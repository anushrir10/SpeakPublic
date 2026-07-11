import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import express from "express";
import { clerkMiddleware, requireAuth } from "@clerk/express";
import { PrismaClient } from "@fixit/db";
import OpenAI from "openai";

const app = express();
const prisma = new PrismaClient();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const PORT = process.env.PORT || 3001;

app.use(express.json());

// Health check (no auth)
app.get("/health", async (req, res) => {
  try {
    const userCount = await prisma.user.count();
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      database: "connected",
      userCount,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Database connection failed",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// GET /api/chapters - list all chapters
app.get("/api/chapters", async (req, res) => {
  try {
    const chapters = await prisma.chapter.findMany({
      orderBy: { number: "asc" },
    });
    res.json(chapters);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch chapters" });
  }
});

// GET /api/chapters/:id - get one chapter with its chunks
app.get("/api/chapters/:id", async (req, res) => {
  try {
    const chapter = await prisma.chapter.findUnique({
      where: { id: req.params.id },
      include: { chunks: true },
    });
    if (!chapter) {
      return res.status(404).json({ error: "Chapter not found" });
    }
    res.json(chapter);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch chapter" });
  }
});

// GET /api/chunks/:id - get a single chunk
app.get("/api/chunks/:id", async (req, res) => {
  try {
    const chunk = await prisma.chunk.findUnique({
      where: { id: req.params.id },
    });
    if (!chunk) {
      return res.status(404).json({ error: "Chunk not found" });
    }
    res.json(chunk);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch chunk" });
  }
});

// GET /api/chunks?chapterId=x - get all chunks for a chapter
app.get("/api/chunks", async (req, res) => {
  try {
    const { chapterId } = req.query;
    if (!chapterId || typeof chapterId !== "string") {
      return res.status(400).json({ error: "chapterId query param required" });
    }
    const chunks = await prisma.chunk.findMany({
      where: { chapterId },
      orderBy: { sectionRef: "asc" },
    });
    res.json(chunks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch chunks" });
  }
});

// Deterministic mock embedding generator (1536 dimensions)
function generateMockEmbedding(text: string): number[] {
  const crypto = require("crypto");
  const vector = new Array(1536).fill(0);
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter(w => w.length > 2);

  if (words.length === 0) {
    const randomVec = Array.from({ length: 1536 }, () => Math.random() - 0.5);
    const norm = Math.sqrt(randomVec.reduce((sum, v) => sum + v * v, 0));
    return randomVec.map(v => v / (norm || 1));
  }

  for (const word of words) {
    const hash = crypto.createHash("md5").update(word).digest();
    for (let i = 0; i < 8; i++) {
      const idxBytes = hash.readUInt16LE(i * 2);
      const dimension = idxBytes % 1536;
      vector[dimension] += 1.0;
    }
  }

  const l2Norm = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
  if (l2Norm === 0) {
    vector[0] = 1.0;
    return vector;
  }
  return vector.map(val => val / l2Norm);
}

// POST /api/retrieve - embed query, find top-k similar chunks
app.post("/api/retrieve", async (req, res) => {
  try {
    const { query, topK = 5 } = req.body;

    if (!query || typeof query !== "string") {
      return res.status(400).json({ error: "query is required" });
    }

    // Embed the query with fallback
    let queryVector: number[];
    const hasKey = process.env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY.includes("sk-proj-...");

    if (!hasKey) {
      queryVector = generateMockEmbedding(query);
    } else {
      try {
        const embeddingResponse = await openai.embeddings.create({
          model: "text-embedding-3-small",
          input: query,
        });
        queryVector = embeddingResponse.data[0].embedding;
      } catch (error: any) {
        if (error.status === 429 || error.status === 401) {
          console.warn(`[WARNING] OpenAI API Quota/Auth Error in /api/retrieve. Falling back to local mock embedding.`);
          queryVector = generateMockEmbedding(query);
        } else {
          throw error;
        }
      }
    }

    // Cosine similarity search via pgvector
    const results = await prisma.$queryRaw`
      SELECT 
        c.id as "chunkId",
        c.content,
        c."sectionRef",
        c."chapterId",
        1 - (ce.vector <=> ${queryVector}::vector) as similarity
      FROM chunks c
      JOIN chunk_embeddings ce ON ce."chunkId" = c.id
      ORDER BY ce.vector <=> ${queryVector}::vector
      LIMIT ${topK}
    `;

    res.json(results);
  } catch (error) {
    console.error("Retrieve error:", error);
    res.status(500).json({
      error: "Retrieval failed",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Helper to generate a dynamic local mock card based on retrieved textbook chunks
function generateLocalMockCard(query: string, topChunk: string): any {
  const sentences = topChunk
    .split(/[.!?]+/)
    .map(s => s.trim())
    .filter(s => s.length > 10);
  
  const queryWords = query.toLowerCase().split(/\s+/).filter(w => w.length > 2);
  let matchedSentence = sentences[0] || topChunk;

  // Search for the best sentence containing query words
  for (const word of queryWords) {
    const found = sentences.find(s => s.toLowerCase().includes(word));
    if (found) {
      matchedSentence = found;
      break;
    }
  }

  const definition = `According to the textbook:\n\n"${matchedSentence}."`;
  const front = `What is the significance of the concept "${query}" as described in the text?`;
  const back = `The textbook states:\n\n"${matchedSentence}"`;

  const question = `Which of the following is associated with "${query}" in the textbook context?`;
  const correctOption = matchedSentence.length > 100 ? `${matchedSentence.substring(0, 97)}...` : matchedSentence;

  const options = [
    correctOption,
    `It is a generic cellular pathway found in unicellular organisms.`,
    `It is a term describing a biological process unrelated to this section.`,
    `None of the above`
  ];

  return {
    term: query,
    definition,
    flashcard: { front, back },
    mcq: {
      question,
      options,
      correctIndex: 0,
      explanation: `The textbook states: "${matchedSentence}."`
    }
  };
}

// POST /api/generate-card — generate study card definition, flashcard & mcq from context chunks
app.post("/api/generate-card", async (req: express.Request, res: express.Response) => {
  try {
    const { query, chunks } = req.body;
    if (!query) {
      return res.status(400).json({ error: "query is required" });
    }

    const contextText = (chunks || []).map((c: any) => c.content).join("\n\n");
    const hasKey = process.env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY.includes("sk-proj-...");

    if (!hasKey || !contextText) {
      const topChunk = contextText || "No context found.";
      const card = generateLocalMockCard(query, topChunk);
      return res.json(card);
    }

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are an expert biology tutor. Generate study flashcards, definitions, and MCQs in JSON format."
          },
          {
            role: "user",
            content: `Based on the following textbook context:\n---\n${contextText}\n---\n\nGenerate a study card for the term "${query}".\nReturn a JSON object matching this schema:\n{\n  "definition": "A concise definition based on context",\n  "flashcard": {\n    "front": "A conceptual question about the term",\n    "back": "The answer using the context"\n  },\n  "mcq": {\n    "question": "A multiple choice question",\n    "options": ["Option 1", "Option 2", "Option 3", "Option 4"],\n    "correctIndex": 0,\n    "explanation": "Why correctIndex is correct"\n  }\n}`
          }
        ],
        response_format: { type: "json_object" }
      });

      const responseText = completion.choices[0].message.content;
      if (responseText) {
        const card = JSON.parse(responseText);
        card.term = query;
        return res.json(card);
      }
      throw new Error("Empty response from OpenAI");
    } catch (error: any) {
      console.warn("[WARNING] OpenAI API Quota/Auth Error in /api/generate-card. Falling back to local mock generator.");
      const topChunk = contextText || "No context found.";
      const card = generateLocalMockCard(query, topChunk);
      return res.json(card);
    }
  } catch (error) {
    console.error("Generate card error:", error);
    res.status(500).json({
      error: "Generation failed",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

// Clerk middleware for protected routes only
app.use(clerkMiddleware());

app.post("/api/fsrs/review", requireAuth(), (req, res) => {
  res.json({ message: "fsrs endpoint - coming soon" });
});

app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});

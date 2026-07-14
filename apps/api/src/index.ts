import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { clerkMiddleware, requireAuth } from "@clerk/express";
import { PrismaClient } from "@fixit/db";
import OpenAI from "openai";

const app = express();
const prisma = new PrismaClient();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const PORT = process.env.PORT || 3001;

app.use(cors());
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

// POST /api/retrieve - embed query, find top-k similar chunks
app.post("/api/retrieve", async (req, res) => {
  try {
    const { query, topK = 5 } = req.body;

    if (!query || typeof query !== "string") {
      return res.status(400).json({ error: "query is required" });
    }

    // Embed the query
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: query,
    });
    const queryVector = embeddingResponse.data[0].embedding;

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

// Clerk middleware for protected routes only
app.use(clerkMiddleware());

app.post("/api/fsrs/review", requireAuth(), (req, res) => {
  res.json({ message: "fsrs endpoint - coming soon" });
});

app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});

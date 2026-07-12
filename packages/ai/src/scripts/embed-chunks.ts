import { PrismaClient } from "@fixit/db";
import { OpenAI } from "openai";
import crypto from "crypto";
import path from "path";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, "../../../../.env") });

const prisma = new PrismaClient();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

const BATCH_SIZE = 20;

// Deterministic mock embedding generator (1536 dimensions)
// Maps words to dimensions deterministically to allow keyword similarity search locally
export function generateMockEmbedding(text: string): number[] {
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

async function embedTextWithRetry(texts: string[], retries = 5, delay = 1000): Promise<number[][]> {
  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: texts,
    });
    return response.data.map(d => d.embedding);
  } catch (error: any) {
    // If it's a quota or auth error, don't waste time retrying
    if (error.status === 429 && error.message?.toLowerCase().includes("quota")) {
      throw error;
    }
    if (error.status === 401) {
      throw error;
    }
    if (retries > 0) {
      console.warn(`OpenAI API error (${error.status || 'no-status'}): ${error.message || error}. Retrying in ${delay}ms... (Attempts remaining: ${retries})`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return embedTextWithRetry(texts, retries - 1, delay * 2);
    }
    throw error;
  }
}

async function retryDb<T>(fn: () => Promise<T>, retries = 5, delay = 1000): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0) {
      console.warn(`Database operation failed. Retrying in ${delay}ms... (Attempts remaining: ${retries})`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return retryDb(fn, retries - 1, delay * 2);
    }
    throw error;
  }
}

async function main() {
  const hasKey = process.env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY.includes("sk-proj-...");
  let useMockFallback = !hasKey;

  if (!hasKey) {
    console.warn("WARNING: OPENAI_API_KEY is not configured or placeholder. Falling back to local deterministic mock embeddings.");
  }

  console.log("Fetching unembedded chunks from database...");
  const chunks = await retryDb(() => prisma.chunk.findMany({
    where: {
      embeddings: {
        none: {}
      }
    },
    orderBy: {
      createdAt: "asc"
    }
  }));

  if (chunks.length === 0) {
    console.log("All chunks are already embedded! Nothing to do.");
    return;
  }

  console.log(`Found ${chunks.length} unembedded chunks. Starting embedding pipeline...`);

  for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
    const batch = chunks.slice(i, i + BATCH_SIZE);
    const texts = batch.map((c: any) => c.content);

    console.log(`Embedding batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(chunks.length / BATCH_SIZE)} (Size: ${batch.length})...`);
    
    let embeddings: number[][];
    let currentBatchModel = "text-embedding-3-small";

    if (useMockFallback) {
      embeddings = texts.map(t => generateMockEmbedding(t));
      currentBatchModel = "text-embedding-3-small-mock";
    } else {
      try {
        embeddings = await embedTextWithRetry(texts);
      } catch (error: any) {
        if (error.status === 429 || error.status === 401) {
          console.warn(`\n[WARNING] OpenAI API Quota Exceeded or Auth Error: ${error.message || error}`);
          console.warn("Switching to local deterministic mock embeddings (1536-dim) to prevent blocking development.\n");
          useMockFallback = true;
          embeddings = texts.map(t => generateMockEmbedding(t));
          currentBatchModel = "text-embedding-3-small-mock";
        } else {
          console.error(`Failed to process batch starting at index ${i}:`, error);
          process.exit(1);
        }
      }
    }

    console.log(`Saving embeddings to database (${currentBatchModel})...`);
    for (let j = 0; j < batch.length; j++) {
      const chunk = batch[j];
      const vector = embeddings[j];
      const vectorString = `[${vector.join(",")}]`;
      const embeddingId = `cemb_${crypto.randomUUID().replace(/-/g, "")}`;

      await retryDb(() => prisma.$executeRawUnsafe(
        `INSERT INTO chunk_embeddings (id, "chunkId", vector, model, "createdAt")
         VALUES ($1, $2, $3::vector, $4, $5)
         ON CONFLICT ("chunkId") 
         DO UPDATE SET vector = $3::vector, model = $4`,
        embeddingId,
        chunk.id,
        vectorString,
        currentBatchModel,
        new Date()
      ));
    }
  }

  console.log("Embedding pipeline completed successfully!");
}

if (require.main === module) {
  main()
    .catch(err => {
      console.error("Unhandled error:", err);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}

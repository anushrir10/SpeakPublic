import { PrismaClient } from "@fixit/db";
import { OpenAI } from "openai";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, "../../../../.env") });

const prisma = new PrismaClient();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

const BATCH_SIZE = 20;

async function embedTextWithRetry(texts: string[], retries = 5, delay = 1000): Promise<number[][]> {
  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: texts,
    });
    return response.data.map(d => d.embedding);
  } catch (error: any) {
    if (retries > 0 && (error.status === 429 || error.status >= 500)) {
      console.warn(`OpenAI API rate limit or error. Retrying in ${delay}ms... (Attempts remaining: ${retries})`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return embedTextWithRetry(texts, retries - 1, delay * 2);
    }
    throw error;
  }
}

async function main() {
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.includes("sk-proj-...")) {
    console.error("Error: OPENAI_API_KEY is not configured in the .env file.");
    process.exit(1);
  }

  console.log("Fetching unembedded chunks from database...");
  
  // Find chunks that do not have an associated chunk embedding
  const chunks = await prisma.chunk.findMany({
    where: {
      embeddings: {
        none: {}
      }
    },
    orderBy: {
      createdAt: "asc"
    }
  });

  if (chunks.length === 0) {
    console.log("All chunks are already embedded! Nothing to do.");
    return;
  }

  console.log(`Found ${chunks.length} unembedded chunks. Starting embedding pipeline...`);

  // Process in batches
  for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
    const batch = chunks.slice(i, i + BATCH_SIZE);
    const texts = batch.map((c: any) => c.content);

    console.log(`Embedding batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(chunks.length / BATCH_SIZE)} (Size: ${batch.length})...`);
    
    try {
      const embeddings = await embedTextWithRetry(texts);
      
      console.log(`Saving embeddings to database...`);
      for (let j = 0; j < batch.length; j++) {
        const chunk = batch[j];
        const vector = embeddings[j];
        const vectorString = `[${vector.join(",")}]`;
        const embeddingId = `cemb_${crypto.randomUUID().replace(/-/g, "")}`;

        // Using executeRawUnsafe to correctly pass the pgvector cast ($3::vector)
        await prisma.$executeRawUnsafe(
          `INSERT INTO chunk_embeddings (id, "chunkId", vector, model, "createdAt")
           VALUES ($1, $2, $3::vector, $4, $5)
           ON CONFLICT ("chunkId") 
           DO UPDATE SET vector = $3::vector`,
          embeddingId,
          chunk.id,
          vectorString,
          "text-embedding-3-small",
          new Date()
        );
      }
    } catch (error) {
      console.error(`Failed to process batch starting at index ${i}:`, error);
      process.exit(1);
    }
  }

  console.log("Embedding pipeline completed successfully!");
}

main()
  .catch(err => {
    console.error("Unhandled error:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

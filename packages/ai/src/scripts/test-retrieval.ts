import { PrismaClient } from "@fixit/db";
import { OpenAI } from "openai";
import path from "path";
import dotenv from "dotenv";

import { generateMockEmbedding } from "./embed-chunks";

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, "../../../../.env") });

const prisma = new PrismaClient();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

async function main() {
  const args = process.argv.slice(2);
  const queryArg = args.find((arg: string) => arg.startsWith("--query="))?.split("=")[1];

  if (!queryArg) {
    console.error("Usage: pnpm run test-retrieval -- --query=\"Your search query here\"");
    process.exit(1);
  }

  console.log(`Query: "${queryArg}"`);
  
  let queryEmbedding: number[] = [];
  const hasKey = process.env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY.includes("sk-proj-...");
  
  if (!hasKey) {
    console.warn("WARNING: Using local mock embedding fallback.");
    queryEmbedding = generateMockEmbedding(queryArg);
  } else {
    console.log("Generating query embedding using text-embedding-3-small...");
    try {
      const response = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: queryArg,
      });
      queryEmbedding = response.data[0].embedding;
    } catch (error: any) {
      if (error.status === 429 || error.status === 401) {
        console.warn(`[WARNING] OpenAI API Quota/Auth Error. Falling back to local mock embedding.`);
        queryEmbedding = generateMockEmbedding(queryArg);
      } else {
        console.error("Failed to generate embedding for query:", error);
        process.exit(1);
      }
    }
  }

  console.log("Running similarity search in PostgreSQL...");
  const vectorString = `[${queryEmbedding.join(",")}]`;

  try {
    // Run cosine similarity search using pgvector operator <=>
    const results = await prisma.$queryRawUnsafe<any[]>(
      `SELECT 
         c.id, 
         c."sectionRef" as "sectionRef", 
         c.content, 
         1 - (ce.vector <=> $1::vector) as similarity
       FROM chunks c
       INNER JOIN chunk_embeddings ce ON c.id = ce."chunkId"
       ORDER BY ce.vector <=> $1::vector ASC
       LIMIT $2`,
      vectorString,
      5
    );

    console.log("\n=================== RETRIEVAL RESULTS ===================");
    if (results.length === 0) {
      console.log("No results found. Have you chunked and embedded the chapter?");
    } else {
      results.forEach((row: any, index: number) => {
        console.log(`\n[${index + 1}] Similarity Score: ${(row.similarity * 100).toFixed(2)}%`);
        console.log(`Source: ${row.sectionRef}`);
        console.log(`Content:\n"${row.content}"`);
        console.log("---------------------------------------------------------");
      });
    }
    console.log("=========================================================\n");

  } catch (error) {
    console.error("Failed to run vector similarity query:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();

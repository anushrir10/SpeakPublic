import { PrismaClient } from "@fixit/db";
import { OpenAI } from "openai";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { generateMockEmbedding } from "./embed-chunks";

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, "../../../../.env") });

const prisma = new PrismaClient();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

const QUERIES = [
  // Chapter 1
  { id: 1, ch: 1, query: "What is the difference between asexual and sexual reproduction?" },
  { id: 2, ch: 1, query: "What is embryogenesis and how does it differ in oviparous vs viviparous animals?" },
  { id: 3, ch: 1, query: "What are vegetative propagules and what are some examples?" },
  { id: 4, ch: 1, query: "Why are offspring of asexual reproduction called clones?" },
  { id: 5, ch: 1, query: "What is the difference between gametogenesis and gamete transfer?" },
  { id: 6, ch: 1, query: "Explain the role of zygote in sexual reproduction." },
  
  // Chapter 2
  { id: 7, ch: 2, query: "Describe the structure of a microsporangium." },
  { id: 8, ch: 2, query: "What is megasporogenesis and where does it occur?" },
  { id: 9, ch: 2, query: "Explain the different types of pollination." },
  { id: 10, ch: 2, query: "What is double fertilisation and what are its products?" },
  { id: 11, ch: 2, query: "How does endosperm development precede embryo development?" },
  { id: 12, ch: 2, query: "What are apomixis and polyembryony?" },

  // Chapter 3
  { id: 13, ch: 3, query: "Describe the male reproductive system and path of sperm." },
  { id: 14, ch: 3, query: "What are the major parts of the female reproductive system?" },
  { id: 15, ch: 3, query: "Explain the stages of spermatogenesis vs oogenesis." },
  { id: 16, ch: 3, query: "What are the phases of the menstrual cycle?" },
  { id: 17, ch: 3, query: "Where does fertilisation occur in humans and how does implantation happen?" },
  { id: 18, ch: 3, query: "Explain the roles of placenta, pregnancy hormones, and parturition." },

  // Chapter 4
  { id: 19, ch: 4, query: "What is the Reproductive and Child Health Care (RCH) programme?" },
  { id: 20, ch: 4, query: "What are the different birth control methods?" },
  { id: 21, ch: 4, query: "What is Medical Termination of Pregnancy (MTP) and when is it safe?" },
  { id: 22, ch: 4, query: "What are sexually transmitted diseases and how can they be prevented?" },
  { id: 23, ch: 4, query: "Describe the various Assisted Reproductive Technologies (ART) like IVF." },
  { id: 24, ch: 4, query: "Why is sex education important in schools?" },

  // Chapter 5
  { id: 25, ch: 5, query: "State Mendel's laws of inheritance." },
  { id: 26, ch: 5, query: "Explain the law of dominance and incomplete dominance with examples." },
  { id: 27, ch: 5, query: "What is co-dominance and how does ABO blood grouping show it?" },
  { id: 28, ch: 5, query: "Describe the chromosomal theory of inheritance." },
  { id: 29, ch: 5, query: "How is sex determined in humans, birds, and honey bees?" },
  { id: 30, ch: 5, query: "What are Mendelian disorders versus chromosomal disorders?" }
];

async function getQueryEmbedding(query: string, useMock: boolean): Promise<{ embedding: number[]; model: string }> {
  if (useMock) {
    return { embedding: generateMockEmbedding(query), model: "text-embedding-3-small-mock" };
  }

  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: query,
    });
    return { embedding: response.data[0].embedding, model: "text-embedding-3-small" };
  } catch (error: any) {
    if (error.status === 429 || error.status === 401) {
      console.warn(`[WARNING] OpenAI API Quota/Auth Error for query embedding. Using local mock embedding.`);
      return { embedding: generateMockEmbedding(query), model: "text-embedding-3-small-mock" };
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
  const useMock = !hasKey;

  const resultsReportPath = path.resolve("C:/Users/Solo-P-Leveller/.gemini/antigravity-ide/brain/7924f393-12b9-4991-a3fc-8f2d6fb1de7f", "retrieval_checkpoint_results.md");
  
  console.log(`Starting retrieval evaluation of ${QUERIES.length} queries...`);
  
  let mdContent = `# RAG Retrieval Quality Checkpoint Results\n\n`;
  mdContent += `**Date:** ${new Date().toLocaleDateString()}\n`;
  mdContent += `**Model:** text-embedding-3-small (Local Mock Fallback: ${useMock ? "Active" : "Active if OpenAI Quota fails"})\n\n`;
  mdContent += `This report lists the top 3 chunks retrieved for 30 sample queries from Biology Chapters 1-5.\n\n`;
  mdContent += `## Retrieval Results\n\n`;

  for (const q of QUERIES) {
    console.log(`\nProcessing Query [${q.id}/30] (Ch ${q.ch}): "${q.query}"`);
    
    const { embedding, model } = await getQueryEmbedding(q.query, useMock);
    const vectorString = `[${embedding.join(",")}]`;

    // Query DB for top 3 similar chunks using pgvector distance operator <=>
    const results = await retryDb(() => prisma.$queryRawUnsafe<any[]>(
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
      3
    ));

    mdContent += `### Query ${q.id}: "${q.query}"\n`;
    mdContent += `**Chapter:** ${q.ch} | **Embedding Model:** ${model}\n\n`;
    
    if (results.length === 0) {
      mdContent += `*No chunks retrieved. Ensure chapters are chunked and embedded first.*\n\n`;
    } else {
      results.forEach((row, index) => {
        const simScore = (row.similarity * 100).toFixed(2);
        mdContent += `#### [Result ${index + 1}] Similarity: ${simScore}% | Source: ${row.sectionRef}\n`;
        mdContent += `\`\`\`text\n${row.content.trim()}\n\`\`\`\n\n`;
      });
    }
    mdContent += `---\n\n`;
  }

  // Write report to artifact directory
  fs.writeFileSync(resultsReportPath, mdContent, "utf-8");
  console.log(`\nEvaluation report successfully generated at: ${resultsReportPath}`);
}

main()
  .catch(err => {
    console.error("Evaluation failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

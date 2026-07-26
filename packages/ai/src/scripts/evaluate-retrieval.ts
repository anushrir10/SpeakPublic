import { PrismaClient } from "@fixit/db";
import dotenv from "dotenv";
import fs from "fs";
import { OpenAI } from "openai";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../../../.env") });

const prisma = new PrismaClient();
const EMBEDDING_MODEL = "text-embedding-3-small";
const TOP_K = 3;
const MIN_CHAPTER_HIT_AT_3 = 0.8;

type EvaluationQuery = {
  chapter: number;
  query: string;
};

type RetrievalResult = {
  id: string;
  chapterNumber: number;
  chapterTitle: string;
  sectionRef: string;
  content: string;
  similarity: number;
};

const QUERIES: EvaluationQuery[] = [
  { chapter: 1, query: "Why is metabolism considered a defining feature of living organisms?" },
  { chapter: 1, query: "What are the rules of binomial nomenclature?" },
  { chapter: 1, query: "How are species, genus, family, order and class arranged in taxonomy?" },
  { chapter: 1, query: "What is the difference between taxonomy and systematics?" },
  { chapter: 1, query: "What are herbarium, botanical gardens and museums used for?" },
  { chapter: 1, query: "How does a taxonomic key help identify organisms?" },

  { chapter: 2, query: "What are the five kingdoms proposed by Whittaker and the criteria for classifying them?" },
  { chapter: 2, query: "How do archaebacteria differ from other bacteria?" },
  { chapter: 2, query: "What are cyanobacteria and heterocysts?" },
  { chapter: 2, query: "Describe the main groups of Kingdom Protista." },
  { chapter: 2, query: "How do phycomycetes, ascomycetes and basidiomycetes differ?" },
  { chapter: 2, query: "What are viroids, prions and lichens?" },

  { chapter: 3, query: "Compare green algae, brown algae and red algae by pigments and stored food." },
  { chapter: 3, query: "Why are bryophytes called the amphibians of the plant kingdom?" },
  { chapter: 3, query: "Describe the life cycle and main features of pteridophytes." },
  { chapter: 3, query: "How did heterospory lead toward seed habit?" },
  { chapter: 3, query: "What are the characteristic features of gymnosperms?" },
  { chapter: 3, query: "Explain haplontic, diplontic and haplo-diplontic life cycles." },

  { chapter: 4, query: "What fundamental features are used to classify animals?" },
  { chapter: 4, query: "Describe the canal system and choanocytes of sponges." },
  { chapter: 4, query: "What are cnidoblasts and what functions do they perform?" },
  { chapter: 4, query: "How do annelids differ from arthropods?" },
  { chapter: 4, query: "What are the defining features of chordates?" },
  { chapter: 4, query: "Compare cartilaginous fishes and bony fishes." },

  { chapter: 5, query: "Describe tap roots, fibrous roots and adventitious roots." },
  { chapter: 5, query: "How are stems modified for storage, support and vegetative propagation?" },
  { chapter: 5, query: "What are phyllotaxy and leaf venation?" },
  { chapter: 5, query: "Differentiate racemose and cymose inflorescence." },
  { chapter: 5, query: "What are valvate, twisted, imbricate and vexillary aestivation?" },
  { chapter: 5, query: "Compare marginal, axile, parietal, free central and basal placentation." },
];

async function embedQueriesWithRetry(
  openai: OpenAI,
  retries = 5,
  delay = 1_000,
): Promise<number[][]> {
  try {
    const response = await openai.embeddings.create({
      model: EMBEDDING_MODEL,
      input: QUERIES.map((item) => item.query),
    });
    return response.data.map((item) => item.embedding);
  } catch (error: any) {
    if (retries > 0 && (error?.status === 429 || error?.status >= 500)) {
      console.warn(
        `Query embedding failed; retrying in ${delay}ms (${retries} retries left).`,
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
      return embedQueriesWithRetry(openai, retries - 1, delay * 2);
    }
    throw error;
  }
}

async function assertDatabaseCoverage() {
  const coverage = await prisma.$queryRaw<
    Array<{
      number: number;
      title: string;
      chunkCount: bigint;
      embeddingCount: bigint;
      models: string[];
    }>
  >`
    SELECT
      ch.number,
      ch.title,
      COUNT(DISTINCT c.id) AS "chunkCount",
      COUNT(DISTINCT ce.id) AS "embeddingCount",
      COALESCE(array_agg(DISTINCT ce.model) FILTER (WHERE ce.model IS NOT NULL), '{}') AS models
    FROM chapters ch
    LEFT JOIN chunks c ON c."chapterId" = ch.id
    LEFT JOIN chunk_embeddings ce ON ce."chunkId" = c.id
    WHERE ch.number BETWEEN 1 AND 5
    GROUP BY ch.number, ch.title
    ORDER BY ch.number
  `;

  if (coverage.length !== 5) {
    throw new Error(`Expected 5 chapters in the database; found ${coverage.length}.`);
  }

  for (const row of coverage) {
    const chunks = Number(row.chunkCount);
    const embeddings = Number(row.embeddingCount);
    if (chunks === 0 || chunks !== embeddings) {
      throw new Error(
        `Chapter ${row.number} has ${chunks} chunks and ${embeddings} embeddings.`,
      );
    }
    if (row.models.length !== 1 || row.models[0] !== EMBEDDING_MODEL) {
      throw new Error(
        `Chapter ${row.number} has unexpected embedding models: ${row.models.join(", ") || "none"}.`,
      );
    }
  }

  return coverage;
}

async function main() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured.");
  }

  const outputArgument = process.argv
    .slice(2)
    .find((argument) => argument.startsWith("--output="))
    ?.slice("--output=".length);
  const outputPath = outputArgument
    ? path.resolve(outputArgument)
    : path.resolve(__dirname, "../../artifacts/retrieval_checkpoint_results.md");

  const coverage = await assertDatabaseCoverage();
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  console.log(`Embedding ${QUERIES.length} evaluation queries...`);
  const queryEmbeddings = await embedQueriesWithRetry(openai);

  let chapterHitsAt3 = 0;
  let top1ChapterHits = 0;
  let reciprocalRankTotal = 0;
  const reportRows: Array<{
    query: EvaluationQuery;
    results: RetrievalResult[];
    expectedRank: number | null;
  }> = [];

  for (let index = 0; index < QUERIES.length; index += 1) {
    const evaluationQuery = QUERIES[index];
    const vectorString = `[${queryEmbeddings[index].join(",")}]`;
    const results = await prisma.$queryRawUnsafe<RetrievalResult[]>(
      `SELECT
         c.id,
         ch.number AS "chapterNumber",
         ch.title AS "chapterTitle",
         c."sectionRef" AS "sectionRef",
         c.content,
         1 - (ce.vector <=> $1::vector) AS similarity
       FROM chunks c
       INNER JOIN chapters ch ON ch.id = c."chapterId"
       INNER JOIN chunk_embeddings ce ON ce."chunkId" = c.id
       WHERE ch.number BETWEEN 1 AND 5
       ORDER BY ce.vector <=> $1::vector ASC
       LIMIT $2`,
      vectorString,
      TOP_K,
    );

    const expectedIndex = results.findIndex(
      (result) => result.chapterNumber === evaluationQuery.chapter,
    );
    const expectedRank = expectedIndex === -1 ? null : expectedIndex + 1;
    if (expectedRank !== null) {
      chapterHitsAt3 += 1;
      reciprocalRankTotal += 1 / expectedRank;
    }
    if (expectedRank === 1) top1ChapterHits += 1;

    reportRows.push({ query: evaluationQuery, results, expectedRank });
    console.log(
      `[${index + 1}/${QUERIES.length}] Ch ${evaluationQuery.chapter}: expected chapter rank ${expectedRank ?? "miss"}`,
    );
  }

  const hitAt3 = chapterHitsAt3 / QUERIES.length;
  const top1Accuracy = top1ChapterHits / QUERIES.length;
  const meanReciprocalRank = reciprocalRankTotal / QUERIES.length;
  const passed = hitAt3 >= MIN_CHAPTER_HIT_AT_3;

  let markdown = "# Retrieval Quality Checkpoint — Biology Chapters 1–5\n\n";
  markdown += `- Date: ${new Date().toISOString()}\n`;
  markdown += `- Embedding model: \`${EMBEDDING_MODEL}\`\n`;
  markdown += `- Queries: ${QUERIES.length}\n`;
  markdown += `- Chapter hit@3: **${(hitAt3 * 100).toFixed(1)}%** (${chapterHitsAt3}/${QUERIES.length})\n`;
  markdown += `- Top-1 chapter accuracy: **${(top1Accuracy * 100).toFixed(1)}%** (${top1ChapterHits}/${QUERIES.length})\n`;
  markdown += `- Mean reciprocal rank: **${meanReciprocalRank.toFixed(3)}**\n`;
  markdown += `- Checkpoint threshold: hit@3 ≥ ${(MIN_CHAPTER_HIT_AT_3 * 100).toFixed(0)}%\n`;
  markdown += `- Result: **${passed ? "PASS" : "FAIL"}**\n\n`;
  markdown += "## Database coverage\n\n";
  markdown += "| Chapter | Title | Chunks | Embeddings | Model |\n";
  markdown += "| ---: | --- | ---: | ---: | --- |\n";
  for (const row of coverage) {
    markdown += `| ${row.number} | ${row.title} | ${row.chunkCount} | ${row.embeddingCount} | ${row.models.join(", ")} |\n`;
  }

  markdown += "\n## Query results\n\n";
  reportRows.forEach(({ query, results, expectedRank }, index) => {
    markdown += `### ${index + 1}. ${query.query}\n\n`;
    markdown += `Expected chapter: ${query.chapter}; rank: ${expectedRank ?? "not in top 3"}\n\n`;
    results.forEach((result, resultIndex) => {
      const snippet = result.content.replace(/\s+/g, " ").slice(0, 220);
      markdown += `${resultIndex + 1}. Ch ${result.chapterNumber}, ${result.sectionRef} — ${(Number(result.similarity) * 100).toFixed(2)}% — ${snippet}${result.content.length > 220 ? "…" : ""}\n`;
    });
    markdown += "\n";
  });

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, markdown, "utf-8");
  console.log(`Evaluation report written to ${outputPath}`);
  console.log(
    `Checkpoint ${passed ? "PASSED" : "FAILED"}: hit@3 ${(hitAt3 * 100).toFixed(1)}%, top-1 ${(top1Accuracy * 100).toFixed(1)}%, MRR ${meanReciprocalRank.toFixed(3)}.`,
  );

  if (!passed) process.exitCode = 1;
}

main()
  .catch((error) => {
    console.error("Retrieval evaluation failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

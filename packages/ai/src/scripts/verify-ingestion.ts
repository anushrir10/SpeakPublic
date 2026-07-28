import { PrismaClient } from "@fixit/db";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../../../.env") });

const prisma = new PrismaClient();

async function main() {
  const coverage = await prisma.$queryRaw<
    Array<{
      number: number;
      title: string;
      chunks: bigint;
      embeddings: bigint;
      models: string[];
    }>
  >`
    SELECT
      ch.number,
      ch.title,
      COUNT(DISTINCT c.id) AS chunks,
      COUNT(DISTINCT ce.id) AS embeddings,
      COALESCE(array_agg(DISTINCT ce.model) FILTER (WHERE ce.model IS NOT NULL), '{}') AS models
    FROM chapters ch
    LEFT JOIN chunks c ON c."chapterId" = ch.id
    LEFT JOIN chunk_embeddings ce ON ce."chunkId" = c.id
    WHERE ch.number BETWEEN 1 AND 5
    GROUP BY ch.number, ch.title
    ORDER BY ch.number
  `;

  console.table(
    coverage.map((row) => ({
      chapter: row.number,
      title: row.title,
      chunks: Number(row.chunks),
      embeddings: Number(row.embeddings),
      models: row.models.join(", ") || "none",
      complete: Number(row.chunks) > 0 && row.chunks === row.embeddings,
    })),
  );

  const complete =
    coverage.length === 5 &&
    coverage.every(
      (row) => Number(row.chunks) > 0 && row.chunks === row.embeddings,
    );
  if (!complete) process.exitCode = 1;
}

main()
  .catch((error) => {
    console.error("Ingestion verification failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

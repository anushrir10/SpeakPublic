import { PrismaClient } from "@fixit/db";
import crypto from "crypto";
import dotenv from "dotenv";
import { OpenAI } from "openai";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../../../.env") });

const prisma = new PrismaClient();
const BATCH_SIZE = 20;
const EMBEDDING_MODEL = "text-embedding-3-small";

function parseChapterNumbers(): number[] | undefined {
  const value = process.argv
    .slice(2)
    .find((argument) => argument.startsWith("--chapters="))
    ?.split("=")[1];

  if (!value) return undefined;

  const chapterNumbers = value.split(",").map(Number);
  if (
    chapterNumbers.length === 0 ||
    chapterNumbers.some(
      (chapterNumber) =>
        !Number.isInteger(chapterNumber) ||
        chapterNumber < 1 ||
        chapterNumber > 5,
    )
  ) {
    throw new Error("--chapters must be a comma-separated subset of 1,2,3,4,5.");
  }

  return [...new Set(chapterNumbers)];
}

async function embedTextWithRetry(
  openai: OpenAI,
  texts: string[],
  retries = 5,
  delay = 1_000,
): Promise<number[][]> {
  try {
    const response = await openai.embeddings.create({
      model: EMBEDDING_MODEL,
      input: texts,
    });
    return response.data.map((item) => item.embedding);
  } catch (error: any) {
    const quotaExhausted =
      error?.code === "insufficient_quota" ||
      error?.message?.toLowerCase().includes("exceeded your current quota");
    if (
      !quotaExhausted &&
      retries > 0 &&
      (error?.status === 429 || error?.status >= 500)
    ) {
      console.warn(
        `Embedding request failed; retrying in ${delay}ms (${retries} retries left).`,
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
      return embedTextWithRetry(openai, texts, retries - 1, delay * 2);
    }
    throw error;
  }
}

async function main() {
  const chapterNumbers = parseChapterNumbers();
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured.");
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  console.log(
    `Fetching unembedded chunks${chapterNumbers ? ` for Chapters ${chapterNumbers.join(", ")}` : ""}...`,
  );

  const chunks = await prisma.chunk.findMany({
    where: {
      embeddings: { none: {} },
      ...(chapterNumbers
        ? { chapter: { number: { in: chapterNumbers } } }
        : {}),
    },
    orderBy: [{ chapter: { number: "asc" } }, { createdAt: "asc" }],
    include: { chapter: { select: { number: true } } },
  });

  if (chunks.length === 0) {
    console.log("All selected chunks are already embedded.");
    return;
  }

  console.log(`Embedding ${chunks.length} chunks in batches of ${BATCH_SIZE}.`);

  for (let index = 0; index < chunks.length; index += BATCH_SIZE) {
    const batch = chunks.slice(index, index + BATCH_SIZE);
    console.log(
      `Embedding batch ${Math.floor(index / BATCH_SIZE) + 1}/${Math.ceil(chunks.length / BATCH_SIZE)} (${batch.length} chunks)...`,
    );
    const embeddings = await embedTextWithRetry(
      openai,
      batch.map((chunk) => chunk.content),
    );

    if (embeddings.some((embedding) => embedding.length !== 1536)) {
      throw new Error("OpenAI returned an embedding with an unexpected dimension.");
    }

    await prisma.$transaction(
      batch.map((chunk, batchIndex) => {
        const vectorString = `[${embeddings[batchIndex].join(",")}]`;
        const embeddingId = `cemb_${crypto.randomUUID().replace(/-/g, "")}`;

        return prisma.$executeRawUnsafe(
          `INSERT INTO chunk_embeddings (id, "chunkId", vector, model, "createdAt")
           VALUES ($1, $2, $3::vector, $4, $5)
           ON CONFLICT ("chunkId")
           DO UPDATE SET vector = EXCLUDED.vector, model = EXCLUDED.model`,
          embeddingId,
          chunk.id,
          vectorString,
          EMBEDDING_MODEL,
          new Date(),
        );
      }),
    );
  }

  console.log(`Embedded and saved ${chunks.length} chunks successfully.`);
}

main()
  .catch((error) => {
    console.error("Embedding pipeline failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

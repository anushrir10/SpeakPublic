import { PrismaClient } from "@fixit/db";
import dotenv from "dotenv";
import fs from "fs";
import { encode } from "gpt-3-encoder";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../../../.env") });

const prisma = new PrismaClient();
const MIN_CHUNK_TOKENS = 20;
const MAX_CHUNK_TOKENS = 450;

type ChapterConfig = {
  number: number;
  slug: string;
  title: string;
  sourceFile: string;
};

const CHAPTERS: ChapterConfig[] = [
  { number: 1, slug: "bio-ch1", title: "The Living World", sourceFile: "bio-ch1.txt" },
  { number: 2, slug: "bio-ch2", title: "Biological Classification", sourceFile: "bio-ch2.txt" },
  { number: 3, slug: "bio-ch3", title: "Plant Kingdom", sourceFile: "bio-ch3.txt" },
  { number: 4, slug: "bio-ch4", title: "Animal Kingdom", sourceFile: "bio-ch4.txt" },
  {
    number: 5,
    slug: "bio-ch5",
    title: "Morphology of Flowering Plants",
    sourceFile: "bio-ch5.txt",
  },
];

type Paragraph = {
  text: string;
  sectionRef: string;
};

type ChunkData = {
  content: string;
  sectionRef: string;
  tokenCount: number;
};

function parseChapterArgument(): ChapterConfig {
  const chapterArg = process.argv
    .slice(2)
    .find((argument) => argument.startsWith("--chapter="))
    ?.split("=")[1];
  const chapter = CHAPTERS.find(
    (candidate) =>
      candidate.slug === chapterArg || String(candidate.number) === chapterArg,
  );

  if (!chapter) {
    console.error(
      `Usage: pnpm run chunk -- --chapter=<${CHAPTERS.map((item) => item.slug).join("|")}>`,
    );
    process.exit(1);
  }

  return chapter;
}

function getSectionHeader(line: string, chapterNumber: number): string | null {
  const trimmed = line.trim().replace(/\s+/g, " ");
  const numberedSection = trimmed.match(
    new RegExp(
      `^(${chapterNumber}\\.\\d+(?:\\.\\d+)*)\\s*([A-Z].+)$`,
      "u",
    ),
  );

  if (numberedSection) {
    const [, sectionNumber, sectionTitle] = numberedSection;
    return `Section ${sectionNumber}: ${sectionTitle.trim()}`;
  }
  if (/^SUMMARY\b/i.test(trimmed)) {
    return "Section: Summary";
  }
  if (/^EXERCISES?\b/i.test(trimmed)) {
    return "Section: Exercises";
  }

  return null;
}

function isNoiseLine(line: string, chapter: ChapterConfig): boolean {
  const trimmed = line.trim();
  if (!trimmed) return true;

  const normalized = trimmed
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim()
    .toLowerCase();
  const normalizedTitle = chapter.title
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim()
    .toLowerCase();

  if (
    normalized === "biology" ||
    normalized === normalizedTitle ||
    normalized === `chapter ${chapter.number}` ||
    new RegExp(`^\\d+\\s*(?:biology|${normalizedTitle})$`, "i").test(
      normalized,
    ) ||
    new RegExp(`^(?:biology|${normalizedTitle})\\s*\\d+$`, "i").test(
      normalized,
    ) ||
    /^reprint\s+\d{4}(?:\s*[-–]\s*\d{2})?$/i.test(trimmed)
  ) {
    return true;
  }
  if (/^\d+$/.test(trimmed) || /^[ivxldcm]+$/i.test(trimmed)) {
    return true;
  }
  if (/^(figure|table)\s+\d+(?:\.\d+)?\b/i.test(trimmed)) {
    return true;
  }
  if (/^[•\f|]+$/.test(trimmed)) {
    return true;
  }

  return false;
}

function countTokens(text: string): number {
  return encode(text).length;
}

function splitIntoSentences(text: string): string[] {
  return text.match(/[^.!?]+[.!?]+(?:\s|$)|[^.!?]+$/g) ?? [text];
}

function cleanParagraphText(lines: string[]): string {
  let cleanedText = "";

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    if (line.endsWith("-")) {
      cleanedText += line.slice(0, -1);
    } else {
      cleanedText += `${line} `;
    }
  }

  return cleanedText
    .replace(/\u00ad/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function parseParagraphs(lines: string[], chapter: ChapterConfig): Paragraph[] {
  const paragraphs: Paragraph[] = [];
  let currentSectionRef = `Chapter ${chapter.number}: ${chapter.title}`;
  let currentParagraphLines: string[] = [];

  const flushParagraph = () => {
    if (currentParagraphLines.length === 0) return;
    const text = cleanParagraphText(currentParagraphLines);
    if (text) paragraphs.push({ text, sectionRef: currentSectionRef });
    currentParagraphLines = [];
  };

  for (const line of lines) {
    const sectionHeader = getSectionHeader(line, chapter.number);
    if (sectionHeader) {
      flushParagraph();
      currentSectionRef = sectionHeader;
      console.log(`Detected ${currentSectionRef}`);
      continue;
    }

    if (isNoiseLine(line, chapter)) {
      flushParagraph();
      continue;
    }

    currentParagraphLines.push(line);
  }

  flushParagraph();
  return paragraphs;
}

function buildChunks(paragraphs: Paragraph[]): ChunkData[] {
  const chunks: ChunkData[] = [];
  let currentSectionRef = "";
  let currentChunkText = "";

  const flushChunk = () => {
    const content = currentChunkText.trim();
    if (content) {
      chunks.push({
        content,
        sectionRef: currentSectionRef,
        tokenCount: countTokens(content),
      });
    }
    currentChunkText = "";
  };

  const addPiece = (piece: string) => {
    const candidate = currentChunkText
      ? `${currentChunkText}\n\n${piece.trim()}`
      : piece.trim();

    if (currentChunkText && countTokens(candidate) > MAX_CHUNK_TOKENS) {
      flushChunk();
      currentChunkText = piece.trim();
    } else {
      currentChunkText = candidate;
    }
  };

  for (const paragraph of paragraphs) {
    if (paragraph.sectionRef !== currentSectionRef) {
      flushChunk();
      currentSectionRef = paragraph.sectionRef;
    }

    if (countTokens(paragraph.text) <= MAX_CHUNK_TOKENS) {
      addPiece(paragraph.text);
      continue;
    }

    for (const sentence of splitIntoSentences(paragraph.text)) {
      addPiece(sentence);
    }
  }

  flushChunk();
  return chunks.filter((chunk) => chunk.tokenCount >= MIN_CHUNK_TOKENS);
}

async function retryDatabase<T>(
  operation: () => Promise<T>,
  retries = 4,
  delay = 1_000,
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (retries === 0) throw error;
    console.warn(
      `Database write failed; retrying in ${delay}ms (${retries} retries left).`,
    );
    await new Promise((resolve) => setTimeout(resolve, delay));
    return retryDatabase(operation, retries - 1, delay * 2);
  }
}

async function main() {
  const chapterConfig = parseChapterArgument();
  const filePath = path.resolve(
    __dirname,
    "../data",
    chapterConfig.sourceFile,
  );

  if (!fs.existsSync(filePath)) {
    console.error(`Source text file not found: ${filePath}`);
    process.exit(1);
  }

  console.log(`Reading ${chapterConfig.title} from ${filePath}`);
  const paragraphs = parseParagraphs(
    fs.readFileSync(filePath, "utf-8").split(/\r?\n/),
    chapterConfig,
  );
  const chunks = buildChunks(paragraphs);

  if (chunks.length === 0) {
    throw new Error(`No chunks were generated for Chapter ${chapterConfig.number}.`);
  }

  console.log(
    `Generated ${chunks.length} chunks from ${paragraphs.length} paragraphs.`,
  );

  const deletedCount = await retryDatabase(() =>
    prisma.$transaction(async (transaction) => {
      const chapter = await transaction.chapter.upsert({
        where: { number: chapterConfig.number },
        update: {
          title: chapterConfig.title,
          subject: "Biology",
          grade: "Class 11",
        },
        create: {
          number: chapterConfig.number,
          title: chapterConfig.title,
          subject: "Biology",
          grade: "Class 11",
        },
      });

      const deleted = await transaction.chunk.deleteMany({
        where: { chapterId: chapter.id },
      });
      await transaction.chunk.createMany({
        data: chunks.map((chunk) => ({
          chapterId: chapter.id,
          sectionRef: chunk.sectionRef,
          content: chunk.content,
          tokenCount: chunk.tokenCount,
        })),
      });

      return deleted.count;
    }),
  );
  console.log(
    `Removed ${deletedCount} existing Chapter ${chapterConfig.number} chunks.`,
  );

  console.log(
    `Saved ${chunks.length} Chapter ${chapterConfig.number} chunks to the database.`,
  );
}

main()
  .catch((error) => {
    console.error("Chapter chunking failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

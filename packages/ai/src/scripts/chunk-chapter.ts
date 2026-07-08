import { PrismaClient } from "@fixit/db";
import fs from "fs";
import path from "path";
import { encode } from "gpt-3-encoder";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, "../../../../.env") });

const prisma = new PrismaClient();

// Helper to check for section headers and return normalized section reference
function getSectionHeader(line: string): string | null {
  const trimmed = line.trim();
  
  // Regex patterns for section numbers
  if (/^\s*(1\.1)(\s|$)/i.test(trimmed)) {
    return "Section 1.1: Asexual Reproduction";
  }
  if (/^\s*(1\.2)(\s|$)/i.test(trimmed)) {
    return "Section 1.2: Sexual Reproduction";
  }
  if (/^\s*(1\.2\.1)(\s|$)/i.test(trimmed)) {
    return "Section 1.2.1: Pre-fertilisation Events";
  }
  if (/^\s*(1\.2\.1\.1)(\s|$)/i.test(trimmed)) {
    return "Section 1.2.1.1: Gametogenesis";
  }
  if (/^\s*(1\.2\.1\.2)(\s|$)/i.test(trimmed)) {
    return "Section 1.2.1.2: Gamete Transfer";
  }
  if (/^\s*(1\.2\.2)(\s|$)/i.test(trimmed)) {
    return "Section 1.2.2: Fertilisation";
  }
  if (/^\s*(1\.2\.3)(\s|$)/i.test(trimmed)) {
    return "Section 1.2.3: Post-fertilisation Events";
  }
  // Handles OCR errors like 1.2.8. J or 1.2.8. 1
  if (/^\s*(1\.2\.[83]\s*\.\s*[1J])(\s|$)/i.test(trimmed)) {
    return "Section 1.2.3.1: The Zygote";
  }
  // Handles OCR errors like 1.2.8.2
  if (/^\s*(1\.2\.[83]\s*\.\s*2)(\s|$)/i.test(trimmed)) {
    return "Section 1.2.3.2: Embryogenesis";
  }

  return null;
}

// Helper to check if a line is a header, footer, page number, or figure caption
function isNoiseLine(line: string): boolean {
  const trimmed = line.trim();
  
  // Empty line
  if (!trimmed) return true;
  
  // Page headers/footers
  if (/^81010GY$/i.test(trimmed) || /^BIOLOGY$/i.test(trimmed) || /^reproduction in organisms$/i.test(trimmed)) {
    return true;
  }
  
  // Page number check (pure digits, optional spaces/symbols)
  if (/^\d+$/i.test(trimmed) || /^[ivxldcm]+$/i.test(trimmed)) {
    return true;
  }
  
  // Figure captions/labels
  if (/^Figure\s+\d+\.\d+/i.test(trimmed)) {
    return true;
  }
  
  // OCR trash/single marks
  if (trimmed === "•" || trimmed === "" || trimmed === "I" || trimmed === "r" || trimmed === "j") {
    return true;
  }
  
  return false;
}

// Helper to count tokens using gpt-3-encoder
function countTokens(text: string): number {
  return encode(text).length;
}

// Splits a paragraph into sentences
function splitIntoSentences(text: string): string[] {
  // Regex to split on periods/exclamations/questions followed by space and uppercase letter
  return text.match(/[^.!?]+[.!?]+(\s|$)/g) || [text];
}

async function main() {
  const args = process.argv.slice(2);
  const chapterArg = args.find(arg => arg.startsWith("--chapter="))?.split("=")[1];

  if (!chapterArg || chapterArg !== "bio-ch1") {
    console.error("Usage: pnpm run chunk -- --chapter=bio-ch1");
    process.exit(1);
  }

  const filePath = path.resolve(__dirname, "../data/bio-ch1.txt");
  if (!fs.existsSync(filePath)) {
    console.error(`Source text file not found at: ${filePath}. Please run extract-chapter1 first.`);
    process.exit(1);
  }

  console.log(`Reading source text from: ${filePath}`);
  const fullText = fs.readFileSync(filePath, "utf-8");
  const lines = fullText.split(/\r?\n/);

  // Find start and end of Chapter 1
  const startIndex = lines.findIndex(l => l.trim().toUpperCase() === "CHAPTER 1");
  const endIndex = lines.findIndex((l, idx) => idx > startIndex && l.trim().toUpperCase() === "CHAPTER 2");

  if (startIndex === -1 || endIndex === -1) {
    console.error("Could not find start or end of Chapter 1 in the source text.");
    process.exit(1);
  }

  console.log(`Chapter 1 starts at line ${startIndex} and ends at line ${endIndex}`);
  const chapterLines = lines.slice(startIndex, endIndex);

  // Parse lines into paragraphs grouped by section reference
  interface Paragraph {
    text: string;
    sectionRef: string;
  }
  const paragraphs: Paragraph[] = [];
  let currentSectionRef = "Chapter 1 Introduction";
  let currentParagraphLines: string[] = [];

  for (const line of chapterLines) {
    const sectionHeader = getSectionHeader(line);
    
    if (sectionHeader) {
      // Flush existing paragraph
      if (currentParagraphLines.length > 0) {
        paragraphs.push({
          text: cleanParagraphText(currentParagraphLines),
          sectionRef: currentSectionRef
        });
        currentParagraphLines = [];
      }
      currentSectionRef = sectionHeader;
      console.log(`Detected section: ${currentSectionRef}`);
      continue;
    }

    if (isNoiseLine(line)) {
      // Noise line flushes paragraph
      if (currentParagraphLines.length > 0) {
        paragraphs.push({
          text: cleanParagraphText(currentParagraphLines),
          sectionRef: currentSectionRef
        });
        currentParagraphLines = [];
      }
      continue;
    }

    currentParagraphLines.push(line);
  }

  // Flush final paragraph
  if (currentParagraphLines.length > 0) {
    paragraphs.push({
      text: cleanParagraphText(currentParagraphLines),
      sectionRef: currentSectionRef
    });
  }

  // Remove empty paragraphs
  const validParagraphs = paragraphs.filter(p => p.text.trim().length > 0);
  console.log(`Grouped into ${validParagraphs.length} valid paragraphs.`);

  // Chunking logic: target ~300-500 tokens per chunk
  interface ChunkData {
    content: string;
    sectionRef: string;
    tokenCount: number;
  }
  const chunks: ChunkData[] = [];
  
  // Group paragraphs by section first to avoid cross-section chunks
  const paragraphsBySection: Record<string, Paragraph[]> = {};
  for (const p of validParagraphs) {
    if (!paragraphsBySection[p.sectionRef]) {
      paragraphsBySection[p.sectionRef] = [];
    }
    paragraphsBySection[p.sectionRef].push(p);
  }

  for (const [sectionRef, sectionParagraphs] of Object.entries(paragraphsBySection)) {
    let currentChunkText = "";
    let currentChunkTokens = 0;

    for (const paragraph of sectionParagraphs) {
      const paragraphTokens = countTokens(paragraph.text);

      // If a single paragraph is too large (greater than 450 tokens), we split it by sentence
      if (paragraphTokens > 450) {
        const sentences = splitIntoSentences(paragraph.text);
        for (const sentence of sentences) {
          const sentenceTokens = countTokens(sentence);
          if (currentChunkTokens + sentenceTokens > 450 && currentChunkTokens > 0) {
            // Flush current chunk
            chunks.push({
              content: currentChunkText.trim(),
              sectionRef,
              tokenCount: currentChunkTokens
            });
            currentChunkText = sentence;
            currentChunkTokens = sentenceTokens;
          } else {
            currentChunkText += (currentChunkText ? " " : "") + sentence.trim();
            currentChunkTokens += sentenceTokens;
          }
        }
      } else {
        // Normal paragraph fit check
        if (currentChunkTokens + paragraphTokens > 450 && currentChunkTokens > 0) {
          // Flush current chunk
          chunks.push({
            content: currentChunkText.trim(),
            sectionRef,
            tokenCount: currentChunkTokens
          });
          currentChunkText = paragraph.text;
          currentChunkTokens = paragraphTokens;
        } else {
          currentChunkText += (currentChunkText ? "\n\n" : "") + paragraph.text;
          currentChunkTokens += paragraphTokens;
        }
      }
    }

    // Flush remaining chunk for the section
    if (currentChunkText) {
      chunks.push({
        content: currentChunkText.trim(),
        sectionRef,
        tokenCount: currentChunkTokens
      });
    }
  }

  console.log(`Generated ${chunks.length} semantically coherent chunks.`);

  // Write to Database
  try {
    // 1. Create or Find the Chapter
    const chapter = await prisma.chapter.upsert({
      where: { number: 1 },
      update: {
        title: "Reproduction in Organisms",
        subject: "Biology",
        grade: "Class 12"
      },
      create: {
        number: 1,
        title: "Reproduction in Organisms",
        subject: "Biology",
        grade: "Class 12"
      }
    });

    console.log(`Upserted Chapter: ${chapter.title} (ID: ${chapter.id})`);

    // 2. Clear existing chunks for this chapter (ensures idempotency)
    const deleteCount = await prisma.chunk.deleteMany({
      where: { chapterId: chapter.id }
    });
    console.log(`Deleted ${deleteCount.count} existing chunks to ensure idempotency.`);

    // 3. Insert chunks
    let insertedCount = 0;
    for (const chunk of chunks) {
      await prisma.chunk.create({
        data: {
          chapterId: chapter.id,
          sectionRef: chunk.sectionRef,
          content: chunk.content,
          tokenCount: chunk.tokenCount
        }
      });
      insertedCount++;
    }

    console.log(`Successfully saved ${insertedCount} chunks to the database!`);
  } catch (error) {
    console.error("Database operation failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Cleans up OCR hyphenation and formatting
function cleanParagraphText(lines: string[]): string {
  let cleanedText = "";
  for (let i = 0; i < lines.length; i++) {
    const currentLine = lines[i].trim();
    if (!currentLine) continue;

    // Check if line ends with a hyphen
    if (currentLine.endsWith("-")) {
      // Remove hyphen and join directly with next line
      cleanedText += currentLine.slice(0, -1);
    } else {
      cleanedText += currentLine + " ";
    }
  }
  return cleanedText.replace(/\s+/g, " ").trim();
}

main();

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
    return "Section 1.1: What is 'Living'?";
  }
  if (/^\s*(1\.2)(\s|$)/i.test(trimmed)) {
    return "Section 1.2: Diversity in the Living World";
  }
  if (/^\s*(1\.3)(\s|$)/i.test(trimmed)) {
    return "Section 1.3: Taxonomic Categories";
  }
  if (/^\s*(1\.3\.1)(\s|$)/i.test(trimmed)) {
    return "Section 1.3.1: Species";
  }
  if (/^\s*(1\.3\.2)(\s|$)/i.test(trimmed)) {
    return "Section 1.3.2: Genus";
  }
  if (/^\s*(1\.3\.3)(\s|$)/i.test(trimmed)) {
    return "Section 1.3.3: Family";
  }
  if (/^\s*(1\.3\.4)(\s|$)/i.test(trimmed)) {
    return "Section 1.3.4: Order";
  }
  if (/^\s*(1\.3\.5)(\s|$)/i.test(trimmed)) {
    return "Section 1.3.5: Class";
  }
  if (/^\s*(1\.3\.6)(\s|$)/i.test(trimmed)) {
    return "Section 1.3.6: Phylum";
  }
  if (/^\s*(1\.3\.7)(\s|$)/i.test(trimmed)) {
    return "Section 1.3.7: Kingdom";
  }
  if (/^\s*(1\.4)(\s|$)/i.test(trimmed)) {
    return "Section 1.4: Taxonomical Aids";
  }
  if (/^\s*(1\.4\.1)(\s|$)/i.test(trimmed)) {
    return "Section 1.4.1: Herbarium";
  }
  if (/^\s*(1\.4\.2)(\s|$)/i.test(trimmed)) {
    return "Section 1.4.2: Botanical Gardens";
  }
  if (/^\s*(1\.4\.3)(\s|$)/i.test(trimmed)) {
    return "Section 1.4.3: Museum";
  }
  if (/^\s*(1\.4\.4)(\s|$)/i.test(trimmed)) {
    return "Section 1.4.4: Zoological Parks";
  }
  if (/^\s*(1\.4\.5)(\s|$)/i.test(trimmed)) {
    return "Section 1.4.5: Key";
  }
  if (/^\s*(SUMMARY)(\s|$)/i.test(trimmed)) {
    return "Section: Summary";
  }
  if (/^\s*(EXERCISES)(\s|$)/i.test(trimmed)) {
    return "Section: Exercises";
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
  
  // Figure or Table captions/labels
  if (/^(Figure|Table|TABLE)\s+\d+(\.\d+)?/i.test(trimmed)) {
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
  const startIndex = lines.findIndex(l => l.trim().toUpperCase() === "CHAPTER 1" || l.trim().toUpperCase() === "CHAPTER 1 - THE LIVING WORLD");
  const endIndex = lines.findIndex((l, idx) => idx > startIndex && (l.trim().toUpperCase() === "CHAPTER 2" || l.trim().toUpperCase() === "CHAPTER 2:"));

  if (startIndex === -1) {
    console.error("Could not find start of Chapter 1 in the source text.");
    process.exit(1);
  }

  const finalEndIndex = endIndex === -1 ? lines.length : endIndex;
  console.log(`Chapter 1 starts at line ${startIndex} and ends at line ${finalEndIndex}`);
  const chapterLines = lines.slice(startIndex, finalEndIndex);

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
        title: "The Living World",
        subject: "Biology",
        grade: "Class 11"
      },
      create: {
        number: 1,
        title: "The Living World",
        subject: "Biology",
        grade: "Class 11"
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

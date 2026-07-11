import { PrismaClient } from "@fixit/db";
import fs from "fs";
import path from "path";
import { encode } from "gpt-3-encoder";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, "../../../../.env") });

const prisma = new PrismaClient();

// Helper to check for section headers and return normalized section reference
function getSectionHeader(line: string, chapterNum: number): string | null {
  const trimmed = line.trim();
  
  // Match patterns starting with chapterNum followed by dots and numbers/OCR noise
  const regex = new RegExp(`^\\s*(${chapterNum}\\s*\\.\\s*[0-9lIJ\\s]+(?:\\.\\s*[0-9lIJ\\s]+)*)(?:\\s|\\.|$)(.*)`, 'i');
  const match = trimmed.match(regex);
  if (!match) return null;

  let numPart = match[1].replace(/\s+/g, ''); // Remove spaces inside number
  const titlePart = match[2].trim();

  // Normalize characters to digits in the section number
  numPart = numPart
    .replace(/l/g, '1')
    .replace(/I/g, '1')
    .replace(/J/g, '1')
    .replace(/\.$/, ''); // remove trailing dot

  // Specific OCR fixes
  if (chapterNum === 1) {
    numPart = numPart.replace(/^1\.2\.8\./, '1.2.3.');
    if (numPart === '1.6' || numPart === '1.7') {
      return null; // Noise
    }
  }
  
  if (chapterNum === 2) {
    // Filter out figures/tables like 2.8, 2.9, 2.11, etc.
    const validPrefixes = ['2.1', '2.2', '2.3', '2.4', '2.5'];
    if (!validPrefixes.some(pref => numPart.startsWith(pref))) {
      return null;
    }
  }

  if (chapterNum === 3) {
    const validPrefixes = ['3.1', '3.2', '3.3', '3.4', '3.5', '3.6', '3.7'];
    if (!validPrefixes.some(pref => numPart.startsWith(pref))) {
      return null;
    }
  }

  if (chapterNum === 4) {
    const validPrefixes = ['4.1', '4.2', '4.3', '4.4', '4.5'];
    if (!validPrefixes.some(pref => numPart.startsWith(pref))) {
      return null;
    }
  }

  if (chapterNum === 5) {
    const validPrefixes = ['5.1', '5.2', '5.3', '5.4', '5.5', '5.6', '5.7'];
    if (!validPrefixes.some(pref => numPart.startsWith(pref))) {
      return null;
    }
  }

  const sectionTitles: Record<string, string> = {
    // Chapter 1
    "1.1": "Asexual Reproduction",
    "1.2": "Sexual Reproduction",
    "1.2.1": "Pre-fertilisation Events",
    "1.2.1.1": "Gametogenesis",
    "1.2.1.2": "Gamete Transfer",
    "1.2.2": "Fertilisation",
    "1.2.3": "Post-fertilisation Events",
    "1.2.3.1": "The Zygote",
    "1.2.3.2": "Embryogenesis",
    
    // Chapter 2
    "2.1": "Flower - A Fascinating Organ of Angiosperms",
    "2.2": "Pre-fertilisation: Structures and Events",
    "2.2.1": "Stamen, Microsporangium and Pollen Grain",
    "2.2.2": "The Pistil, Megasporangium (ovule) and Embryo Sac",
    "2.2.3": "Pollination",
    "2.3": "Double Fertilisation",
    "2.4": "Post-fertilisation: Structures and Events",
    "2.4.1": "Endosperm",
    "2.4.2": "Embryo",
    "2.4.3": "Seed",
    "2.5": "Apomixis and Polyembryony",

    // Chapter 3
    "3.1": "The Male Reproductive System",
    "3.2": "The Female Reproductive System",
    "3.3": "Gametogenesis",
    "3.4": "Menstrual Cycle",
    "3.5": "Fertilisation and Implantation",
    "3.6": "Pregnancy and Embryonic Development",
    "3.7": "Parturition and Lactation",

    // Chapter 4
    "4.1": "Reproductive Health - Problems and Strategies",
    "4.2": "Population Explosion and Birth Control",
    "4.3": "Medical Termination of Pregnancy",
    "4.4": "Sexually Transmitted Diseases (STDs)",
    "4.5": "Infertility",

    // Chapter 5
    "5.1": "Mendel's Laws of Inheritance",
    "5.2": "Inheritance of One Gene",
    "5.2.1": "Law of Dominance",
    "5.2.2": "Law of Segregation",
    "5.2.2.1": "Incomplete Dominance",
    "5.2.2.2": "Co-dominance",
    "5.3": "Inheritance of Two Genes",
    "5.3.2": "Chromosomal Theory of Inheritance",
    "5.4": "Sex Determination",
    "5.4.1": "Sex Determination in Humans",
    "5.5": "Mutation",
    "5.6": "Genetic Disorders",
    "5.6.1": "Pedigree Analysis",
    "5.6.3": "Chromosomal Disorders",
  };

  const title = sectionTitles[numPart];
  if (title) {
    return `Section ${numPart}: ${title}`;
  }
  
  return `Section ${numPart}${titlePart ? ': ' + titlePart : ''}`;
}

// Helper to check if a line is a header, footer, page number, or figure caption
function isNoiseLine(line: string): boolean {
  const trimmed = line.trim();
  
  // Empty line
  if (!trimmed) return true;
  
  // Page headers/footers / Chapter headers
  const noisePatterns = [
    /^81010GY$/i,
    /^BIOLOGY$/i,
    /^reproduction in organisms$/i,
    /^sexual reproduction in flowering plants$/i,
    /^human reproduction$/i,
    /^reproductive health$/i,
    /^principles of inheritance and variation$/i,
    /^chapter\s+\d+$/i,
    /^chapter:\d+$/i,
    /^chapter\s+[ivxldcm]+$/i
  ];
  if (noisePatterns.some(pat => pat.test(trimmed))) {
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
  const trash = ["•", "", "I", "r", "j", "_I", "i I", "j", "Parent cell", "(a)", "(b)", "(c)", "(d)", "(e)"];
  if (trash.includes(trimmed)) {
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

async function processChapter(chapterNum: number, chapterTitle: string, lines: string[]) {
  console.log(`\n--- Processing Chapter ${chapterNum}: ${chapterTitle} ---`);
  
  // Find start and end of Chapter (case-sensitive to avoid matching the contents index)
  const startIndex = lines.findIndex(l => l.trim() === `CHAPTER ${chapterNum}`);
  const nextChapterNum = chapterNum + 1;
  const endIndex = lines.findIndex((l, idx) => idx > startIndex && l.trim() === `CHAPTER ${nextChapterNum}`);

  if (startIndex === -1) {
    console.error(`Could not find start of Chapter ${chapterNum} in the source text.`);
    process.exit(1);
  }

  const chapterLines = endIndex === -1 ? lines.slice(startIndex) : lines.slice(startIndex, endIndex);
  console.log(`Chapter ${chapterNum} starts at line ${startIndex + 1} and ends at line ${endIndex === -1 ? lines.length : endIndex + 1}`);

  // Parse lines into paragraphs grouped by section reference
  interface Paragraph {
    text: string;
    sectionRef: string;
  }
  const paragraphs: Paragraph[] = [];
  let currentSectionRef = `Chapter ${chapterNum} Introduction`;
  let currentParagraphLines: string[] = [];

  for (const line of chapterLines) {
    const sectionHeader = getSectionHeader(line, chapterNum);
    
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
    const chapter = await prisma.chapter.upsert({
      where: { number: chapterNum },
      update: {
        title: chapterTitle,
        subject: "Biology",
        grade: "Class 12"
      },
      create: {
        number: chapterNum,
        title: chapterTitle,
        subject: "Biology",
        grade: "Class 12"
      }
    });

    console.log(`Upserted Chapter: ${chapter.title} (ID: ${chapter.id})`);

    // Clear existing chunks for this chapter (ensures idempotency)
    const deleteCount = await prisma.chunk.deleteMany({
      where: { chapterId: chapter.id }
    });
    console.log(`Deleted ${deleteCount.count} existing chunks to ensure idempotency.`);

    // Insert chunks in a single bulk operation
    const chunkData = chunks.map(chunk => ({
      chapterId: chapter.id,
      sectionRef: chunk.sectionRef,
      content: chunk.content,
      tokenCount: chunk.tokenCount
    }));

    const result = await prisma.chunk.createMany({
      data: chunkData
    });

    console.log(`Successfully saved ${result.count} chunks for Chapter ${chapterNum} to the database!`);
  } catch (error) {
    console.error(`Database operation failed for Chapter ${chapterNum}:`, error);
    throw error;
  }
}

async function main() {
  const args = process.argv.slice(2);
  const chapterArg = args.find(arg => arg.startsWith("--chapter="))?.split("=")[1];
  const allArg = args.includes("--all");

  if (!allArg && !chapterArg) {
    console.error("Usage: pnpm run chunk -- --chapter=<1-5> OR pnpm run chunk -- --all");
    process.exit(1);
  }

  const filePath = path.resolve(__dirname, "../data/bio-ch1.txt");
  if (!fs.existsSync(filePath)) {
    console.error(`Source text file not found at: ${filePath}.`);
    process.exit(1);
  }

  console.log(`Reading source text from: ${filePath}`);
  const fullText = fs.readFileSync(filePath, "utf-8");
  const lines = fullText.split(/\r?\n/);

  const chaptersMap: Record<number, string> = {
    1: "Reproduction in Organisms",
    2: "Sexual Reproduction in Flowering Plants",
    3: "Human Reproduction",
    4: "Reproductive Health",
    5: "Principles of Inheritance and Variation"
  };

  try {
    if (allArg) {
      for (const [numStr, title] of Object.entries(chaptersMap)) {
        const num = parseInt(numStr, 10);
        await processChapter(num, title, lines);
      }
    } else {
      const chapterNums = chapterArg!.split(",").map(n => parseInt(n.trim(), 10));
      for (const num of chapterNums) {
        if (!chaptersMap[num]) {
          console.error(`Invalid chapter number: ${num}. Only chapters 1-5 are supported.`);
          process.exit(1);
        }
        await processChapter(num, chaptersMap[num], lines);
      }
    }
  } catch (error) {
    console.error("Error in execution:", error);
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
      cleanedText += currentLine.slice(0, -1);
    } else {
      cleanedText += currentLine + " ";
    }
  }
  return cleanedText.replace(/\s+/g, " ").trim();
}

main();

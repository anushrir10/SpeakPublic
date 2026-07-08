import fs from "fs";
import path from "path";
import pdf from "pdf-parse";

async function extract() {
  const pdfPath = path.resolve(__dirname, "../../../../apps/frontend/NCERT-Class-12-Biology.pdf");
  const outputPath = path.resolve(__dirname, "../../src/data/bio-ch1.txt");

  console.log(`Reading PDF from: ${pdfPath}`);
  
  if (!fs.existsSync(pdfPath)) {
    console.error("PDF file not found!");
    process.exit(1);
  }

  const dataBuffer = fs.readFileSync(pdfPath);
  
  // pdf-parse options
  const options = {
    // We can customize page rendering if needed
  };

  try {
    const data = await (pdf as any)(dataBuffer);
    
    // Create output directory if it doesn't exist
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Let's find Chapter 1 text
    // The PDF text includes all pages. We'll search for "CHAPTER 1" and "REPRODUCTION IN ORGANISMS".
    // Let's write the whole text first, or slice it to Chapter 1.
    // Chapter 1 is from page 3 to page 18 of the PDF roughly.
    // Let's write the full extracted text to the file so we can inspect and chunk it.
    fs.writeFileSync(outputPath, data.text, "utf-8");
    console.log(`Extracted PDF text saved to: ${outputPath}`);
    console.log(`Total Pages: ${data.numpages}`);
  } catch (error) {
    console.error("Error parsing PDF:", error);
  }
}

extract();

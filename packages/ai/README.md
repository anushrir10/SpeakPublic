# FixIt AI Service — Week 1 MVP Scaffolding

This package handles the parsing, chunking, embedding, and similarity search/retrieval for textbook chapters.

## Chunking Strategy Specification

To support precise citation and high retrieval quality (required for Week 3's passaged-locked QA), we implement a strict semantic chunking strategy:

1. **Chapter Boundaries**: We extract and process only the text between the start of the target chapter (e.g., `CHAPTER 1`) and the next chapter (`CHAPTER 2`).
2. **Noise and Layout Cleaning**: 
   - Page numbers, header/footer text (e.g., "BIOLOGY"), and figure captions are removed.
   - Text flow layout issues from PDF parsing are corrected. Specifically, words split across lines by a hyphen (e.g., `repro- \n duction`) are joined back together (e.g., `reproduction`).
3. **Section References**: 
   - The script tracks the current section header (e.g. `1.1 Asexual Reproduction`, `1.2.1 Pre-fertilisation Events`) using flexible regex pattern matching that accounts for common OCR errors (such as `1.2.8. J` for `1.2.3.1`).
   - Every chunk is tagged with its `sectionRef` for citation and source attribution.
4. **Paragraph Preservation**:
   - Consecutive text lines are grouped into paragraphs.
   - We avoid splitting paragraphs unless they exceed our token limit, ensuring semantic coherence is maintained.
5. **Token Count & Chunk Sizing**:
   - We target a chunk size of **300 to 500 tokens**.
   - Tokens are counted using the GPT-3/4 tokenizer representation (`gpt-3-encoder` library), matching `text-embedding-3-small`'s tokenization.
   - Paragraphs are combined sequentially into a chunk. If adding a paragraph would exceed 500 tokens, the current chunk is saved, and a new chunk is started.
   - If a single paragraph is larger than 450 tokens, it is split into sentences (e.g. at `.`/`?`/`!`), which are then grouped into 300–500 token chunks.
   - Chunks **never cross section boundaries**. If a section ends, the current chunk is flushed immediately, ensuring each chunk corresponds to exactly one section reference.

---

## CLI Usage

First, ensure you have set up a `.env` file at the root of the workspace with your `DATABASE_URL` and `OPENAI_API_KEY`:
```env
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"
OPENAI_API_KEY="your-openai-api-key"
```

### 1. Extract PDF Text (Internal Helper)
To extract the raw text from the Class 12 Biology PDF:
```bash
pnpm --filter @fixit/ai exec tsx src/scripts/extract-chapter1.ts
```
This generates the plain text file `packages/ai/src/data/bio-ch1.txt`.

### 2. Chunking Script
Process Chapter 1 into semantically coherent chunks and write them to the database:
```bash
# From workspace root
pnpm --filter @fixit/ai run chunk --chapter=bio-ch1

# Or from packages/ai directory
npm run chunk -- --chapter=bio-ch1
```

### 3. Embedding Pipeline
Read unembedded chunks from the database, call the OpenAI API (in batches of 20, with retry and exponential backoff), and save the vector embeddings to the database:
```bash
# From workspace root
pnpm --filter @fixit/ai run embed

# Or from packages/ai directory
npm run embed
```
This script is idempotent; re-running it will only embed chunks that don't already have stored vectors.

### 4. Similarity Search Smoke Test
Run a cosine similarity search against the database using a test query and retrieve the top-5 matching chunks:
```bash
# From workspace root
pnpm --filter @fixit/ai run test-retrieval --query="How do yeast and amoeba reproduce asexually?"

# Or from packages/ai directory
npm run test-retrieval -- --query="How do yeast and amoeba reproduce asexually?"
```
The script will output the top-5 matched chunks, their section references, and their cosine similarity percentage.

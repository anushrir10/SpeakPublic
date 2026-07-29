# FixIt AI Service — Biology retrieval pipeline

This package handles chunking, embedding, and similarity retrieval for NCERT Class XI Biology Chapters 1–5:

1. The Living World
2. Biological Classification
3. Plant Kingdom
4. Animal Kingdom
5. Morphology of Flowering Plants

## Chunking strategy

- Chunks never cross section boundaries.
- Paragraphs are preserved unless they exceed the 450-token limit.
- Oversized paragraphs are split by sentence.
- Page headers, page numbers, and figure/table captions are removed.
- OCR line-ending hyphenation is repaired.
- Each chunk stores its section reference and token count.

## Configuration

Create a workspace-root `.env` file:

```env
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"
OPENAI_API_KEY="your-openai-api-key"
```

## Commands

Chunk one chapter and replace that chapter's existing chunks:

```bash
pnpm --filter @fixit/ai run chunk -- --chapter=bio-ch2
```

Valid slugs are `bio-ch1` through `bio-ch5`. Replacing chunks also removes their old embeddings through the database relation's cascade.

Embed only unembedded chunks from selected chapters:

```bash
pnpm --filter @fixit/ai run embed -- --chapters=2,3,4,5
```

The `--chapters` filter is optional. The command writes 1536-dimensional `text-embedding-3-small` vectors and fails rather than storing mock or random vectors when the OpenAI request cannot be completed.

Confirm per-chapter `chunks` and `chunk_embeddings` row counts:

```bash
pnpm --filter @fixit/ai run verify-ingestion
```

Run the 30-query, five-chapter retrieval checkpoint:

```bash
pnpm --filter @fixit/ai run evaluate-retrieval
```

The checkpoint writes `packages/ai/artifacts/retrieval_checkpoint_results.md` and passes when expected-chapter hit@3 is at least 80%.

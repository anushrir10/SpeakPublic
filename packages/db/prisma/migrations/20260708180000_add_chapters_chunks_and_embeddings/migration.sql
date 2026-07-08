-- CreateExtension
CREATE EXTENSION IF NOT EXISTS vector;

-- CreateTable
CREATE TABLE "chapters" (
    "id" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "subject" TEXT NOT NULL DEFAULT 'Biology',
    "grade" TEXT NOT NULL DEFAULT 'Class 12',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chapters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chunks" (
    "id" TEXT NOT NULL,
    "chapterId" TEXT NOT NULL,
    "sectionRef" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "tokenCount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chunks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chunk_embeddings" (
    "id" TEXT NOT NULL,
    "chunkId" TEXT NOT NULL,
    "vector" vector(1536),
    "model" TEXT NOT NULL DEFAULT 'text-embedding-3-small',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chunk_embeddings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "chapters_number_key" ON "chapters"("number");

-- CreateIndex
CREATE UNIQUE INDEX "chunk_embeddings_chunkId_key" ON "chunk_embeddings"("chunkId");

-- AddForeignKey
ALTER TABLE "chunks" ADD CONSTRAINT "chunks_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "chapters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chunk_embeddings" ADD CONSTRAINT "chunk_embeddings_chunkId_fkey" FOREIGN KEY ("chunkId") REFERENCES "chunks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

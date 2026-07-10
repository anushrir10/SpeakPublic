-- CreateExtension
CREATE EXTENSION IF NOT EXISTS vector;

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "clerkId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_chunks" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "chapterId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "content_chunks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "embeddings" (
    "id" TEXT NOT NULL,
    "chunkId" TEXT NOT NULL,
    "embedding" vector,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "embeddings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flashcards" (
    "id" TEXT NOT NULL,
    "chunkId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "options" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "flashcards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flashcard_progress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "flashcardId" TEXT NOT NULL,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "lastReviewed" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "flashcard_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fsrs_state" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "flashcardId" TEXT NOT NULL,
    "ease" DOUBLE PRECISION NOT NULL DEFAULT 2.5,
    "interval" INTEGER NOT NULL DEFAULT 1,
    "nextReview" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reps" INTEGER NOT NULL DEFAULT 0,
    "lapses" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fsrs_state_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "simplified_content" (
    "id" TEXT NOT NULL,
    "chunkId" TEXT NOT NULL,
    "tier" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "simplified_content_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "analytics_events" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "chunkId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "analytics_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_clerkId_key" ON "users"("clerkId");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "embeddings_chunkId_key" ON "embeddings"("chunkId");

-- CreateIndex
CREATE UNIQUE INDEX "flashcard_progress_userId_flashcardId_key" ON "flashcard_progress"("userId", "flashcardId");

-- CreateIndex
CREATE UNIQUE INDEX "fsrs_state_userId_flashcardId_key" ON "fsrs_state"("userId", "flashcardId");

-- CreateIndex
CREATE UNIQUE INDEX "simplified_content_chunkId_tier_key" ON "simplified_content"("chunkId", "tier");

-- AddForeignKey
ALTER TABLE "embeddings" ADD CONSTRAINT "embeddings_chunkId_fkey" FOREIGN KEY ("chunkId") REFERENCES "content_chunks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flashcards" ADD CONSTRAINT "flashcards_chunkId_fkey" FOREIGN KEY ("chunkId") REFERENCES "content_chunks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flashcard_progress" ADD CONSTRAINT "flashcard_progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flashcard_progress" ADD CONSTRAINT "flashcard_progress_flashcardId_fkey" FOREIGN KEY ("flashcardId") REFERENCES "flashcards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fsrs_state" ADD CONSTRAINT "fsrs_state_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fsrs_state" ADD CONSTRAINT "fsrs_state_flashcardId_fkey" FOREIGN KEY ("flashcardId") REFERENCES "flashcards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simplified_content" ADD CONSTRAINT "simplified_content_chunkId_fkey" FOREIGN KEY ("chunkId") REFERENCES "content_chunks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analytics_events" ADD CONSTRAINT "analytics_events_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analytics_events" ADD CONSTRAINT "analytics_events_chunkId_fkey" FOREIGN KEY ("chunkId") REFERENCES "content_chunks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

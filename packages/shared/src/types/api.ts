// API Response Types

export type RetrievalResponse = {
  id: string;
  text: string;
  chapterId: string;
  similarity: number;
};

export type FlashcardReviewRequest = {
  cardId: string;
  rating: 1 | 2 | 3 | 4; // FSRS rating
};

export type FlashcardResponse = {
  id: string;
  question: string;
  answer: string;
  difficulty: "easy" | "medium" | "hard";
  type: "qa" | "mcq";
  options?: string[]; // for MCQ
};

export type SimplifyResponse = {
  eli5: string;
  standard: string;
  advanced: string;
};

export type FSRSReviewResponse = {
  nextCard: FlashcardResponse;
  dueCount: number;
  completedToday: number;
};

export type HealthResponse = {
  status: string;
  timestamp: string;
};

// Week 2 additions

export type ChapterResponse = {
  id: string;
  number: number;
  title: string;
  subject: string;
  grade: string;
};

export type ChapterDetailResponse = ChapterResponse & {
  chunks: ChunkResponse[];
};

export type ChunkResponse = {
  id: string;
  chapterId: string;
  sectionRef: string;
  content: string;
  tokenCount: number;
};

export type RetrieveRequest = {
  query: string;
  topK?: number; // default 5
};

export type RetrieveResponse = {
  chunkId: string;
  content: string;
  sectionRef: string;
  chapterId: string;
  similarity: number;
}[];

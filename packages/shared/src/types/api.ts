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

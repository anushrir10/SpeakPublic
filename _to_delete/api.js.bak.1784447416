import axios from "axios";

// Base API client — proxied through Vite in dev, direct in production
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Inject Clerk auth token into every request
let getTokenFn = null;

export const setAuthTokenGetter = (fn) => {
  getTokenFn = fn;
};

api.interceptors.request.use(async (config) => {
  if (getTokenFn) {
    try {
      const token = await getTokenFn();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      console.warn("[api] Failed to get auth token:", err);
    }
  }
  return config;
});

// ─── Health ──────────────────────────────────────────────
export const healthCheck = async () => {
  try {
    const { data } = await api.get("/health");
    return data;
  } catch (err) {
    console.warn("[api] Health check failed:", err.message);
    return null;
  }
};

// ─── Content Retrieval ───────────────────────────────────
// POST /api/retrieve — search content chunks by query text
export const retrieveContent = async (query) => {
  try {
    const { data } = await api.post("/api/retrieve", { query });
    return data;
  } catch (err) {
    console.warn("[api] Retrieve failed:", err.message);
    return null;
  }
};

// ─── Chapters & Chunks (Week 2) ──────────────────────────
// GET /api/chapters — list all chapters, ordered by number.
// Returns Chapter[] ({ id, number, title, subject, grade }) or null on failure.
export const fetchChapters = async () => {
  try {
    const { data } = await api.get("/api/chapters");
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.warn("[api] fetchChapters failed:", err.message);
    return null; // null → caller decides to fall back
  }
};

// GET /api/chapters/:id — a single chapter with its chunks included.
export const fetchChapter = async (id) => {
  try {
    const { data } = await api.get(`/api/chapters/${id}`);
    return data;
  } catch (err) {
    console.warn("[api] fetchChapter failed:", err.message);
    return null;
  }
};

// GET /api/chunks?chapterId=x — all chunks for a chapter, ordered by sectionRef.
// Returns Chunk[] ({ id, chapterId, sectionRef, content, tokenCount }) or null.
export const fetchChunks = async (chapterId) => {
  if (!chapterId) return [];
  try {
    const { data } = await api.get("/api/chunks", { params: { chapterId } });
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.warn("[api] fetchChunks failed:", err.message);
    return null;
  }
};

// ─── FSRS Flashcard Review ───────────────────────────────
// POST /api/fsrs/review — submit a flashcard review rating
export const reviewFlashcard = async (cardId, rating) => {
  try {
    const { data } = await api.post("/api/fsrs/review", { cardId, rating });
    return data;
  } catch (err) {
    console.warn("[api] FSRS review failed:", err.message);
    return null;
  }
};

// ─── DB-Backed Flashcards ────────────────────────────────
// GET /api/flashcards?chapterId=x — all flashcards for a chapter.
// Returns Flashcard[] ({ id, chunkId, question, answer, difficulty, type, options }) or [].
export const fetchFlashcards = async (chapterId) => {
  if (!chapterId) return [];
  try {
    const { data } = await api.get("/api/flashcards", { params: { chapterId } });
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.warn("[api] fetchFlashcards failed:", err.message);
    return [];
  }
};

// GET /api/flashcards/:id — single flashcard by id.
export const fetchFlashcard = async (id) => {
  if (!id) return null;
  try {
    const { data } = await api.get(`/api/flashcards/${id}`);
    return data ?? null;
  } catch (err) {
    console.warn("[api] fetchFlashcard failed:", err.message);
    return null;
  }
};

// ─── Simplified Content (Difficulty Tiers) ───────────────
// GET /api/chunks/:id/simplified?tier=eli5|standard|advanced
// Returns { id, chunkId, tier, text } or null.
export const fetchSimplifiedContent = async (chunkId, tier = "standard") => {
  if (!chunkId) return null;
  try {
    const { data } = await api.get(`/api/chunks/${chunkId}/simplified`, {
      params: { tier },
    });
    return data ?? null;
  } catch (err) {
    console.warn("[api] fetchSimplifiedContent failed:", err.message);
    return null;
  }
};

// ─── Analytics ───────────────────────────────────────────
// POST /api/analytics — fire-and-forget event logging.
export const logAnalyticsEvent = async (eventType, chunkId = null, metadata = {}) => {
  try {
    await api.post("/api/analytics", { eventType, chunkId, metadata });
  } catch {
    // Non-critical — swallow silently
  }
};

export default api;

import axios from "axios";

// Base API client — proxied through Vite in dev, direct in production
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3001",
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

// POST /api/generate-card — generate study card definition, flashcard & mcq from context chunks
export const generateStudyCard = async (query, chunks) => {
  try {
    const { data } = await api.post("/api/generate-card", { query, chunks });
    return data;
  } catch (err) {
    console.warn("[api] Generate study card failed:", err.message);
    return null;
  }
};

export default api;

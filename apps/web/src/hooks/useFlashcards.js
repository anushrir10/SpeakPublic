import { useState, useEffect, useCallback } from "react";
import { fetchFlashcards } from "../services/api";

/**
 * Fetches DB-backed flashcards for a chapter from GET /api/flashcards?chapterId=…
 *
 * Pass `null` to skip fetching (e.g. in local/fallback mode).
 *
 * Flashcard shape (from Prisma model):
 *   { id, chunkId, question, answer, difficulty, type, options }
 *   - type: "qa" | "mcq"
 *   - difficulty: "easy" | "medium" | "hard"
 *   - options: string[] | null  (only for MCQ)
 *
 * Falls back to [] if the endpoint is unreachable — the UI stays functional.
 *
 * @param {string|null} chapterId
 * @returns {{ flashcards: Array, loading: boolean, error: string|null, reload: () => void }}
 */
export function useFlashcards(chapterId) {
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    if (!chapterId) {
      setFlashcards([]);
      setError(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    const data = await fetchFlashcards(chapterId);
    setFlashcards(Array.isArray(data) ? data : []);
    if (!data || (Array.isArray(data) && data.length === 0)) {
      // Not an error — chapter just has no cards yet, or endpoint not deployed
      setError(null);
    }
    setLoading(false);
  }, [chapterId]);

  useEffect(() => {
    load();
  }, [load]);

  return { flashcards, loading, error, reload: load };
}

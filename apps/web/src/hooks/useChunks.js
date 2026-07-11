import { useState, useEffect, useCallback } from "react";
import { fetchChunks } from "../services/api";

/**
 * Loads the content chunks for a chapter from GET /api/chunks?chapterId=…
 *
 * Pass `null` (e.g. when the API is unreachable and the reader is using local
 * content) to skip fetching entirely.
 *
 * Chunk shape (matches @fixit/shared ChunkResponse):
 *   { id, chapterId, sectionRef, content, tokenCount }
 *
 * @param {string|null} chapterId
 * @returns {{ chunks: Array|null, loading: boolean, error: string|null, reload: () => void }}
 */
export function useChunks(chapterId) {
  const [chunks, setChunks] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    if (!chapterId) {
      setChunks(null);
      setError(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    const data = await fetchChunks(chapterId);
    if (data === null) {
      setError("api-unreachable");
      setChunks([]);
    } else {
      setChunks(data);
    }
    setLoading(false);
  }, [chapterId]);

  useEffect(() => {
    // Fetch-on-change: synchronising with the chunks API is the intended use here.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  return { chunks, loading, error, reload: load };
}

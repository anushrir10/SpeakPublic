import { useState, useEffect, useCallback } from "react";
import { fetchChapters } from "../services/api";

/**
 * Week 2 — chapter fetch + navigation source.
 *
 * Tries Prabodh's GET /api/chapters. Until that endpoint is merged and the
 * database is seeded, it falls back to deriving lightweight "sections" from
 * the active local textbook so chapter navigation still works end-to-end.
 *
 * Chapter shape (matches @fixit/shared ChapterResponse):
 *   { id, number, title, subject, grade }
 * Fallback chapters additionally carry { __local: true, __pageNumber } so the
 * Reader can map a selection back to a local page.
 *
 * @param {object|null} activeBook - the currently open local textbook (fallback source)
 * @returns {{ chapters, loading, error, isFallback, reload }}
 */
export function useChapters(activeBook) {
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFallback, setIsFallback] = useState(false);

  const deriveFallback = useCallback((book) => {
    if (!book || !Array.isArray(book.pages)) return [];
    return book.pages.map((pg, i) => {
      const number = pg.pageNumber ?? i + 1;
      return {
        id: `local-${book.id}-${number}`,
        number,
        title: pg.title || `Section ${number}`,
        subject: book.subject,
        grade: book.grade,
        __local: true,
        __pageNumber: number,
      };
    });
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const data = await fetchChapters();

    if (Array.isArray(data) && data.length > 0) {
      // Live data from the API
      setChapters(data);
      setIsFallback(false);
    } else {
      // Endpoint unreachable (not merged yet) or empty → local fallback
      setChapters(deriveFallback(activeBook));
      setIsFallback(true);
      if (data === null) setError("api-unreachable");
    }
    setLoading(false);
  }, [activeBook, deriveFallback]);

  useEffect(() => {
    // Fetch-on-mount: synchronising React with an external API is the intended
    // use of an effect here; load() manages its own loading/error state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  return { chapters, loading, error, isFallback, reload: load };
}

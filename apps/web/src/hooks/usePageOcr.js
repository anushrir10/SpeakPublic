import { useState, useEffect, useCallback } from "react";
import { fetchPageOcr } from "../services/api";

/**
 * Loads OCR word boxes for a scanned page image from GET /api/ocr?src=<path>.
 * Returns null when the endpoint is unavailable (not implemented yet, offline,
 * or no OCR for this scan) so the caller can gracefully fall back to the plain
 * image / the "Text" view.
 *
 * @param {string|null} src - the scan image URL (currentPage.imageUrl)
 * @returns {{ ocr: {src,width,height,tokens}|null, loading: boolean }}
 */
export function usePageOcr(src) {
  const [ocr, setOcr] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (!src) {
      setOcr(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    const data = await fetchPageOcr(src);
    setOcr(data); // null → caller falls back
    setLoading(false);
  }, [src]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  return { ocr, loading };
}

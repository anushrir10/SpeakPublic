import { useState, useEffect, useCallback, useRef } from "react";
import { fetchSimplifiedContent } from "../services/api";

const TIERS = ["eli5", "standard", "advanced"];

/**
 * Fetches simplified content for a chunk at a given difficulty tier.
 *
 * - "standard" tier is the raw chunk content itself (no fetch needed).
 * - "eli5" and "advanced" fetch from GET /api/chunks/:id/simplified?tier=…
 *
 * When the endpoint is unreachable or has no data for the tier, `simplified`
 * is null and the caller should fall back to the raw chunk content.
 *
 * @param {string|null} chunkId  — the active chunk ID (first chunk of chapter)
 * @param {string}      initTier — initial tier ("eli5"|"standard"|"advanced")
 * @returns {{ simplified: string|null, loading: boolean, tier, setTier, TIERS }}
 */
export function useSimplifiedContent(chunkId, initTier = "standard") {
  const [tier, setTier] = useState(initTier);
  const [simplified, setSimplified] = useState(null);
  const [loading, setLoading] = useState(false);

  // Reset simplified when chunkId changes
  const prevChunkId = useRef(null);
  useEffect(() => {
    if (prevChunkId.current !== chunkId) {
      setSimplified(null);
      prevChunkId.current = chunkId;
    }
  }, [chunkId]);

  const load = useCallback(async () => {
    // Standard tier = raw content; no fetch needed
    if (!chunkId || tier === "standard") {
      setSimplified(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    const result = await fetchSimplifiedContent(chunkId, tier);
    setSimplified(result?.text ?? null);
    setLoading(false);
  }, [chunkId, tier]);

  useEffect(() => {
    load();
  }, [load]);

  return { simplified, loading, tier, setTier, TIERS };
}

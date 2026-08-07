/**
 * FixIt API — end-to-end smoke test (Week 3/4 contract).
 * Real network test against the deployed backend.
 *
 *   node apps/web/e2e/api.e2e.mjs
 *   FIXIT_API=https://staging... node apps/web/e2e/api.e2e.mjs
 *
 * Requires Node 18+ (global fetch) and internet access to the API host.
 * Exit code 0 = all passed, 1 = one or more failed.
 */
const BASE = (process.env.FIXIT_API || "https://fixit-production-d6a4.up.railway.app").replace(/\/$/, "");
const results = [];
const parse = (r) => r.text().then((t) => { try { return JSON.parse(t); } catch { return t; } });
const assert = (c, m) => { if (!c) throw new Error(m); };
async function step(name, fn) {
  const t0 = Date.now();
  try { const note = await fn(); const ms = Date.now() - t0; results.push({ name, ok: true, ms, note }); console.log(`✓ ${name}  (${ms}ms)  ${note || ""}`); }
  catch (e) { const ms = Date.now() - t0; results.push({ name, ok: false, ms, note: e.message }); console.log(`✗ ${name}  (${ms}ms)  — ${e.message}`); }
}

console.log(`FixIt API E2E  →  ${BASE}\n`);
let chapterId = null;

await step("GET /health", async () => {
  const r = await fetch(`${BASE}/health`); assert(r.ok, `status ${r.status}`); return `status ${r.status}`;
});
await step("GET /api/chapters", async () => {
  const r = await fetch(`${BASE}/api/chapters`); assert(r.ok, `status ${r.status}`);
  const d = await parse(r); assert(Array.isArray(d), "expected an array");
  if (d.length) { chapterId = d[0].id; assert(chapterId, "chapter has no id"); }
  return `${d.length} chapters` + (d[0] ? ` (first: "${d[0].title}")` : "");
});
await step("GET /api/chunks?chapterId", async () => {
  assert(chapterId, "no chapterId from /api/chapters");
  const r = await fetch(`${BASE}/api/chunks?chapterId=${encodeURIComponent(chapterId)}`); assert(r.ok, `status ${r.status}`);
  const d = await parse(r); assert(Array.isArray(d), "expected an array");
  return `${d.length} chunks; sectionRef sample=${d[0]?.sectionRef ?? "—"}`;
});
await step("POST /api/retrieve  {query,topK}", async () => {
  const r = await fetch(`${BASE}/api/retrieve`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ query: "what is taxonomy", topK: 3 }) });
  assert(r.ok, `status ${r.status}`); const d = await parse(r);
  const arr = Array.isArray(d) ? d : d?.results; assert(Array.isArray(arr), "no results array");
  return `${arr.length} hits; top similarity=${arr[0]?.similarity ?? "—"}`;
});
await step("POST /api/ask  {query,selection,topK}", async () => {
  const r = await fetch(`${BASE}/api/ask`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ query: "what is taxonomy", selection: "taxonomy", topK: 3 }) });
  assert(r.status !== 404, "endpoint returns 404 (not deployed yet)"); assert(r.ok, `status ${r.status}`);
  const d = await parse(r); assert(d && d.answer !== undefined, "response missing `answer`");
  const cites = d.citations || d.chunks || [];
  return `answer len=${String(d.answer).length}; grounded=${d.grounded}; citations=${cites.length}`;
});
await step("GET /api/flashcards?chapterId", async () => {
  assert(chapterId, "no chapterId"); const r = await fetch(`${BASE}/api/flashcards?chapterId=${encodeURIComponent(chapterId)}`);
  assert(r.status !== 404, "endpoint returns 404 (not deployed yet)"); assert(r.ok, `status ${r.status}`);
  const d = await parse(r); assert(Array.isArray(d), "expected an array");
  return `${d.length} flashcards`;
});
await step("POST /api/fsrs/review  {cardId,rating}", async () => {
  const r = await fetch(`${BASE}/api/fsrs/review`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ cardId: "e2e-probe", rating: 3 }) });
  assert(r.status !== 404, "endpoint returns 404 (not deployed yet)");
  return `status ${r.status}` + (r.status === 401 ? " (auth required — endpoint exists)" : "");
});

const pass = results.filter((r) => r.ok).length;
console.log(`\n${pass}/${results.length} passed`);
process.exit(results.every((r) => r.ok) ? 0 : 1);

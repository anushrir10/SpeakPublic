# PRD — Week 3 & 4 Frontend (Christopher · `apps/web`)

**Owner:** Christopher (Frontend)  ·  **Scope:** `apps/web` only  ·  **Status:** Frontend complete & unit-verified; blocked on backend/data for live end-to-end.

> Context (from *Week 3 & 4 Combined Plan*): weeks 3 and 4 run together because we're behind.
> This document covers **only Christopher's frontend deliverables**. Anything under `apps/api`
> is **specified here for Prabodh**, not implemented (per the "stay in your folder" working rule).

---

## 1. Deliverables (from the plan)

**Week 3 — Live AI Q&A**
1. Wire "Ask FixIt" button to `POST /api/ask`.
2. Render answer with cited passages visible.
3. Loading / error states (AI calls take seconds).
4. Clear message when retrieval finds nothing.

**Week 4 — Flashcards & FSRS**
1. Flashcard review UI: show → flip → rate (Again/Hard/Good/Easy).
2. Wire ratings to `POST /api/fsrs/review`.
3. Due count + session-complete state.
4. Replace locally-generated flashcards with DB-backed ones.

---

## 2. Status summary

| # | Deliverable | Status | Where |
|---|-------------|--------|-------|
| W3.1 | Ask FixIt → `POST /api/ask` | ✅ Done | `services/api.js` `askQuestion()`, `components/ContextualPanel.jsx` |
| W3.2 | Answer + visible citations (click → jump to section) | ✅ Done | `ContextualPanel.jsx` |
| W3.3 | Loading + error states | ✅ Done | `ContextualPanel.jsx` |
| W3.4 | Explicit "no relevant passage" message | ✅ Done | `ContextualPanel.jsx` |
| W4.1 | Show → flip → rate (Again/Hard/Good/Easy) | ✅ Done | `components/DBFlashcardDeck.jsx` |
| W4.2 | Ratings → `POST /api/fsrs/review` | ✅ Done | `DBFlashcardDeck.jsx` → `api.reviewFlashcard()` |
| W4.3 | Due count + session-complete screen | ✅ Done (added this pass) | `DBFlashcardDeck.jsx` |
| W4.4 | DB-backed flashcards (local fallback) | ✅ Done | `Reader.jsx` `deckFlashcards`, `hooks/useFlashcards.js` |

**Bottom line:** every frontend item is implemented and passes static verification. Two of them
(**Ask FixIt results** and **DB flashcards**) only *return real content* once the backend endpoints
and the Ch. 2–5 embeddings exist — see §6 Blockers. Until then the UI degrades gracefully (clear
error/no-match messaging; flashcards fall back to locally-derived cards).

---

## 3. Feature 1 — Live AI Q&A ("Ask FixIt")

**User story:** *A student highlights a passage, asks a question, and gets an answer grounded only on
retrieved textbook chunks, with the sources cited.*

### Flow (implemented)
1. Select text in either reading pane → Study Assistant drawer → **Ask FixIt** button.
2. `ContextualPanel` opens with the selected passage as context.
3. Student types a question (or taps a starter chip) → `submit()` calls `askQuestion(query, selection, 5)`.
4. A **user bubble** + a **"Thinking…" skeleton** render immediately.
5. On response the skeleton is replaced with the **answer** + a **Sources** list; each source shows
   its `§ sectionRef` and match %, and **clicking it scrolls the reader to `[data-section="…"]`**.
6. State handling: **network/server error** → red "couldn't reach the AI service"; **no match**
   (`grounded:false` / empty citations / `noMatch:true`) → "I couldn't find a relevant passage…".
7. A stale-response guard (`reqIdRef`) discards answers if the student sends another question first.

### API contract required from backend (Prabodh) — **NOT yet implemented**
```
POST /api/ask
Content-Type: application/json
{ "query": "<question>", "selection": "<highlighted text>", "topK": 5 }

200 →
{
  "answer": "…grounded answer text…",
  "grounded": true,
  "citations": [
    { "chunkId": "…", "sectionRef": "1.2", "content": "…", "similarity": 0.83 }
  ]
}

No good match →  { "answer": "I don't have enough in the text to answer that.",
                   "grounded": false, "citations": [] }
```
The frontend is tolerant: it also accepts `chunks` in place of `citations`, and treats any non-2xx or
missing body as an error (never crashes). **Sarvesh** owns the grounded prompt + citation formatting so
`sectionRef` values match what the reader renders on chunks (`data-section`).

### Acceptance criteria
- [x] Ask button issues `POST /api/ask` with query + selection.
- [x] Answer text rendered; citations rendered with `sectionRef` and made clickable.
- [x] Loading skeleton while awaiting; disabled send while busy.
- [x] Distinct error vs. no-match messaging.
- [ ] **E2E against real `/api/ask`** — pending backend endpoint + Ch. 2–5 embeddings.

---

## 4. Feature 2 — Flashcards & FSRS review

**User story:** *A student reviews flashcards; the scheduler shows the right cards at the right time.*

### Implemented
- **Entry points:** always-visible **Flashcards (N)** button in the reader top bar + a **Study Flashcards**
  button in the reading pane.
- **Card types:** Q&A **flip** card and **MCQ** card (`DBFlashcardDeck.jsx`).
- **Rating:** after flip, **Again / Hard / Good / Easy** → mapped to FSRS ratings **1 / 2 / 3 / 4**.
- **Wiring:** each rating fires `reviewFlashcard(cardId, rating)` → `POST /api/fsrs/review`
  (non-blocking; also logs an analytics event). MCQ auto-rates 4 (correct) / 1 (wrong).
- **Due count:** header shows `… · N due` (remaining in the session).
- **Session complete:** after the last card, a **summary screen** shows Reviewed / Known / Again counts,
  with **Review again** and **Done** — instead of silently closing.
- **DB-backed with fallback:** `deckFlashcards = API cards if present, else cards built from the chapter's
  local concepts`, so the deck is never empty. DB-backed is the primary source when `/api/flashcards`
  returns data.

### API contracts required from backend (Prabodh)
```
GET  /api/flashcards?chapterId=<id>   → Flashcard[]  { id, chunkId, question, answer, difficulty, type, options }
GET  /api/flashcards/:id              → Flashcard
POST /api/fsrs/review                 → { cardId, rating (1–4) } → updated FSRS state / next due card
```
`GET /api/flashcards` and `POST /api/fsrs/review` **do not exist yet** (Week 4 backend). The frontend
already calls them and degrades to local cards / fire-and-forget until they ship. **Sarvesh** pre-computes
the cards (Claude Batch: 5 Q&A + 3 MCQ per section) into the `Flashcard` table — flashcards are cached,
**not** live RAG.

### Acceptance criteria
- [x] show → flip → rate (Again/Hard/Good/Easy).
- [x] ratings POST to `/api/fsrs/review`.
- [x] due count + session-complete state.
- [x] DB-backed cards preferred; graceful local fallback.
- [ ] **E2E against real `/api/flashcards` + `/api/fsrs/review`** — pending backend endpoints.
- [ ] Optional: consume `nextReview`/next-due from the review response to drive a true FSRS queue
      (today the session reviews the loaded set in order — see §7).

---

## 5. Files touched (all under `apps/web/src`)

| File | Change |
|------|--------|
| `services/api.js` | **+`askQuestion()`** (POST `/api/ask`). (`retrieveContent`, `reviewFlashcard`, `fetchFlashcards`, `fetchPageOcr` already present.) |
| `components/ContextualPanel.jsx` | **Rewritten** from Week-2 shell → live Q&A (loading/answer+citations/error/no-match, section deep-link). |
| `components/DBFlashcardDeck.jsx` | **+session-complete screen, +due count**, finish-instead-of-close. |
| `components/Reader.jsx` | Ask/Flashcard buttons on selection; `deckFlashcards` (DB-or-local); left-pane selectable text; OCR layer hook. |
| `hooks/useFlashcards.js` | DB flashcard fetch (already present). |

No `apps/api` files were modified. No `.bak`/backup files are committed (`.gitignore` updated).

---

## 6. Blockers (why "done" ≠ "working end-to-end") — flag to the team

These are **not frontend bugs**; they gate whether the shipped UI shows real content.

1. **Embeddings missing for Ch. 2–5 (Sarvesh, Week-2 carryover).** Only Chapter 1 has embeddings
   (26/26); chapters 2–5 have 0. `/api/retrieve` (and therefore `/api/ask`) uses an INNER JOIN on
   `chunk_embeddings`, so **4 of 5 chapters return nothing**. Ask FixIt will correctly show the
   "no relevant passage" state for those chapters until embeddings exist.
2. **Retrieval quality gate not passed.** The 30-query checkpoint has only run on Ch. 1 and showed
   garbled OCR text and sub-6% match scores. Live Q&A quality depends on clearing this go/no-go.
3. **Backend endpoints not deployed:** `POST /api/ask`, `GET /api/flashcards`, `GET /api/flashcards/:id`,
   `POST /api/fsrs/review`. Frontend is wired and waiting.
4. **Source OCR quality.** Raw chunk text has extraction artifacts ("PlantaeMonera, Protista",
   "hunw1s" for "humans"). Bad source text degrades both retrieval and answer quality; spot-check
   chunks after the Ch. 2–5 embed run.

Parked (not Week 3/4): `/api/ocr` scan-text selection (spec delivered; "Text" toggle already works),
Vercel deployment.

---

## 7. What's yet to be done

**Frontend (Christopher):**
- Run `pnpm install` (if any dep changed — none this pass) and `pnpm --filter web build`, then a manual
  E2E pass once the backend endpoints are live.
- Verify citation deep-links resolve against **real** `sectionRef` values returned by `/api/ask`
  (the reader renders `data-section={chunk.sectionRef}`; formats must match).
- Optional polish: stream the answer token-by-token; persist "known/again" per card; a true FSRS due
  queue driven by `nextReview` from the review response.

**Cross-team (unblocks the above):**
- Sarvesh: finish Ch. 2–5 embeddings; grounded prompt + citation format; explicit "no good match".
- Prabodh: `/api/ask`, `/api/flashcards(+/:id)`, `/api/fsrs/review`; rate limiting; daily cost cap;
  request logging; refactor `index.ts` into `routes/ + controllers/`.
- Run the 30-query retrieval checkpoint across all five chapters (go/no-go for live Q&A).

---

## 8. Test report

**Environment note:** a full `vite build` / live E2E could not be executed from the review sandbox
because (a) the deployed API host is not reachable from the sandbox network, and (b) the device's
`node_modules` are Windows-native (esbuild win32) so a Linux build won't run. Verification below is
static + logic review; Christopher should run the build + manual E2E locally.

| Check | Result |
|-------|--------|
| Babel parse — `ContextualPanel.jsx`, `api.js`, `DBFlashcardDeck.jsx`, `Reader.jsx` | ✅ Pass |
| Export/import resolution (`askQuestion` exported & imported; icons valid) | ✅ Pass |
| No stale props left on `ContextualPanel` (`messages`/`onAsk`/`localThread`) | ✅ Pass (0) |
| `Reader` passes only supported props to `ContextualPanel` | ✅ Pass |
| Ask states (loading / answer+citations / error / no-match) present & mutually exclusive | ✅ Reviewed |
| Deck states (flip / rate 1–4 / due count / session-complete / review-again) present | ✅ Reviewed |
| Graceful fallback (API null → error/no-match; empty flashcards → local set) | ✅ Reviewed |
| Live `/api/ask` round-trip | ⏳ Blocked on backend |
| Live `/api/flashcards` + `/api/fsrs/review` round-trip | ⏳ Blocked on backend |

---

## 9. Acceptance checklist (PRD deliverables)

- [x] Ask FixIt wired to `POST /api/ask`.
- [x] Answer rendered with cited passages visible (and section-linked).
- [x] Loading + error states.
- [x] Clear "nothing found" message.
- [x] Flashcard review: show → flip → rate (Again/Hard/Good/Easy).
- [x] Ratings wired to `POST /api/fsrs/review`.
- [x] Due count + session-complete state.
- [x] DB-backed flashcards (local fallback until seeded).
- [ ] End-to-end verified against live backend + Ch. 2–5 embeddings **(blocked — see §6)**.

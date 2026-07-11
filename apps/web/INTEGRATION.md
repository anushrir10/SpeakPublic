# Backend ↔ Frontend Integration (chapters & chunks)

The web app (`apps/web`) reads reading content from the API (`apps/api`). When the
API is reachable and seeded it renders **live** chapters/chunks; otherwise it falls
back to local textbook content so the UI always works.

## Data flow

```
GET /api/chapters              -> ChapterNav (top bar) list
GET /api/chunks?chapterId=…    -> Reader right pane (chapter content)
GET /api/chapters/:id          -> chapter + chunks (available for detail views)
GET /api/chunks/:id            -> single chunk
POST /api/retrieve             -> Ask panel "related content" (Week 3 AI)
GET /health                    -> connectivity
```

Frontend pieces (all in `apps/web/src`):
- `services/api.js` — `fetchChapters`, `fetchChapter`, `fetchChunks`, `retrieveContent`
- `hooks/useChapters.js` — chapter list (live or local fallback)
- `hooks/useChunks.js` — a chapter's chunks (live only)
- `components/ChapterNav.jsx` — chapter dropdown (`live`/`local` badge)
- `components/Reader.jsx` — renders live chunks as the reading pane; the pane header
  shows a `live`/`local` badge so you can see the connection state at a glance.

## Bring it up locally

1. **Database** (Postgres + pgvector) and env:
   ```bash
   # apps/api/.env
   DATABASE_URL=postgresql://user:pass@localhost:5432/fixit
   ```
2. **Migrate + generate:**
   ```bash
   pnpm db:migrate          # runs prisma migrate in packages/db
   ```
3. **Seed chapters + chunks** (so the endpoints return data):
   ```bash
   pnpm db:seed             # packages/db/prisma/seed.mjs
   ```
4. **Run API + web:**
   ```bash
   pnpm dev                 # turbo runs apps/api (:3001) and apps/web (:5173)
   ```
   The web dev server proxies `/api` and `/health` to `:3001` (see `apps/web/vite.config.js`),
   so no CORS setup is needed in dev.

Once seeded, open a book → the reader pane shows the `live` badge and streams chunk
content from `/api/chunks`. `/api/retrieve` needs embeddings (run the AI embedding
step); until then the Ask panel stays in shell mode and degrades gracefully.

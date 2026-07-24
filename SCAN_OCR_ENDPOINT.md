# Scan Text Selection — OCR Text-Layer Endpoint

**Goal:** let a student select real text **directly on the scanned textbook page**
(the left pane in the Reader), not just on the clean transcript. Selecting words
on the scan should feed the exact same study flow (Study Assistant → `/api/retrieve`
→ Ask / Flashcard) that selecting on the right pane already does.

This document specifies **one new backend endpoint** the web app needs.
**No existing backend file has been changed** — the frontend is already wired to
call this endpoint and degrades gracefully until it exists.

---

## 1. Why an endpoint is required

A scanned page (`/kebo101/page_01.png`, …) is a raster **image**. An image has no
text, so the browser cannot select anything on it. Real PDF viewers (PDF.js,
Google Books) solve this with a **text layer**: the page is OCR'd into words, and
each word is drawn as a *transparent, absolutely-positioned* `<span>` on top of
the image at the word's bounding box. The scan shows through; the invisible text
is what actually gets selected/highlighted.

To build that layer the frontend needs, per scanned page, the list of words and
their bounding boxes. That data must be produced by OCR on the server (or offline)
and served by an endpoint. That endpoint is what this document defines.

```
Scan image  ──OCR──▶  word boxes  ──GET /api/ocr──▶  frontend overlays a
(page_01.png)         (server)                       transparent <span> per word
                                                      → user selects real text
```

---

## 2. The endpoint

### `GET /api/ocr`

Return the OCR word boxes for one scanned page image.

**Query parameters**

| param | type   | required | description                                                        |
|-------|--------|----------|--------------------------------------------------------------------|
| `src` | string | yes      | The scan's image path exactly as the frontend uses it, e.g. `/kebo101/page_01.png`. URL-encoded. |

> The frontend sends `currentPage.imageUrl` verbatim as `src`. Key your OCR
> records by that string (or by its basename `page_01`) so lookups are exact.

**Response — `200 application/json`**

```json
{
  "src": "/kebo101/page_01.png",
  "width": 1240,
  "height": 1754,
  "tokens": [
    { "text": "The",      "x": 0.104, "y": 0.081, "w": 0.031, "h": 0.017 },
    { "text": "Living",   "x": 0.140, "y": 0.081, "w": 0.062, "h": 0.017 },
    { "text": "World",    "x": 0.206, "y": 0.081, "w": 0.061, "h": 0.017 }
  ]
}
```

**Field reference**

| field    | type     | meaning                                                                 |
|----------|----------|-------------------------------------------------------------------------|
| `src`    | string   | Echo of the requested image path.                                       |
| `width`  | number   | Native pixel width of the scan (optional but recommended, for debugging).|
| `height` | number   | Native pixel height of the scan (optional).                             |
| `tokens` | array    | One entry per OCR word (or short phrase).                               |
| `text`   | string   | The recognized word text.                                               |
| `x`      | number   | Left edge of the word box, **normalized 0..1** (fraction of page width).|
| `y`      | number   | Top edge of the word box, **normalized 0..1** (fraction of page height).|
| `w`      | number   | Box width, normalized 0..1.                                             |
| `h`      | number   | Box height, normalized 0..1.                                            |

**Why normalized (0..1) coordinates?** The scan is displayed at different pixel
sizes on different screens. Normalized coordinates let the frontend position each
word with CSS percentages (`left: x*100%`), so the layer lines up at *any* rendered
size with zero recomputation.

**Ordering:** return tokens in natural **reading order** (top-to-bottom,
left-to-right). The browser selects text in DOM order, so reading-order tokens
produce a clean multi-word selection string.

**Errors / edge cases**

| situation                          | response                                        |
|------------------------------------|-------------------------------------------------|
| No OCR available for that `src`    | `404` **or** `200 {"src":..., "tokens": []}`    |
| `src` missing/invalid              | `400 {"error":"src is required"}`               |
| OCR failed server-side             | `500 {"error":"..."}`                           |

The frontend treats **any non-2xx, or a body without a `tokens` array, as "no OCR"**
and silently falls back to the plain scan + the "Text" view. So a 404 is safe.

**Caching (recommended):** OCR for a fixed scan never changes. Send
`Cache-Control: public, max-age=31536000, immutable` so the browser caches it.

**Auth:** same posture as `/api/retrieve`. If retrieve is public, keep `/api/ocr`
public; the frontend attaches the Clerk bearer token when present either way.

### Optional: batch variant

If you prefer to fetch a whole book's OCR at once:

`GET /api/ocr/batch?srcs=/kebo101/page_01.png,/kebo101/page_02.png`
→ `{ "pages": [ { "src": "...", "tokens": [...] }, ... ] }`

Not required — the single-page endpoint is enough. The frontend currently calls
the single-page one per page as you navigate.

---

## 3. How to produce the tokens (OCR pipeline)

Any OCR engine that yields **word-level bounding boxes** works. Pick one:

### Option A — Tesseract (free, self-hosted)

`tesseract` can emit **hOCR** or TSV with per-word boxes.

```bash
# TSV output: one row per word with left/top/width/height in PIXELS
tesseract page_01.png out -c tessedit_create_tsv=1
# → out.tsv columns: level page_num ... left top width height conf text
```

Convert pixel boxes to normalized tokens (pseudocode):

```
img_w, img_h = size(page_01.png)
for row in tsv where level == 5 (word) and conf > 40 and text not blank:
    tokens.push({
      text: row.text,
      x: row.left        / img_w,
      y: row.top         / img_h,
      w: row.width       / img_w,
      h: row.height      / img_h,
    })
```

### Option B — Cloud OCR (higher accuracy on scans)

- **Google Cloud Vision** `documentTextDetection` → `pages[].blocks[].paragraphs[].words[]`,
  each word has `boundingBox.normalizedVertices` (already 0..1 — use directly).
- **AWS Textract** `DetectDocumentText` → `Blocks` of `BlockType=WORD`, each with
  `Geometry.BoundingBox = { Left, Top, Width, Height }` **already normalized 0..1**.
  Map straight to `{ text: Text, x: Left, y: Top, w: Width, h: Height }`.

Cloud engines handle the noisy NCERT scans far better than raw Tesseract.

### Normalization rule (the only thing that matters)

Whatever engine you use, the endpoint must output `x = left/pageWidth`,
`y = top/pageHeight`, `w = boxWidth/pageWidth`, `h = boxHeight/pageHeight`, with the
origin at the **top-left** of the page. That's it.

---

## 4. Suggested storage (optional)

OCR is expensive; run it **once per scan** and cache. A minimal table:

```
model PageOcr {
  id        String   @id @default(cuid())
  src       String   @unique        // "/kebo101/page_01.png"
  width     Int
  height    Int
  tokens    Json                     // [{ text, x, y, w, h }]
  createdAt DateTime @default(now())
}
```

Endpoint handler = look up by `src`, return `tokens` (or `[]`/404). A one-off
script OCRs every scan in `apps/web/public/**` and upserts rows. This keeps the
request path a fast DB read with no live OCR.

---

## 5. What the frontend already does (no backend change needed to test the fallback)

Files added/edited on the web side (all under `apps/web/src`):

| file                              | role                                                                 |
|-----------------------------------|----------------------------------------------------------------------|
| `services/api.js` → `fetchPageOcr(src)` | `GET /api/ocr?src=`; returns the payload or `null` on any failure. |
| `hooks/usePageOcr.js`             | Fetches OCR for the current scan; returns `{ ocr, loading }`.        |
| `components/ScanTextLayer.jsx`    | Renders the scan `<img>` + a transparent, selectable `<span>` per token, positioned by the normalized coords. |
| `components/Reader.jsx`           | In the left pane's **Scan** view: if OCR tokens exist → render `ScanTextLayer` (selectable); else → plain image. Selecting text there opens the Study Assistant exactly like the right pane. |

**Graceful fallback:** until `/api/ocr` exists it returns 404 → `fetchPageOcr`
resolves to `null` → the Scan view shows the plain image (as today), and the
**"Text" toggle** remains the working way to select. The moment the endpoint
returns tokens, the scan itself becomes selectable — **no further frontend change**.

### Frontend rendering contract (so alignment is correct)

`ScanTextLayer` wraps the image in a `position: relative` box and draws each token as:

```jsx
<span style={{
  position: "absolute",
  left:   `${t.x * 100}%`,
  top:    `${t.y * 100}%`,
  width:  `${t.w * 100}%`,
  height: `${t.h * 100}%`,
  fontSize: `${t.h * renderedImageHeightPx}px`,
  color: "transparent",
}}>{t.text}</span>
```

So: **top-left origin, normalized 0..1, reading order.** Match that and the layer
lines up.

---

## 6. Quick test

```bash
# once implemented:
curl "https://fixit-production-d6a4.up.railway.app/api/ocr?src=/kebo101/page_01.png"
# expect: { "src": "...", "tokens": [ { "text": "...", "x": .., "y": .., "w": .., "h": .. }, ... ] }
```

In the app: open the Class XI Biology book → left pane → **Scan** toggle → try to
drag-select a line on the scan. With tokens present, the words highlight and the
Study Assistant opens with the selected text.

---

## 7. Backend checklist

- [ ] OCR each scan in `apps/web/public/**` → word boxes (Tesseract/Vision/Textract).
- [ ] Normalize boxes to top-left origin, 0..1.
- [ ] Store per `src` (see §4) or serve from a static JSON map.
- [ ] Add `GET /api/ocr?src=` returning `{ src, width, height, tokens }`.
- [ ] `Cache-Control: immutable`; CORS allowing the web app origin.
- [ ] (Optional) `GET /api/ocr/batch?srcs=`.

Nothing else in the app changes — the reader picks it up automatically.

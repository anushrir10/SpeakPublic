# FixIt — Technical Build Blueprint

FixIt is a cognitive-first, active-learning textbook reader tailored for NCERT syllabus (CBSE/State boards). It transforms static textbooks into dynamic, adaptive learning materials specifically optimized for students with ADHD, neurodivergence, or high-focus learning requirements.

---

## 1. Project Architecture (Lean MVP)

To maximize velocity and keep initial infrastructure costs negligible, the project implements a lean, API-driven serverless architecture.

```mermaid
graph TD
    subgraph Client Layer
        A[Flutter Mobile/Web App]
    end
    subgraph BaaS Layer (Supabase)
        B[Auth & User Sessions]
        C[PostgreSQL Database]
        D[Storage Bucket (Audio Cache & Media)]
        E[pgvector Embedding Storage]
    end
    subgraph AI & Cognitive API Layer
        F[LLM API - Reasoning/Fast]
        G[OpenAI Whisper API]
        H[Google Cloud TTS / Sarvam AI]
    end

    A -->|Authentication| B
    A -->|Read/Write Progress| C
    A -->|Retrieve/Upload media| D
    A -->|Cosine Similarity Concept query| E
    A -->|Generate Q&A, Summaries| F
    A -->|Audio processing| G
    A -->|Voice Synthesis| H
```

### Technology Stack
* **Frontend**: **Flutter** (a single codebase targeting Android, iOS, and Web). Flutter's canvas-level rendering engine provides superior performance for custom animations (such as RSVP speed reading and radial/circular gesture menus) compared to standard web view layers.
* **Backend & Database**: **Supabase**. Provides instant authentication, file storage for cached TTS assets, row-level security policies, and a managed PostgreSQL instance with `pgvector` enabled out of the box.
* **AI Cognitive Layer**: **LLM API** (using state-of-the-art models optimized for cost-performance and deep reasoning).
* **Audio Layer**: **OpenAI Whisper** for video transcibing + **Google Cloud TTS** / **Sarvam AI** for cost-efficient speech synthesis including regional Indian languages (Hindi, etc.).
* **Media & CDN**: **Cloudflare R2** for highly optimized, zero-egress cost storage of student-uploaded video content.

---

## 2. Feature-by-Feature Design

### A. Text Selection & Radial Menu
* **Concept**: A non-disruptive, context-aware radial/floating menu that appears when a student highlights textbook content.
* **Logic**: Intercept standard text-selection gesture controls. On mobile, we subclass Flutter's `SelectableText` with a custom `SelectionControls`. On web, we intercept standard range selections. The menu triggers cognitive tools directly inline: Speak, RSVP, Flashcard, Mind Map, Simplify.

### B. Auditory Mode (Speech Synthesis)
* **Optimization**: Caching is critical. A textbook paragraph is static and does not change between users. TTS generation is cached in Cloudflare R2 / Supabase Storage using a SHA-256 hash of the paragraph text.
* **Result**: Subsequent students request the cached audio file directly instead of hitting the TTS API, reducing speech synthesis API expenses by **up to 95%**.
* **Languages**: Use Sarvam AI for high-fidelity regional Indian languages, and Google TTS / ElevenLabs for English.

### C. RSVP Mode (Rapid Serial Visual Presentation)
* **Mechanism**: Focuses visual attention by flashing words one-by-one at a target speed (configurable between 250 and 700 Words Per Minute).
* **Alignment (ORP)**: Implements the **Optimal Recognition Point (ORP)** algorithm. The focal letter of each word (usually slightly left of center) is positioned at a constant anchor point and highlighted in red.
* **Punctuation Delay**: To simulate normal cognitive reading pauses, duration is increased by `1.5x` for commas/colons and `2.0x` for periods/question marks.

### D. Spaced Repetition (FSRS)
* **Generation**: Contextual quizzes are generated on-demand using structured AI JSON outputs:
  ```json
  {
    "flashcards": [
      { "question": "Question text...", "answer": "Answer text..." }
    ],
    "mcqs": [
      { "question": "Question text...", "options": ["A", "B", "C", "D"], "answer": "Correct Option" }
    ]
  }
  ```
* **Scheduling**: Governed by the **FSRS (Free Spaced Repetition Scheduler)** algorithm. It tracks four rating responses (Again, Hard, Good, Easy) and updates intervals, difficulty, stability, and retrievability coefficients.

### E. Concept Mind Mapping
* **Pre-processing**: Textbook chapters are pre-split into conceptual chunks. Each chunk is passed through an embedding model (e.g., `text-embedding-3-small` or `voyage-3`) and saved in `pgvector`.
* **Graphing**: Selecting text extracts its concept embedding, queries `pgvector` using cosine similarity for the top-k nearest concepts, and utilizes the AI to identify and label the link relationships (e.g., `"causes"`, `"mitigates"`, `"example of"`).
* **Render**: Visualized using a force-directed layout engine (e.g., D3-based graphs or `graphview` in Flutter).

### F. Simplified Learning ("ELI5")
* **Mechanism**: On-demand AI prompts that break down jargon. Supports tiered explanations (ELI5, Analogy, Deep-Dive).
* **Cost Saving**: Employs **prompt caching** by loading the textbook chapter context into cache and varying only the highlighted segment, cutting token costs by up to 80%.

---

## 3. Cost-Optimization Architecture

Operating at a target consumer price point of **₹99/month**, AI token limits must be managed strictly.

1. **Massive Pre-computation**: Flashcards, mind-map nodes, auditory cache files, and simplified summaries for standard NCERT textbooks are computed **once** in the background and served statically. Individual API requests are reserved for user-generated text selections.
2. **Prompt Caching**: System prompts and static chapters are pinned in prompt cache.
3. **AI Batch API**: Flashcard and concept generation for new textbooks are batched in overnight runs, utilizing asynchronous batch APIs for a **50% discount**.
4. **Target Cost**: ₹15–25 per active user per month.

---

## 4. Repository Layout

* `landing/`: The promotional and feature-simulator web landing page.
* `app/`: Directory for the cross-platform Flutter application code.
* `docs/`: System blueprints, database schemas, and AI prompts.

---

## 5. Getting Started

### Local Landing Page Server
To preview the interactive landing page locally:
1. Ensure Node.js is installed.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open the displayed address (default is `http://localhost:3000`) in your browser.

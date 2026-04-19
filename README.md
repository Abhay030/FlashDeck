# FlashDeck AI

**Turn dense PDFs into a deck you’ll actually study.** FlashDeck AI is a production-style learning product that runs a full pipeline—parse, chunk, extract concepts, generate cards, deduplicate, persist—and wraps it in a dashboard built for habits: streaks, goals, insights, and spaced repetition grounded in SM‑2 logic.

This repository is intentionally **product-shaped**, not “CRUD + AI bolt-on.” The engineering focuses on **latency**, **bounded serverless runs**, **incremental generation**, and **UX that rewards showing up**.

---

## Why this exists

Learners don’t fail because they lack PDFs—they fail because **making great flashcards by hand doesn’t scale**. FlashDeck collapses that gap: upload once, review AI output quickly, then lean on science-backed scheduling and a dashboard that answers “what should I do next?” instead of drowning you in vanity metrics.

---

## What makes it different

| Dimension | Commitment |
|-----------|------------|
| **Pipeline** | Two-stage AI (concepts → Q&A cards), not one vague prompt over 50 pages |
| **Chunks** | Paragraph-aware splits with headings + token budgets—not one fragile long-context call |
| **Scale** | Incremental “generate more” so large docs don’t die to timeouts or RAM |
| **Quality** | Jaccard-style dedup so you get distinct practice, not ten cards asking the same thing |
| **Retention** | SM‑2–inspired scheduling on every rating—intervals and easiness live on the card |
| **Momentum** | Dashboard designed for **action**: resume session, daily goal, streaks, weak areas |

---

## Feature deep dive

### 1. AI flashcard generation pipeline

Upload hits `POST /api/upload`. The server:

1. Parses the PDF to text (`pdf-parse`).
2. Chunks it with **`chunkText`** (see Chunking below).
3. Runs **concept extraction** per chunk via **Groq** (`llama-3.1-8b-instant`), JSON-mode, low temperature—structured facts, not prose.
4. Runs **card generation** from those concepts—questions and answers your study UI can flip immediately.
5. Applies **`processFinalDeck`**: validation + **deduplication** before anything touches MongoDB.

Fast inference matters: Groq keeps the loop tight enough that generation feels like part of the product, not a batch job.

### 2. Intelligent chunking strategy

Chunks aren’t naive character splits. The chunker:

- Respects **paragraph boundaries** and estimates token load (~4 chars ≈ 1 token heuristic).
- Detects **section headings** (chapter lines, ALL CAPS titles, etc.) and passes them into prompts as anchors—so the model knows *where* in the document it is.
- Supports **overlap** between chunks (default overlap budget in config) so ideas at boundaries aren’t orphaned.

**Why not “just use a huge context window”?** Cost, latency, and failure modes: long prompts drift, repeat, and blow serverless budgets. Chunking keeps each LLM call **focused and recoverable**.

### 3. Incremental “generate more” system

Large PDFs don’t need to finish in one request. Decks store **`chunks`**, **`totalChunks`**, and **`processedChunks`**. When you expand a deck (re-upload flow with `expandDeckId`), the API:

- Resumes from the next unprocessed chunk slice.
- Processes **a bounded batch per request** (new chunks capped per run) so a single invocation stays inside **serverless time limits** (`maxDuration` on the route).
- Returns **progress**: processed/total, percent, and a short **“up next”** preview so the UI feels transparent.

**Product intuition:** Users learn better when they can **start studying early** and pull more cards later—instead of waiting for a mythical “100% complete” pass.

### 4. Deduplication (similarity logic)

After generation, **`deduplicateFlashcards`** walks the candidate cards and scores overlap with **Jaccard similarity** on token sets from **question + topic**. Above a **0.85** threshold, near-duplicates collapse.

**Why Jaccard here?** It’s fast, deterministic, runs **without extra services**, and tuned so legitimately different questions (“mitosis” vs “meiosis”) survive while rephrased duplicates merge. Tradeoff: it’s lexical, not embedding-deep—good for shipping; embeddings are a natural upgrade path.

### 5. Dashboard intelligence layer

The dashboard isn’t a static grid of decks. It aggregates **due cards**, **weak topics**, **resume session**, **expand deck**, and optional panels (performance, consistency) so the screen tells you **what to do next**. Heavy lifting for things like heatmaps is pushed toward **MongoDB aggregation** where possible—fewer fragile all-in-memory transforms on big histories.

### 6. Daily goal + streak system

Daily goals and streaks aren’t gamification wallpaper—they align the product with **repeat contact** with material. Short feedback loops (hit goal → visible progress) pair with streak messaging so “zero days missed” is a **habit signal**, not a guilt trip.

### 7. Performance insights

Analytics focus on **accuracy-style and volume trends** over time—enough to see whether you’re improving, not so much that the UI becomes a spreadsheet. The intent: **close the loop** between “I studied” and “I’m getting better at recalling.”

### 8. Study system (ratings + SM‑2)

Study mode pulls due (or filtered) cards, captures **Again / Hard / Good / Easy** ratings, and updates **`interval`**, **`repetition`**, **`eFactor`**, and **`dueDate`** per card—**SuperMemo‑2–style** scheduling. Ratings are persisted through the API so the next session reflects true state.

### 9. Activity heatmap (StudyLog-based)

Every review can log to an **append-only `StudyLog`**. The dashboard heatmap aggregates activity by day (server-side pipeline), driving the **GitHub-style** consistency view and supporting **streak calculation** without mutating old rows.

**Why append-only?** Auditability, simpler mental model, and aggregation-friendly queries.

### 10. UX-first design philosophy

- **Friction before value is murder**—the product is demo-friendly without forcing auth, so reviewers and learners reach the **upload → dashboard → study** loop fast.
- **Motion and layout** (Framer Motion, layered cards, warm palette) aim for **premium SaaS calm**, not startup chaos.
- **Primary actions** (study, upload, expand) stay **above the fold** of attention—stats support the loop; they don’t replace it.

---

## Tech stack

| Layer | Choice |
|------|--------|
| **Frontend** | **Next.js** (App Router), **React**, **Tailwind CSS**, **Framer Motion** |
| **UI primitives** | Base UI–style components, CVA variants, consistent design tokens |
| **Backend** | **Node.js** via **Next.js Route Handlers** (`/api/*`) |
| **Database** | **MongoDB** with **Mongoose** (embedded `cards` array for fast deck reads) |
| **AI** | **Groq** SDK — **`llama-3.1-8b-instant`** for extraction + generation |
| **PDF** | **`pdf-parse`** with a cleaning pass before chunking |

---

## Architecture: PDF → flashcards

```text
PDF upload
    → parse to raw text
    → clean / normalize
    → chunk (headings, token budget, overlap)
    → for each batch: Groq extracts concepts (JSON)
    → Groq generates flashcards from concepts
    → dedupe (Jaccard on question + topic)
    → validate / finalize
    → persist Deck + embedded Cards
    → optional: StudyLog entries on review
```

**Incremental path:** the same chunk list is **stored on the deck**. Later requests advance **`processedChunks`**, append new cards, and return **progress metadata** until the document is exhausted or deck **card cap** is hit.

### Database shape (high level)

- **`Deck`**: title, embedded **`cards[]`** (each card carries SM‑2 fields), **`chunks`**, **`processedChunks`**, **`totalChunks`**, **`cardCount`** cache for limits.
- **`StudyLog`**: append-only events for heatmap / streak logic.

Embedded cards favor **one round-trip per study session** for a deck—right for solo learning; sharding cards out to separate collections is a future scale lever.

### Tradeoffs you should know

- **Serverless timeouts:** long PDFs are tamed by **batching** and **incremental expansion**, not infinite work in one function.
- **Deck card cap:** prevents runaway generations and keeps UX honest (configure in upload route).
- **Partial responses:** if work fails mid-pipeline but some cards exist, the API can return **partial payloads**—the study experience degrades gracefully instead of silently losing value.

---

## Product decisions (the “why”)

- **Incremental generation** — Ships value in minutes, respects host timeouts, matches how people actually study (chapter by chapter).
- **Chunking vs brute-force context** — Reliability and cost; every chunk is a **retryable unit**.
- **Dedup after generation** — Lets the model stay creative on wording; we normalize overlap mathematically afterward.
- **Dashboard that drives action** — Stats exist to **route behavior** (study due, fix weak topics), not to pad a portfolio slide.
- **Auth deferred in this demo** — Reviewers can walk the full funnel without signup fiction; production would add accounts when personalization and billing justify it.

---

## Project structure

```text
src/
├── app/                    # App Router pages & API routes
│   ├── api/upload/         # PDF → AI → Deck persistence
│   ├── api/study/          # Ratings, scheduling
│   ├── dashboard/          # Workspace (server data + client UI)
│   ├── study/[id]/         # Study session
│   ├── about|contact|pricing/
│   └── layout.tsx          # Shell, metadata, theme
├── components/
│   ├── features/           # Landing, dashboard, study, marketing pages
│   └── layout/             # Navbar, chrome
├── lib/
│   ├── ai/                 # Groq client, extract, generate, dedupe, processor
│   ├── pdf/                # Parse, clean, chunk
│   ├── sm2.ts              # Scheduling helpers
│   └── db.ts               # Mongoose singleton for serverless
└── models/                 # Deck, StudyLog, etc.
```

---

## Getting started

### Prerequisites

- **Node.js** 20+ recommended  
- **MongoDB** connection string (Atlas or local)  
- **Groq API key**

### Install

```bash
git clone <your-fork-or-repo-url>
cd cuemathProject   # or your checkout folder name
npm install
```

### Environment variables

Create **`.env.local`** in the project root:

```env
# Required
MONGODB_URI=mongodb+srv://USER:PASSWORD@cluster.mongodb.net/flashdeck
GROQ_API_KEY=gsk_...

# Optional — canonical site URL for metadata / OG (production)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Never commit `.env.local`. Rotate keys if exposed.

### Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Upload a PDF from the home page, then open **Dashboard** to study.

### Production build

```bash
npm run build
npm start
```

---

## Demo & showcase

| Asset | Where to add |
|-------|----------------|
| **Screenshots** | Drop images in `docs/screenshots/` (or your host) and link here |
| **Demo video** | Loom / YouTube — paste the URL in this section |
| **Live app** | `https://your-deployment.vercel.app` |

> *Tip for reviewers:* follow the path **Upload → Dashboard → Study** with one short PDF first, then try a longer doc with **Generate more** to see incremental progress.

---

## Future improvements

- **Streaming generation** — Token stream to the UI for perceived speed; keep batch safety on the server.
- **Stronger dedup** — Embeddings for paraphrase-level merge while keeping latency caps.
- **Collaborative decks** — Shared decks, comments, class roles (owner / viewer).
- **Mobile polish** — Touch-first study gestures, offline review cache.
- **Accounts & billing** — When the learning loop is proven at scale, layer auth and Stripe without changing core deck semantics.

---

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm start` | Run production server |
| `npm run lint` | ESLint |

---

## License

Private / all rights reserved — unless you add an open license explicitly.

---

**FlashDeck AI** — *Learn faster. Forget slower. Build the habit.*

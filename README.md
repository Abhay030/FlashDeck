# CUEMATH.ai — Intelligent Flashcard Platform

A production-grade, AI-powered spaced repetition platform that converts educational PDFs into high-quality flashcards with real-time analytics. Built for performance, stability, and intelligent learning.

## 🚀 Tech Stack

*   **Framework:** Next.js 15 (App Router) + Turbopack
*   **Database:** MongoDB + Mongoose (Embedded Document Strategy)
*   **AI Providers:** Groq (`llama-3.1-8b-instant`) for extreme-speed inference
*   **Embeddings:** `@xenova/transformers` (Local execution for latency-free deduplication)
*   **UI / Styling:** Tailwind CSS + shadcn/ui + Framer Motion
*   **PDF Processing:** `pdf-parse`

---

## 🧠 System Architecture & Engineering Decisions

### 1. The Two-Stage AI Extraction Pipeline
Most AI flashcard generators suffer from "hallucinated overlap" when feeding massive text blocks. We solved this utilizing a specialized two-stage pipeline:
1.  **Semantic Chunking with Overlap:** We parse the PDF and split it into strictly bounded token-chunks (with ~200 character overlaps) to prevent contextual loss at boundaries.
2.  **Parallel Concept Extraction:** Instead of asking the LLM to generate flashcards directly from 10 pages of raw text, we first prompt Groq to extract a raw array of *Concepts*.
3.  **Local Embedding Deduplication:** We run Cosine Similarity checks locally using Xenova on those concepts. If two concepts are >85% similar, one is discarded. Only *unique* concepts proceed to the generation phase.

### 2. Spaced Repetition (SM-2) Engine
The application implements the scientifically proven SuperMemo-2 (SM-2) spaced repetition algorithm natively.
*   Instead of complex relational joins, `Deck.cards` is an embedded array.
*   Atomic updates (`$set`) modify `eFactor` (Easiness Factor), `interval`, and `dueDate` purely in memory and persist in O(1) time.

### 3. Append-Only Global Analytics
The dashboard heatmap tracks your study velocity. To build this scalably:
*   We use an **Append-Only** `StudyLog` model. We *never* update existing logs.
*   Logging is **non-blocking**; it is pushed to the background `Promise.resolve().then(...)` so the SM-2 response latency is exactly 0ms.
*   The Dashboard uses a native MongoDB Aggregation Pipeline (`$match` + `$group` via `$dateToString`) to push calculation to the database layer, completely preventing Node.js from OOM-crashing.

### 4. ⚠️ Serverless Execution Mitigation
This application is optimized for Serverless Edge/Hobby deployments (like Vercel). 
Because free-tier serverless functions strictly timeout at 60 seconds, processing a 50-page PDF mathematically risks connection-crashing. 
**Trade-off:** We implemented strict upper-bound clamping on the AI pipeline sequence. If a PDF exceeds the available execution timeout window, the pipeline gracefully processes the first ~15 chunks, aborts further extraction, and triggers an HTTP `206 Partial Content` response.
*   *If deployed to an environment with dedicated background workers (AWS SQS, Inngest, or Vercel Pro), you simply alter `maxChunksProcessed` to scale infinitely.*

---

## 💻 Getting Started Locally

### 1. Environment Variables
Create a `.env.local` file in the root directory:
```env
MONGODB_URI="mongodb+srv://<user>:<password>@cluster.mongodb.net/cuemath-platform"
GROQ_API_KEY="gsk_..."
```

### 2. Run the Development Server
```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

---

## 🎨 UI/UX Features
*   **Optimistic UI Hydration:** Clicking a rating instantly transitions to the next card, while the database syncs silently in the background.
*   **Micro-interactions:** Consistent button press scales, premium 3D CSS `preserve-3d` flips, and "Edited" human-in-the-loop badges.
*   **Error Boundaries:** Graceful fallback UI skeletons prevent jarring layout shifts during data fetching.

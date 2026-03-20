# VedaAI — AI Assessment Creator

A full-stack web application that lets teachers create assignments and automatically generate structured question papers using AI. Fill a form, click generate, and get a fully formatted exam paper with sections, difficulty-tagged questions, and an answer key — in seconds.

---

## Table of Contents

- [What it does](#what-it-does)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Step 1 — Get your API keys](#step-1--get-your-api-keys)
- [Step 2 — Set up MongoDB and Redis](#step-2--set-up-mongodb-and-redis)
- [Step 3 — Set up the Backend](#step-3--set-up-the-backend)
- [Step 4 — Set up the Frontend](#step-4--set-up-the-frontend)
- [Step 5 — Run everything](#step-5--run-everything)
- [Step 6 — Test it](#step-6--test-it)
- [API Reference](#api-reference)
- [Environment Variables](#environment-variables)
- [Common Errors](#common-errors)

---

## What it does

1. Teacher fills a form — subject, class, chapter, question types, marks
2. Clicks **Generate Paper**
3. Backend queues a background job
4. AI generates a structured question paper
5. Paper appears on screen in real time — no page refresh needed

The output is a properly formatted exam paper with:
- Section A, B, C etc based on question types
- Each question tagged with difficulty (Easy / Moderate / Challenging)
- Marks per question
- Answer key at the bottom
- Download as PDF option

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14, TypeScript, Tailwind CSS |
| State Management | Zustand |
| Real-time | WebSocket |
| Backend | Node.js, Express, TypeScript |
| Database | MongoDB + Mongoose |
| Queue | BullMQ + Redis |
| AI (Primary) | Gemini 2.0 Flash |
| AI (Fallback) | Groq — Llama 3.3 70B |
| Infrastructure | Docker |

---

## Architecture

```
Teacher fills form
        │
        ▼
Next.js Frontend (Zustand store)
        │
        │  POST /assignments
        ▼
Express API (Zod validation)
        │
        ├──► Save to MongoDB (status: pending)
        │
        └──► Add job to BullMQ queue
                │
                ▼
         BullMQ Worker
                │
                ├──► Call Gemini 2.0 Flash
                │         │ (if fails)
                │         └──► Fallback to Groq Llama 3.3
                │
                ├──► Parse + validate JSON response
                │
                ├──► Save result to MongoDB (status: completed)
                │
                └──► Emit WebSocket event
                          │
                          ▼
                   Frontend receives event
                          │
                          ▼
                   Paper renders on screen
```

---

## Project Structure

```
vedaai-phase1/
  vedaai/                         ← Next.js frontend
    app/
      assignments/page.tsx        ← Dashboard
      create/page.tsx             ← Create assignment form
      assignment/[id]/page.tsx    ← Output / exam paper
    components/
      layout/                     ← Sidebar, Header, MobileNav
      dashboard/                  ← AssignmentCard, EmptyState
      create/                     ← FileUpload, QuestionTypeRow
      output/                     ← DifficultyBadge, GeneratingState
    hooks/
      useAssignmentSocket.ts      ← WebSocket hook
    lib/
      api.ts                      ← All API calls to backend
    store/
      useAssignmentStore.ts       ← Zustand store
    types/
      index.ts                    ← TypeScript types

  vedaai-backend/                 ← Express backend
    src/
      index.ts                    ← Server entry point
      config/
        db.ts                     ← MongoDB connection
        redis.ts                  ← Redis connection
      models/
        Assignment.ts             ← Mongoose schema
      routes/
        assignments.ts            ← API routes
      queues/
        paperQueue.ts             ← BullMQ queue
        paperWorker.ts            ← Background job processor
      services/
        aiService.ts              ← Gemini + Groq AI calls
      socket/
        wsHandler.ts              ← WebSocket event emitter
      middleware/
        validate.ts               ← Zod validation middleware
    docker-compose.yml            ← MongoDB + Redis containers
```

---

## Prerequisites

Before you start, make sure you have these installed:

- **Node.js** (v18 or higher) — https://nodejs.org
- **Docker Desktop** — https://www.docker.com/products/docker-desktop

To verify:
```bash
node --version    # should show v18 or higher
docker --version  # should show Docker version
```

---

## Step 1 — Get your API keys

You need two free API keys. No credit card required for either.

### Gemini API key (Primary AI)

1. Go to https://aistudio.google.com/app/apikey
2. Sign in with your Google account
3. Click **Create API Key**
4. Copy the key — it starts with `AIza...`

### Groq API key (Fallback AI)

1. Go to https://console.groq.com
2. Sign up for a free account
3. Go to **API Keys** in the left sidebar
4. Click **Create API Key**
5. Copy the key — it starts with `gsk_...`

Keep both keys somewhere safe — you will need them in the next step.

---

## Step 2 — Set up MongoDB and Redis

Instead of installing MongoDB and Redis manually, we use Docker to run them in containers. This takes one command.

### Install and open Docker Desktop

1. Download Docker Desktop from https://www.docker.com/products/docker-desktop
2. Install it and restart your computer if prompted
3. Open Docker Desktop
4. Wait until you see a green **Engine running** dot at the bottom left

### Start the containers

Open a terminal inside the `vedaai-backend` folder and run:

```bash
docker-compose up -d
```

You should see:
```
✓ Container vedaai-mongo   Running
✓ Container vedaai-redis   Running
```

That's it. MongoDB is now running on port `27017` and Redis on port `6379`.

> **Note:** You need to keep Docker Desktop open in the background whenever you run this project. The containers stop when Docker Desktop closes.

---

## Step 3 — Set up the Backend

### Install dependencies

```bash
cd vedaai-backend
npm install
```

### Create your .env file

Copy the example file:

```bash
# Windows
copy .env.example .env

# Mac / Linux
cp .env.example .env
```

Open `.env` and fill in your API keys:

```env
PORT=4000
NODE_ENV=development

MONGODB_URI=mongodb://localhost:27017/vedaai

REDIS_HOST=localhost
REDIS_PORT=6379

GEMINI_API_KEY=paste-your-gemini-key-here
GROQ_API_KEY=paste-your-groq-key-here

FRONTEND_URL=http://localhost:3000
```

---

## Step 4 — Set up the Frontend

### Install dependencies

```bash
cd vedaai
npm install
```

### Create your .env.local file

Create a new file called `.env.local` inside the `vedaai` folder with this content:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_WS_URL=ws://localhost:4000/ws
```

---

## Step 5 — Run everything

You need **4 separate terminals** running at the same time. In VS Code, click the `+` button in the terminal panel to open new ones.

**Terminal 1 — Start databases** (only needed first time or after restart)
```bash
cd vedaai-backend
docker-compose up -d
```

**Terminal 2 — Start the backend server**
```bash
cd vedaai-backend
npm run dev
```

Wait until you see:
```
✅ BullMQ queue 'generate-paper' ready
✅ MongoDB connected
✅ Redis connected
🚀 VedaAI Backend running at http://localhost:4000
🔌 WebSocket server at ws://localhost:4000/ws
```

**Terminal 3 — Start the worker**
```bash
cd vedaai-backend
npm run worker
```

Wait until you see:
```
✅ MongoDB connected
🚀 Worker started — listening for jobs on 'generate-paper'
```

**Terminal 4 — Start the frontend**
```bash
cd vedaai
npm run dev
```

Wait until you see:
```
▲ Next.js ready
✓ Local: http://localhost:3000
```

---

## Step 6 — Test it

1. Open http://localhost:3000 in your browser
2. Click **Create Assignment**
3. Fill in the form — subject, class, chapter, question types, marks
4. Click **Next**, then **Generate Paper**
5. You will see a generating screen
6. After 15–30 seconds the paper appears automatically

To verify the backend is healthy at any time:
```bash
http://localhost:4000/health
```

Should return:
```json
{ "status": "ok", "timestamp": "...", "uptime": 123 }
```

---

## API Reference

| Method | Route | Description |
|---|---|---|
| GET | `/health` | Health check |
| POST | `/assignments` | Create assignment and queue generation |
| GET | `/assignments` | List all assignments |
| GET | `/assignments/:id` | Get single assignment with result |
| DELETE | `/assignments/:id` | Delete assignment |
| POST | `/assignments/:id/regenerate` | Re-generate paper for existing assignment |

### POST /assignments — Request body

```json
{
  "title": "Quiz on Electricity",
  "subject": "Science",
  "className": "8th",
  "chapter": "Chemical Effects of Electric Current",
  "dueDate": "2025-06-30",
  "questionTypes": [
    {
      "type": "Multiple Choice Questions",
      "numberOfQuestions": 4,
      "marksPerQuestion": 1
    },
    {
      "type": "Short Questions",
      "numberOfQuestions": 5,
      "marksPerQuestion": 2
    }
  ],
  "instructions": "Focus on NCERT Chapter 14"
}
```

### WebSocket events

Connect to: `ws://localhost:4000/ws?assignmentId=<id>`

Events you will receive:
```json
{ "type": "assignment:queued",      "assignmentId": "..." }
{ "type": "assignment:processing",  "assignmentId": "..." }
{ "type": "assignment:completed",   "assignmentId": "...", "payload": { ...result } }
{ "type": "assignment:failed",      "assignmentId": "...", "payload": { "error": "..." } }
```

---

## Environment Variables

### vedaai-backend/.env

| Variable | Description | Example |
|---|---|---|
| `PORT` | Backend server port | `4000` |
| `NODE_ENV` | Environment | `development` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/vedaai` |
| `REDIS_HOST` | Redis host | `localhost` |
| `REDIS_PORT` | Redis port | `6379` |
| `GEMINI_API_KEY` | Gemini API key from aistudio.google.com | `AIza...` |
| `GROQ_API_KEY` | Groq API key from console.groq.com | `gsk_...` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:3000` |

### vedaai/.env.local

| Variable | Description | Value |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:4000` |
| `NEXT_PUBLIC_WS_URL` | WebSocket URL | `ws://localhost:4000/ws` |

---

## Common Errors

**`Failed to create. Is the backend running?`**
- Backend is not running. Start Terminal 2 (`npm run dev` in vedaai-backend)
- Check that `.env.local` exists in the `vedaai` folder
- Restart the frontend after creating `.env.local`

**`PostCSS: module is not defined in ES module scope`**
- Open `vedaai/postcss.config.mjs` and replace the entire content with:
```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

**`Gemini API error 429: quota exceeded`**
- You have hit the free tier rate limit for Gemini
- The system automatically falls back to Groq — this is expected behaviour
- Wait a minute and try again, or use Groq exclusively

**`Worker failed: Both AI providers failed`**
- Check that `GEMINI_API_KEY` and `GROQ_API_KEY` are correctly set in `.env`
- Make sure there are no extra spaces or quotes around the keys
- Verify the keys are valid by testing them at their respective consoles

**`Container vedaai-mongo not running`**
- Open Docker Desktop and make sure it shows Engine running (green dot)
- Run `docker-compose up -d` again from the `vedaai-backend` folder

**Paper shows blank page / needs refresh**
- This was a known bug — fixed in the latest version of `app/assignment/[id]/page.tsx`
- Make sure you have the latest version of that file

---

## How the AI generation works

1. The worker builds a structured prompt from the assignment data
2. It calls **Gemini 2.0 Flash** first (fast, reliable JSON output)
3. If Gemini fails (rate limit, error) it automatically calls **Groq Llama 3.3 70B**
4. If both fail the assignment is marked as `failed`
5. The response is always parsed and validated as JSON before saving — the raw AI response is never rendered directly

---

Built with Next.js, Express, BullMQ, MongoDB, Redis, Gemini, and Groq.

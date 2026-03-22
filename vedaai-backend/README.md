# VedaAI Backend

Node.js + Express + TypeScript backend with MongoDB, Redis, BullMQ, WebSocket, and Claude AI.

---

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY
```

### 3. Start MongoDB + Redis
```bash
docker-compose up -d
```

### 4. Run the server + worker (two terminals)

**Terminal 1 — API server:**
```bash
npm run dev
```

**Terminal 2 — BullMQ worker:**
```bash
npm run worker
```

---

## API Reference

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/health` | Health check |
| POST | `/assignments` | Create assignment + queue job |
| GET | `/assignments` | List all assignments |
| GET | `/assignments/:id` | Get single assignment + result |
| DELETE | `/assignments/:id` | Delete assignment |
| POST | `/assignments/:id/regenerate` | Re-queue generation |

### POST /assignments — Request body
```json
{
  "title": "Quiz on Electricity",
  "subject": "Science",
  "className": "8th",
  "dueDate": "2025-06-30",
  "questionTypes": [
    { "type": "Multiple Choice Questions", "numberOfQuestions": 4, "marksPerQuestion": 1 },
    { "type": "Short Questions", "numberOfQuestions": 5, "marksPerQuestion": 2 }
  ],
  "instructions": "Focus on NCERT Chapter 14"
}
```

---

## WebSocket

Connect to: `ws://localhost:4000/ws?assignmentId=<id>`

Events received:
```json
{ "type": "assignment:queued",      "assignmentId": "..." }
{ "type": "assignment:processing",  "assignmentId": "..." }
{ "type": "assignment:completed",   "assignmentId": "...", "payload": { ...result } }
{ "type": "assignment:failed",      "assignmentId": "...", "payload": { "error": "..." } }
```

---

## Flow

```
POST /assignments
  → Save to MongoDB (status: pending)
  → Add job to BullMQ queue
  → Return { id, status: "pending" }

Worker picks up job:
  → Update status: "processing"
  → Emit WS: assignment:processing
  → Call Claude API with structured prompt
  → Parse + validate JSON response
  → Save result to MongoDB (status: "completed")
  → Emit WS: assignment:completed { result }

Frontend:
  → Connects to WS on /assignment/[id]
  → Shows GeneratingState while pending/processing
  → Updates UI when completed event received
  → Falls back to polling every 3s if WS fails
```

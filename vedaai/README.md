# VedaAI — AI Assessment Creator

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
app/
  assignments/page.tsx     → Dashboard (0-state + filled)
  create/page.tsx          → Create Assignment (2-step form)
  assignment/[id]/page.tsx → Assignment output / exam paper
  layout.tsx               → Root layout with Sidebar + Header

components/
  layout/
    Sidebar.tsx            → Left nav (desktop)
    Header.tsx             → Top bar with breadcrumb
    MobileNav.tsx          → Bottom tab bar (mobile)
  dashboard/
    AssignmentCard.tsx     → Card with 3-dot menu
    EmptyState.tsx         → 0-state illustration
  create/
    FileUpload.tsx         → Drag & drop file upload
    QuestionTypeRow.tsx    → Question type row with +/- counters
  output/
    DifficultyBadge.tsx    → Easy/Moderate/Challenging badge
    GeneratingState.tsx    → Animated loading state

store/
  useAssignmentStore.ts    → Zustand store (all app state)

lib/
  mockData.ts              → Mock assignments + exam paper result

types/
  index.ts                 → All TypeScript types
```

---

## What's Built (Phase 1)

- ✅ Dashboard — 0-state + filled state with assignment cards
- ✅ Create Assignment — 2-step form with validation
- ✅ Assignment Output — structured exam paper with difficulty badges
- ✅ Zustand store for all state management
- ✅ Mobile responsive with bottom nav
- ✅ Simulated async generation (3s delay, mock data)
- ✅ Download as PDF via browser print
- ✅ Regenerate button

## Next Steps (Phase 2+)

- [ ] Backend: Node.js + Express + MongoDB
- [ ] Queue: BullMQ + Redis for async generation
- [ ] AI: Claude/GPT integration with structured prompt
- [ ] WebSocket: Real-time generation updates

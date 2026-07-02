# System Design Mastery — Web App

The Next.js front-end for the System Design Mastery platform. Serves all 20 parts, ~260 lessons, 23 reference sheets, and a flashcard review system.

---

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| Content | Contentlayer2 + MDX |
| Animation | Framer Motion |
| State | Zustand + localStorage |
| Package manager | pnpm |

---

## Getting Started

Requires [Node.js 18+](https://nodejs.org) and [pnpm](https://pnpm.io).

```bash
# Install pnpm if you don't have it
npm install -g pnpm

# Install dependencies
pnpm install

# Start dev server (syncs content + builds contentlayer automatically)
pnpm dev
```

Open **http://localhost:3000**

---

## Scripts

| Command | What it does |
|---------|-------------|
| `pnpm dev` | Syncs content, builds Contentlayer, starts Next.js dev server |
| `pnpm build` | Production build (runs verify-manifest + contentlayer + next build) |
| `pnpm start` | Serves the production build locally |
| `pnpm sync` | Manually copies `../platform/` content into `content/` |
| `pnpm lint` | ESLint + TypeScript type check |

---

## Project Structure

```
web/
├── src/
│   ├── app/              → Next.js App Router pages
│   │   ├── page.tsx      → Dashboard (home)
│   │   ├── learn/        → Lesson reader (/learn/[...slug])
│   │   ├── reference/    → Reference sheets (/reference/[slug])
│   │   ├── docs/         → Backbone docs (/docs/[slug])
│   │   └── flashcards/   → Flashcard review (/flashcards)
│   ├── components/
│   │   ├── layout/       → AppShell, Sidebar, TopBar, NavTree, Pager
│   │   ├── content/      → LessonHeader, TocRail, ReadingProgressBar
│   │   ├── flashcards/   → FlashcardDialog, DeckPicker
│   │   └── shared/       → MarkdownRenderer, PartBadge, Kbd
│   ├── stores/           → Zustand stores (progress, UI)
│   ├── hooks/            → useProgress, useHasMounted, useHotkeys, etc.
│   ├── lib/              → curriculum helpers, motion variants
│   └── data/
│       └── manifest.ts   → Authoritative course structure (all parts/modules/lessons)
├── content/              → Markdown source (synced from ../platform/)
│   ├── lessons/          → All 20 parts of lesson files
│   ├── reference/        → 23 reference/cheat sheet files
│   └── backbone/         → Curriculum map, roadmap, study schedules
├── scripts/
│   ├── sync-content.mjs  → Copies platform/ → content/
│   └── verify-manifest.mjs → Validates all manifest paths exist in content/
├── contentlayer.config.ts → Contentlayer document schemas
├── next.config.mjs        → Next.js config (wraps contentlayer)
└── tailwind.config.ts     → Tailwind theme tokens
```

---

## Content Pipeline

```
platform/lessons/   →  sync-content.mjs  →  content/lessons/
platform/reference/ →                    →  content/reference/
platform/*.md       →                    →  content/backbone/
                                                  ↓
                                         contentlayer2 build
                                                  ↓
                                    .contentlayer/generated/
                                    (imported by pages at build time)
```

Content is sourced from `../platform/` (the sibling directory). The `sync` script copies it into `web/content/` which is what Contentlayer reads. On Vercel, `content/` is committed directly so the sync step is skipped automatically.

---

## Deployment

Deployed to Vercel. A `vercel.json` at the repo root handles all configuration. No environment variables required.

See the [root README](../README.md) for full deployment instructions.

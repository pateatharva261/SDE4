# System Design Mastery

A comprehensive, university-depth **System Design** learning platform — 20 parts, ~260 lessons, 23 reference sheets, and a full-stack interactive web app.

Built for engineers aiming for Senior, Staff, and Principal-level system design proficiency.

## Live App

Deployed on Vercel → *(add your URL here after deployment)*

---

## What's Inside

```
SDE4/
├── web/          → Next.js web application (the main platform)
└── platform/     → Source content: lessons, reference sheets, backbone docs
```

### `web/` — The Web App

A Next.js 16 + Tailwind 4 + Contentlayer2 application with:

- 📚 Full lesson reader with table of contents, reading progress, and pager navigation
- 🗂️ Reference sheet library (23 cheat sheets and decision tables)
- 🃏 Flashcard review system with spaced-repetition decks
- 📊 Progress tracking persisted in localStorage
- 🌙 Dark / light mode
- ⌨️ Keyboard shortcuts (`j` / `k` to navigate lessons)
- 🔍 Command palette search

### `platform/` — Content

- **Lessons** — 20 parts across `lessons/part-01-mindset/` through `part-20-capstone/`, each a structured deep-dive with learning objectives, theory, diagrams, analogies, interview Q&A, pitfalls, and flashcard revision notes.
- **Reference sheets** — `reference/` — 23 cheat sheets and decision tables.
- **Backbone docs** — curriculum map, learning roadmap, concept dependency graph, and study schedules.
- **Legacy app** — `app/` — the original single-file browser prototype (still works, but superseded by `web/`).

---

## Curriculum

20 parts, progressing from foundations to enterprise-scale design:

| Part | Topic |
|------|-------|
| 1 | The Mindset of System Design |
| 2 | Architecture Fundamentals |
| 3 | Networking |
| 4 | Storage Internals |
| 5 | Databases |
| 6 | Caching |
| 7 | Scalability |
| 8 | Distributed Systems Core |
| 9 | Messaging & Streaming |
| 10 | Consistency & Replication |
| 11 | Fault Tolerance |
| 12 | Microservices |
| 13 | Cloud Native |
| 14 | SRE |
| 15 | Security |
| 16 | Observability |
| 17 | Performance |
| 18 | Real-World Architectures |
| 19 | Interview System Designs |
| 20 | Enterprise Capstone |

---

## Running Locally

### Web App (recommended)

Requires [Node.js 18+](https://nodejs.org) and [pnpm](https://pnpm.io).

```bash
# Install pnpm if you don't have it
npm install -g pnpm

cd web
pnpm install
pnpm dev
```

Open **http://localhost:3000**

### Legacy Static App

No build step needed:

```bash
cd platform
python -m http.server 8080
```

Open **http://localhost:8080/app/** — or on Windows, double-click `platform/app/launch.bat`.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| Content | Contentlayer2 + MDX |
| Animation | Framer Motion |
| State | Zustand |
| Package manager | pnpm |
| Deployment | Vercel |

---

## Deploying to Vercel

A `vercel.json` is included at the repo root with all settings pre-configured. Just:

1. Push the repo to GitHub
2. Import it at [vercel.com/new](https://vercel.com/new)
3. Click **Deploy** — no manual configuration needed

---

## Notes

- Reference books (PDFs) are kept locally under `resources/` and are **git-ignored** (not distributed).
- Illustrative numbers in lessons are labeled as such; company examples are marked *representative*.
- Progress tracking is client-side only (localStorage) — no backend or database required.

# System Design Mastery

A comprehensive, university-depth **System Design** learning platform — 20 parts, 209 lessons, 23 reference sheets, and an interactive browser app.

## Contents

The full curriculum lives in [`platform/`](./platform):

- **Lessons** — `platform/lessons/part-01-…` through `part-20-capstone/`, each a deep, structured lesson (learning objectives, theory, diagrams, analogies, interview questions, pitfalls, revision notes).
- **Reference sheets** — `platform/reference/` (cheat sheets and decision tables).
- **Backbone docs** — curriculum map, learning roadmap, dependency graph, and study schedules at `platform/`.
- **Interactive app** — `platform/app/` (reads `manifest.js`).

## Curriculum overview

Mindset → Architecture Fundamentals → Networking → Storage → Databases → Caching → Scalability → Distributed Systems Core → Messaging & Streaming → Consistency & Replication → Fault Tolerance → Microservices → Cloud Native → SRE → Security → Observability → Performance → Real-World Architectures → Interview System Designs → Enterprise Capstone.

## Running the app

From the `platform/` directory:

```bash
python -m http.server 8080
```

Then open <http://localhost:8080/app/>. On Windows you can also use `platform/app/launch.bat`.

## Notes

- Reference books (PDFs) are kept locally under `resources/` and are **git-ignored** (not distributed).
- Illustrative numbers are labeled as such; company examples are marked *representative*.

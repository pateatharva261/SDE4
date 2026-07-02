# System Design Mastery — A Complete Learning Platform

> From "I can build a CRUD app" to "I can design, defend, and operate planet-scale systems at Staff/Principal level."

This is **not** a summary of books. It is a structured, dependency-ordered curriculum that synthesizes the core ideas from the field's foundational texts into one coherent course, then extends them with modern cloud-native, distributed-systems, and production-engineering practice.

---

## What this platform assumes you already know

You should already be comfortable with:

- A general-purpose programming language (Java, Go, Python, C++, or similar)
- Object-Oriented Programming and basic design patterns
- Data Structures & Algorithms (Big-O, trees, hashing, graphs, sorting)
- Operating Systems basics (processes, threads, virtual memory, scheduling, syscalls)
- Basic relational databases (tables, SQL, primary keys, joins)
- Basic networking (what an IP address is, what a port is, client/server)

We do **not** re-teach these. We start where most engineers actually have gaps: turning these primitives into large, reliable, evolvable systems.

---

## What you will be able to do when finished

1. Decompose any vague product requirement into functional + non-functional requirements and capacity estimates.
2. Choose data models, storage engines, and databases from first principles — not cargo-cult.
3. Reason precisely about consistency, availability, latency, and partition behavior (CAP/PACELC) instead of using them as buzzwords.
4. Design replication, partitioning, caching, and messaging layers and explain every tradeoff.
5. Apply consensus (Raft/Paxos), distributed transactions (2PC, Saga), and idempotency correctly.
6. Architect microservice and event-driven systems, and know when a modular monolith is the better call.
7. Operate systems: SLO/error-budget thinking, observability, capacity planning, incident response, chaos engineering.
8. Pass Staff+ system design interviews by reasoning out loud with structure and depth.
9. Design and defend a full enterprise capstone (a Wealth Management Platform) end to end.

---

## How the platform is organized

```
platform/
├── 00-START-HERE.md                 ← you are here
├── 01-CURRICULUM-MAP.md             ← every Part → Module → Lesson
├── 02-LEARNING-ROADMAP.md           ← durations, prerequisites, milestones
├── 03-CONCEPT-DEPENDENCY-GRAPH.md   ← what must be learned before what (Mermaid)
├── 04-STUDY-SCHEDULES.md            ← 6 / 9 / 12-month tracks
├── lessons/
│   ├── part-01-mindset/
│   ├── part-02-architecture-fundamentals/
│   ├── ... (one folder per Part)
│   └── part-20-capstone/
├── reference/                       ← cheat sheets, decision trees, comparison tables
└── labs/                            ← hands-on labs, debugging & failure exercises
```

Each lesson is a standalone Markdown file following a fixed 17-section template (see the curriculum map). Lessons cross-reference prerequisites and follow-ups so the whole platform forms one connected knowledge graph.

---

## The standard lesson template (every lesson follows this)

1. Learning Objectives
2. Motivation (why it exists, historical evolution, problems solved)
3. Theory (from first principles)
4. Visual Intuition (Mermaid-compatible diagrams)
5. Real-World Analogy
6. Industry Example (publicly documented architectures only)
7. Implementation Details (algorithms, protocols, data structures, complexity, tradeoffs)
8. Advantages
9. Disadvantages
10. When NOT to use it
11. Common Mistakes
12. Interview Questions (Easy / Medium / Hard / Staff+)
13. Production Pitfalls
14. Optimization Techniques
15. Summary
16. Revision Notes (flashcard-style)
17. Further Reading + Knowledge-Graph Links

Plus interleaved: **Knowledge Checks**, **Quizzes**, **Exercises**, **Labs**, **Tradeoff Worksheets**.

---

## Sourcing & integrity rules used throughout

- Concepts are synthesized across the foundational texts; we never reproduce author wording.
- Real-company examples use **only publicly documented** architectures and are marked as *representative* when exact internals aren't public.
- We **do not** invent benchmarks, latency/throughput numbers, or internal implementation details. Illustrative numbers are explicitly labeled *(illustrative)*.
- Claims are tagged where useful:
  - `[CS]` = established computer science
  - `[CONV]` = common industry convention
  - `[BP]` = best practice
  - `[EMERGING]` = newer/contested pattern
  - `[OPINION]` = author judgment

---

## How to use this platform

- **Linear path (recommended for mastery):** follow Parts 1 → 20 in order.
- **Interview crash path:** Parts 1–2, then the cheat sheets in `reference/`, then Part 19 problems, pulling deep-dive lessons as needed.
- **On-the-job reference:** jump straight to the topic via the curriculum map; each lesson is self-contained.

Start with `01-CURRICULUM-MAP.md`, skim `03-CONCEPT-DEPENDENCY-GRAPH.md`, pick a track in `04-STUDY-SCHEDULES.md`, then begin Lesson 1.1.

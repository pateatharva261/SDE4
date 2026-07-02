# Recommended Study Schedules

Three tracks at different intensities. Pick based on your weekly time budget and deadline. All assume the platform's prerequisite knowledge is already in place.

> Hours are *illustrative* planning aids. Adjust to your pace. The non-negotiable is the **order** (driven by the dependency graph), not the calendar.

---

## Track A — 6-Month Intensive (~12–15 hrs/week)

For candidates with a near-term Staff+ interview or a focused sabbatical.

| Month | Parts | Outcome / Milestone |
|------|-------|---------------------|
| 1 | P1, P2, P3 | M0; networking fluent |
| 2 | P4, P5, P6 | M1; storage + DB + cache internals |
| 3 | P7, P8 | scalability + distributed core (the hard month) |
| 4 | P9, P10, P11 | M2; messaging, consistency, fault tolerance |
| 5 | P12, P13, P14, P15, P16, P17 | M3; build/operate/secure/observe |
| 6 | P18, P19, P20 | M4; case studies, interview drills, capstone |

Weekly rhythm: 3 lessons + 1 lab/exercise + 1 mock-design or quiz block.

---

## Track B — 9-Month Balanced (~8–10 hrs/week) ← recommended default

For full-time engineers who want real depth without burnout.

| Month | Parts | Notes |
|------|-------|-------|
| 1 | P1, P2 | mindset + architecture; produce M0 deliverable |
| 2 | P3 | networking deep dive; lab: build a tiny LB/router |
| 3 | P4, P5 (5.1–5.2) | storage engines + data models + transactions |
| 4 | P5 (5.3–5.4), P6 | recovery, DB selection, caching; M1 |
| 5 | P7, P8 (8.1–8.2) | scalability, network/clock difficulties, logical clocks |
| 6 | P8 (8.3–8.4), P9 | consensus, locks; messaging & streaming |
| 7 | P10, P11 | consistency + fault tolerance; M2 |
| 8 | P12, P13, P14 | microservices, cloud-native, SRE; M3 |
| 9 | P15, P16, P17, then P18–P20 | security/observability/perf + designs + capstone; M4 |

Weekly rhythm: 2–3 lessons + 1 exercise + spaced-repetition flashcards (15 min/day).

---

## Track C — 12-Month Mastery (~5–7 hrs/week)

For deep, durable learning alongside a demanding job; maximizes retention via spacing.

| Months | Parts | Emphasis |
|-------|-------|----------|
| 1–2 | P1, P2 | over-learn the mindset and LLD; lots of small designs |
| 3 | P3 | networking |
| 4–5 | P4, P5 | storage + databases (spend real time on internals) |
| 6 | P6, P7 | caching + scalability |
| 7–8 | P8 | distributed core — go slow, do every lab; M2 prep |
| 9 | P9, P10 | messaging + consistency; M2 |
| 10 | P11, P12 | fault tolerance + microservices |
| 11 | P13, P14, P15, P16 | cloud-native, SRE, security, observability; M3 |
| 12 | P17, P18, P19, P20 | performance, case studies, interviews, capstone; M4 |

Weekly rhythm: 2 lessons + heavy spaced repetition + monthly mock design review.

---

## Universal practices (all tracks)

1. **Spaced repetition.** Each lesson's Revision Notes (Section 16) are flashcard-ready. Review daily for 10–15 min. Retention, not exposure, is the goal.
2. **Active recall before re-reading.** Before re-opening a lesson, try to reconstruct its core diagram and top 3 tradeoffs from memory.
3. **One lab/exercise per Part minimum.** Reading about Raft ≠ understanding Raft. Build the toy.
4. **Mock design reviews.** Every 2–3 weeks, design a system out loud (record yourself or use a peer) using the framework in Lesson 1.3.1.
5. **Maintain a personal ADR log.** For every design you do, write one Architecture Decision Record. This builds the Staff+ habit of justifying decisions.
6. **Re-derive, don't memorize.** If you find yourself memorizing (e.g., "use Kafka here"), stop and re-derive *why* from first principles.

---

## Pace self-check

If after a Part you cannot pass the "ready to move on" checklist in `02-LEARNING-ROADMAP.md`, **slow down**. The schedule serves the learning, not the reverse. It is normal for Parts 8 and 10 to take 1.5–2× longer than planned — they are the conceptual peak.

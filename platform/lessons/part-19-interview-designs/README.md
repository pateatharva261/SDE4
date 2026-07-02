# Part 19 — Interview System Designs

> **The application layer of the whole course.** Twenty end-to-end designs, each driven by the **framework** (1.3.1/1.3.2): **requirements → estimation → API → data model → HLD → deep dives → bottlenecks**. Every design is a *composition* of concepts from Parts 1–18 — the goal is to make the reflexes automatic.

---

## Why this part exists

Parts 1–18 taught the **building blocks** (caching, sharding, consensus, streaming, sagas, geo-indexing, CDNs, ledgers…). Part 19 is where you **assemble** them under interview conditions: recognize a workload's **key signal**, pick the right patterns, defend the tradeoffs, and go deep on the one or two decisions that actually matter. Each lesson keeps the 17-section template, adapted to a design-problem shape (Theory = the design walkthrough).

The recurring meta-skill: **every decision follows from a requirement.** Read-heavy → cache. Write-heavy stream → log + partitioned aggregation. Money → idempotency + ledger + consistency. Concurrent shared state → OT/CRDT. Nearby → geospatial index. Strict ordering → sequenced deterministic engine.

---

## Index

### Module 19.1 — Volume 1 Problems (the fundamentals)

| # | Design | Key signal / core patterns |
|---|--------|----------------------------|
| 19.1.1 | URL Shortener | Read-heavy + immutable → cache-first + KV; counter+base62 code-gen |
| 19.1.2 | Rate Limiter | On-every-request + global limit → token bucket + shared atomic Redis counter |
| 19.1.3 | Web Crawler | Massive BFS + politeness → frontier queue + dedup + distributed workers |
| 19.1.4 | Notification System | Fan-out + multi-channel → queues + provider adapters + idempotency |
| 19.1.5 | News Feed (Instagram) | Read-heavy fan-out → push/pull hybrid + cached feeds |
| 19.1.6 | Chat System (WhatsApp) | Persistent connections + delivery → connection registry + routing + fan-out |
| 19.1.7 | File Storage & Sync (Dropbox) | Chunking + dedup + sync → content-addressed chunks + metadata + object store |
| 19.1.8 | Video Platform (YouTube) | Upload/transcode + streaming → pipeline + ABR + CDN |
| 19.1.9 | Search Autocomplete | Prefix lookups + low latency → trie + cached top-K |
| 19.1.10 | Unique-ID Generator & KV Store | Distributed IDs → Snowflake/block-allocation; consistent-hashing KV |

### Module 19.2 — Volume 2 Problems (the hard ones)

| # | Design | Key signal / core patterns |
|---|--------|----------------------------|
| 19.2.1 | Google Docs (Collaborative Editing) | Concurrent shared state → OT/CRDT + WebSockets + op-log |
| 19.2.2 | News Feed (Deep) | Celebrity skew → hybrid fan-out + async workers + cursor pagination |
| 19.2.3 | Payment System | Money → idempotency + double-entry ledger + saga/outbox + reconciliation (CP) |
| 19.2.4 | Ride-Sharing (Uber) | Geo + high-write + real-time → geo index + streaming ingest + atomic matching + trip saga |
| 19.2.5 | Distributed Lock Service | Safety under failure → lease + fencing token + consensus store (CP) |
| 19.2.6 | Metrics / Monitoring Platform | Write firehose + cardinality → buffered ingest + compressed TSDB + SLO alerting |
| 19.2.7 | Recommendation System | Heavy ML → offline precompute + online two-stage retrieve→rank + streaming freshness |
| 19.2.8 | Proximity / Nearby (Yelp) | Static + read-heavy geo → density-adaptive geo index + cache-first serving |
| 19.2.9 | Ad Click Aggregator | Event firehose + money → log + event-time windowed aggregation + exactly-once + Lambda/Kappa |
| 19.2.10 | Stock Exchange / Matching Engine | Latency + strict ordering → sequenced input log + deterministic engine + replicated state machine |

---

## The through-line

- **The framework is universal** (1.3.1/1.3.2): every design starts with requirements + estimation, and the **key non-functional signal** dictates the architecture.
- **Composition, not invention:** these designs reuse the course. Feed/chat = fan-out (18.8); ride-sharing/proximity = geo (18.6); recommendations/feed-ranking = online/offline + two-stage (18.5); payment/matching = ledger + correctness (18.3); ad aggregator/metrics = streaming (Part 9) + TSDB (16.2).
- **Split by consistency/latency profile:** big systems are compositions of subsystems with *different* guarantees (ride-sharing's fast-eventual geo vs strong trip/payment — 18.6).
- **Correctness patterns recur:** idempotency + exactly-once effects (11.5/9.4), sagas (11.7), immutable logs enabling replay (18.1), fencing (8.3.6), deterministic replay (8.3.3).
- **Scale patterns recur:** cache-first for read-heavy; log + partitioned aggregation for write-heavy streams; hybrid fan-out and hot-key handling for skew (7.4); geospatial indexing for "nearby."

---

## Self-check

Can you, for any prompt, within a minute: (1) state whether it's read-heavy, write-heavy, or correctness-first; (2) name the **one** dominant pattern that follows; (3) identify the **single hardest deep-dive** the interviewer will push on; and (4) name the bottleneck and how you dissolve it? If yes, you're interview-ready.

- URL shortener vs rate limiter: why is one cache-first and the other atomic-counter-first?
- Feed vs chat: how does fan-out differ, and where does the celebrity problem bite?
- Payment vs matching engine: both are correctness-first — how do their *ordering* needs differ?
- Ride-sharing vs proximity: same geo index, opposite optimization (write vs read) — why?
- Ad aggregator vs metrics platform: both ingest firehoses — what's different about *correctness* requirements?

---

*Next: **Part 20 — Enterprise Capstone** integrates the entire course into one defended, end-to-end design.*

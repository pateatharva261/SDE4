# Interview System Designs — Cheat Sheet

> Fast lookup for Part 19. Recognize the **key signal**, reach for the **dominant pattern**, know the **hardest deep dive** and the **bottleneck**. Every design = the framework (1.3.1) + composition of Parts 1–18.

---

## The framework (say it every time — 1.3.1/1.3.2)

**Requirements (FR + NFR) → Capacity estimation → API → Data model → HLD → Deep dives → Bottlenecks.**
The **dominant non-functional requirement** determines the architecture. Clarify scope, state assumptions, drive the conversation.

---

## Signal → pattern quick map

| If the workload is… | Reach for… |
|---|---|
| Read-heavy + immutable/cacheable | Cache-first (Part 6) + CDN (18.4) + read replicas (7.5) |
| Write-heavy event firehose | Distributed log (18.1) + partitioned stream aggregation (9.6) |
| Fan-out to many followers | Push/pull **hybrid**; pull for celebrities (7.4) |
| Persistent real-time connections | WebSockets (3.2.5) + connection registry + routing (18.8) |
| "Find nearby" | Geospatial index — geohash/quadtree/S2/H3 (18.6) |
| Money / financial correctness | Idempotency (11.5) + double-entry ledger (18.3) + saga/outbox (11.7) + CP (10.7) |
| Concurrent edits to shared state | OT or CRDT (10.4) + op-log |
| Exclusive access under failure | Lease + fencing token + consensus store (8.3.6/8.3.8) |
| Heavy ML serving | Offline precompute + online two-stage retrieve→rank (18.5) |
| Strict ordering + ultra-low latency | Sequenced input log + deterministic engine + RSM (8.2.3/8.3.3) |
| Unique IDs at scale | Snowflake / block-allocated counter (19.1.10) |

---

## Volume 1 — one-liners

- **URL shortener:** read-heavy + immutable → cache-first + sharded KV; **counter+base62** code-gen (collision-free, block-allocate); async analytics; 301 vs 302.
- **Rate limiter:** on every request + global limit → **token bucket** + **shared atomic Redis counter** (Lua); counter store = bottleneck (HA/shard); fail-open usually.
- **Web crawler:** politeness + dedup at scale → **URL frontier** (priority + per-host queues) + seen-set (Bloom) + distributed fetchers; respect robots.
- **Notification system:** multi-channel fan-out → queues per channel + **provider adapters** + retries + **idempotency** (dedup) + user preferences.
- **News feed (Instagram):** read-heavy fan-out → **hybrid push/pull** + cached precomputed feeds + ranking.
- **Chat (WhatsApp):** C10M persistent connections → **connection registry** + routing/pub-sub + wide-column message store + delivery/ordering/dedup + presence.
- **File sync (Dropbox):** **chunking + content-addressed dedup** + metadata service + object store + sync/conflict handling.
- **Video (YouTube):** upload → **transcode pipeline** → **ABR** streaming over **CDN**; metadata + view counts async.
- **Autocomplete:** prefix queries + low latency → **trie** with cached **top-K** per prefix; update offline from logs.
- **ID generator + KV:** **Snowflake** (time+machine+seq) / block allocation; KV = **consistent hashing** + replication + quorums (18.2).

---

## Volume 2 — one-liners + the hardest deep dive

- **Google Docs:** concurrent shared state → **OT vs CRDT** (10.4) + WebSockets + op-log/snapshots. **Hard part:** convergence + causality; optimistic-local-apply + reconcile.
- **News feed (deep):** **celebrity/hot-key** (7.4) → hybrid fan-out + async workers + **cursor pagination**. **Hard part:** the celebrity write explosion.
- **Payment system:** **idempotency** + **double-entry ledger** (immutable, ACID) + **saga/outbox** + **reconciliation**; **CP** (correctness > availability). **Hard part:** exactly-once effects + reconciliation.
- **Ride-sharing (Uber):** **geo index** + **streaming location ingest** + **geo-sharding** + **atomic matching** (lock/CAS) + **trip saga** + real-time push. **Hard part:** consistency split (fast-eventual geo vs strong trip).
- **Distributed lock:** **lease (liveness) + fencing token (safety) + consensus store (CP)**. **Hard part:** stale-holder split-brain; efficiency vs correctness locks (Redlock debate).
- **Metrics platform:** buffered/sharded ingest + **compressed LSM TSDB** + downsampling/retention + **bounded cardinality** + SLO alerting + independent HA. **Hard part:** cardinality is the #1 cost; monitoring must outlive the monitored.
- **Recommendations:** **offline precompute** + **online two-stage retrieve→rank** + streaming freshness + A/B. **Hard part:** cold start + feedback loops; keep ML off the hot path.
- **Proximity (Yelp):** **density-adaptive geo index** (quadtree) + **read-heavy cache-first** serving + geo-filter ranking. **Hard part:** variable density; contrast with write-heavy ride-sharing.
- **Ad click aggregator:** **log ingest** + **event-time windowed aggregation** (watermarks) + **exactly-once effects** + **Lambda/Kappa** reconciliation + hot-key pre-aggregation. **Hard part:** late/out-of-order data + money-accurate counts.
- **Matching engine:** **sequenced total-order input log** + **deterministic single-threaded in-memory matcher** (per symbol) + **replicated state machine** HA + market-data fan-out + ledger. **Hard part:** correctness+ordering over parallelism; HA without sharding the matcher.

---

## Recurring correctness patterns

- **Idempotency + exactly-once effects** (11.5/9.4): keys + dedup; at-least-once + idempotency = exactly-once effects. (Payment, notifications, ad aggregator, order gateways.)
- **Sagas + compensations** (11.7): multi-step cross-service flows; irreversible-last. (Payment, trips.)
- **Outbox / no dual writes** (Part 9/12.5): atomic DB-change + event. (Payment, event-driven flows.)
- **Immutable log → replay** (18.1): recovery, audit, reprocessing. (Docs op-log, ad aggregator, matching engine, ledger.)
- **Fencing tokens** (8.3.6): the resource enforces exclusivity, not the client's belief. (Locks.)
- **Deterministic replay / RSM** (8.3.3): order once, replay everywhere. (Matching engine, standbys.)

## Recurring scale patterns

- **Cache-first** for read-heavy/immutable (Part 6). **Hybrid fan-out** + hot-key handling for skew (7.4).
- **Log + partitioned aggregation** for write-heavy streams (18.1/9.6). **Geospatial indexing** for nearby (18.6).
- **Online/offline split + two-stage funnel** for ML (18.5). **Consistency/latency split** for composite systems (18.6).
- **Partition by the right key** (7.3): shortCode, adId, symbol, docId, region.

---

## Interview tempo

1. **Clarify + scope** (2–3 min): FRs, key NFR, back-of-envelope scale.
2. **API + data model** (a few min): shows concreteness.
3. **HLD** (the core): boxes + arrows; name the dominant pattern.
4. **Deep dive** where the interviewer pushes: the *one hard part* above.
5. **Bottlenecks + tradeoffs:** name the binding constraint and how you relieve it; state what you'd monitor.

> Golden rule: **every decision follows from a requirement.** If you can't justify a component by a requirement, cut it.

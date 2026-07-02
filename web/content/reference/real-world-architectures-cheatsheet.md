# Reference — Real-World Architectures Cheat Sheet

Pairs with [Part 18] (18.1–18.8). Core idea: **great architectures compose the fundamentals — each decision follows from a requirement; large systems are sets of subsystems, each with the right tool + consistency/latency profile.** *(All representative — documented lineages, no invented specs.)*

---

## 1. Distributed log — Kafka/LinkedIn (18.1)

```
Append-only, ordered (per partition), durable, REPLAYABLE log as the CENTRAL abstraction. O(N²) point-to-point → O(N) hub-and-spoke.
```
- Design: partitions (scale + per-partition order — 7.3/9.5) · offsets (consumer-tracked, replay) · consumer groups · retention/compaction · replication (ISR — 10.1).
- Unifies: messaging + data integration (CDC — 9.8) + stream processing (log = stream — 9.6) + event sourcing/CQRS (12.4).
- Everything = a materialization of the log. Retain+replay makes it a backbone (not a transient queue).

---

## 2. Wide-column — Bigtable/Dynamo/Cassandra/DynamoDB (18.2)

```
Goal: massive data + high write throughput + HA + horizontal scale. Trade: give up joins/ACID/strong consistency for scale + availability (AP).
```
- **LSM storage** (4.2.3): write-optimized. **Consistent hashing** (7.3): elastic scale (partition key critical — hot partitions 7.4).
- **Leaderless quorum replication** (10.1/10.9): write-anywhere, R+W>N, AP. **Tunable consistency** (dial N/R/W — 10.9).
- **Conflict resolution** (10.4): version vectors → LWW (loses data) / merge / CRDTs / siblings — the AP cost.
- **Query-driven denormalized modeling** (5.1.2): design tables per access pattern, single-partition queries, NO joins.

---

## 3. Globally-distributed SQL — Spanner/Cockroach (18.3)

```
Goal: relational + ACID + STRONG consistency AT horizontal + geo scale (CP). Cost: cross-region latency.
```
- Range-shard (7.3) + **consensus per shard** (Paxos/Raft — 8.3) → strong consistency + fault tolerance within a shard.
- **Distributed txns: 2PC over consensus groups** → fault-tolerant 2PC (11.6's blocking problem removed) + MVCC (5.2.4).
- **Global ordering: synchronized/bounded clocks (TrueTime/HLC — 8.2.4)** → strict serializability (10.6). Spanner: commit-wait (wait out ε).
- Latency mitigations: geo-partition by locality (single-region txns), colocate data (avoid cross-shard 2PC), follower reads.
- **vs 18.2:** opposite consistency choice — CP/consensus/strong/transactions vs AP/leaderless/eventual.

---

## 4. CDN & edge — Cloudflare-style (18.4)

```
Global edge PoPs cache near users (3.3.3) + anycast routes to nearest (3.2.4/13.8). The DEFAULT first tier.
```
- Wins: low latency (serve near user) + origin offload/resilience.
- **Origin shielding + request coalescing** (6.7): prevent cache misses becoming an origin stampede.
- **Security at the edge** (15.5): DDoS absorption (anycast scale — can't out-provision at origin) + WAF (L7) + TLS termination.
- **Edge compute:** run code at the PoP (personalization/auth/routing) — constrained runtime, eventually-consistent edge data.
- **Invalidation is hard globally** (6.5): TTL / purge / versioned URLs (static) / tags / stale-while-revalidate; eventually consistent.

---

## 5. Streaming & recommendations — Netflix-style (18.5)

```
Three fused subsystems: VIDEO (CDN/ABR) + CONTROL PLANE (microservices) + DATA/ML (recommendations).
```
- **Video:** CDN edge, PRE-POSITIONED near users (predictable catalog) + adaptive bitrate (ABR). SEPARATE from control plane (bytes bypass microservices).
- **Control plane:** microservices (12.x) on cloud-native (13.x) + gateway/BFF + RESILIENCE (11.3/11.4 — degrade, don't collapse; protect playback); **Chaos Engineering originated here** (14.8).
- **Recommendations:** events → log (18.1) → batch/stream (9.6/9.7) → ML training → PRECOMPUTED/CACHED serving (Part 6); A/B tested (14.7).
- Split: video/control + online (cached)/offline (batch/ML).

---

## 6. Ride-sharing & geo — Uber-style (18.6)

```
Real-time geo-matching. Split: real-time geo hot path (eventual/in-memory) vs trip/payments (strong/durable).
```
- **Geospatial indexing** (geohash/grid/S2/H3/quadtree): "find nearby" = cell/prefix lookup, not scan; maps to **geo-sharding** (7.3).
- **High-write location:** in-memory latest-value + streaming (9.x), geo-partitioned; NOT a durable DB write per GPS ping.
- **Matching:** find nearby + **atomic assignment** (11.5) to prevent double-booking; geo-partitioned driver state.
- **Trip = saga/state machine** (11.7) + idempotency (11.5); **payments strong/correct** (ledger — 18.3).
- **Real-time push** (WebSockets/SSE — 3.2.5) for live map. Watch hot cells (dense cities — 7.4).

---

## 7. Search — Elasticsearch/Lucene (18.7)

```
Full-text search = inverted index + text analysis + relevance ranking. A DERIVED READ MODEL (CQRS), not source of truth.
```
- **Inverted index:** term → postings list (docs); query = lookup + set ops (intersect/union), not scanning docs.
- **Text analysis:** tokenize/normalize/stem/synonyms — SAME at index + query time (mismatch → silently missing results).
- **Relevance:** TF-IDF → **BM25** (rank by term frequency × rarity + length normalization) + signals.
- **Distributed:** sharded + replicated inverted index + **scatter-gather** (fan-out — 17.2 → tail latency, slowest shard dominates).
- **Immutable segments** (like SSTables — 4.2.3) + NRT refresh; **derived read model via CDC** (12.4/9.8), eventually consistent.

---

## 8. Chat at scale — WhatsApp/Discord (18.8)

```
Real-time delivery to always-connected users. Dominant challenge: millions of persistent connections (C10K→C10M — 17.3).
```
- **Connection layer:** WebSockets (3.2.5) to event-driven gateways (17.3) + **connection registry** (which gateway holds whom).
- **Delivery = STORE + ROUTE:** persist (wide-column — 18.2) + route to recipient's gateway (via registry) + push; offline → queue + push notification + deliver on reconnect; pub-sub bus (9.1).
- **Fan-out** (feed-style): 1:1 route; small group on-write; huge broadcast on-read/hybrid (celebrity — 7.4).
- **Delivery/ordering/dedup** (9.4/9.5/11.5): sent/delivered/read acks; per-conversation ordering (server sequence); client message IDs + dedup → exactly-once effects.
- **Presence** deceptively expensive (high-churn + high-fan-out) → batch/throttle/approximate. **E2E** (15.3): route ciphertext.

---

## 9. Meta-lessons (the point of Part 18)

| Lesson | Applies to |
|---|---|
| Every decision follows from a requirement | LSM (writes — 18.2), TrueTime (global order — 18.3), anycast (latency/DDoS — 18.4), inverted index (search — 18.7) |
| Large systems = compositions of subsystems | video vs control (18.5), geo vs trip/payments (18.6), search vs primary (18.7), connections vs storage (18.8) |
| Split by consistency + latency profile | eventual/in-memory hot paths vs strong/durable cores (18.5/18.6/18.7) |
| Pick the right tool (polyglot — 5.1.3) | AP wide-column vs CP NewSQL (18.2/18.3); search as read model (18.7); log as backbone (18.1) |
| The same patterns recur | fan-out (18.8), scatter-gather (18.7), CDN/edge (18.5), geo-partitioning (18.6), CQRS/CDC (18.5/18.7) |

---

*Pairs with: Part 18 lessons; composes the whole course (Parts 1–17). Leads into Part 19 (apply to interview designs) & Part 20 (integrate into the capstone). All representative — documented lineages, no invented benchmarks.*

# Reference — Scalability & Partitioning Cheat Sheet

Pairs with [Part 7 Scalability] (7.1–7.7). Core idea: **scale by removing coordination; statelessness scales compute, replication scales reads, partitioning scales writes — the database is where load pools.** Do the **cheapest thing that meets the requirement** (1.1.5).

---

## 1. The scaling ladder (cheapest-first — 7.1/7.6)

```
1. Scale UP to a price/performance sweet spot (simple; buys time)
2. Make the service tier STATELESS + behind a load balancer → scale out COMPUTE (7.2)
3. CACHE (Part 6) → offload hot reads
4. READ REPLICAS + read/write splitting (5.4.2) → scale reads
5. CONNECTION POOLER (essential once app tier autoscales — else connection exhaustion)
6. ASYNC QUEUE + workers (Part 9) → offload writes/heavy work off the request path
7. Reduce/batch writes (write-back/coalesce — 6.3/6.7)
8. SHARD (7.3) → scale writes/data — LAST RESORT (hard, hard to reverse)
```
Most systems never reach step 8.

---

## 2. Up vs out (7.1)

| | Vertical (scale-up) | Horizontal (scale-out) |
|---|---|---|
| How | bigger machine | more machines + LB |
| Ceiling | hard (biggest box) | none (add nodes) |
| Availability | SPOF | HA (redundant) |
| Cost | non-linear at top | commodity, linear-ish |
| Complexity | low | needs statelessness + data story |
| Data | local, easy txns | replicate + partition (hard) |

**Statelessness enables scale-out.** Limits: **Amdahl** (serial fraction caps speedup at `1/s`); **USL** (coordination cost ∝ N² → throughput can *decline*). → minimize serial steps + cross-node coordination (shared-nothing).

---

## 3. Statelessness (7.2)

- **Stateless** = no client state in-process between requests; everything from the request + shared external stores → any node serves any request (interchangeable/disposable → elastic, HA, painless deploys).
- **Relocate state:** sessions → shared store (Redis) **or** JWT; conversational → shared store; data → DB; blobs/uploads → **object storage** (never local disk); derived → cache (losable).

| Session approach | Pro | Con |
|---|---|---|
| Sticky (in-node + affinity) | simple | **anti-pattern**: lost on crash, no rebalance, deploys disrupt |
| JWT / signed token | stateless server, effortless scale | hard revocation, size/security limits |
| Shared session store (Redis) | revocable, arbitrary data, stateless tier | per-request lookup; store must be HA/scaled |

Common: **JWT (identity) + shared store (revocation/data)**. Externalization moves the problem — the **shared store must be scaled & HA**. Legitimately-stateful (DB, cache, stream processors, grids): **partition state by key + replicate/checkpoint + sticky-by-key**.

---

## 4. Partitioning strategies (7.3)

| Strategy | Range queries | Distribution | Rebalance | Use |
|---|---|---|---|---|
| **Range** | ✅ efficient | hotspot-prone | dynamic split/merge | time-series, ordered scans |
| **Hash** | ❌ scatter-gather | ✅ even | `mod N` = disaster | even spread, point lookups |
| **Consistent hashing + vnodes** | ❌ | ✅ even | ✅ ~1/N moves | elastic clusters (default) |
| **Directory/lookup** | depends | flexible | ✅ precise | flexible placement; must be HA |

**Partition key = the decision** → hotspots, query locality (queries with the key hit one partition; without it = scatter-gather), txn co-location (avoid distributed txns), re-shard pain. Want high cardinality + even access + aligns with dominant query.
**Secondary indexes:** local (cheap writes / scatter reads) vs global (cheap reads / amplified writes).
**Partition vs replicate:** partition = split (scales writes/volume); replicate = copy (scales reads/HA). Real systems do both: **each shard = a replica set.**

---

## 5. Hotspots & rebalancing (7.4)

- **Data skew** (uneven storage) ≠ **load skew** (uneven traffic) — independent; balancing data ≠ balancing load.
- Patterns: **append** (timestamp/sequential key), **celebrity/hot-key**, **low-cardinality**, **whale tenant**.
- Mitigations: spreading key design · **salt/hash-prefix** (append) · **cache/replicate** read-hot · **split** write-hot · **isolate** whales · **detect** (per-key/partition metrics).
- **Rebalancing rules:** move little data · keep serving · end balanced · don't stampede.
  - **`mod N` = FORBIDDEN.** Use **fixed-many-partitions** (move whole partitions), **dynamic split/merge**, or **consistent hashing**.
  - Throttle + often human-gate; route to old owner until atomic handoff; distinguish **slow vs dead** (avoid rebalance-storm cascade).

---

## 6. Read vs write scaling (7.5)

| | Reads | Writes |
|---|---|---|
| Mechanism | **copy** (cache + replicas) | **split** (sharding) |
| Difficulty | easy, cheap, near-linear | hard |
| Cost | staleness / replication lag | hotspots, cross-shard queries/txns |
| Tools | Part 6 cache → replicas → CQRS read models | reduce writes → vertical → shard → multi-leader/leaderless |

- **Replication lag anomalies** (Part 10): read-your-writes, monotonic reads, consistent prefix → route freshness-critical reads to primary/caught-up replica.
- **Replication mode:** async (fast/lag/possible loss) · sync (no lag/loss, slow, blocks) · **semi-sync** (1 sync replica + rest async — common).
- **Diagnose:** read-bound → cache+replicas; write-bound → shard (replicas won't help); both/volume → shard+replicate. **Misdiagnosis is the classic mistake.**

---

## 7. Multi-tier & the DB bottleneck (7.6)

```
Client → CDN → LB → [stateless app tier] → [cache] → DATABASE → [async queue + workers]
   easy    easy   easy    easy (autoscale)   moderate   HARD        easy
```
- **DB is the usual bottleneck**: stateful (hard to scale), everything funnels to it, writes don't scale by copying.
- **Bottleneck thinking:** throughput = narrowest tier; one binding constraint at a time; scale only the bottleneck; relieving it **moves** it. Find it via **USE** (Utilization/Saturation/Errors).
- **Connection pooler** essential with autoscaling (else connection exhaustion kills the DB regardless of query load).
- **Async queue** offloads writes/heavy work → spike absorption, decoupling, independent worker scaling, better tail latency (cost: eventual/async semantics — Part 9).

---

## 8. Capacity planning & load testing (7.7)

- **Little's Law:** `L = λ·W` (concurrency = throughput × latency) — sizes pools; latency rise eats concurrency.
- **Utilization knee:** latency `∝ 1/(1−ρ)` — flat then explodes; run **below the knee** (~50–70%, more if bursty); plan to **tail (p99)**, not average.
- **Load-test types:** load (SLO at peak) · stress (breaking point + failure mode) · breakpoint (knee/max) · soak (leaks) · spike (flash + autoscale reaction).
- **Valid tests:** realistic workload (incl. **skew/hot keys**), realistic env/data, **cold-cache** scenarios, **percentile** metrics.
- **Plan loop:** SLO → per-unit capacity → forecast peak (growth+seasonality) → units + **headroom (spike + N+1/N+2 failure)** → provision → monitor/re-plan.
- **Static vs autoscaling:** autoscale stateless tiers within min/max + warm pools + pre-scale events; **the DB doesn't autoscale** — provision it for the peak the autoscaled tier generates; **load shedding** (Part 11) as backstop. Autoscaling ≠ a substitute for planning.

---

## 9. Red flags

- Scaling out a **stateful** service (sticky sessions, in-memory carts, local-disk uploads).
- **Premature sharding** before cache/replicas/pooler/async.
- **`hash mod N`** sharding/rebalancing → mass movement / outage.
- **Adding replicas** for a write bottleneck (no effect); **sharding** a read-bound system (needless complexity).
- **Ignoring replication lag** → read-your-writes bugs; stale money from a replica.
- **No connection pooler** with an autoscaling app tier → connection exhaustion.
- **Running tiers near 100% utilization**; planning to the **average** not the peak/failure case.
- **Unrealistic load tests** (uniform traffic, warm cache, tiny data, averages-only).
- **No failure headroom** → one node dies → cascade. **Autoscaling treated as the plan.**

---

*Cross-references: [7.1–7.7], [6.6 Consistent Hashing], [6.7 Hot Keys/Stampede], [Part 6 Caching], [5.4.2 Replicas/Pooling/Failover], [Part 9 Messaging/Queues/CQRS], [Part 10 Replication & Consistency], [Part 11 Load Shedding/Resilience], [Part 13 Autoscaling], [Part 14 SRE/Capacity], [Part 17 Performance/USE/Little's Law].*

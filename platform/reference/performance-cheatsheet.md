# Reference — Performance Engineering Cheat Sheet

Pairs with [Part 17] (17.1–17.6). Core idea: **measure before optimizing, find the bottleneck, target the tail, match concurrency to workload, minimize round-trips, fix the data layer, and optimize efficiency (performance per dollar) — meet the SLO at the lowest cost, never "as fast as possible."**

---

## 1. Methodology (17.1)

```
MEASURE BEFORE YOU OPTIMIZE. The bottleneck is usually NOT where you think. Optimize the binding constraint, re-measure (it moves).
```
- **USE** (per resource): Utilization, Saturation, Errors → infrastructure bottlenecks (which resource, esp. saturation).
- **RED** (per service): Rate, Errors, Duration (percentiles) → service-level performance. **RED = what's wrong; USE = why.**
- **Amdahl's Law:** speeding a part that's fraction p → overall speedup ≤ 1/(1−p). Optimize the DOMINANT fraction only.
- **Goal-directed:** optimize the user-relevant metric (tail latency on the critical path) toward the SLO (14.1); STOP when met.
- Loop: goal → measure (RED+USE+profile+trace) → find bottleneck → estimate payoff (Amdahl) → optimize → re-measure → stop.

---

## 2. Tail latency & fan-out (17.2)

```
Averages LIE (hide the tail). Use PERCENTILES (p50/p99/p99.9). The tail is what users feel.
Fan-out amplification: request waits for all N → P(≥1 slow) = 1−(1−q)^N. 1% tail × 100 ≈ 63% slow requests (tail becomes the median).
```
- **Tail sources:** queueing (near the knee — 7.7), contention (17.3), GC pauses, stragglers/hot shards (7.4), retries (11.3), HoL blocking, cache misses.
- **Mitigations (big two):** REDUCE FAN-OUT (fewer sync deps, local data/CQRS — 12.4) + HEDGED REQUESTS (send to 2, take first — max→min; send hedge after a delay). Plus timeouts, headroom, straggler avoidance, cache warming.
- **Critical path:** the longest dependency chain (analyze via traces — 16.4); optimize the dominant span, parallelize the rest.

---

## 3. Concurrency & parallelism (17.3)

```
Concurrency = deal with many at once (structure; async/event-loop for I/O-bound). Parallelism = do many at once (cores; for CPU-bound).
```
- **Thread-per-request:** simple, but ~MB/thread + context-switch + idle blocked threads → C10K wall.
- **Event loop (async, non-blocking I/O):** few threads multiplex many connections (C10K/C10M); NEVER BLOCK THE LOOP (offload CPU/blocking → thread pool).
- **Match workload:** I/O-bound → async; CPU-bound → parallelism (cores, thread/process pools). Most servers: event loop (I/O) + thread pool (CPU) hybrid.
- **Little's Law:** concurrency = throughput × latency → sizes pools; slow dependency inflates concurrency → exhaustion (11.3).
- **Contention (USL — 7.1):** more threads isn't free; minimize shared mutable state/locks (immutability, message-passing, sharded state).

---

## 4. Reducing latency (17.4)

```
Attack FIXED per-op overhead (round-trips — 8.1.1). Amortize (batch/pipeline) or avoid (reuse/cache/prefetch). Minimize round-trips.
```
- **Batch:** many ops → one (bulk API/query — fixes N+1); pay fixed cost once. Tradeoff: latency-per-item (batching delay).
- **Pipeline:** send many without waiting → overlap round-trips (N RTTs → ~1). HTTP/2, Redis. Needs independent requests.
- **Connection reuse/pooling:** keep-alive + pools avoid repeated handshake/TLS setup; never connect-per-request; size via Little's Law.
- **Prefetch:** fetch before needed → hide latency; tradeoff = wasted work if wrong.
- **Cache (Part 6):** avoid the op entirely (highest leverage); tradeoff = staleness/invalidation.
- Hierarchy: avoid (cache) → fewer/bigger (batch) → overlap (pipeline/parallelize) → no re-setup (reuse) → hide (prefetch).

---

## 5. Data-layer performance (17.5)

```
The DB is usually the bottleneck (7.6) → highest ROI. Small mistakes = huge cost.
```
- **Slow queries:** missing index → full scan; fix via EXPLAIN + right index (4.2.5); avoid non-sargable/SELECT*/over-fetch; don't over-index (RUM — 4.2.4).
- **N+1:** fetch N items → 1+N queries (ORM lazy-load in a loop); fix with eager-load/JOIN/batch (IN ...) → 1–2. Detect via query-count-per-request.
- **Hot partitions (7.4):** skew (celebrity/monotonic key) overloads one shard → defeats sharding; fix via even key + salting/split + cache (6.7) + replicate (7.5).
- **Cost-order relief (7.6):** index/query/N+1 fix → cache (Part 6) → read replicas (7.5) → denormalize/materialized views/CQRS (5.1.2/12.4) → connection pool → shard (last).

---

## 6. Cost/performance & efficiency (17.6)

```
Efficiency = performance PER DOLLAR (cost per request/user/txn). Meet the SLO at MIN cost — not "as fast as possible" (diminishing returns — like 14.1).
```
- **Both-win first:** reduce waste (N+1/round-trips), caching, query tuning → FASTER AND CHEAPER (perf ≠ always more cost).
- **Levers:** right-size (#1 waste = over-provisioning), autoscale + scale-to-zero (13.5), reserved (baseline)/spot (batch)/on-demand (variable) mix (14.6), caching (Part 6), tiered storage + retention (16.2/4.1.3).
- **Hidden costs:** data egress (cross-region — 13.8), over-provisioning, managed-service pricing at scale, storage/log/cardinality growth, idle resources.
- **FinOps:** attribute + monitor/alert + optimize spend (cost as an engineering metric, like SLOs).
- **Build vs buy:** managed = less toil + faster start, more cost/lock-in at scale; build = cheaper at scale + more effort. Managed for undifferentiated, build for core.

---

## 7. One-line recall

| Concept | One line |
|---|---|
| Methodology | Measure first; USE (resource) + RED (service) find the bottleneck; Amdahl-prioritize; optimize to the SLO then stop |
| Tail latency | Averages lie — use percentiles; fan-out amplifies the tail; reduce fan-out + hedge; analyze the critical path |
| Concurrency vs parallelism | Async/event-loop for I/O-bound (never block the loop); parallelism (cores) for CPU-bound; Little's Law sizes pools |
| Reduce latency | Minimize round-trips: cache (avoid) → batch (fewer) → pipeline (overlap) → reuse (no re-setup) → prefetch (hide) |
| Data-layer | DB is usually the bottleneck (highest ROI): indexes/EXPLAIN, fix N+1, hot partitions; cost-order relief |
| Cost/efficiency | Performance per dollar; meet the SLO at min cost, not max speed; both-win first; levers + FinOps + hidden costs |

---

*Pairs with: Part 17 lessons; builds on 1.1.3 (latency/throughput), 7.7 (knee/Little's Law), 7.1 (USL), 7.6 (DB bottleneck), 14.3 (RED/USE/golden signals), 16.4 (traces), 12.3 (fan-out), 4.2.5/5.3.2 (indexing/query opt), Part 6 (caching), 13.5/14.6 (autoscaling/capacity), 1.2.3 (cost). Leads into Parts 18–20.*

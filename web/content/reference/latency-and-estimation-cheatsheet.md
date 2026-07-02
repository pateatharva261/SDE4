# Reference — Latency Numbers & Capacity Estimation Cheat Sheet

A one-page lookup used alongside [1.1.3 Vocabulary of Scale] and [1.1.4 Capacity Estimation]. Numbers are **order-of-magnitude approximations** for back-of-the-envelope reasoning, not benchmarks. Hardware varies; treat all values as *illustrative* and rounded.

---

## 1. "Latency numbers every engineer should know" (order-of-magnitude, illustrative)

These are the classic *relative* magnitudes (popularized by Jeff Dean / Peter Norvig). Exact values depend on hardware; the **ratios** are the point.

| Operation | Approx time | Relative intuition |
|---|---|---|
| L1 cache reference | ~1 ns | baseline |
| Branch mispredict | ~3 ns | |
| L2 cache reference | ~4 ns | ~4× L1 |
| Mutex lock/unlock | ~17 ns | |
| Main memory (RAM) reference | ~100 ns | ~100× L1 |
| Compress 1 KB (fast) | ~2 µs | |
| Send 1 KB over 1 Gbps network | ~10 µs | |
| Read 1 MB sequentially from RAM | ~10–25 µs | |
| SSD random read | ~16–150 µs | ~1000× RAM |
| Read 1 MB sequentially from SSD | ~50–1000 µs | |
| Round trip within same datacenter | ~0.5 ms | |
| Read 1 MB sequentially from disk (HDD) | ~2–20 ms | |
| Disk (HDD) seek | ~3–10 ms | ~100,000× RAM |
| Round trip CA ↔ Netherlands | ~150 ms | speed of light bound |

**The hierarchy to internalize:** CPU cache (ns) ≪ RAM (100 ns) ≪ SSD (µs) ≪ network same-DC (sub-ms) ≪ HDD seek (ms) ≪ cross-continent RTT (100+ ms).

**Key takeaways for design:**
- Memory is ~1000× faster than SSD, which is ~10–100× faster than HDD random I/O → **caching in RAM is the highest-leverage latency optimization** (Part 6).
- **Sequential ≫ random** I/O on disk (orders of magnitude) → log-structured/append-only designs win for write throughput (Part 4: LSM, WAL).
- **Cross-region RTT is physics** (~speed of light): you cannot compute your way under ~tens of ms intercontinental. → put data near users (CDN/edge, geo-partitioning; Parts 3, 13).
- A datacenter round trip (~0.5 ms) is ~5000× a RAM access → **chatty service-to-service calls add up**; batch and co-locate (Part 17).

---

## 2. Time constants for estimation

| Quantity | Exact | Round to |
|---|---|---|
| Seconds per day | 86,400 | **10⁵** |
| Seconds per month (~30.4 d) | ~2,629,000 | **2.5 × 10⁶** |
| Seconds per year | ~31,536,000 | **3 × 10⁷** |

Shortcut: **X per day ÷ 10⁵ ≈ X per second.** (1 M/day ≈ 12/s; 100 M/day ≈ ~1,000/s.)

---

## 3. Data size ladder (decimal, for estimation)

| Unit | Bytes | Mental anchor *(illustrative)* |
|---|---|---|
| 1 char / ASCII | 1 B | — |
| Small JSON record | 0.5–2 KB | a tweet/user row |
| 1 KB | 10³ B | ~1 page of text |
| Thumbnail image | tens of KB | |
| 1 MB | 10⁶ B | small photo / short doc |
| Photo (full) | 1–5 MB | |
| 1 GB | 10⁹ B | ~minutes of HD video |
| 1 TB | 10¹² B | fits on one node; replicas/indexes push higher |
| 1 PB | 10¹⁵ B | many nodes; definitely distributed |

**Bits vs bytes:** network speeds are in **bits/sec** (Gbps); storage in **bytes**. 1 byte = 8 bits. 1 Gbps ≈ 125 MB/s. Always convert explicitly.

---

## 4. Estimation formulas (from Lesson 1.1.4)

```
avg QPS        ≈ (actions per day) / 10^5
peak QPS       ≈ avg QPS × peak_factor          (peak_factor ~2–10, state it)
read QPS       ≈ total QPS × read_fraction
write QPS      ≈ total QPS × write_fraction
storage        ≈ writes/sec × bytes/write × retention_seconds × replication_factor
                 (+ index/metadata overhead, often +10–50%)
egress bw      ≈ read QPS × avg_response_bytes
ingress bw     ≈ write QPS × avg_request_bytes
cache RAM      ≈ hot_fraction × working_set_bytes   (80/20 rule: hot_fraction ~0.2)
nodes needed   ≈ total_resource / per_node_capacity   (storage, QPS, or RAM)
```

**Always finish with:** "…therefore the architecture needs ___."

---

## 5. Throughput rules of thumb (very rough, illustrative)

These vary enormously by hardware, schema, and query; use only to know the *regime*, then measure.

| Component | Rough single-node ceiling *(illustrative)* | Implication when exceeded |
|---|---|---|
| Single relational DB (mixed) | ~thousands–low-tens-of-thousands QPS | add read replicas / cache; then shard |
| In-memory cache (Redis-style), single node | ~100k+ ops/s | distribute via consistent hashing |
| Message log (Kafka-style) per partition | high throughput; scale by adding partitions | partition for parallelism |
| Single NVMe SSD | very high IOPS, GB/s sequential | rarely the first bottleneck |
| 1 Gbps NIC | ~125 MB/s | media workloads saturate fast → CDN |

> Treat these as "is this 1 node or 100 nodes?" signals, **not** as numbers to quote as fact.

---

## 6. Availability → downtime budget (the "nines")

| Availability | Downtime/year | Downtime/month | Downtime/day |
|---|---|---|---|
| 99% | ~3.65 days | ~7.3 h | ~14.4 min |
| 99.9% | ~8.77 h | ~43.8 min | ~1.44 min |
| 99.99% | ~52.6 min | ~4.38 min | ~8.6 s |
| 99.999% | ~5.26 min | ~26.3 s | ~0.86 s |

- Serial dependencies **multiply**: n services each `a` available → ≈ `aⁿ` (worse than any one).
- Redundant parallel paths **add nines back**: two independent components each `a` → ≈ `1 − (1−a)²`.
- Each extra nine ≈ 10× less downtime, ≫10× the cost. (See Part 14: error budgets.)

---

## 7. Queueing / utilization quick intuition (Lesson 1.1.3)

- Little's Law: **L = λ × W** (in-flight = throughput × time-in-system).
- Wait time ∝ **1/(1 − ρ)**; latency explodes as utilization ρ → 100%.
- Target headroom (often ~60–70% utilization `[BP]`, workload-dependent); autoscale before the knee.

---

## 8. Quick decision triggers (estimate → architecture)

| If your estimate shows… | …reach for |
|---|---|
| Read QPS ≫ write QPS | cache + read replicas (Parts 6, 10) |
| Write QPS exceeds one node | sharding; log-structured store (Parts 7, 4) |
| Storage ≫ one node | partitioning; pick a partition key carefully (Part 7) |
| Media/large payloads dominate bandwidth | object storage + CDN (Parts 3, 6, 18) |
| Strict low-latency, global users | edge/CDN, geo-partitioning (Parts 3, 13) |
| Peak ≫ average | autoscaling + load shedding (Parts 13, 11) |
| Strong consistency required | constrains replication; weigh CAP/PACELC (Part 10) |

---

*Cross-references: [1.1.3], [1.1.4], [Part 4 Storage], [Part 6 Caching], [Part 7 Scalability], [Part 14 SRE].*

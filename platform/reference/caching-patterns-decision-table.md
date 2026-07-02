# Reference — Caching Patterns Decision Table

Pairs with [Part 6 Caching] (6.1–6.7). A cache is a **probabilistic bet**: `T_avg = h·T_hit + (1−h)·T_miss`. Design = maximize **hit ratio**, bound **staleness**, and keep the **miss path** safe. Default everything; deviate only with a concrete driver.

---

## 1. Should I cache at all? (6.1)

```
Cache when:  high locality/skew (a hot set repeats) AND T_miss >> T_hit AND reads >> writes-per-item
Don't when:  near-unique requests (no reuse) · source already fast (T_miss ≈ T_hit) · zero-staleness data (naively)
First step:  MEASURE T_hit, T_miss, request volume, plausible hit ratio → do the EV math (1.1.4)
Remember:    origin OFFLOAD (95%→99% cuts origin load 5×) often beats the latency win
```

---

## 2. Where to cache — layer by data class (6.2)

| Data | Layer | Key scope |
|---|---|---|
| Versioned static assets (JS/CSS/img) | Browser + CDN, long/immutable TTL | shared (versioned URL) |
| Public pages / shared responses | CDN / reverse proxy | shared |
| Per-user / personalized responses | browser or per-user key only | **per-user (never shared key)** |
| Sessions, global counters, rate-limit state | **Distributed** cache (shared) | shared, consistent |
| Ultra-hot, read-mostly, staleness-tolerant (config/flags) | **Local L1** (in-process) | per-node (short TTL) |
| Hot pages/rows | DB buffer pool (size it!) | n/a |

**Local vs distributed:** local = ns-fast, per-node, stale-prone, cold-on-restart, N× memory. Distributed = shared/consistent/large/one-invalidation-point, network hop + infra + failure mode. **Near-cache** = L1 local + L2 distributed (best of both; L1 needs short TTL/invalidation).

---

## 3. Read + write pattern selection (6.3)

| Read pattern | Who populates on miss | Use |
|---|---|---|
| **Cache-aside** (lazy) | the application | **default**; resilient to cache outage |
| **Read-through** | the cache (loader) | centralize load logic; simpler app code |

| Write pattern | What happens | Use / caution |
|---|---|---|
| **Write-around** (DB + invalidate) | write source, **delete** cache key | **default** for read-heavy; pairs with cache-aside |
| **Write-through** (sync both) | write source + cache before ack | read-after-write freshness; +latency; +TTL so unread writes don't bloat |
| **Write-back** (cache now, DB later) | ack from cache, async flush | fastest + coalesces; **loses acked writes on crash unless durable/logged** — never for money |

**Production default:** `cache-aside + write-around (delete-on-write) + TTL`.

**Stale-set race (6.3 §3.7):** slow reader writes an old value into cache *after* a writer invalidated → stale until TTL. Fixes: **delete-don't-update**, **TTL backstop**, **versioning/CAS**, **CDC-driven invalidation**. Always write **source-first**, then invalidate.

---

## 4. Eviction + TTL (6.4)

| Workload | Policy |
|---|---|
| General, shifting hot set | **LRU** (sampled) — default |
| Stable, strongly-skewed popularity | **LFU / TinyLFU** (with aging) |
| Scans/batch mixed with hot OLTP | **ARC / SLRU / 2Q / W-TinyLFU** (scan-resistant) |
| Best general hit ratio, tiny metadata | **W-TinyLFU** (Caffeine) |
| OS/DB page replacement | **CLOCK / second-chance** |
| Metadata/contention-sensitive | **Random / sampled** |

- **Bélády/MIN** = optimal (evict furthest-future use) but clairvoyant → only a yardstick.
- **LRU pathology:** scan/sequential flooding evicts the hot set. **LFU pathology:** pollution (no aging) + new-item problem.
- **Real caches approximate** (Redis samples; OS/DB use CLOCK) — near-optimal far cheaper than exact.
- **TTL is a different axis** (freshness, not space). Always set `maxmemory` + a policy. **Always jitter TTLs** (avoid synchronized expiry → stampede).

---

## 5. Invalidation by staleness budget (6.5)

| Staleness tolerated | Strategy |
|---|---|
| Effectively immutable | **Versioned/immutable keys** + very long TTL (nothing to invalidate) |
| Minutes–hours | Longer TTL + invalidate-on-edit |
| Seconds | Short TTL and/or **CDC/outbox-driven** invalidation |
| Zero / near-zero | Write-through or explicit invalidate + short TTL, or read from source (mind replica lag, 5.4.2); handle **read-your-writes** |

**Why it's hard:** no shared transaction (cache↔source), copies in many layers/nodes (browser/CDN unreachable), and which-keys-to-invalidate (dependency graph). **Always keep a TTL backstop.** Fan-out: direct keys · **tags** · **generation/namespace versioning** (O(1) mass invalidation) · **CDC/outbox** (reliable, ordered, at scale). Layer reachability: distributed = one place; local = short TTL or pub/sub broadcast; CDN = purge/version; **browser = can't recall**.

---

## 6. Distributed tier: Memcached vs Redis (6.6)

| | Memcached | Redis |
|---|---|---|
| Model | volatile blobs, multithreaded | data structures, single-threaded core |
| Persistence | none | RDB (snapshot) / AOF (write log) |
| HA / cluster | client sharding only | Sentinel / Redis Cluster (16384 slots) + replicas + failover |
| Pick when | pure simple cache | structures/atomic ops/persistence/HA (most cases) |

- **Shard with consistent hashing (+ virtual nodes), never `hash mod N`** (modulo remaps ~all keys → miss storm). Only ~1/N keys move on a topology change.
- **Persistence ≠ durability:** RDB loses since last snapshot; AOF `everysec` ≈ ≤1s loss. A cache stays **losable** — never the system of record. Use persistence for **warm restarts**.
- **Async replication** → small failover loss window + replica staleness. Cache usually favors **availability** (PACELC, Part 10).
- **Redis single-threaded:** avoid O(N)/blocking commands (`KEYS *`, huge ranges) — use `SCAN`.

---

## 7. Miss-path safety — stampede / hotspots (6.7)

| Failure | Trigger | Mitigation |
|---|---|---|
| **Stampede / dog-pile** | hot key expires → N concurrent recomputes | **single-flight/coalescing**, **per-key lock (TTL + bounded wait)**, **serve-stale** |
| **Synchronized mass expiry** | identical TTLs | **TTL jitter** |
| **Hot key on one shard** | one ultra-popular key | **local L1**, **replicate key**, **split key**; detect it |
| **Cold-start** | restart/deploy/flush → empty cache | **warm** (preload / persistence restart), gradual ramp, **stagger** restarts |
| **Hot key under load** | expensive recompute | **probabilistic early recompute (XFetch)** — refresh before expiry |
| **Runaway / metastable** | overloaded source → wider miss window → more pile-on | **source-side**: concurrency limits/**backpressure**, **load shedding**, **circuit breaker**, **jittered-backoff retries** (Part 11) |

**Layered default:** jitter every TTL · serve-stale + single-flight on hot keys · early recompute for hottest · local-L1/replicate/split hot keys · warm on deploy · source-side backpressure/shed/breaker. **Engineer the miss path as carefully as the hit path** — and always have a **stampede-protected degradation path** for a full cache-tier outage.

---

## 8. Red flags

- Adding a cache **without measuring** (no baseline, no hit-ratio target) — cargo-cult.
- Storing the **only copy** of data in a cache (it's losable).
- **Update-on-write** instead of delete; **no TTL backstop** → permanent staleness from races.
- **`hash mod N`** sharding → miss storm on scaling.
- **No `maxmemory`/eviction policy** → OOM / write-rejection.
- **Identical TTLs** → synchronized-expiry stampede.
- **No coalescing/serve-stale on hot keys**; **no cache warming** on deploy.
- **Cache-tier outage with no stampede-protected fallback** → DB meltdown.
- **Caching personalized data under a shared key** → cross-user leak.
- **Ignoring read-your-writes** on user-visible updates.

---

*Cross-references: [6.1 Why Caching], [6.2 Topologies], [6.3 Patterns], [6.4 Eviction], [6.5 Invalidation], [6.6 Redis/Memcached], [6.7 Stampede], [3.3.3 CDNs], [5.4.2 Replicas/Failover], [Part 7 Scalability — consistent hashing/hotspots], [Part 10 Consistency], [Part 11 Resilience].*

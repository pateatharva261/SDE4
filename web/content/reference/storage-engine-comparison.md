# Reference — Storage Engine & Indexing Cheat Sheet (B-Tree vs LSM)

Pairs with [Part 4 Storage] — especially [4.2.1–4.2.4 engines] and [4.2.5 indexing]. Directional guidance, not law (1.1.5): a well-tuned "lower-fit" engine can beat a poorly-tuned "best-fit" one.

---

## 1. The hardware facts that drive everything (4.1)

- **Hierarchy (latency, illustrative):** registers/cache (ns) → RAM ~100 ns (volatile) → NVMe/SSD (µs) → HDD ~ms (seek+rotation) → network (sub-ms in-DC → 10s–100s ms cross-region). Each step ≈ 10×–1000×.
- **Sequential ≫ random** on every medium (HDD: seek+rotation; SSD: write amplification; RAM: cache lines).
- **`write()` ≠ durable** — lands in the **page cache** (RAM); only **fsync** to stable media is durable (and it's slow).
- **Universal levers:** sequentialize access, batch small→large, exploit locality (temporal=cache, spatial=blocks), keep hot working set in RAM.

---

## 2. B-Tree vs LSM at a glance (4.2.4)

| Factor | **B-Tree** (page-oriented, in-place) | **LSM-Tree** (log-structured, append-only) |
|---|---|---|
| Writes | random in-place + WAL | sequential (memtable→SSTable) + compaction |
| Write throughput | good | **high** |
| Write amplification | WAL + page (~2×) + splits | foreground low; **compaction adds background WA** |
| Point reads | **fast, predictable** O(log n) | usually fast (bloom filters); less predictable |
| Read amplification | low | **higher** (multiple SSTables) |
| Range scans | **excellent** (sorted linked leaves) | OK (merge across SSTables + tombstones) |
| Space | fragmentation/fill-factor | versions+tombstones until compaction; temp 2× |
| Latency predictability | **stable** | jittery (compaction competes) |
| SSD-friendliness | more random writes/wear | **friendlier** (sequential) |
| Transactions/maturity | **mature ACID** | improving |
| **Best for** | read-heavy / transactional / mixed OLTP | write-heavy / high-ingest (time-series, logs, events) |

**RUM tradeoff:** you can't minimize **Read-amp ↔ Write-amp ↔ Space-amp** all at once — pick a point; tune within it.

---

## 3. Workload → engine (4.2.4)

| Dominant trait | Engine |
|---|---|
| Very high write/ingest (time-series, metrics, logs, events, IoT) | **LSM** |
| Read-heavy / complex queries / transactions / latency-SLA | **B-Tree** |
| Range scans / ordered iteration central | B-Tree edge |
| Strong multi-key ACID | B-Tree (relational) |
| SSD wear / write cost / compression dominant | LSM |
| Predictable tail latency (no compaction jitter) | B-Tree |
| General / unsure | **B-Tree relational default**; switch when write-bound |

> Remember **pluggable/polyglot**: InnoDB (B-tree) vs MyRocks (LSM); or split workloads across different DBs.

---

## 4. LSM compaction strategies (4.2.3)

| Strategy | Optimizes | Costs |
|---|---|---|
| **Size-tiered (STCS)** | write amplification (write-heavy) | higher read + space amplification; temp 2× space |
| **Leveled (LCS)** | read + space amplification | higher write amplification |
| **Time-windowed** | time-series (TTL/expiry) | niche to time-ordered data |

**LSM read helpers:** bloom filters (skip SSTables, no false negatives — huge for not-found), sparse/block index, block cache. **Watch:** compaction backlog, tombstone/range-scan cost, latency spikes.

---

## 5. Durability (4.1.2)

- **WAL + group commit:** append change to a sequential log + fsync (batched) → durable fast; apply random data pages later.
- **Durability knob:** sync-per-commit (safe, slow) ↔ group commit ↔ periodic flush (fast, crash-loss window = RPO, Part 11).
- **fsync foot-guns:** device write caches, must fsync directory for new files, mishandled fsync errors (fsync-gate).

---

## 6. Indexing quick rules (4.2.5)

- **An index trades write cost + space for read speed** — index for queries you actually run; drop unused/redundant.
- **Clustered** = rows stored in index order (1 per table, direct read; clustered-key choice drives locality + insert hotspots). **Non-clustered/secondary** = pointer to row (extra fetch hop).
- **Composite:** sorted left-to-right → serves **leftmost-prefix**; order **equality columns first, then range/sort**.
- **Covering** (all needed columns) → **index-only scan**, no row fetch (great for hot queries).
- **Partial/filtered** → index only a row subset (smaller/cheaper).
- **Planner uses an index only if:** matches predicate/sort, **sargable** (no functions/casts/leading wildcards), **selective enough**, and **stats are fresh**.
- **Pitfalls:** missing index (full scan), over-indexing (write/space tax), wrong composite order, non-sargable predicates, low-selectivity indexes, clustered/monotonic insert hotspots.

---

## 7. Storage substrate (4.1.3, 4.3.2)

| Type | Interface | In-place edit | Best for |
|---|---|---|---|
| **Block** | raw blocks (virtual disk) | yes | DBs, VM disks (low latency, random I/O) |
| **File** | POSIX hierarchy (NAS) | yes | shared file access across hosts |
| **Object** | key→blob+metadata over HTTP | **no** (replace whole) | media, backups, logs, data lake, static assets |

**Object storage rules:** blobs in object storage + **reference in DB**; front hot reads with a **CDN** (3.3.3); multipart upload + range reads for big objects; **lifecycle tiering** hot→IA→archive + expire (cost); know consistency (strong read-after-write today; cross-region async). Durability via **replication** (N×) or **erasure coding** (k+m, ~1.4×).

---

## 8. Schema evolution rules (4.3.1)

- Need **backward** (new code reads old data) **AND forward** (old code reads new data) compatibility (rolling deploys, long-lived logs).
- **Additive & optional:** add new fields with defaults; **never** remove/rename/repurpose required fields or reuse identifiers.
- **Protobuf/Thrift:** never reuse/renumber **tags**; reserve retired tags; readers skip unknown tags.
- **Avro:** writer+reader schema resolution via a **registry** with a **compatibility mode** (backward/forward/full).
- **JSON:** tolerant readers (ignore unknown fields); version (`/v2`) for breaking changes.
- **DB migrations:** **expand-and-contract** (add nullable → backfill → switch → drop later); enforce compatibility in **CI** (fitness function, 2.3.3).

---

## 9. Red flags

- Choosing an engine by buzzword instead of **workload profile** (read/write ratio, ingest, latency-SLA, space/cost).
- Running an **OLTP database on object storage**, or storing **large blobs in the database**.
- Believing **`write()` is durable**; per-commit fsync as a bottleneck (no group commit).
- **Over-indexing** a write-heavy table; non-sargable predicates silently disabling indexes.
- **Ignoring LSM compaction** capacity/monitoring; **no lifecycle policies** on object storage (cost blowup).
- **Breaking schema** (required new field, reused Protobuf tag, one-step destructive migration).

---

*Cross-references: [4.1.1–4.3.2], [Part 5 Databases], [Part 6 Caching], [Part 7 Scalability], [Part 9 Messaging], [Part 10 Consistency], [Part 11 Fault Tolerance], [reference/latency-and-estimation-cheatsheet], [reference/tradeoff-worksheet].*

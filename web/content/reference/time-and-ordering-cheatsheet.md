# Reference — Time & Ordering Cheat Sheet

Pairs with [Part 8 Module 8.1–8.2] (8.1.2, 8.2.1–8.2.4). Core idea: **don't trust physical clocks for ordering; capture causality with logical clocks; impose a total order only where you must (it costs coordination).**

---

## 1. Clocks (8.1.2)

| | Wall-clock (time-of-day) | Monotonic |
|---|---|---|
| Means | real calendar time | elapsed time (arbitrary zero) |
| NTP-synced? | yes — can **jump fwd/back**, slew | no — only ever moves forward |
| Use for | timestamps (created_at, logs, TTLs) | **durations, timeouts, backoff, benchmarks** |
| Never for | measuring durations | cross-machine comparison / real time |

- **Drift:** quartz clocks ~tens of ppm → seconds/day apart. **NTP:** approximate (ms-to-worse), can step.
- **Clock skew:** unknown difference between nodes' clocks → **can't order cross-node events by timestamp**.
- **Wall-clock LWW silently loses data:** a fast-clock node's earlier write gets a larger timestamp → discards the truly-later write. Use only for loss-tolerant data.
- **Rule:** monotonic for durations, wall-clock for timestamps; never use physical time for cross-node ordering / locks-leases / "is newer?" correctness (use logical/monotonic — fencing 8.3.6).

---

## 2. Logical clocks — Lamport (8.2.1)

```
Rules: increment on each event; attach counter on send; on receive C = max(C, t)+1
Guarantee (clock condition): if A → B then LT(A) < LT(B)   (cause < effect)
Limitation: converse FALSE — LT(A) < LT(B) does NOT imply A→B (can't detect concurrency)
Total order: sort by (LT, node_id)  — consistent with causality
```
**Use for:** imposing *an* order respecting causality (cheap, 1 integer). **Can't:** detect concurrency/conflicts.

---

## 3. Vector clocks (8.2.2)

```
Vector of counters, one per node. Increment own entry on events; attach whole vector on send;
on receive element-wise max then increment own entry.
Compare:  A ≤ B (≠) → A→B;  B ≤ A → B→A;  equal → same;  NEITHER dominates → CONCURRENT (A∥B)
Exact: A→B iff VC(A) < VC(B)  (captures full happens-before)
```
- **Version vectors** = vector clocks on replica data → **detect conflicting (concurrent) writes** → keep **siblings** to merge (or CRDT) — no silent LWW loss.
- **Cost:** O(N) size, grows with membership → track replicas not clients, prune, dotted version vectors (DVV).
- **Detects** concurrency; does **not resolve** (app/CRDT) or **agree** (consensus).

---

## 4. Happens-before & order types (8.2.3)

- **Happens-before (→)** is a **partial order**: causally-related events ordered; **concurrent events incomparable** (genuinely unordered).
- **Total order** = every pair comparable → requires **coordination** (tie-break / sequencer / **consensus**).
- **Total-order (atomic) broadcast = consensus** → that's why a single agreed order is expensive (basis of state-machine replication).
- **Ordering ↔ consistency:** eventual (≈none) → **causal** (partial, no consensus, available) → **sequential/linearizable** (total, needs consensus).
- **Rule:** use the **weakest correct order**; confine total order/consensus to a small core (ledger/leader/metadata).

---

## 5. HLC & TrueTime (8.2.4)

| | HLC | TrueTime (Spanner) |
|---|---|---|
| What | physical component + logical counter | clock returns interval `[earliest, latest]`, uncertainty ε |
| Guarantee | causal order + near-real-time, monotonic | **external consistency** (real-time-respecting total order) |
| Hardware | none (any NTP) | GPS + atomic clocks (tight sync) |
| Cost | negligible | **commit-wait ≈ ε** per txn (shrink ε with hardware) |
| Used by | CockroachDB, YugabyteDB, MongoDB | Google Spanner |

- **Commit-wait:** assign ts = latest, wait until earliest > ts → later txns get greater ts → external consistency.
- Both **order/timestamp**; still need **consensus** (Paxos/Raft) for agreement/durability.

---

## 6. Choosing a mechanism

| Need | Use |
|---|---|
| *An* order respecting causality (cheap) | Lamport timestamps (8.2.1) |
| **Detect** causality vs concurrency / conflicts | Vector / version vectors (8.2.2) |
| Auto-merge concurrent updates | CRDTs (Part 10; use version vectors internally) |
| Causal order without consensus | causal broadcast (vector clocks) |
| Single agreed total order | consensus / total-order broadcast (8.3) |
| Near-real-time + causal correctness, no hardware | HLC (8.2.4) |
| External consistency for global txns | TrueTime + commit-wait (8.2.4) |
| Measure elapsed time / timeouts | monotonic clock (8.1.2) |

---

## 7. Red flags

- Measuring durations with wall-clock time (breaks on NTP step).
- Ordering cross-node events / "is newer?" by wall-clock timestamps.
- **Wall-clock last-write-wins** for data you can't lose (silent loss).
- Time-based locks/leases for exclusivity (skew → two holders; use fencing — 8.3.6).
- Using Lamport timestamps to **detect concurrency** (they can't — use vector clocks).
- Vector clocks tracking **clients** (explosion) instead of replicas.
- Forcing a **total order** (consensus) where **causal** suffices (needless coordination cost / lower availability).
- Treating logical-clock values as real time.
- Not monitoring clock offset (a skewed node silently corrupts ordering/data).

---

*Cross-references: [8.1.2 Clocks], [8.2.1 Lamport], [8.2.2 Vector Clocks], [8.2.3 Total vs Partial Order], [8.2.4 HLC/TrueTime], [8.3.6 Fencing], [Part 10 Consistency/LWW/CRDTs], [5.2.4 MVCC], [6.5 cache LWW].*

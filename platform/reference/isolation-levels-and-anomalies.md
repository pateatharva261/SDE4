# Reference — Isolation Levels, Anomalies & Concurrency Control Cheat Sheet

Pairs with [Part 5 Module 5.2] (5.2.1–5.2.5). Directional guidance; **verify your database's actual semantics** (vendor names differ).

---

## 1. ACID in one line each (5.2.1)

| Property | Guarantee | Mechanism |
|---|---|---|
| **Atomicity** | all-or-nothing (rollback on failure) | WAL undo (5.3.1); enables safe retry |
| **Consistency** | invariants preserved (valid→valid) | **declared constraints + app logic** (emerges from A+I+D) |
| **Isolation** | concurrent txns ≈ serial | concurrency control (2PL/MVCC/OCC/SSI); **levels** |
| **Durability** | committed survives crash | WAL + fsync (+ replication) |

> ACID's **C ≠ CAP's C**. **Isolation is weaker than serializable by default.**

---

## 2. Isolation levels → anomalies (5.2.2 / 5.2.3)

| Level | Dirty read | Non-repeatable read | Phantom | Lost update | Write skew |
|---|---|---|---|---|---|
| **Read Uncommitted** | ❌ allowed | ❌ | ❌ | ❌ | ❌ |
| **Read Committed** *(common default)* | ✅ prevented | ❌ | ❌ | ❌ | ❌ |
| **Repeatable Read / Snapshot** | ✅ | ✅ | ~ (often prevented) | ~ (often detected) | ❌ **allowed** |
| **Serializable** | ✅ | ✅ | ✅ | ✅ | ✅ |

✅ = prevented · ❌ = allowed · ~ = implementation-dependent.
**Key gaps:** defaults allow **lost update**; **Snapshot Isolation allows write skew**.

---

## 3. Anomalies defined (5.2.3)

| Anomaly | What happens | Fix |
|---|---|---|
| **Dirty read** | read uncommitted data (may roll back) | Read Committed+ |
| **Non-repeatable read** | same row, different value on reread | Repeatable Read/Snapshot+ |
| **Phantom** | range query returns different rows | Serializable (or RR/SI) |
| **Lost update** | concurrent read-modify-write clobbers one | atomic update / FOR UPDATE / optimistic CAS / serializable |
| **Write skew** | disjoint writes jointly break a cross-row invariant | Serializable (SSI) / lock invariant rows / constraint |

---

## 4. Concurrency control mechanisms (5.2.4)

| Mechanism | Readers block writers? | Implements | Conflict handling |
|---|---|---|---|
| **Strict 2PL** | **yes** | up to Serializable | wait; deadlock → abort victim |
| **MVCC (snapshot)** | **no** | Snapshot/RR/RC | writer-writer conflict; allows write skew; needs version GC (VACUUM) |
| **Optimistic (OCC)** | no | various | validate at commit (version/CAS) → abort+retry |
| **SSI** | no (MVCC + dependency tracking) | **true Serializable** | detect r-w cycle → abort → retry; prevents write skew |

**Pessimistic** (lock first) → high contention. **Optimistic** (proceed + validate) → low contention.

---

## 5. Fixing contended writes — pick by contention

| Situation | Approach |
|---|---|
| Counter/balance increment | **Atomic update** `SET v = v + ?` (no read-modify-write) |
| Low-contention update | **Optimistic** version/CAS (`WHERE version = ?`) → retry on conflict |
| High-contention hotspot | **Pessimistic** `SELECT ... FOR UPDATE` |
| Cross-row invariant (write skew) | **Serializable (SSI)** or lock the invariant rows |
| "No duplicates" | **Unique constraint/index** (cheap, DB-enforced) |
| Extreme write hotspot | **Reduce contention by design** (sharded counters, single-writer — Part 7/9) |

---

## 6. Deadlocks (5.2.5)

- **Definition:** cycle of transactions each waiting on a lock the other holds.
- **Coffman conditions (need all 4):** mutual exclusion, hold-and-wait, no preemption, **circular wait**.
- **DB handling:** **detect** (wait-for graph) → abort victim → **app must retry**; or timeouts; or **prevent** via lock ordering.
- **Deadlock ≠ livelock ≠ starvation ≠ contention:** stuck-forever vs busy-no-progress (backoff) vs perpetually-denied (fairness) vs waiting-on-hot-locks (slow).
- **Avoid:** consistent lock ordering, short transactions, right granularity, lowest correct isolation, MVCC/optimistic where low contention, reduce hot rows.
- **Retry** deadlock aborts with **exponential backoff + jitter** (avoid livelock).

---

## 7. Defaults & vendor caveats

- Postgres/Oracle/SQL Server default **Read Committed**; MySQL/InnoDB default **Repeatable Read** (MVCC snapshot).
- "Repeatable Read" often = **Snapshot Isolation** (→ write skew possible). **Names differ across vendors — verify.**
- Postgres `SERIALIZABLE` = **SSI** (optimistic, aborts → retry). MySQL/InnoDB uses next-key locks.

---

## 8. Red flags

- "We use transactions, so concurrency is handled" — **defaults allow lost update & write skew**.
- App-side **read-modify-write** on contended data (lost update) — use atomic/optimistic/lock.
- **Snapshot isolation** assumed to prevent **write skew** (it doesn't).
- **Blanket Serializable** everywhere (contention/aborts) — use targeted fixes.
- **No retry** logic for SSI/optimistic/deadlock aborts.
- **Inconsistent lock ordering** / long transactions → deadlocks + MVCC bloat.

---

*Cross-references: [5.2.1–5.2.5], [5.3.1 WAL/recovery], [Part 10 Consistency] (serializability vs linearizability), [Part 11] (retry/idempotency), [Part 17] (contention), [Part 7] (reduce contention by partitioning).*

# Reference — Consensus & Quorums Cheat Sheet

Pairs with [Part 8 Module 8.3] (8.3.1–8.3.8) and [8.4.1]. Core idea: **agreement despite failures comes from overlapping quorums + a leader; you can have safety always but only liveness when the network behaves (FLP).**

---

## 1. The consensus problem (8.3.1)

```
Agreement  : no two correct nodes decide differently   ┐
Validity   : decided value was actually proposed        │ SAFETY (always hold)
Integrity  : decide at most once                         ┘
Termination: every correct node eventually decides      ← LIVENESS (FLP: can't guarantee under async)
```
**Reduces to consensus:** leader election, total-order broadcast, replicated state machines, distributed locks, atomic commit, membership.

**FLP:** in a fully asynchronous system, no deterministic algorithm can *guarantee* termination with even one crash (because slow vs dead is undecidable — 8.1.3). **Circumvent** via partial synchrony (timeouts) + randomization → **safe always, live when the network behaves.**

---

## 2. Quorums (8.3.4)

- **Quorum** = minimum nodes to participate; sized so **any two quorums overlap in ≥1 node** (the linchpin).
- **Majority** = `⌊N/2⌋+1` → two majorities can't be disjoint → **no split-brain** (no two leaders / two chosen values).
- **Fault tolerance:** `N = 2f+1` tolerates `f` crashes (3→1, 5→2, 7→3). **Use odd N** (even adds no tolerance + split-tie risk).
- **Dynamo R+W>N** (leaderless, Part 10): `W` ack writes, `R` respond to reads; `R+W>N` → read/write quorums overlap → read sees latest write.
  - `W=N,R=1` (consistent slow writes / fast reads) · `R=W=majority` (balanced) · `R+W≤N` (eventual, stale reads possible).
- **Quorum ≠ linearizability** — concurrent/partial writes need versioning (vector clocks), read-repair; sloppy quorums + hinted handoff weaken it for availability.
- **Byzantine quorums (8.3.7):** `3f+1` nodes, quorum `2f+1` → overlap of ≥1 **honest** node.

---

## 3. Paxos (8.3.2) vs Raft (8.3.3)

| | Paxos | Raft |
|---|---|---|
| Roles | proposer / acceptor / learner | leader / follower / candidate |
| Single value | Phase 1 Prepare/Promise + Phase 2 Accept | (leader appends + replicates) |
| Key safety rule | adopt highest prior accepted value | up-to-date voting restriction |
| Why safe | quorum overlap → once chosen, always chosen | quorum overlap → Leader Completeness |
| Sequence of values | Multi-Paxos (stable leader, 1 RT/entry) | log replication (commit on majority) |
| Reputation | hard to implement correctly | designed for understandability (de facto standard) |
| Used by | Chubby, Spanner | etcd, Consul, CockroachDB, TiKV; MongoDB-like |

**Raft essentials:** terms (leadership clock) · randomized election timeouts (avoid split-vote livelock) · entry committed when on a majority · committed entries never lost (Leader Completeness). **Both:** safe always; may stall without a quorum (FLP/CAP).

---

## 4. Leader election & membership (8.3.5)

- **Safe election = quorum/consensus** → at most one leader; only the majority side elects during a partition. **Naive election → split brain.**
- **Fencing (8.3.6):** elected leader carries a monotonic epoch/term; downstream rejects stale leaders (election alone doesn't stop a deposed-but-alive leader).
- **Failure detection** (suspect a node down — 8.1.3, phi-accrual) ≠ **membership** (agreed live set).
- **Membership:** **strong/consensus** (exact, safety-critical roles, small scale) vs **gossip/SWIM eventual** (huge scale, routing). Often **hybrid** (small consensus core + gossiped fleet).
- **Gossip:** exchange with a few random peers → O(log N) spread, O(1)/node, robust, eventually consistent. **SWIM:** direct + **indirect probing** + suspicion → O(1)/node failure detection, low false positives.

---

## 5. Distributed locks (8.3.6)

```
Local mutex ≠ distributed lock. Holder can crash → locks must be LEASES (TTL + renew).
But: holder can PAUSE (GC) past the lease → re-granted → wakes & acts → TWO HOLDERS → corruption.
No timeout fixes this (undecidable). FIX = FENCING TOKENS:
  - monotonic number per grant; client sends it on every write;
  - the PROTECTED RESOURCE rejects lower (stale) tokens.
```
- **Efficiency lock** (collision = wasted work) → simple lease OK. **Correctness lock** (collision = corruption) → consensus-backed + **fencing required**.
- **Redlock-without-fencing is unsafe for correctness** (clever granting ≠ safety).
- **Prefer to avoid locks:** idempotency (Part 11), single-writer-per-partition (7.3), optimistic concurrency/CAS (5.2.4).

---

## 6. Byzantine / BFT (8.3.7)

- **Crash fault** (silent, never wrong → Paxos/Raft, 2f+1) vs **Byzantine** (lies, equivocates → BFT, **3f+1**).
- **PBFT:** leader-based multi-round (pre-prepare/prepare/commit), O(N²) messages, cross-check detects equivocation, client awaits `f+1` matching replies.
- **Blockchain:** open/permissionless + Sybil resistance — **PoW** (compute cost, >50% honest hash power, probabilistic finality) or **PoS** (stake, slashing).
- **Use BFT only for untrusted/adversarial participants** (blockchains, consortia, compromise-resistant cores). **Internal systems → crash consensus + security.**

---

## 7. Coordination services (8.3.8)

- **What:** packaged consensus (ZooKeeper=ZAB, etcd=Raft, Consul=Raft+gossip) → leader election, locks, membership, config, discovery.
- **Primitives:** ZK ephemeral (auto-delete on session death) / sequential (ordering + fencing) / watches; etcd leases / MVCC revisions / watches / CAS.
- **CP under partition** — majority serves, minority refuses (prefer no leader over two).
- **NOT a datastore** — small (KB) read-heavy critical metadata only; misuse (bulk/high-write/queue) → overload → system-wide coordination loss.
- **Rule:** don't build your own consensus; run odd ensemble (3/5) across AZs; fence locks; handle CP-unavailability.

---

## 8. RPC delivery semantics (8.4.1)

```
At-most-once : 0 or 1 (don't retry; may lose)
At-least-once: 1+ (retry until acked; may DUPLICATE) ← common default
Exactly-once : ideal — exactly-once DELIVERY is IMPOSSIBLE
   → achieve exactly-once EFFECTS = at-least-once delivery + IDEMPOTENCY/dedup
```
- Timed-out call = **ambiguous outcome** (request lost / crashed before/after / response lost / slow).
- **Idempotency keys:** unique ID per op; server records + returns prior result on duplicates → safe retries.
- Prefer **state-based** (`set X`) over **delta-based** (`add N`) operations.

---

## 9. Decision cheats

- **Need one agreed order / one winner / durable agreement?** → consensus (Raft via etcd/ZooKeeper).
- **Only causal order needed?** → vector clocks / causal broadcast (no consensus; more available — 8.2.3).
- **Exclusive access?** → idempotency / single-writer / OCC first; else fenced consensus-backed lock.
- **Untrusted participants?** → BFT (3f+1); else crash consensus (2f+1).
- **Membership:** safety-critical → consensus; large-fleet routing → gossip/SWIM.
- **Cluster size:** odd (3 or 5); 5 to tolerate 2 failures / survive maintenance.

---

## 10. Red flags

- Rolling your own consensus / leader election (split-brain bugs).
- Naive (non-quorum) election; election **without fencing**.
- Leased locks **without fencing** for correctness; trusting client's belief it holds the lock.
- Retrying non-idempotent operations; believing in "exactly-once delivery."
- Even-sized clusters; quorum members in one AZ.
- Expecting consensus to never stall (it correctly stalls without a quorum — FLP/CAP).
- Using a coordination service as a database/cache/queue.
- BFT for trusted internal systems (overkill); crash consensus where nodes can be malicious (unsafe).
- Wall-clock time for ordering/leases/fencing (use logical/monotonic — 8.1.2).

---

*Cross-references: [8.3.1–8.3.8], [8.4.1], [8.1.1 partitions], [8.1.3 failure detection], [8.2.2 vector clocks], [8.2.3 total vs partial order], [Part 10 CAP/PACELC/consistency], [Part 11 idempotency/resilience], [Part 9 delivery semantics].*

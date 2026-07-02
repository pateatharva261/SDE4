# Reference — Resilience & Fault-Tolerance Patterns Cheat Sheet

Pairs with [Part 11] (11.1–11.8). Core idea: **failure is the steady state — break the fault→failure chain, make recovery safe (idempotency), degrade don't collapse, avoid distributed transactions, and test DR. Optimize MTTR over fault-freedom.**

---

## 1. Failure models & mindset (11.1)

```
fault (defect) → error (bad state) → failure (user-visible). Fault tolerance = BREAK the chain.
availability ≈ MTBF / (MTBF + MTTR) → optimize MTTR (recover fast); you can't prevent all faults.
```
- **Models (mild→harsh):** crash-stop, crash-recovery, omission, timing (gray failure — worse than crash), Byzantine (→ BFT, 3f+1). Assume the mildest realistic (usually crash+omission+timing).
- **Fallacies** = false assumptions (network reliable, latency zero, …) → design-review checklist.
- **Independent failures** → redundancy handles. **Correlated failures** (shared AZ/dependency/deploy/retry storm) → defeat redundancy → **most big outages** → spread across failure domains.

---

## 2. Redundancy & failover (11.2)

| | Active-active | Active-passive |
|---|---|---|
| Serving | all serve; failure reroutes (no gap) | one active + standby; failure = failover (gap) |
| Needs | N+ headroom | fast, correct failover |

- **N+1/N+2 with HEADROOM** — survivors stay below the knee (7.7); redundancy without headroom = delayed cascade.
- **Failover correctness:** quorum-gated (8.3.5) + **fencing tokens** (8.3.6, prevent split-brain) + promote **caught-up** replica (minimize RPO — 10.2). Slow-vs-dead (8.1.3) → strong evidence before failover.
- **Hunt hidden SPOFs** (LB, failover coordinator, shared dependency, network, power); spread across racks/AZs/regions; **test failover**.

---

## 3. Resilience patterns (11.3)

```
Cascade: slow dep → callers wait (hold threads, L=λ·W) → pool exhausts → caller down → propagates → metastable outage
```
- **Timeout** — bound the wait (monotonic/adaptive/deadline-propagated); foundation; no unbounded resource-holding.
- **Retry** — exponential backoff + JITTER + caps + budgets; only retriable errors; **only if idempotent**. Naive retries → retry storm.
- **Circuit breaker** — closed→open→half-open; **fail fast** when open (stop hammering) → dep recovers, caller stays healthy → breaks metastable loop; pair with fallback.
- **Bulkhead** — per-dependency bounded pools/limits → one slow dep exhausts only its pool → contain blast radius.
- **Compose** all + idempotency + fallback → one dep's failure = degraded feature. Service mesh (Envoy/Istio) provides these transparently.

---

## 4. Graceful degradation & load shedding (11.4)

- **Degrade, don't collapse** — fallbacks (cached/default/partial/stale-if-error), disable non-critical features, reduced fidelity, read-only mode.
- **Classify criticality** — protect the core (minimal hard deps, bulkheads, priority); non-critical degrades independently; turn hard deps soft.
- **Load shedding** — reject/drop excess under overload → stay below the knee (7.7); serving a subset well beats everything badly. Prioritized (shed non-critical/expensive first) + adaptive. Distinct from backpressure (slow producer — 3.3.4), combine.
- **Fail-fast** (fail immediately/visibly — free resources, prevent cascade) vs **fail-safe/soft** (fail into safe default / degraded state).
- **Fail-open vs fail-closed** — security/critical **fail-closed** (deny); non-critical availability may **fail-open**. Deliberate, critical choice.

---

## 5. Idempotency (11.5) — makes recovery safe

```
Ambiguous timeout → must retry → safe ONLY if idempotent. at-least-once + idempotency = EXACTLY-ONCE EFFECTS.
```
- Idempotent: set/PUT/DELETE, "mark SHIPPED". NOT: `+= x`, "create order", "charge card", POST.
- **Techniques:** natural (state-based, not delta-based), conditional writes/upsert/CAS (5.2.4), idempotency keys + dedup store (bounded TTL).
- **Exactly-once DELIVERY impossible; effects achievable** (8.4.1/9.4). **End-to-end:** every hop idempotent; in-system EOS (Kafka) doesn't cover external side effects → idempotency at each external boundary (keys/outbox — 9.8).
- Mantra: **assume at-least-once → assume duplicates → make every effect idempotent.**

---

## 6. Distributed transactions — 2PC (11.6)

```
2PC: Phase 1 Prepare (vote YES/NO, prepared = hold locks + promise); Phase 2 Commit/Abort (all YES → commit).
```
- **Blocking problem:** coordinator crashes after prepare, before decision → prepared participants BLOCK indefinitely (hold locks, can't decide) → cascading unavailability. Coordinator = SPOF. 2PC = CP.
- **3PC** adds pre-commit to reduce blocking but fails under partitions (inconsistent) → impractical.
- **Avoid distributed transactions** → single-system transactions, or **Sagas**, or outbox (9.8). If 2PC needed, make coordinator fault-tolerant (Spanner = Paxos+2PC).

---

## 7. Sagas (11.7) — cross-service consistency without 2PC

- **Saga** = sequence of local transactions, each with a **compensating transaction** (semantic undo — refund a charge, release a reservation; NOT rollback; must be idempotent).
- On failure at step Tk → run Ck-1…C1 (reverse) → consistent state via **eventual consistency**.
- **Orchestration** (central coordinator drives — clear/observable, central component; complex workflows) vs **Choreography** (services react to events — decoupled, hard to trace; simple flows).
- **Caveats:** **NO isolation** (intermediate states visible → anomalies → semantic locks/commutative updates); eventual consistency; **irreversible steps last** (pivot); compensations can fail (idempotent, retriable, monitor stuck sagas).
- Driven by messaging (Part 9) + **outbox** (9.8) for atomic step-commit + reliable event.

---

## 8. Disaster recovery (11.8)

```
RPO = max DATA loss (time; = backup freq/replication lag)     RTO = max DOWNTIME (= restore/failover speed)
low RPO/RTO = expensive (active-active/sync); high = cheap (nightly backup/restore). Buy down with money.
```
- **Backups ≠ replicas** — replication copies corruption/deletion; only point-in-time/immutable/offline backups recover from corruption/ransomware. **3-2-1** (3 copies, 2 media, 1 off-site, 1 offline). **PITR** = restore to any moment. Encrypt.
- **Strategy spectrum (cost↔RPO/RTO):** Backup & Restore → Pilot Light → Warm Standby → Active-Active (hot).
- **Regional failover:** fence old region, avoid split-brain, caught-up replica (RPO), reroute (DNS/global LB — TTL affects RTO).
- **TEST DR** (restore drills + failover game days + measure RPO/RTO) — **untested DR is a hope, not a plan. A backup you've never restored is worthless.**

---

## 9. Decision cheats

- **Prevent cascades?** → timeout + backoff/jitter retries + circuit breaker + bulkhead (+ idempotency + fallback).
- **Retry safe?** → only if idempotent (make it so) + backoff/jitter/caps/budget + circuit breaker.
- **Overload?** → backpressure + prioritized load shedding; degrade non-critical to protect the core.
- **Cross-system atomicity?** → single-system transaction > saga (eventual) > 2PC (blocking, last resort).
- **Cross-service consistency?** → saga (orchestrated for complex) + idempotent compensations + outbox.
- **Survive region loss/corruption?** → RPO/RTO per tier → matching DR strategy + real (immutable) backups + TEST.
- **Availability lever?** → optimize MTTR (fast detect/failover/degrade) more than MTBF.

---

## 10. Red flags

- Assuming failures are rare exceptions; trying to prevent faults instead of tolerating them.
- Redundancy without headroom (N+1 at ~100% → cascade); redundant nodes in the same failure domain (correlated).
- Failover without fencing (split brain); auto-failover on slow-not-dead; promoting a lagging replica.
- No timeout / unbounded wait; retry without backoff/jitter/caps (retry storm); retry without idempotency (double effects).
- One shared pool (no bulkhead); no circuit breaker (relentless hammering → metastable).
- No graceful degradation (non-critical dep fails the core); no load shedding (accept-everything → collapse); auth fails-open.
- 2PC across microservices (blocking); 3PC expecting non-blocking.
- Saga ignoring no-isolation; non-idempotent steps/compensations; irreversible step not last; unmonitored stuck sagas.
- "Replication is a backup"; never testing restores; RPO/RTO undefined; untested DR failover; no offline/immutable backup.

---

*Cross-references: [11.1–11.8], [8.1.1 fallacies/partial failure], [8.1.3 timeouts/failure detection], [6.7 stampede/metastable/shedding], [3.3.4 backpressure], [8.3.5/8.3.6 leader election/fencing], [8.4.1/9.4/9.5 delivery/idempotency], [9.8 outbox/CDC], [10.2 sync/async/RPO], [10.7/10.8 CAP/PACELC], [5.2.1 ACID], [7.7 capacity/knee], [Part 12 microservices/sagas], [Part 13 multi-region/DR], [Part 14 SRE/chaos/incident response].*

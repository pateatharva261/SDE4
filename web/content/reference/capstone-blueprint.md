# Enterprise Capstone Blueprint — Wealth Management Platform

> One-page reference for Part 20. The **assembled architecture**, the **decision→requirement→alternative** table, and the **through-lines**. Use it to run an end-to-end architecture review.

---

## The system in one line

**A microservices platform organized by bounded context, with a CP write core (immutable double-entry ACID ledger, event sourcing + CQRS, idempotent sagas) and an eventual, derived read halo (cache, market data, search/recs/AI), linked by ledger events — fronted by a gateway/CDN edge, secured zero-trust, made reliable multi-region, and operated via SLOs + observability + a production-readiness review. Correctness, compliance, and security come first.**

---

## Layered architecture

```
Edge:        CDN/WAF/DDoS → GeoDNS/LB → API Gateway + BFF (authN, rate limit)
Write core:  Transaction service (idempotent + saga orchestrator) → Event-sourced
             double-entry ACID CP ledger  [strong, correctness-first]
Read halo:   Portfolio read model (CQRS) · Market-data streaming + TSDB · Search +
             Recs + AI · Cache/read models   [eventual, derived, decoupled]
Link:        Ledger events / CDC → derived read-model updates
Cross-cut:   Identity + KYC/AML · Zero-trust security + compliance · Resilience +
             locks · HA/DR/multi-region on K8s · Observability + PRR
```

---

## Bounded contexts (→ services)

Identity & Access · Onboarding & Compliance (KYC/AML) · Portfolio · Ledger/Transactions · Payments · Market Data · Search · Advice/Recommendations · Reporting · Notifications. Each has **its own database** (database-per-service); communicate via **events + APIs**; anti-corruption layers at seams.

---

## Decision → requirement → alternative rejected

| Decision | Requirement | Rejected alternative |
|---|---|---|
| Microservices by bounded context | Large, regulated, multi-team domain | Monolith (fine early, wrong at this scale) |
| Immutable double-entry ACID CP ledger | Financial correctness + audit (SOX) | Mutable/eventual balances (no audit, corrupts money) |
| Event sourcing + CQRS | Tamper-evident audit + many read shapes | Plain CRUD (loses history, couples read/write) |
| Idempotency + saga + outbox | Exactly-once effects across services | 2PC (blocking/fragile, no external rails) |
| Consistency split (CP write / eventual read) | Money strong; dashboards tolerate lag; scale | All-strong (no scale) / all-eventual (corrupts money) |
| Streaming market data, decoupled | High-write firehose; valuations derived | Coupling to the ledger (slows money path) |
| Cache derived views, never the auth truth | Read-heavy + money correctness | Authorizing off cached balances (correctness bug) |
| Zero-trust + defense-in-depth | Existential security; assume breach | Perimeter-only (lateral movement) |
| Per-context multi-region (CP sync / eventual active-active) | RPO≈0 money + global low-latency reads | Multi-master ledger (conflicts) / single region (no DR) |
| Resilience on every dependency | Prevent cascades around external rails | Naive calls (one slow dep topples all) |
| Distributed locks only where needed | Correct singleton coordination | Locks everywhere (prefer idempotency/partitioning) |
| Per-context SLOs + PRR | Correctness-first + safe launch | One global SLO / launch without review |

> If you can't name the requirement for a box, **cut the box**.

---

## Through-lines (what makes it coherent)

1. **Every decision follows from a requirement** (1.3.1).
2. **Split by consistency/latency** (18.6): CP write core + eventual read halo, linked by ledger events (9.8/20.7).
3. **Correctness patterns (money):** idempotency/exactly-once (11.5), immutable ledger + ES (20.4/20.7), sagas + outbox (20.6), reconciliation (19.2.3).
4. **Derived-data patterns (reads):** CQRS/materialized views/caches/search — rebuildable from the log, eventually consistent.
5. **Defense-in-depth:** layered controls; **fail-closed for money/security, fail-open for reliability** (20.11).
6. **Operability designed-in:** SLOs + observability + PRR (20.12); monitoring outlives the monitored (16.6).
7. **Composition of the whole course** (Parts 1–19).

---

## Consistency map (know this cold)

| Data | Model | Why |
|---|---|---|
| Ledger entries, hard balances | **Strong / CP / ACID** | Money invariants — can't be wrong |
| Portfolio views, valuations | Eventual (cached) | Derived; a moment stale is fine |
| Market data | Eventual (streaming) | Firehose; freshness SLI, not exact |
| Search index, recommendations | Eventual (derived read model) | Advisory; rebuildable from events |
| Audit trail | Immutable, append-only | Compliance (SOX) |

---

## Key numbers discipline (20.2)

- Three workloads: **read-heavy** (dashboards) · **write-critical** (trades/txns — sacred) · **firehose** (market data).
- **Per-context SLOs:** ledger correctness≈100% + RPO≈0; reads = latency + real error budget; market data = freshness.
- Plan to **peak (market open) + N+1**; autoscale elastic tiers; **provision + load-shed the non-elastic ledger DB**.

---

## Reliability + DR (20.10)

- HA baseline: replicas across ≥2 AZs + N+1; safe (fenced/quorum-gated) failover for stateful.
- Multi-region: **CP ledger = distributed-SQL/sync or active-passive**; **eventual reads = active-active**.
- DR: **RPO≈0 for the ledger** (sync + immutable log) + warm/hot standby; **immutable tested backups ≠ replicas**; **test failover + chaos**.

---

## The review (how to run it — 20.13)

1. Restate **requirements + priorities** (correctness/compliance/security first).
2. Walk the **read path** + the **write path**; name consistency at each hop.
3. **Defend each decision** (requirement + rejected alternative); admit tradeoffs honestly.
4. Probe **risks** (SPOFs, hot keys, non-elastic DB, correlated failure, compliance, cascades) + mitigations.
5. State **what you'd monitor + how it evolves** (fitness functions — 2.3.3).

> The review is the demonstration of **judgment** — the true output of the whole course.

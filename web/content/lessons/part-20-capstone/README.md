# Part 20 — Enterprise Capstone: Wealth Management Platform

> **The finale.** One defended, end-to-end enterprise system that **integrates the entire course**. Thirteen lessons build a regulated **Wealth Management Platform** — and, more importantly, they teach the **judgment** to choose, defend, and weigh patterns under real constraints. This is the capstone of the platform.

---

## Why this part exists

Parts 1–17 taught the **building blocks**; Part 18 showed **real systems**; Part 19 drilled **20 focused designs**. Part 20 proves it all **composes** into a coherent, operable, defensible whole — the kind of system a Staff/Principal engineer actually architects, reviews, and runs. The domain (wealth management) was chosen because it forces **every hard theme at once**: financial correctness, heavy compliance, real-time streaming + strong transactions + eventual reads, search/recs/AI, caching/CDN, microservices, cloud-native reliability, security, and observability.

The organizing idea: **a CP write core + an eventual, derived read halo, linked by ledger events** — and **every decision follows from a requirement**.

---

## Index

| # | Lesson | Integrates |
|---|--------|-----------|
| 20.1 | Domain, Requirements, Compliance & Bounded Contexts | DDD (2.1.3), compliance (15.8), decomposition (12.2) |
| 20.2 | Capacity Estimation & SLOs | Estimation (1.1.4), SLOs/error budgets (14.1), capacity (7.7) |
| 20.3 | Authentication, Authorization & Identity | AuthN/authZ (15.2), KYC/AML (15.8), ReBAC, gateway (12.6) |
| 20.4 | Portfolio, Transactions & the Ledger | Ledger (18.3), idempotency (11.5), CQRS, payment (19.2.3) |
| 20.5 | Market Data Ingestion (Streaming, Kafka, Time-Series) | Log (18.1), stream (9.6), TSDB (16.2), ad aggregator (19.2.9) |
| 20.6 | Distributed Transactions & Saga | 2PC (11.6), sagas (11.7), outbox (12.5), idempotency (11.5) |
| 20.7 | CQRS + Event Sourcing for the Ledger & Audit Trail | Log (18.1), CQRS (12.4), CDC (9.8), audit (15.8) |
| 20.8 | Search, Recommendations & AI Services | Search (18.7), recs (18.5/19.2.7), suitability (15.8) |
| 20.9 | Caching, Object Storage, CDN & API Gateway | Caching (Part 6), object storage (4.3.2), CDN (18.4), gateway (12.6) |
| 20.10 | Reliability: HA, DR, Multi-Region, Autoscaling on K8s | Failover (11.2), DR (11.8), multi-region (13.8), autoscaling (13.5) |
| 20.11 | Security, Compliance, Rate Limiting, Breakers & Locks | Security (Part 15), rate limiting (15.7/19.1.2), resilience (11.3), locks (19.2.5) |
| 20.12 | Observability & the Production-Readiness Review | Observability (Part 16), golden signals (14.3), IR (14.5) |
| 20.13 | Full Architecture Review: Every Decision Defended | Everything — the meta-skill: judgment (1.3.1/1.1.5/2.3.1) |

---

## The through-line

- **Every decision follows from a requirement** (1.3.1) — the master rule; if you can't name the requirement, cut the component.
- **Split by consistency/latency profile** (18.6): a **CP write core** (immutable ACID ledger, event sourcing, sagas) + an **eventual, derived read halo** (cache, market data, search/recs), linked by **ledger events** (CDC — 9.8).
- **Correctness patterns for money:** idempotency/exactly-once effects (11.5), immutable double-entry ledger + event sourcing (20.4/20.7), orchestrated sagas + outbox (20.6), reconciliation (19.2.3).
- **Derived-data patterns for reads:** CQRS read models, materialized views, caches, search indexes — all **rebuildable from the log**, all eventually consistent.
- **Defense-in-depth:** layered security + reliability; **fail-closed for money/security, fail-open for reliability** (20.11).
- **Operability designed-in:** SLOs, correlated observability, production-readiness review (20.12) — built to be **run**, not just built.
- **Composition of the whole course:** the platform reuses Parts 1–19 as its building blocks.

---

## Self-check (the review, in your own words)

1. Walk the **read path** (dashboard load) and the **write path** (a trade) — name the consistency model at each hop.
2. For any component, state its **requirement** and the **alternative you rejected** (and why).
3. Why is the ledger **CP + immutable**, while the portfolio view is **eventual + cached**?
4. Where are the **SPOFs, hot keys, the non-elastic ledger DB, and correlated-failure risks** — and their mitigations?
5. What's in the **production-readiness review**, and why must monitoring **outlive the monitored**?
6. What is the **single skill** this entire course was building toward? (Judgment: choosing, defending, and weighing patterns under real constraints.)

---

*You started at "what is system design" and tradeoffs as the core skill. You finish defending a complete regulated financial platform end-to-end. **Platform complete.***

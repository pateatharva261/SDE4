# Reference — Microservices Patterns Cheat Sheet

Pairs with [Part 12] (12.1–12.9). Core idea: **microservices are an *organizational* solution (independent teams/deployments) bought with distributed-systems complexity — decompose along real business boundaries, own data privately, communicate loosely without breaking consumers, keep cross-service workflows reliable + eventually consistent, front/connect the fleet, verify with contracts, and migrate incrementally (never big-bang).**

---

## 1. Adopt or not? (12.1)

```
Microservices = small, independently-deployable services, each owning a business capability + its own data, over the network.
PRIMARY benefit = organizational: independent deploy + team autonomy (Conway). A monolith scales technically far;
many teams on one codebase does NOT. So microservices pay off at ORG scale — usually premature for small teams.
```
- **Benefits:** independent deployability · team autonomy · independent scaling · fault isolation · polyglot.
- **Costs (underestimated):** distributed-systems complexity (Parts 8–11) · no cross-service ACID (sagas) · ops overhead · testing/debugging · latency/fan-out.
- **Monolith-first:** start modular monolith (clean boundaries, one deploy+DB) → decompose on **triggers**: team-scaling pain (main) · independent-scaling · independent-deploy cadence · fault isolation · tech fit · stable boundaries.
- **Traps:** cargo-cult adoption · **distributed monolith** (coupled services = all costs, no benefits).

---

## 2. Decomposition (12.2)

```
Good boundary = HIGH COHESION within (changes together, owns its data) + LOOSE COUPLING between (small stable contracts).
Litmus: can one team develop/deploy/scale it independently?
```
- **By business capability** (what the org does — Order/Inventory/Payment) — stable, org-aligned, coarse first cut.
- **By subdomain / bounded context** (DDD — model + ubiquitous-language consistency; same term = one meaning) — validates/refines.
- **Right-size:** one team-ownable capability, one reason to change; if two always change/deploy together → merge.
- **Anti-patterns:** by technical **layer** (UI/logic/data — worst) · **entity/CRUD** services (one per table) · **nano**-services · **god** service · boundaries from the schema.
- **Same concept in many contexts** (Product) → each context keeps its own model + **shared identifier**; NOT a shared entity service. Protect with **anti-corruption layer**.

---

## 3. Communication (12.3)

| | Synchronous (REST/gRPC) | Asynchronous (events/messages) |
|---|---|---|
| Caller | blocks for answer | fire-and-forget |
| Coupling | time + knowledge | decoupled (events deepest) |
| Use for | queries you need now (short chains) | side-effects, decoupling, load absorption, workflows |

```
Sync chain of n deps: latency = SUM; availability ≈ 0.999^n; slow dep cascades upstream (metastable — 11.3).
```
- **Events decouple deepest:** publisher doesn't know consumers → add consumers without changing producer.
- **API design:** coarse-grained use-case APIs (not chatty CRUD); hide internal model; contract-first (OpenAPI/.proto).
- **Evolve compatibly (4.3.1):** additive/optional only · tolerant reader · Protobuf/Avro + registry · version + **expand/contract** only when a break is unavoidable. **GOLDEN RULE: never break your consumers.**
- Wrap every call: timeout/retry/breaker/bulkhead (11.3) + idempotency (11.5) + tracing + mTLS.

---

## 4. Data management (12.4)

```
DATABASE-PER-SERVICE: each service owns its data privately; access only via its API/events. Shared DB = FATAL (distributed monolith).
Consequences: NO cross-service ACID (→ sagas) · NO cross-service joins (→ distributed query).
```
- **Distributed query — API composition:** composer/BFF queries each owner, joins in memory. Simple + fresh; fan-out latency/availability; weak at complex joins.
- **Distributed query — CQRS materialized view:** pre-joined read model fed by events; single local read (fast/resilient); **eventually consistent**; more moving parts.
- **Event-carried state transfer:** keep a local read-only replica of upstream data (via events) → answer locally, no sync call. Source of truth stays with owner.
- **Consistency:** eventual is the norm (read-your-writes where a user must see own change). **Cross-service invariants** can't be enforced by one txn → keep invariant-bound data in ONE service.

---

## 5. Saga & Outbox (12.5)

```
Cross-service business txn = sequence of LOCAL txns; on failure run COMPENSATIONS (semantic undo, not rollback); irreversible LAST.
= atomicity WITHOUT isolation, eventual consistency. (2PC = blocking/fragile → avoid.)
```
| | Choreography | Orchestration |
|---|---|---|
| Coordination | services react to events, no coordinator | central state machine drives steps |
| Best for | simple/short sagas | complex/branching; needs visibility |
| Flow | implicit (hard to trace) | explicit (observable) |

- **Dual-write problem:** DB update + message send as 2 ops isn't atomic → stalled saga / ghost event.
- **Transactional outbox (9.8):** write business change **+ outbox row** in ONE local txn; relay/CDC publishes at-least-once. (Or event sourcing = no dual write.)
- **Idempotency (11.5):** at-least-once + idempotent handlers/compensations = **exactly-once EFFECTS** (never exactly-once delivery); track last-processed per entity.
- **No isolation → anomalies:** semantic locks (PENDING/held), commutative updates, careful ordering; add saga timeouts for stuck sagas.

---

## 6. Discovery, Gateway, BFF (12.6)

```
North-south = client↔system (GATEWAY/BFF).   East-west = service↔service (DISCOVERY + MESH).
```
- **Service discovery:** registry (HA, health-aware, TTL+heartbeat) of healthy instances.
  - **Client-side:** client queries registry + self-LB (no hop; logic per client).
  - **Server-side (default):** client calls stable router/LB (K8s Service) that queries registry (simple client; extra hop).
  - **Registration:** self (register+heartbeat) vs third-party (registrar watches platform). Health check → evict dead.
- **API gateway:** single edge entry — routing, auth/authz, TLS termination, rate limiting, aggregation, tracing entry. Risks: SPOF/bottleneck (HA+scale), god-gateway.
- **BFF:** one gateway per client type (mobile/web/partner), owned by client team, tailored payloads. Fixes god-gateway.
- **LB vs discovery vs gateway vs mesh** = complementary layers (distribute / locate / front-edge / internal-fabric).

---

## 7. Service mesh (12.7)

```
Factor EAST-WEST cross-cutting concerns out of app libraries → SIDECAR proxy per instance (transparent, localhost, polyglot).
Data plane = sidecars (in path). Control plane = brain: pushes config/certs/policy (NOT in path — outage blocks changes, not traffic).
```
- **Provides (no app changes):** mTLS + workload identity (zero-trust, auto cert rotation) · traffic mgmt (routing, canary/blue-green/weighted, mirroring, **fault injection**, central timeouts/retries/breaking) · uniform observability (golden signals, traces, logs).
- **Costs:** 2 extra proxy hops (latency) · sidecar CPU/mem × fleet · operational + debugging complexity.
- **Use when:** many polyglot services + zero-trust mTLS + uniform observability + ops maturity. **Overkill** for small/homogeneous → use a library or nothing.
- `[EMERGING]` sidecar-less / eBPF / ambient meshes reduce per-pod overhead.

---

## 8. Testing (12.8)

```
E2E doesn't scale (slow/flaky/combinatorial). Rebalance the pyramid; anchor on CONTRACT tests.
```
- **Pyramid:** unit (most) → integration (svc↔its DB/broker) → component (one svc, deps stubbed) → **contract** (keystone) → **few** E2E (critical journeys) → + testing in production.
- **Contract testing:** verify consumer & provider honor an agreed contract, each tested separately, no shared env.
- **Consumer-driven contracts (CDC):** consumers publish expectations (pacts) → provider verifies ALL in CI → automated **"never break a consumer"** + data-driven deprecation. Works sync + async (event schemas — vital for sagas).
- **Contracts verify COMPATIBILITY, not correctness** → still need component + few E2E + prod testing.
- **Test in production:** canary + auto-rollback · synthetic monitoring · shadow traffic · feature flags · observability.

---

## 9. Migration (12.9)

```
NEVER big-bang rewrite (moving target, no value until end, terrifying cutover). Migrate INCREMENTALLY + reversibly.
```
- **Strangler Fig:** façade/proxy in front of monolith routes each request → new service (migrated) or monolith (not yet); extract one bounded context at a time; flip routes; monolith shrinks → retired.
- **Anti-Corruption Layer (ACL):** translation layer between clean new service and messy legacy → legacy model can't corrupt the new one; delete when legacy retires.
- **Data decomposition (the hard part):** split shared table with zero-downtime (5.4.3): dual-write + CDC (9.8) + backfill + verify + gradual read cutover + decommission. Joins → API/events; cross-module txns → sagas.
- **Sequence:** extract high-value / low-risk contexts first; measure; iterate. **Know when to stop** — leaving a stable core monolithic is legitimate (goal = right architecture, not zero monolith).

---

## 10. One-line recall

| Concept | One line |
|---|---|
| Microservices | Org solution (independent teams/deploys) bought with distributed-systems complexity |
| Adopt when | Org scale + ops maturity + clear boundaries + concrete trigger; else modular monolith |
| Decompose by | Business capability + bounded context; high cohesion / loose coupling; never layers/tables |
| Communicate | Sync for queries (short chains); async events to decouple; never break consumers |
| Data | Database-per-service; no cross-service ACID/joins → sagas + API-composition/CQRS |
| Saga | Local txns + compensations; outbox for dual-write; idempotency → exactly-once effects |
| Discovery/Gateway/BFF | Registry finds instances; gateway fronts the edge; BFF per client; N-S vs E-W |
| Service mesh | Sidecars + control plane: mTLS/traffic/observability; scale decision, not default |
| Testing | Contract / consumer-driven contracts = "never break a consumer"; minimal E2E + prod testing |
| Migration | Strangler fig + ACL + zero-downtime data split; incremental, reversible; stop when right |

---

*Pairs with: Part 12 lessons; builds on 2.1.3 (DDD), 2.2.3 (service styles), Parts 8–11 (distributed core), 9.8 (outbox/CDC), 11.3/11.5/11.7 (resilience/idempotency/sagas), 5.4.3 (zero-downtime migration). Leads into Parts 13–16.*

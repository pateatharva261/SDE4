# Reference — Architecture Style Comparison Matrix & Selection Guide

Pairs with [2.3.1 Characteristics → Style Selection] and all of [Module 2.2]. Ratings are **directional tendencies** (synthesizing Richards & Ford's analysis), not precise measurements — a well-built instance of a "lower-rated" style can beat a poorly-built "higher-rated" one. Scale: ★ low → ★★★★★ high.

---

## 1. The matrix

| Characteristic | Layered | Pipeline | Microkernel | Service-Based | Event-Driven | Microservices | Space-Based |
|---|---|---|---|---|---|---|---|
| Simplicity / ease | ★★★★★ | ★★★★ | ★★★ | ★★★ | ★★ | ★ | ★ |
| Cost (★=cheap→expensive; more ★ = cheaper) | ★★★★★ | ★★★★ | ★★★★ | ★★★ | ★★ | ★ | ★ |
| Deployability | ★★ | ★★ | ★★★ | ★★★★ | ★★★ | ★★★★★ | ★★★ |
| Elasticity / scalability | ★ | ★ | ★ | ★★★ | ★★★★ | ★★★★★ | ★★★★★ |
| Fault tolerance | ★ | ★ | ★ | ★★★ | ★★★★ | ★★★★ | ★★★ |
| Evolvability | ★ | ★★★ | ★★★ | ★★★ | ★★★★ | ★★★★★ | ★★ |
| Performance | ★★ | ★★★ | ★★★ | ★★★ | ★★★ | ★★ | ★★★★★ |
| Testability | ★★★ | ★★★★ | ★★★ | ★★★ | ★★ | ★★★★ | ★★ |
| Overall complexity (more ★ = simpler) | ★★★★★ | ★★★★ | ★★★ | ★★★ | ★★ | ★ | ★ |

> Read it by **row**: find your driving characteristic, pick the style with the most stars there, then check it doesn't tank a characteristic you also need.

---

## 2. One-line essence of each style

| Style | Essence | Deployment | Lesson |
|---|---|---|---|
| **Layered** | Organized by technical role; stack of layers | monolithic | 2.1.2, 2.2.2 |
| **Pipeline** | Data flows through stateless composable filters | usually monolithic | 2.2.2 |
| **Microkernel** | Minimal core + plugins (extensibility) | monolithic | 2.2.2 |
| **Modular Monolith** | One deployable, clean bounded-context modules | monolithic | 2.2.1 |
| **Service-Based** | Few coarse services, often shared DB, no ESB | distributed | 2.2.3 |
| **Event-Driven** | Async events; broker (choreography) / mediator (orchestration) | either | 2.2.4 |
| **Microservices** | Many fine, independently-deployable, DB-per-service | distributed | 2.2.3 |
| **Space-Based** | In-memory grid, DB off the hot path, async persist | distributed | 2.2.5 |

---

## 3. Driver → style quick lookup

| If the top driving characteristic is… | Start with… |
|---|---|
| Simplicity, low cost, small team | Layered / **Modular Monolith** |
| Extensibility / customization (plugins) | **Microkernel** |
| Transform a stream of data | **Pipeline** (or streaming, Part 9) |
| Independent deploy, mid-size, want transactions | **Service-Based** |
| Loose coupling + many reactions to events | **Event-Driven** |
| Independent deploy/scale per capability, large org | **Microservices** |
| Extreme spiky scale + low latency (DB is the wall) | **Space-Based** |

---

## 4. Selection process (from 2.3.1)

```
1. Rank driving characteristics (top 2–3) + hard constraints
2. Decide distribution need FIRST  (monolithic vs distributed)  ← least reversible
3. Match drivers → style via the matrix
4. Verify satisficed characteristics stay acceptable
5. Combine styles per subsystem (don't force one style everywhere)
6. Record as ADR + reversal trigger
```

**Senior phrasing:** "Top drivers X,Y → style Z (per matrix), accepting sacrifice S; combine with W for subsystem; revisit if T."

---

## 5. The distributed-systems tax (paid by all distributed styles — 2.2.3)

Network latency & unreliability · partial failure · no cheap transactions (Sagas/eventual consistency) · operational complexity (discovery, gateway, tracing, CI/CD) · data duplication & cross-service queries · contract versioning. → Don't distribute without a concrete trigger (2.2.1).

---

## 6. Decision red flags

- Choosing **microservices/event-driven by hype** when drivers are simplicity/cost.
- **Distributed monolith**: services that must deploy together (high cross-boundary connascence) — costs of distribution, none of the benefits.
- **Shared database across "microservices"** — re-coupling; not microservices.
- **One style forced** on the whole system instead of combining per subsystem.
- **Casual distribution decision** — it's a one-way door; apply extra rigor.

---

*Cross-references: [1.2.4 Prioritization], [2.2.1–2.2.5 Styles], [2.3.1 Selection], [Part 12 Microservices].*

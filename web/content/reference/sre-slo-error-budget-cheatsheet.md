# Reference — SRE, SLOs & Error-Budget Cheat Sheet

Pairs with [Part 14] (14.1–14.8). Core idea: **make reliability a number (SLOs/error budgets), run ops as engineering (kill toil), see + alert + respond humanely, plan capacity, ship safely (progressive delivery), and verify empirically (chaos) — turning "reliable enough?" into arithmetic and failures into fast recoveries + learning.**

---

## 1. SLI / SLO / SLA & error budget (14.1)

```
SLI (measure: good/total events, user-centric) → SLO (internal target + window) → SLA (external contract w/ penalties, looser than SLO)
Error budget = 1 − SLO = allowed unreliability = a RESOURCE to spend on risk (deploys/features/experiments).
```
- **100% is wrong:** impossible + exponentially expensive (diminishing returns) + invisible (users' own path less reliable).
- **Nines (illustrative):** 99.9% ≈ ~43 min/month; 99.99% ≈ ~4 min/month.
- **SLIs:** user-centric, measured at edge/client/synthetic, **percentiles not averages** (latency), success/fail separated, few + meaningful.
- **Error-budget policy:** healthy → ship freely; exhausted → freeze launches + focus reliability. Aligns dev/ops incentives; blameless.
- **Alert on burn rate** (multi-window): fast burn → page, slow burn → ticket.

---

## 2. Toil & the SRE model (14.2)

```
Toil = manual + repetitive + automatable + tactical + no-enduring-value + scales with the system.
SRE = apply software engineering to ops → automate so ops scales SUB-LINEARLY.
```
- **≤50% toil cap** → guarantees engineering time (else toil fills all time → firefighting trap).
- **Automate yourself out:** manual → runbook → script → self-service → automated/self-healing → **eliminate root cause**.
- **Dev/ops alignment:** error budget (overspend stops launches) + toil pushed back to source. "SRE implements DevOps."
- Not toil: judgment work, one-offs, engineering that reduces future toil.

---

## 3. Monitoring vs observability + golden signals (14.3)

```
Monitoring = watch predefined signals for KNOWN problems (known-unknowns).
Observability = ask ARBITRARY new questions from telemetry (unknown-unknowns) — debug novel incidents w/o new code.
Distributed systems NEED observability (emergent failures, fan-out, high-cardinality slices).
```
- **Four golden signals:** **Latency** (success/fail separate, percentiles), **Traffic** (demand), **Errors** (failure rate), **Saturation** (how full — leading indicator, near the knee — 7.7).
- **RED** (Rate/Errors/Duration — service) + **USE** (Utilization/Saturation/Errors — resource): RED=what's wrong, USE=why.
- **Symptom-based** (page) vs **cause-based** (diagnose). **Three pillars:** metrics (dashboards/alerts), logs (forensics), traces (cross-service).

---

## 4. Alerting & on-call (14.4)

```
Alert fatigue: too many/noisy alerts → ignore alerts → miss the real one + burnout. Noisy < quieter for safety.
Every PAGE: urgent + actionable + real impact. Else → ticket/notification/delete.
```
- **Symptom / SLO burn-rate alerting** (not cause spam); leading indicators (disk-full/cert/saturation) → tickets.
- **Tiers:** page (urgent, wake) / ticket (non-urgent) / notification (FYI, never page).
- **Humane on-call:** bounded page load/shift, sustainable rotation/follow-the-sun, escalation, runbooks, compensation + recovery, review loop.

---

## 5. Incident response & postmortems (14.5)

```
Goal = minimize MTTR (11.1). Structure beats heroics. MITIGATE before RESOLVE (stop the bleeding first).
```
- **Incident Command (ICS):** **IC** (coordinate, not fix) · **Ops** (fix) · **Comms** (shield responders, stakeholders) · **Scribe** (timeline). Scale to severity.
- **Mitigate:** rollback (fastest, 13.7) / failover (11.2) / shed load (11.4) / feature-flag off / scale — restore now; root-cause after (safely, preserve evidence).
- **Blameless postmortem:** timeline + impact (SLO/budget) + root cause + **tracked action items**; focus systems not people. Human error = symptom (ask why the system allowed it). Blame → hidden truth → recurrence.

---

## 6. Capacity planning & forecasting (14.6)

```
Enough capacity to meet FUTURE demand at SLO, cost-effectively, BEFORE it arrives. Reconcile demand/capacity/cost.
```
- **Forecast:** organic (trend extrapolation) + **inorganic** (launches/campaigns/sales — NOT in the trend → surprises cause outages). Plan for PEAK.
- **Demand → resources:** peak / per-unit-capacity (load-tested at SLO, below the knee — 7.7) + headroom (N+, forecast error, scale-up lag).
- **Autoscaling ≠ enough:** reactive/lagging, can't scale non-elastic DB (7.6), needs capacity/quota to scale into, ignores lead times. Plan non-elastic tiers + quota AHEAD.
- **Balance:** under → outages; over → waste. Reserved baseline + autoscaling + scale-to-zero + load-shedding backstop.

---

## 7. Release engineering & progressive delivery (14.7)

```
Change is the top cause of outages → how you release is a top reliability lever. Make releases boring: reproducible, automated, safe.
```
- **CI** (frequent small merges + auto tests) → **CD** (always deployable, human gate) → **continuous deployment** (auto, needs strong safety).
- **Progressive delivery:** gradual + controlled + observable + reversible (canary 1→5→25→100%, metric-gated — 14.3, auto-rollback); feature flags decouple deploy/release.
- **Error-budget-gated** launches; progressive rollout spends budget cheaply (small blast radius).
- **DORA:** small+frequent+automated = faster AND more reliable (deploy frequency, lead time, change failure rate, time to restore). Big-bang = anti-pattern.
- **Supply chain (Part 15):** pin/scan/sign deps, provenance (SLSA), SBOM, least-privilege pipeline.

---

## 8. Chaos engineering (14.8)

```
Deliberately inject failures to find weaknesses BEFORE outages. Reliability = empirical property to test, not assume.
Method: define steady state (SLI) → hypothesize it holds despite fault → inject → observe → fix → re-verify.
```
- **A "failed" experiment = success** (found a weakness safely, on your schedule).
- **Safety:** minimize blast radius (small → expand), run in prod carefully + monitored, **abort switch**, error-budget-bound, communicate, business hours.
- **Fault types:** instance kill (redundancy), latency (timeouts/breakers), partition (CAP/isolation), dependency failure (degradation), resource exhaustion (saturation), zone/region loss (DR — 11.8/13.8). Via mesh (12.7)/chaos tooling.
- **Game days:** validate systems AND incident response (14.5) + DR drills; surface observability/alerting/runbook gaps.
- **Prereqs:** observability (14.3) + resilience (11.3) + incident response (14.5) + error budget (14.1). Don't chaos a fragile/unobservable system.

---

## 9. One-line recall

| Concept | One line |
|---|---|
| SLI/SLO/SLA | Measure → internal target → external contract (SLA looser than SLO) |
| Error budget | 1−SLO = allowed unreliability = a resource to spend; policy gates launches |
| 100% reliability | Wrong target — impossible, exponentially costly, invisible to users |
| Toil | Manual/repetitive/automatable/no-value; cap at 50%; automate/eliminate |
| Monitoring vs observability | Known-unknowns (predefined) vs unknown-unknowns (arbitrary questions) |
| Golden signals | Latency, Traffic, Errors, Saturation |
| Alerting | Symptom + burn-rate; every page urgent+actionable+impact; avoid fatigue |
| Incident response | Incident command + mitigate-before-resolve + blameless postmortem; minimize MTTR |
| Capacity planning | Forecast organic+inorganic; headroom; non-elastic + quota ahead; autoscaling isn't enough |
| Release/progressive delivery | Small+frequent, metric-gated canary + rollback, budget-gated (velocity ↔ reliability) |
| Chaos engineering | Hypothesis-driven bounded fault injection; game days; verify resilience empirically |

---

*Pairs with: Part 14 lessons; builds on 1.2.1 (availability), 11.1 (MTBF/MTTR), 11.3/11.8 (resilience/DR), 13.5/13.7/13.8 (autoscaling/deployments/multi-region), 7.6/7.7 (bottleneck/capacity), 12.7 (mesh fault injection). Leads into Parts 15–17 & the Part 20 capstone.*

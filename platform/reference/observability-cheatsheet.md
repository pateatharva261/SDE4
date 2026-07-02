# Reference — Observability Cheat Sheet

Pairs with [Part 16] (16.1–16.6). Core idea: **you can't operate what you can't see — emit metrics (detect), traces (localize), logs (diagnose), correlate them, keep metrics low-cardinality + sample traces + control logs, turn telemetry into purposeful dashboards + SLO burn-rate alerts, and design the platform knowing cardinality dominates and the watcher must outlive the watched.**

---

## 1. Three pillars (16.1)

```
Metrics = DETECT (numbers over time). Traces = LOCALIZE (request path across services). Logs = DIAGNOSE (event detail).
Complementary, NOT interchangeable. Workflow: metric alert → drill into traces → read logs.
```
- **Correlate** via shared trace ID (in logs + metric exemplars) + consistent labels → seamless detect→localize→diagnose.
- **Cost/cardinality** is the recurring constraint.
- **Limit of the model:** 3 silos make arbitrary questions hard → high-cardinality **wide events** for unknown-unknowns (14.3).

---

## 2. Metrics / TSDB / cardinality (16.2)

```
Time series = metric name + labels → (timestamp, value) points. Any label change = a new series.
CARDINALITY = # unique series (product of label-value counts) = THE dominant cost/scaling driver.
```
- **TSDB** specialized: append-heavy, time-ordered, compressed (delta/XOR), time-partitioned (LSM lineage — 4.2.3).
- **Golden rule:** metric labels LOW-cardinality + bounded (status/service/region/route-pattern); NEVER user/request/URL IDs.
- **High-cardinality data → logs/traces/events**, not metric labels.
- **Pull** (scrape, liveness) vs **push** (ephemeral/serverless). **Downsampling + tiered retention**; histograms for percentiles.

---

## 3. Structured logging (16.3)

```
Structured (JSON/key-value, queryable) > unstructured free text. Emit to stdout (12-factor — 13.1).
Pipeline: emit → collect (agent/sidecar) → parse/enrich/REDACT → buffer/queue (9.9) → store/index → query.
```
- **Levels:** ERROR/WARN/INFO/DEBUG/TRACE; INFO in prod, DEBUG on demand.
- **Cost controls:** sampling (errors 100% + sample common case), tiered retention, metrics-for-counts, selective indexing.
- **Correlation ID = trace ID** (16.4) → reconstruct request across services + link logs↔traces.
- **NEVER log secrets/PII** (15.4/15.8) — logging them is a breach; redact. Operational logs ≠ audit logs (15.8).

---

## 4. Distributed tracing (16.4)

```
Trace = one request's path across services; span = one unit of work (start/duration/status/parent). Waterfall reveals the slow hop.
Context propagation: trace ID injected at entry + passed on EVERY hop (W3C Trace Context header) incl. async (Part 9).
```
- **Sampling** (100% too costly): **head** (decide at start, cheap, blind to outcome) vs **tail** (decide after, keep errors/slow, needs buffering). → head-baseline + tail-keep-errors/slow.
- **OpenTelemetry:** vendor-neutral standard (SDKs + auto-instrumentation + W3C propagation + Collector) — instrument once, export anywhere.
- **Correlate:** trace ID in logs + metric exemplars. **Use for:** slow-hop localization, tail latency (Part 17), dependency mapping, fan-out (12.3).

---

## 5. Dashboards + alerts + anomaly detection (16.5)

```
Dashboards ANSWER QUESTIONS (not vanity walls). Alert on SYMPTOMS + SLO BURN RATE (not static thresholds/causes).
```
- **Default dashboard:** RED per service (Rate/Errors/Duration) + USE per resource (Util/Saturation/Errors) + SLO panel; percentiles not averages; drill-down to traces/logs.
- **SLO burn-rate (multi-window):** fast burn → page; slow burn → ticket. Alerts on real risk, scaled to urgency → less alert fatigue (14.4).
- **Anomaly detection:** catches unforeseen issues but PRONE TO FALSE POSITIVES → use as investigation/ticket signal, not hair-trigger page; complements (not replaces) SLO alerts.
- **Workflow:** SLO alert (detect) → dashboard (assess) → traces (localize) → logs (diagnose) → incident response (14.5).

---

## 6. Designing a monitoring platform (16.6)

```
Framework (1.3.2): requirements → estimation → API/data model → HLD → deep dives → bottlenecks.
Defining constraints: WRITE-HEAVY + time-series + CARDINALITY + HIGH AVAILABILITY (must outlive the monitored).
```
- **Ingestion:** push+pull → collectors → buffer/queue (Part 9, spike absorption + decouple) → shard by series hash (7.3).
- **Storage:** append-optimized/compressed/time-partitioned TSDB (4.2.3) + tiered retention/downsampling → object storage (4.1.3); cardinality limits.
- **HA (key signal):** replicate + isolate failure domains (13.8) + run INDEPENDENTLY of monitored system + HA alerting; no SPOF.
- **Query:** fan-out + aggregate + recording rules + caching + downsampled long-range + protect against expensive queries.
- **Alerting:** HA SLO burn-rate engine → notification/routing (dedup/group/escalate).
- **Deep dives:** cardinality (#1), write scaling, query perf, HA, retention, push/pull, multi-tenancy, extend to logs+traces (16.1).

---

## 7. One-line recall

| Concept | One line |
|---|---|
| Three pillars | Metrics=detect, traces=localize, logs=diagnose; complementary, correlate via trace IDs |
| Metrics/TSDB | Time series + specialized TSDB; cardinality is the dominant cost driver — keep labels low-cardinality |
| Cardinality | # unique series = product of label-value counts; high-cardinality data → logs/traces, not metric labels |
| Structured logging | Queryable JSON, correlated (trace ID), cost-controlled (levels/sampling/retention), no secrets/PII |
| Distributed tracing | Request path across services (spans + context propagation); sample (head+tail); OpenTelemetry |
| Dashboards | Purposeful (golden signals + SLO), not vanity; percentiles; drill-down |
| Alerting | SLO burn-rate multi-window (page fast burn, ticket slow), not static thresholds |
| Anomaly detection | Catches unforeseen but false-positive-prone → investigation signal, complements SLO alerts |
| Monitoring platform | Write-heavy/cardinality/HA; ingest(push/pull+queue+shard)→TSDB+retention→query→SLO alerting; watcher must outlive watched |

---

*Pairs with: Part 16 lessons; builds on 14.1/14.3/14.4 (SLO/golden signals/alerting), 12.3/12.7 (fan-out/mesh), 4.2.3 (LSM/TSDB), 7.3 (sharding), Part 9 (streaming), 11.2 (HA), 13.1 (logs as streams), 15.4/15.8 (secrets/audit). Leads into Part 17 (performance) & the Part 20 capstone.*

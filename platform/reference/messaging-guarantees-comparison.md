# Reference — Messaging & Streaming Guarantees Comparison

Pairs with [Part 9] (9.1–9.9). Core idea: **durable replayable log + at-least-once delivery + idempotent consumers (→ exactly-once effects); derive everything from one source of truth (no dual writes).**

---

## 1. When messaging vs RPC (9.1)

```
Messaging (async): async-tolerable work, decoupling/fan-out, load leveling/spike absorption, resilience
RPC (sync):        need an immediate answer to continue
Don't add a broker where a synchronous call suffices (eventual consistency + ops cost).
```

---

## 2. Queue vs Topic; Push vs Pull (9.1)

| | Queue (point-to-point) | Topic (pub/sub) |
|---|---|---|
| Delivery | one message → ONE consumer | one message → ALL subscribers |
| Use | work distribution (scale workers) | event fan-out / notification |

| | Push | Pull |
|---|---|---|
| Driver | broker pushes | consumer polls |
| Pros | low latency | natural backpressure + batching |
| Cons | can overwhelm (need prefetch) | poll latency (long-poll helps) |

---

## 3. Broker vs Log (9.2)

| | Broker (RabbitMQ/SQS) | Log (Kafka/Pulsar/Kinesis) |
|---|---|---|
| Model | deliver-and-delete (queue) | append-and-retain (log) |
| State | broker tracks per-message | consumer tracks offset |
| Replay | ❌ (consumed = gone) | ✅ (retained, reset offset) |
| Multiple consumers | per-queue copies | many independent (own offsets) |
| Ordering | weak (competing consumers) | strict per-partition |
| Throughput | lower | very high (sequential I/O) |
| Routing | rich (exchanges, TTL, priority, DLX) | simple (topic + key) |
| Pick when | complex routing, transient tasks | replay, fan-out, ordering, throughput, streaming/CDC |

Often run **both** (log = event backbone; broker = routed task queues).

---

## 4. Distributed log anatomy (9.3)

- **Topic → partitions → offsets.** Ordering **within a partition only** (NOT global).
- **Partition** = unit of ordering + parallelism + distribution. Max consumers per group = #partitions.
- **Partition count tradeoff:** more = throughput/parallelism but less ordered-together + overhead + longer rebalances; hard to reduce.
- **Consumer groups:** within a group = split partitions (queue); across groups = each gets all (pub/sub).
- **Offset commit timing → delivery semantics** (§5). **Rebalance** = reassign partitions (pauses; flapping → churn).
- **Retention:** time/size (replay window) OR **compaction** (latest-per-key → changelog/state).
- **Replication:** leader + followers + **ISR**; `acks=all`+min-ISR = no-loss (consistency); `acks=1/0` = faster, lossy.
- **Consumer lag** = offset behind log end → primary health metric.

---

## 5. Delivery guarantees (9.4)

```
At-most-once : commit offset BEFORE process → may LOSE, never duplicate
At-least-once: commit offset AFTER process  → never lose, may DUPLICATE  ← default
Exactly-once : DELIVERY impossible → EXACTLY-ONCE EFFECTS = at-least-once + idempotency/dedup/txn
```
- **EOS (Kafka):** idempotent producer (dedupe retried appends) + transactions (atomic read-process-write, read-committed) → exactly-once **within the system**.
- **EOS scope STOPS at external side effects** (payment API, email, external DB) → add idempotency keys / outbox there.
- **Default:** at-least-once + idempotent consumers.

---

## 6. Ordering + idempotent consumers (9.5)

- **Partition key = ordering scope** → key by the entity whose events must be ordered (user/account/PK); no key = round-robin (max parallelism, no order).
- **Avoid hot partitions** (skewed key) — salt/sub-key (lose strict order), cache/aggregate (7.4/6.7).
- **Prefer per-entity over global ordering** (global = single partition / consensus).
- **Idempotency techniques:** dedup by ID, upsert/CAS, **state-based not delta-based**, **per-key last-applied version** (dedupes + handles out-of-order in one).
- **Preserve per-key order in processing** (no threading within a partition; parallelize by partitions). Use **logical versions** not wall-clock timestamps.

---

## 7. Stream processing (9.6)

- **Stateless** (map/filter) vs **stateful** (count/aggregate/join/window → keyed state + checkpointing).
- **Windows:** tumbling (fixed non-overlapping), sliding (overlapping), session (activity + gap).
- **Event time** (when it happened — correct) vs **processing time** (when seen — mis-buckets late events).
- **Watermark:** "seen all events ≤ W" → fire window; **completeness vs latency** tradeoff. Late data: drop / side-output / update.
- **Exactly-once stateful:** atomic state + offsets + outputs (in-system); external sinks need idempotency.
- **Models:** true-streaming (Flink, low latency) vs micro-batch (Spark, high throughput).

---

## 8. Batch/stream unification (9.7)

| | Batch | Stream |
|---|---|---|
| Input | bounded, finite | unbounded |
| Latency | high | low |
| Completeness | exact | watermark-bounded |
| Reprocess | re-run | replay log |

- **Dual-system problem:** same logic implemented twice.
- **Lambda:** batch (exact) + speed (real-time) + serving merge → **dual code paths** (avoid).
- **Kappa:** stream-only + **replay** for reprocessing → one code path (needs retention + idempotent outputs).
- **Unification:** batch = streaming over a bounded input → one engine (Beam/Flink/Spark), write logic once.
- **Enabler:** immutable append-only source + reprocessing → rebuildable derived views (event sourcing).

---

## 9. CDC + Outbox — no dual writes (9.8)

```
DUAL WRITE (broken): update DB, then publish event/update index → crash between = inconsistent
FIX: one atomic write + derive the rest from the change stream.
```
- **CDC:** tail the DB's WAL (5.3.1) → ordered change events keyed by PK → log → derived stores sync (cache/index/warehouse/views/services). Log-based > query-based.
- **Outbox:** write business change + event row in ONE local transaction (atomic); relay/CDC publishes (at-least-once → idempotent consumers).
- **CDC + outbox** = reliable atomic emission + ordered replayable change streams = the integration backbone.
- Correctness: key by PK (order), idempotent consumers (last-applied-version + upsert), schema evolution, snapshot+stream, accept lag.

---

## 10. Backpressure, DLQ, poison messages (9.9)

- **Backpressure:** producers > consumers → bound buffers (block/reject), pull-based (lag = signal), scale consumers, propagate upstream, **load-shed** loss-tolerant data. Never grow unbounded.
- **Consumer lag** = primary overload signal → monitor/alert/scale.
- **Poison message:** consistently fails → at-least-once redelivers forever + **head-of-line blocks** an ordered partition.
- **Retry + DLQ:** bounded retries (backoff+jitter; transient→retry, permanent→DLQ sooner; retry topics) → **DLQ** (quarantine + inspect/fix/reprocess); pipeline continues.
- **Ordering vs liveness:** DLQ-and-continue (may break order) vs halt-on-poison (preserve order, stall) — choose per flow.
- **Unwatched DLQ = silent data loss** → monitor depth + runbook.

---

## 11. Red flags

- Non-idempotent consumers under at-least-once → duplicate effects (double charge/order).
- Believing in "exactly-once delivery" / assuming EOS covers external side effects.
- Wrong model: queue where you needed fan-out (or vice versa); broker where you needed replay.
- Expecting global ordering from a multi-partition topic; hot partition from a skewed key.
- **Dual writes** (DB then index/event) → inconsistency; publishing events from app code instead of outbox.
- Query-based CDC (misses deletes); not keying CDC by PK.
- Unbounded buffers / no backpressure; infinite/uncapped retries; no DLQ (poison blocks partition); unwatched DLQ.
- Processing-time windows when event-time correctness is needed; watermark too aggressive (drop late) or too conservative (latency).
- Lambda dual-path drift; forcing streaming where batch fits.

---

*Cross-references: [9.1–9.9], [8.4.1 delivery/idempotency], [8.4.2 async middleware], [7.6 queue tier], [6.5 CDC-driven invalidation], [5.1.2 derived data/materialized views], [5.3.1 WAL], [3.3.4 backpressure], [Part 10 consistency], [Part 11 resilience], [Part 12 microservices], [Part 20 event sourcing].*

# Build Progress Tracker

> **Purpose:** This file lets any new chat session resume building the platform without the prior conversation's context. It records what's done, what's next, and the working conventions.

> **How to resume in a fresh chat:** paste this prompt →
> *"Continue building the System Design Mastery platform in `c:\Users\athar\Downloads\System Design\platform`. Read `PROGRESS.md`, `01-CURRICULUM-MAP.md`, and `app/manifest.js` to see current state, then continue from the 'NEXT UP' section. Keep the same 17-section lesson template, depth, and conventions. Register each new lesson in `app/manifest.js` and update this PROGRESS.md as you finish."*

---

## Conventions (keep consistent)
- **Lesson template:** the fixed 17 sections (see `00-START-HERE.md`). University-lecture depth + engineering-review rigor.
- **Integrity tags:** `[CS]` established CS · `[CONV]` industry convention · `[BP]` best practice · `[EMERGING]` newer/contested · `[OPINION]`. Mark company internals "representative"; never invent benchmarks.
- **File naming:** `lessons/part-XX-name/N.M.L-slug.md`.
- **After each lesson:** add an entry to `app/manifest.js` (under the right Part/Module) so it appears in the app.
- **After each Part:** add a Part `README.md` index, flip the Part `status` to `"done"` in `manifest.js`, flip the next Part to `"in-progress"`, and update this file.
- **Reference sheets:** live in `reference/`; create them as their topic's lesson lands. Register each new reference sheet in the `reference:` array of `app/manifest.js` too.
- **The app** (`app/`) is built once and reads `manifest.js` — no rebuild needed; just register lessons.

## Environment quirks (read before resuming)
- **Shell is broken for verification:** the terminal injects an incompatible `cd "..." ;` prefix (cmd can't parse it), so `node --check` etc. fail. **To validate `manifest.js` after editing, use the `get_diagnostics` tool on it** (it reports JS syntax errors) — do NOT rely on the shell.
- **Per-lesson depth is high (~400–600 lines each).** A full Part = ~10–17 lessons. Expect to write lessons in batches across turns; keep going part-by-part without pausing to ask (user preference).
- **Folder naming so far:** `part-01-mindset` … `part-19-interview-designs`, `part-20-capstone`. **All parts complete.**
- **manifest.js shape:** each Part object has `status` (`done`/`in-progress`/`planned`) and a `modules: []` array; each module has `title` + `lessons: [{id, title, path}]`. Paths are relative to `platform/` (e.g., `lessons/part-06-caching/6.1-....md`).

---

## STATUS SUMMARY
- **Part 1 — Mindset:** ✅ COMPLETE (12 lessons + README)
- **Part 2 — Architecture Fundamentals:** ✅ COMPLETE (17 lessons + README)
- **Part 3 — Networking:** ✅ COMPLETE (15 lessons + README)
- **Part 4 — Storage Systems:** ✅ COMPLETE (10 lessons + README)
- **Part 5 — Databases:** ✅ COMPLETE (15 lessons + README)
- **Part 6 — Caching:** ✅ COMPLETE (7 lessons + README + 1 reference sheet)
- **Part 7 — Scalability:** ✅ COMPLETE (7 lessons + README + 1 reference sheet)
- **Part 8 — Distributed Systems Core:** ✅ COMPLETE (17 lessons + README + 2 reference sheets)
- **Part 9 — Messaging & Streaming:** ✅ COMPLETE (9 lessons + README + 1 reference sheet)
- **Part 10 — Consistency & Replication:** ✅ COMPLETE (9 lessons + README + 1 reference sheet)
- **Part 11 — Fault Tolerance & Resilience:** ✅ COMPLETE (8 lessons + README + 1 reference sheet)
- **Part 12 — Microservices:** ✅ COMPLETE (9 lessons + README + 1 reference sheet)
- **Part 13 — Cloud Native:** ✅ COMPLETE (8 lessons + README + 1 reference sheet)
- **Part 14 — Reliability Engineering (SRE):** ✅ COMPLETE (8 lessons + README + 1 reference sheet)
- **Part 15 — Security:** ✅ COMPLETE (8 lessons + README + 1 reference sheet)
- **Part 16 — Observability:** ✅ COMPLETE (6 lessons + README + 1 reference sheet)
- **Part 17 — Performance Engineering:** ✅ COMPLETE (6 lessons + README + 1 reference sheet)
- **Part 18 — Real-World Architectures:** ✅ COMPLETE (8 lessons + README + 1 reference sheet)
- **Part 19 — Interview System Designs:** ✅ COMPLETE (20 lessons [10 Vol-1 + 10 Vol-2] + README + 1 reference sheet)
- **Part 20 — Enterprise Capstone:** ✅ COMPLETE (13 lessons 20.1–20.13 + README + 1 reference sheet)
- **Total lessons written: 209** + 23 reference sheets + 20 Part READMEs + interactive app.
- **🎉 PLATFORM COMPLETE — all 20 Parts done.**

---

## DONE (detailed)

### Backbone docs (`platform/`)
00-START-HERE · 01-CURRICULUM-MAP · 02-LEARNING-ROADMAP · 03-CONCEPT-DEPENDENCY-GRAPH · 04-STUDY-SCHEDULES

### Reference sheets (`reference/`)
- latency-and-estimation-cheatsheet.md
- tradeoff-worksheet.md
- architecture-comparison-matrix.md
- protocol-selection-cheatsheet.md
- storage-engine-comparison.md
- database-selection-decision-tree.md
- isolation-levels-and-anomalies.md
- caching-patterns-decision-table.md
- scalability-and-partitioning-cheatsheet.md
- consensus-and-quorums-cheatsheet.md
- time-and-ordering-cheatsheet.md
- messaging-guarantees-comparison.md
- consistency-and-cap-decision-tree.md
- resilience-patterns-cheatsheet.md
- microservices-patterns-cheatsheet.md
- cloud-native-kubernetes-cheatsheet.md
- sre-slo-error-budget-cheatsheet.md
- security-cheatsheet.md
- observability-cheatsheet.md
- performance-cheatsheet.md
- real-world-architectures-cheatsheet.md
- interview-designs-cheatsheet.md
- capstone-blueprint.md

### App (`app/`)
index.html, styles.css, app.js, manifest.js, launch.bat, README.md — run via `launch.bat` or `python -m http.server 8080` in `platform/` then open `http://localhost:8080/app/`.

### Part 1 — Mindset (12) ✅
1.1.1 What System Design Is · 1.1.2 FR vs NFR · 1.1.3 Vocabulary of Scale · 1.1.4 Capacity Estimation · 1.1.5 Tradeoffs · 1.2.1 Big Four (scalability/perf/avail/reliability) · 1.2.2 Maintainability/Evolvability/Operability/Observability · 1.2.3 Security/Compliance/Cost · 1.2.4 Conflicting Characteristics · 1.3.1 Design Framework · 1.3.2 Driving a Design Conversation · 1.3.3 ADRs

### Part 2 — Architecture Fundamentals (17) ✅
2.1.1 Cohesion/Coupling/Connascence · 2.1.2 Layering/Hexagonal/Clean · 2.1.3 DDD Essentials · 2.2.1 Monolith/Modular Monolith · 2.2.2 Layered/Pipeline/Microkernel · 2.2.3 Service-Based/Microservices/SOA · 2.2.4 Event-Driven · 2.2.5 Space-Based · 2.3.1 Characteristics→Style Selection · 2.3.2 The Hard Parts · 2.3.3 Tech Debt/Fitness Functions/Evolutionary · 2.4.1 SOLID/GRASP · 2.4.2 Design Patterns · 2.4.3 Concurrency Patterns · 2.4.4 LLD Case Studies · 2.4.5 LLD→HLD

### Part 3 — Networking (15) ✅
**Module 3.1 (✅):** 3.1.1 Layered Model · 3.1.2 IP/Routing/NAT/Subnets · 3.1.3 TCP Deep Dive · 3.1.4 UDP · 3.1.5 QUIC
**Module 3.2 (✅):** 3.2.1 HTTP/1.1 Semantics · 3.2.2 HTTP/2 & HTTP/3 · 3.2.3 TLS/SSL/mTLS/PKI · 3.2.4 DNS · 3.2.5 WebSockets/SSE/Long-Polling · 3.2.6 API Styles & Serialization (REST/gRPC/GraphQL, Protobuf/Thrift/Avro)
**Module 3.3 (✅):** 3.3.1 Load Balancing (L4/L7, algorithms, health checks) · 3.3.2 Reverse Proxies/API Gateways/Ingress · 3.3.3 CDNs (edge caching, invalidation, anycast) · 3.3.4 Connection Management (keep-alive, pooling, backpressure)
**+ Part 3 README** (index, through-line, end-to-end request path, self-check).

### Part 4 — Storage Systems (10) ✅
**Module 4.1 (✅):** 4.1.1 Memory Hierarchy & Sequential vs Random I/O · 4.1.2 Disks/Page Cache/fsync/Write Amplification · 4.1.3 Block vs File vs Object Storage
**Module 4.2 (✅):** 4.2.1 Log-Structured vs Page-Oriented · 4.2.2 B-Trees · 4.2.3 LSM-Trees · 4.2.4 B-Tree vs LSM Tradeoffs (RUM amplification) · 4.2.5 Indexing
**Module 4.3 (✅):** 4.3.1 Data Encoding & Schema Evolution · 4.3.2 Object/Blob Storage Internals & Lifecycle
**+ Part 4 README** + `reference/storage-engine-comparison.md`.

### Part 5 — Databases (15) ✅
**Module 5.1 (✅):** 5.1.1 Data Models (relational/document/KV/wide-column/graph) · 5.1.2 Normalization vs Denormalization · 5.1.3 Polyglot Persistence
**Module 5.2 (✅):** 5.2.1 ACID · 5.2.2 Isolation Levels · 5.2.3 Anomalies (incl. lost update & write skew) · 5.2.4 Concurrency Control (2PL/MVCC/OCC/SSI) · 5.2.5 Locking/Deadlocks
**Module 5.3 (✅):** 5.3.1 WAL/Checkpoints/Crash Recovery (ARIES) · 5.3.2 Query Execution & Optimization
**Module 5.4 (✅):** 5.4.1 SQL vs NoSQL vs NewSQL · 5.4.2 Connection Pooling/Read Replicas/Failover · 5.4.3 Schema Migrations Without Downtime
**+ Part 5 README** + `reference/database-selection-decision-tree.md` + `reference/isolation-levels-and-anomalies.md`.

### Part 6 — Caching (7) ✅
**Module 6 (✅, flat list):** 6.1 Why Caching Works (locality/skew, hit ratio, `T_avg`, cache-as-losable-copies) · 6.2 Cache Topologies (browser→CDN→proxy→local→distributed→buffer pool; local vs distributed; near-cache) · 6.3 Patterns (cache-aside/read-through; write-through/back/around; the stale-set race; delete-don't-update) · 6.4 Eviction (Bélády; LRU/LFU/ARC/W-TinyLFU/CLOCK; sampling; TTL+jitter) · 6.5 Invalidation (why hard; TTL/purge/versioned-keys/tags-generations/CDC; staleness budget; read-your-writes) · 6.6 Distributed Caching (Memcached vs Redis; RDB/AOF; consistent hashing vs mod N; Cluster/Sentinel; async replication) · 6.7 Stampede/Hotspots/Thundering Herd (self-amplifying loop; jitter, coalescing/single-flight, per-key lock, XFetch early recompute, serve-stale, warming, hot-key handling, source-side backpressure/shedding/breaker).
**+ Part 6 README** + `reference/caching-patterns-decision-table.md`.

### Part 7 — Scalability (7) ✅
**Module 7 (✅, flat list):** 7.1 Vertical vs Horizontal (statelessness as enabler; Amdahl/USL) · 7.2 Stateless Services + Externalized State (sticky/JWT/shared-store sessions; relocate not remove; legitimately-stateful = partition by key) · 7.3 Sharding/Partitioning (range/hash/consistent-hashing+vnodes/directory; partition key is the decision; local vs global secondary indexes; cross-shard cost) · 7.4 Hotspots/Skew/Rebalancing (data vs load skew; append/celebrity hotspots; salt/cache/replicate/split/isolate; rebalance moving little data, never mod N; rebalance-storm cascade) · 7.5 Read vs Write Scaling (copy for reads / split for writes; replication lag anomalies; sync/async/semi-sync; CQRS; diagnose bound) · 7.6 Multi-Tier & DB Bottleneck (difficulty increases inward; one binding constraint; USE; cost-ordered relief cache→replicas→pooler→async queue→shard) · 7.7 Capacity Planning & Load Testing (Little's Law; utilization knee 1/(1−ρ); load/stress/soak/spike; plan to peak + N+1 headroom; static vs autoscaling + non-elastic DB + load-shed backstop).
**+ Part 7 README** + `reference/scalability-and-partitioning-cheatsheet.md`.

### Part 8 — Distributed Systems Core (17) ✅
**Module 8.1 (✅):** 8.1.1 Unreliable Networks/Partitions/Partial Failure · 8.1.2 Unreliable Clocks (monotonic vs wall-clock; LWW data loss) · 8.1.3 Timeouts/Retries/Failure Detection (undecidable; phi-accrual; slow vs dead)
**Module 8.2 (✅):** 8.2.1 Lamport Timestamps · 8.2.2 Vector Clocks/Causal Ordering (version vectors/siblings) · 8.2.3 Happens-Before; Total vs Partial Order (total-order broadcast=consensus) · 8.2.4 HLC & TrueTime
**Module 8.3 (✅):** 8.3.1 Consensus Problem & FLP · 8.3.2 Paxos · 8.3.3 Raft · 8.3.4 Quorums (R+W>N) · 8.3.5 Leader Election/Failure Detectors/Membership (gossip, SWIM) · 8.3.6 Distributed Locks & Fencing · 8.3.7 Byzantine Faults & BFT · 8.3.8 Coordination Services (ZooKeeper/etcd)
**Module 8.4 (✅):** 8.4.1 RPC Semantics/Failure Modes/Idempotency (exactly-once effects) · 8.4.2 Middleware & Distributed Objects (CORBA→REST/gRPC/brokers/mesh)
**+ Part 8 README** + `reference/consensus-and-quorums-cheatsheet.md` + `reference/time-and-ordering-cheatsheet.md`.

### Part 9 — Messaging & Streaming (9) ✅
**Module 9 (✅, flat list):** 9.1 Messaging Fundamentals (queues/topics, push/pull, delivery semantics) · 9.2 Brokers vs Logs (delete-on-consume vs append-and-retain; replay) · 9.3 Distributed Log (partitions/offsets/consumer-groups/retention/compaction/ISR/rebalancing) · 9.4 Delivery Guarantees (exactly-once *effects* not delivery; EOS scope) · 9.5 Ordering/Partition Keys/Idempotent Consumers (per-key last-applied-version) · 9.6 Stream Processing (windows, event vs processing time, watermarks, stateful operators/checkpointing) · 9.7 Batch/Stream Unification (Lambda vs Kappa; batch = bounded stream; immutability + reprocessing) · 9.8 Data Pipelines/CDC/Outbox (no dual writes; tail the WAL; atomic DB-change+event) · 9.9 Backpressure/DLQ/Poison Messages (bounded buffers, lag-scaling, shedding, bounded retries, DLQ, ordering-vs-liveness).
**+ Part 9 README** + `reference/messaging-guarantees-comparison.md`.

### Part 10 — Consistency & Replication (9) ✅
**Module 10 (✅, flat list):** 10.1 Replication Topologies (single-leader/multi-leader/leaderless; single-orderer vs write-anywhere) · 10.2 Sync vs Async Replication + Lag (RPO; semi-sync; failover loss) · 10.3 Read-Your-Writes/Monotonic/Consistent-Prefix (session guarantees ≈ causal) · 10.4 Conflict Detection & Resolution (version vectors; LWW/siblings/CRDTs; invariants need consensus) · 10.5 Consistency Spectrum (strong→sequential→causal→session→eventual; weakest-correct; causal sweet spot) · 10.6 Linearizability vs Serializability (recency vs isolation; orthogonal; strict serializability = both) · 10.7 CAP (C=linearizability; P mandatory; CP vs AP; "pick 2 of 3" myth) · 10.8 PACELC (if P→A|C, else→L|C; the everyday tradeoff CAP misses) · 10.9 Quorum Tuning & Sloppy Quorums (N/R/W dial; hinted handoff; quorum≠linearizability).
**+ Part 10 README** + `reference/consistency-and-cap-decision-tree.md`.

### Part 11 — Fault Tolerance & Resilience (8) ✅
**Module 11 (✅, flat list):** 11.1 Failure Models & Fallacies (fault→error→failure; crash/omission/timing/Byzantine; MTBF/MTTR; independent vs correlated) · 11.2 Redundancy/Replication/Failover (no SPOF; active-active/passive; N+ headroom; fenced+quorum-gated+caught-up failover) · 11.3 Resilience Patterns (timeout/retry+backoff+jitter/circuit-breaker/bulkhead → prevent cascades & metastable failures) · 11.4 Graceful Degradation & Load Shedding (degrade-don't-collapse; fallbacks; prioritized shedding; fail-fast vs fail-safe; fail-open/closed) · 11.5 Idempotency/Dedup/Exactly-Once Effects (makes recovery safe; keys+dedup/state-based/CAS; at-least-once+idempotency=exactly-once effects) · 11.6 Distributed Transactions 2PC/3PC (prepare/commit; blocking problem; CP/fragile; avoid) · 11.7 Sagas (local txns + compensations; orchestration vs choreography; no isolation; irreversible-last) · 11.8 Disaster Recovery (RPO/RTO; backups≠replicas/3-2-1/PITR/immutable; backup-restore→pilot-light→warm-standby→active-active; TEST it).
**+ Part 11 README** + `reference/resilience-patterns-cheatsheet.md`.

### Part 12 — Microservices (9) ✅
**Module 12 (✅, flat list):** 12.1 Why/Why-Not (real benefits vs underestimated costs; microservices = org solution; monolith-first + decomposition triggers; distributed-monolith/cargo-cult traps) · 12.2 Decomposition (boundaries=destiny; by business capability + bounded context/DDD; cohesion/coupling litmus; layer/entity/nano/god anti-patterns; same concept→per-context model+shared id; ACL) · 12.3 Communication (sync couples time+knowledge, chains multiply latency/availability→cascade; async/events decouple deepest; coarse use-case APIs; compatible evolution+versioning; NEVER break consumers; wrap every call in resilience+idempotency) · 12.4 Data (database-per-service; shared DB fatal; no cross-service ACID→sagas / no joins→API-composition vs CQRS materialized views + event-carried state transfer; eventual consistency; keep invariant-bound data together) · 12.5 Saga & Outbox (local txns+compensations; orchestration vs choreography; dual-write problem→transactional outbox+CDC; idempotency→exactly-once effects; no-isolation→semantic locks/ordering) · 12.6 Discovery/Gateway/BFF (registry+client/server-side discovery+health/TTL; API gateway single edge; BFF per client; north-south vs east-west) · 12.7 Service Mesh (sidecars=data plane + control plane; mTLS/identity zero-trust, traffic mgmt/canary/fault-injection, uniform observability; costs latency/resource/ops; scale decision; [EMERGING] sidecar-less/eBPF) · 12.8 Testing (E2E doesn't scale; pyramid unit→integration→component→contract→few E2E; consumer-driven contracts="never break a consumer"; compatibility≠correctness; testing in production canary/synthetic/observability) · 12.9 Migration (never big-bang; strangler fig façade routing; anti-corruption layer; zero-downtime data decomposition dual-write/CDC/backfill/verify; know when to stop).
**+ Part 12 README** + `reference/microservices-patterns-cheatsheet.md`.

### Part 13 — Cloud Native (8) ✅
**Module 13 (✅, flat list):** 13.1 Cloud-Native Model & 12/15-Factor (designed-to-exploit-cloud not merely hosted; cattle not pets; 12-factor config-in-env/stateless-processes/disposability/logs-as-streams + 15-factor API-first/telemetry/security; cloud-native≠microservices) · 13.2 Containers (isolated process = namespaces[see] + cgroups[use] + immutable layered image; OCI portability CRI→containerd→runc; vs VMs lighter/faster/denser/weaker-isolation; run-in-VMs + gVisor/Kata sandboxes) · 13.3 Kubernetes (declarative reconciliation→self-heal; Pod/ReplicaSet/Deployment/StatefulSet/DaemonSet/Job + Service; control plane API-server/etcd-Raft/scheduler/controller-mgr + node kubelet/runtime/kube-proxy; scheduler filter+score; liveness/readiness/startup probes; requests vs limits) · 13.4 Networking/Config/Stateful (flat pod net + Services/CoreDNS/kube-proxy; Ingress L7 edge; NetworkPolicy default-deny; ConfigMaps/Secrets[base64≠encrypted→etcd-encryption+external-manager]; StatefulSets+PV/PVC/StorageClass; prefer managed services for state) · 13.5 Autoscaling (HPA replicas + VPA size + Cluster-Autoscaler nodes compose; scale-to-zero+cold-start; metrics concurrency/queue-lag>CPU, target below knee; CRITICAL: doesn't scale non-elastic DB→pair with load shedding + bounds) · 13.6 Cloud-Native Patterns (multi-container pods; sidecar[add]/ambassador[proxy-outbound]/adapter[normalize-output]/init[setup-before]=decorator/proxy/adapter at container level; mesh=productized; library for single-language) · 13.7 IaC+Immutable+Deployments (IaC declarative version-controlled no-ClickOps-drift; immutable rebuild+replace; rolling[efficient/coexist] vs blue-green[instant-rollback/2x] vs canary[smallest-blast-radius/metric-gated]; feature flags; readiness+compatible-changes+auto-rollback) · 13.8 Multi-AZ/Multi-Region/Global Traffic (AZ=HA-baseline sync/cheap vs region=disaster-resilience+global-latency hard-async-data CAP/PACELC; GeoDNS/anycast/GSLB/CDN; active-passive vs active-active vs global-DB; map to RPO/RTO; test failover; global-config correlated-failure).
**+ Part 13 README** + `reference/cloud-native-kubernetes-cheatsheet.md`.

### Part 14 — Reliability Engineering (SRE) (8) ✅
**Module 14 (✅, flat list):** 14.1 SLI/SLO/SLA & Error Budget (measure→internal target→external contract SLA-looser; 100% wrong—impossible/costly/invisible; error budget=1−SLO a resource to spend; error-budget policy=reliability-vs-velocity arithmetic; user-centric percentile SLIs; burn-rate alerting) · 14.2 Toil & SRE Model (toil=manual/repetitive/automatable/no-value/scales-with-system; ≤50% cap; automate/eliminate yourself out; ops-as-engineering→sub-linear; error-budget-aligned dev/ops; SRE implements DevOps) · 14.3 Monitoring vs Observability & Golden Signals (monitoring=known-unknowns predefined; observability=unknown-unknowns arbitrary questions; distributed systems need it; four golden signals latency/traffic/errors/saturation; RED+USE; symptom vs cause; three pillars) · 14.4 Alerting & On-Call (alert fatigue corrosive; every page urgent+actionable+impact; symptom/SLO-burn-rate not cause-spam; page/ticket/notification tiers; humane bounded on-call + runbooks) · 14.5 Incident Response & Postmortems (minimize MTTR via structure; Incident Command IC/Ops/Comms/Scribe; mitigate-before-resolve stop-the-bleeding; blameless postmortems systems-not-people + tracked action items; human error=symptom) · 14.6 Capacity Planning & Forecasting (enough capacity at SLO cost-effectively ahead-of-time; organic+inorganic forecasting; load-test+headroom; autoscaling≠enough—non-elastic DB/quota/lead-times; under-vs-over provision) · 14.7 Release Engineering & Progressive Delivery (change=top outage cause; reproducible/automated/safe; CI/CD/continuous-deployment; progressive delivery gradual/controlled/observable/reversible canary metric-gated + error-budget-gated; small+frequent=faster AND safer DORA; supply chain) · 14.8 Chaos Engineering (deliberately inject failures to find weaknesses before outages; hypothesis→inject→observe→fix; minimize blast-radius+abort+budget-bound; fault types instance/latency/partition/dependency/resource/region; game days validate systems AND incident response; prereqs observability/resilience/IR/budget).
**+ Part 14 README** + `reference/sre-slo-error-budget-cheatsheet.md`.

### Part 15 — Security (8) ✅
**Module 15 (✅, flat list):** 15.1 Threat Modeling (security designed-in-not-bolted-on; four questions; STRIDE Spoofing/Tampering/Repudiation/Info-disclosure/DoS/Elevation; trust boundaries=never-trust-crossing-data; minimize attack surface; least-privilege/defense-in-depth/fail-secure/assume-breach/secure-by-default) · 15.2 AuthN/AuthZ (who≠what; broken access control #1; enforce authz server-side; sessions stateful/easy-revoke vs JWT stateless/hard-revoke→short-lived+refresh; RBAC/ABAC/ReBAC; OAuth2=delegated-authorization NOT login; OIDC=authentication) · 15.3 Cryptography (don't-roll-your-own; symmetric-fast/shared vs asymmetric-slow/keypair→hybrid-TLS; hash-integrity vs password-hash-slow+salted-bcrypt/argon2; MAC-shared-no-nonrepudiation vs signature-private-key-nonrepudiation; key management hardest→KMS/HSM) · 15.4 Encryption/Secrets (in-transit TLS-everywhere-incl-internal-mTLS + at-rest storage/field-level/tokenization + backups; secrets manager central/least-priv/audited/rotated/dynamic-short-lived; KMS+envelope-encryption DEK/KEK; never-commit-secrets; K8s base64→external+etcd-encryption) · 15.5 Network Security (perimeter-failed-lateral-movement→zero-trust-never-trust-network-verify-every-request-by-identity; assume-breach+micro-segmentation+least-privilege; mTLS via mesh 12.7; WAF-L7-not-a-fix; DDoS volumetric/protocol/L7-absorb-at-edge-CDN/anycast; defense-in-depth) · 15.6 OWASP/Injection/SSRF (Top-10 checklist; injection root cause=mixing-data-with-code→fix-separate-them parameterized-queries/output-encoding; allow-list-validation-not-substitute; SSRF-server-fetches-attacker-URLs→internal/metadata; broken-access-control) · 15.7 Rate Limiting (dual-purpose reliability+security; token/leaky-bucket/sliding-window; dimensions per-IP/user/key/global-combine; edge+distributed-Redis; brute-force/credential-stuffing/scraping/DoS + CAPTCHA/lockout/MFA/anomaly-detection) · 15.8 Compliance (first-class-driver-design-in; PII classification+minimization; GDPR data-rights-erasure-hard-crypto-shredding+residency; PCI scope-reduction-tokenization+processors; immutable-tamper-evident audit-logging-redact-secrets; reuses security controls; NOT legal advice).
**+ Part 15 README** + `reference/security-cheatsheet.md`.

### Part 16 — Observability (6) ✅
**Module 16 (✅, flat list):** 16.1 Three Pillars (metrics=detect/logs=diagnose/traces=localize; complementary-not-interchangeable; correlate via trace-IDs; cardinality/cost theme; limits→high-cardinality-wide-events for unknown-unknowns) · 16.2 Metrics/TSDB/Cardinality (time-series name+labels→points; specialized append/compressed TSDB LSM-lineage; CARDINALITY=dominant-cost-driver→bounded-labels-only, high-cardinality→logs/traces; pull vs push; downsampling/retention; histograms-for-percentiles) · 16.3 Structured Logging (structured-queryable>free-text; pipeline stdout→collect→enrich/redact→buffer/queue→store→query; levels+sampling+retention for cost; correlation-ID=trace-ID; NEVER-log-secrets/PII; operational≠audit) · 16.4 Distributed Tracing (traces+spans=request-path-across-services; context-propagation W3C-every-hop-incl-async; head-vs-tail-sampling; OpenTelemetry-instrument-once-export-anywhere; correlate with logs/metrics; localize-slow-hops/tail-latency/dependency-map) · 16.5 Dashboards/SLO-Alerts/Anomaly (purposeful-dashboards-golden-signals+SLO-not-vanity; SLO-burn-rate-multi-window-not-static-thresholds; anomaly-detection-promise+false-positive-pitfalls; detect→localize→diagnose workflow) · 16.6 Designing a Monitoring Platform (interview-grade synthesis; framework requirements→estimation→ingestion-push/pull+queue+shard→TSDB+retention→query→SLO-alerting→HA; cardinality-#1; monitoring-must-outlive-the-monitored; extend to logs+traces).
**+ Part 16 README** + `reference/observability-cheatsheet.md`.

### Part 17 — Performance Engineering (6) ✅
**Module 17 (✅, flat list):** 17.1 Methodology (measure-before-optimize; bottleneck-usually-not-where-you-think; USE-resource + RED-service; Amdahl-bounds-payoff; optimize-binding-constraint-to-SLO-then-stop; loop goal→measure→find→estimate→optimize→re-measure) · 17.2 Tail Latency (averages-lie→percentiles p99/p99.9; tail=what-users-feel; fan-out-amplification 1%×100≈63%-slow; tail-becomes-median; hedged-requests + reduce-fan-out; critical-path-analysis via traces) · 17.3 Concurrency/Parallelism (concurrency=deal-with-many-async/event-loop-for-I/O vs parallelism=do-many-cores-for-CPU; thread-per-request→C10K-wall→event-loops-C10M; NEVER-block-the-loop; Little's-Law sizes pools; contention/USL) · 17.4 Reducing Latency (attack fixed-per-op-overhead=round-trips; batch-amortize/pipeline-overlap/reuse-no-resetup/prefetch-hide/cache-avoid; minimize-round-trips; tradeoffs) · 17.5 Data-Layer (DB-usually-bottleneck-highest-ROI; slow-queries→indexes/EXPLAIN; N+1→batch/eager-load; hot-partitions→key-design/salting/cache/replicate; cost-order relief) · 17.6 Cost/Efficiency (efficiency=performance-per-dollar-cost-per-request; meet-SLO-at-min-cost-not-as-fast-as-possible; both-win-optimizations-waste/caching; levers right-size/autoscale/spot/tiered; hidden-costs-egress; FinOps; build-vs-buy).
**+ Part 17 README** + `reference/performance-cheatsheet.md`.

### Part 18 — Real-World Architectures (8) ✅ *(representative case studies)*
**Module 18 (✅, flat list):** 18.1 Distributed Log (Kafka/LinkedIn; append-only-log-as-central-abstraction; O(N²)→O(N) hub-and-spoke; unifies messaging/integration-CDC/streaming/event-sourcing; everything=materialization-of-log) · 18.2 Wide-Column (Bigtable/Dynamo/Cassandra/DynamoDB; LSM+consistent-hashing+leaderless-quorums+tunable-consistency+conflict-resolution+query-driven-denormalized; AP horizontal-write-scale, gives up joins/ACID/strong-consistency) · 18.3 Globally-Distributed SQL (Spanner/Cockroach; relational+ACID+strong-consistency AT scale; range-shard+consensus-per-shard+2PC-over-consensus+MVCC+TrueTime/HLC; CP pays latency; counterpoint to 18.2) · 18.4 CDN & Edge (Cloudflare; anycast+edge-PoPs+origin-shielding+DDoS-absorption+WAF+edge-compute; global-invalidation-hard; default first tier) · 18.5 Streaming/Recommendations (Netflix; 3 subsystems video-CDN/ABR + control-plane-microservices/resilience/chaos-origin + data-ML-log→batch/stream→cached-recs; separate video/control + online/offline) · 18.6 Ride-Sharing/Geo (Uber; geospatial-indexing-geohash/S2+geo-sharding+high-write-streaming-location+atomic-matching+trip-sagas+real-time-push; split real-time-geo-eventual vs trip/payments-strong) · 18.7 Search (Elasticsearch/Lucene; inverted-index+text-analysis+BM25-relevance+sharding/scatter-gather-fan-out+immutable-segments/NRT; derived-read-model-CQRS-via-CDC, eventually-consistent) · 18.8 Chat (WhatsApp/Discord; persistent-connections-C10M+connection-registry+routing/pub-sub+wide-column-storage+delivery/ordering/dedup+feed-style-fan-out+presence+E2E). **Meta-lessons:** every decision follows from a requirement; large systems=compositions of subsystems; split by consistency/latency profile; right tool (polyglot); recurring patterns (fan-out/scatter-gather/CDN/geo/CQRS-CDC). All REPRESENTATIVE, no invented benchmarks.
**+ Part 18 README** + `reference/real-world-architectures-cheatsheet.md`.

### Part 19 — Interview System Designs (20) ✅ *(design problems; framework-driven; representative)*
**Module 19.1 — Volume 1 (10):** 19.1.1 URL shortener (read-heavy→cache-first+KV; counter+base62) · 19.1.2 rate limiter (token-bucket+shared-atomic-Redis; counter-store bottleneck; fail-open) · 19.1.3 web crawler (frontier+dedup+politeness+distributed fetchers) · 19.1.4 notification system (multi-channel fan-out+provider-adapters+idempotency) · 19.1.5 news feed/Instagram (hybrid push/pull+cached feeds) · 19.1.6 chat/WhatsApp (C10M persistent-conns+registry+routing+delivery/ordering) · 19.1.7 file sync/Dropbox (chunking+content-addressed-dedup+metadata+object-store) · 19.1.8 video/YouTube (transcode pipeline+ABR+CDN) · 19.1.9 autocomplete (trie+cached top-K) · 19.1.10 ID generator+KV (Snowflake/block-allocation; consistent-hashing KV).
**Module 19.2 — Volume 2 (10):** 19.2.1 Google Docs (concurrent shared state→OT/CRDT+WebSockets+op-log; convergence+causality) · 19.2.2 news feed deep (celebrity hot-key→hybrid fan-out+async workers+cursor pagination) · 19.2.3 payment system (idempotency+double-entry-ledger+saga/outbox+reconciliation; CP) · 19.2.4 ride-sharing/Uber (geo-index+streaming-ingest+geo-shard+atomic-matching+trip-saga; consistency-split) · 19.2.5 distributed lock (lease+fencing-token+consensus-store CP; efficiency-vs-correctness locks) · 19.2.6 metrics platform (buffered-ingest+compressed-LSM-TSDB+downsampling+bounded-cardinality+SLO-alerting+outlive-the-monitored) · 19.2.7 recommendations (offline-precompute+online-two-stage-retrieve→rank+streaming-freshness+A/B) · 19.2.8 proximity/Yelp (density-adaptive-geo-index+read-heavy-cache-first; contrast ride-sharing) · 19.2.9 ad click aggregator (log-ingest+event-time-windowed-aggregation+watermarks+exactly-once+Lambda/Kappa+hot-key-pre-agg) · 19.2.10 matching engine (sequenced-total-order-input-log+deterministic-single-threaded-in-memory-matcher+replicated-state-machine-HA+market-data-fan-out; correctness+ordering over parallelism). **Meta-skill:** recognize the key signal → dominant pattern → hardest deep dive → bottleneck. Every design = framework + composition of Parts 1–18.
**+ Part 19 README** + `reference/interview-designs-cheatsheet.md`.

### Part 20 — Enterprise Capstone: Wealth Management Platform (13) ✅ *(integration finale; representative)*
**Module 20 (✅):** 20.1 Domain/requirements/compliance/bounded-contexts (DDD→services; correctness/compliance/security-first NFR ordering; compliance as design driver — KYC/AML/PCI/GDPR/SOX) · 20.2 Capacity & SLOs (three workloads read-heavy/write-critical/market-data-firehose; per-context SLOs not global; error budgets tight-for-money/generous-for-reads; peak+N+1, autoscale elastic + provision/shed non-elastic ledger) · 20.3 AuthN/authZ/identity (MFA+OIDC/OAuth2; short-JWT+refresh+revocation; RBAC+**ReBAC** advisor→assigned-clients+ABAC; KYC/AML onboarding; gateway+per-service defense-in-depth; attributable) · 20.4 Portfolio/transactions/ledger (immutable double-entry ACID CP ledger=source-of-truth; idempotency→exactly-once; derived cached eventual portfolio read model=CQRS; invariant-bound strong / derived eventual) · 20.5 Market-data ingestion (normalize→distributed-log-partitioned-by-instrument→two consumers: real-time fan-out+latest-price-cache & compressed-downsampled-TSDB→event-time stream processing; eventual, decoupled from CP ledger; reuses 19.2.9/16.2/18.1) · 20.6 Distributed transactions & saga (not-2PC; orchestrated sagas+compensations for money flows; semantic-locks for no-isolation; transactional-outbox no-dual-writes; idempotent steps; eventual cross-context / strong within ledger step) · 20.7 CQRS+event-sourcing (immutable event log=truth+state-is-replay; tamper-evident audit for-free=SOX; multiple rebuildable eventually-consistent projections; snapshots+event-versioning; apply only where audit/multi-view/correctness justify) · 20.8 Search/recs/AI (inverted-index derived permission-filtered read model — 18.7/20.7/20.3; recs=19.2.7 offline/online two-stage + suitability/fiduciary filter + explainability + audit; AI=isolated non-critical-path resilient enrichment; all off CP path) · 20.9 Caching/object-storage/CDN/gateway (cache derived views event-invalidated — **never the auth truth**; object storage encrypted signed-URLs; CDN static/public/WAF-DDoS not private data; gateway+BFF single secure aggregating edge) · 20.10 Reliability HA/DR/multi-region/K8s (AZ redundancy+N+1+safe failover; K8s+autoscale elastic, provision/shed ledger DB; per-context multi-region CP-ledger-sync/active-passive vs eventual-reads-active-active; RPO≈0 money + immutable tested backups; test failover+chaos) · 20.11 Security/compliance/rate-limiting/breakers/locks (zero-trust+defense-in-depth+encryption/secrets; operational compliance audit/KYC-AML/PCI/GDPR; dual-purpose rate limiting token-bucket+shared-atomic-Redis — 19.1.2; resilience on every dependency — 11.3; correct locks only-where-needed lease+fencing+consensus — 19.2.5; **money/security fail-closed, reliability fail-open**) · 20.12 Observability+PRR (three correlated pillars via OpenTelemetry metrics-detect/traces-localize/logs-diagnose; distributed-trace the saga; SLO burn-rate alerting+humane on-call; structured IR+blameless postmortems; **production-readiness review = launch gate**; monitoring outlives the monitored) · 20.13 Full architecture review (assemble all; **decision→requirement→alternative-rejected** table; through-lines: every-decision-from-a-requirement / consistency-split CP-write-core + eventual-read-halo linked by ledger events / correctness+derived-data patterns / defense-in-depth / operability-designed-in; run the review = demonstration of **judgment** = the course's true output). **Meta:** a CP write core + eventual derived read halo, linked by ledger events; every decision defended by a requirement + weighed alternative. All REPRESENTATIVE, no invented benchmarks.
**+ Part 20 README** + `reference/capstone-blueprint.md`.

---

## 🎉 PLATFORM COMPLETE

All **20 Parts** are done: **209 lessons + 23 reference sheets + 20 Part READMEs + backbone docs + interactive app**. The System Design Mastery platform spans mindset → architecture → networking → storage → databases → caching → scalability → distributed systems → messaging/streaming → consistency/replication → fault tolerance → microservices → cloud native → SRE → security → observability → performance → real-world architectures → interview designs → enterprise capstone.

- **To run the app:** `launch.bat` (or `python -m http.server 8080` in `platform/`, then open `http://localhost:8080/app/`).
- **All lessons registered** in `app/manifest.js` (verified clean via `get_diagnostics`); all Parts `status: "done"`.
- **Possible future enhancements** (optional, not required): additional reference sheets, spaced-repetition/flashcard export from the Revision Notes, diagrams gallery, or per-lesson exercises. The core curriculum is complete.

---

## Notes / decisions
- Books in the parent folder are reference material; synthesizing from canonical content (PDF text-extraction not used — impractical/low-quality in this environment). Stated to user; approved.
- User preference: continue part-by-part without pausing to ask; maximize depth and learning-friendliness; keep registering lessons in the app.
- **Last session ended:** **🎉 PLATFORM COMPLETE.** Part 19 (Interview System Designs, 20 lessons) and Part 20 (Enterprise Capstone, 13 lessons 20.1–20.13) both fully written, with READMEs and reference sheets (`interview-designs-cheatsheet.md`, `capstone-blueprint.md`), all registered in `manifest.js` (Parts 19 & 20 `status: "done"`, both reference sheets in the `reference:` array), manifest verified clean via `get_diagnostics`. **All 20 Parts are done — 209 lessons + 23 reference sheets + 20 Part READMEs + backbone docs + interactive app.** No resume needed; the curriculum is complete. Optional future work: extra reference sheets, flashcard export, exercises.
- **Quality bar to match:** look at any Part 5 lesson (e.g., `5.2.3-anomalies.md`) or `3.3.3-cdns.md` as the reference for depth, the 17-section structure, Mermaid diagrams, the extended real-world analogy, flashcard revision notes, and dense in-platform cross-references.

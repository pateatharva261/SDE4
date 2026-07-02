# Curriculum Map — System Design Mastery

20 Parts · ~70 Modules · ~260 Lessons · 1 Enterprise Capstone

Legend for difficulty: 🟢 Foundational · 🟡 Intermediate · 🔴 Advanced · ⚫ Staff+/Research

Each lesson ID is `P.M.L` (Part.Module.Lesson). Lesson files live under `lessons/part-XX-.../`.

---

## PART 1 — The Mindset of System Design 🟢
*Goal: install the mental models and vocabulary used by the rest of the platform.*

**Module 1.1 — Thinking in Systems**
- 1.1.1 What "system design" actually is (and isn't)
- 1.1.2 Functional vs non-functional requirements
- 1.1.3 The vocabulary of scale: latency, throughput, concurrency, utilization
- 1.1.4 Back-of-the-envelope capacity estimation
- 1.1.5 Tradeoffs as the core skill (there is no "best", only "best given constraints")

**Module 1.2 — Quality Attributes (Architecture Characteristics)**
- 1.2.1 Scalability, performance, availability, reliability — precise definitions
- 1.2.2 Maintainability, evolvability, operability, observability
- 1.2.3 Security, compliance, cost as first-class characteristics
- 1.2.4 How characteristics conflict and how to prioritize them

**Module 1.3 — The Design Process**
- 1.3.1 A repeatable interview/real-world design framework
- 1.3.2 Driving a design conversation: clarify → estimate → API → data → HLD → deep dive → bottlenecks
- 1.3.3 Documenting decisions: ADRs (Architecture Decision Records)

---

## PART 2 — Architecture Fundamentals 🟢🟡
*Goal: the structural building blocks and styles before any distributed concern.*

**Module 2.1 — Components & Coupling**
- 2.1.1 Modularity, cohesion, coupling, connascence
- 2.1.2 Layering, ports & adapters (hexagonal), clean architecture
- 2.1.3 Domain-Driven Design essentials: bounded contexts, aggregates, ubiquitous language

**Module 2.2 — Architecture Styles**
- 2.2.1 Monolith and the modular monolith
- 2.2.2 Layered, pipeline, microkernel/plugin
- 2.2.3 Service-based vs microservices vs SOA
- 2.2.4 Event-driven architecture (broker vs mediator topologies)
- 2.2.5 Space-based / in-memory-grid architectures

**Module 2.3 — Decisions & Tradeoffs**
- 2.3.1 Architecture characteristics → style selection (decision matrix)
- 2.3.2 The "Hard Parts": decomposition, data ownership, communication tradeoffs
- 2.3.3 Technical debt, fitness functions, evolutionary architecture

**Module 2.4 — Low-Level Design (LLD)**
- 2.4.1 SOLID, GRASP, and design smells at the class level
- 2.4.2 Creational/structural/behavioral patterns that matter for systems
- 2.4.3 Concurrency patterns (producer-consumer, thread pools, futures, actors)
- 2.4.4 LLD case studies: parking lot, rate limiter object model, in-memory cache, BookMyShow
- 2.4.5 From LLD to HLD: where the boundary really is

---

## PART 3 — Networking Deep Dive 🟡
*Goal: the substrate every distributed system runs on.*

**Module 3.1 — The Transport & Internet Layers**
- 3.1.1 The layered model in practice (L3/L4/L7)
- 3.1.2 IP, routing, NAT, subnets (what an architect must know)
- 3.1.3 TCP: handshake, flow control, congestion control, head-of-line blocking
- 3.1.4 UDP and when datagrams win
- 3.1.5 QUIC and the motivation behind it

**Module 3.2 — Application Protocols**
- 3.2.1 HTTP/1.1 semantics, methods, status codes, caching headers
- 3.2.2 HTTP/2 multiplexing; HTTP/3 over QUIC
- 3.2.3 TLS/SSL handshake, certificates, mTLS, PKI
- 3.2.4 DNS: resolution, records, TTLs, GeoDNS, DNS as a load-balancing tool
- 3.2.5 WebSockets, Server-Sent Events, long polling — real-time transport tradeoffs
- 3.2.6 gRPC, REST, GraphQL, and Protobuf/Thrift/Avro serialization

**Module 3.3 — Edge & Traffic Management**
- 3.3.1 Load balancing: L4 vs L7, algorithms, health checks
- 3.3.2 Reverse proxies, API gateways, ingress
- 3.3.3 CDNs: caching at the edge, invalidation, anycast
- 3.3.4 Connection management: keep-alive, pooling, backpressure

---

## PART 4 — Storage Systems 🟡🔴
*Goal: how bytes are actually stored, indexed, and retrieved.*

**Module 4.1 — Storage Hardware Reality**
- 4.1.1 Memory hierarchy, sequential vs random I/O, the latency numbers every engineer should know
- 4.1.2 Disks (HDD/SSD/NVMe), page cache, fsync, write amplification
- 4.1.3 Block vs file vs object storage

**Module 4.2 — Storage Engines**
- 4.2.1 Log-structured vs page-oriented engines
- 4.2.2 B-Trees: structure, search/insert/delete, page layout, WAL
- 4.2.3 LSM-Trees: memtable, SSTables, compaction, bloom filters
- 4.2.4 B-Tree vs LSM tradeoffs (read/write amplification, space)
- 4.2.5 Indexing: primary, secondary, covering, composite, partial; clustered vs non-clustered

**Module 4.3 — Encoding & Evolution**
- 4.3.1 Data encoding formats and schema evolution (backward/forward compatibility)
- 4.3.2 Object/blob storage internals and lifecycle (S3-style systems, representative)

---

## PART 5 — Databases 🟡🔴
*Goal: choose and operate the right database, understanding internals.*

**Module 5.1 — Data Models**
- 5.1.1 Relational, document, key-value, wide-column, graph — when each fits
- 5.1.2 Normalization vs denormalization; query-driven schema design
- 5.1.3 Polyglot persistence

**Module 5.2 — Transactions & Concurrency**
- 5.2.1 ACID precisely defined
- 5.2.2 Isolation levels: read committed, snapshot/repeatable read, serializable
- 5.2.3 Anomalies: dirty/non-repeatable reads, phantoms, write skew, lost updates
- 5.2.4 Concurrency control: 2PL, MVCC, optimistic vs pessimistic, SSI
- 5.2.5 Locking, deadlocks, and detection

**Module 5.3 — Durability & Recovery**
- 5.3.1 Write-ahead logging, checkpoints, crash recovery (ARIES-style concepts)
- 5.3.2 Query execution & optimization basics (planning, joins, cardinality)

**Module 5.4 — Database Selection & Operation**
- 5.4.1 SQL vs NoSQL vs NewSQL (Spanner/Cockroach/Yugabyte family, representative)
- 5.4.2 Connection pooling, read replicas, failover
- 5.4.3 Schema migrations without downtime

---

## PART 6 — Caching 🟡
*Goal: the highest-leverage performance tool, and its traps.*

- 6.1 Why caching works: locality, the cache as a probabilistic shortcut
- 6.2 Cache topologies: client, CDN, reverse-proxy, application, distributed
- 6.3 Patterns: cache-aside, read-through, write-through, write-back, write-around
- 6.4 Eviction policies: LRU, LFU, ARC, TTL, and their internals
- 6.5 Invalidation strategies and why it's "one of the two hard things"
- 6.6 Distributed caching with Redis/Memcached (representative): data structures, persistence, clustering
- 6.7 Cache stampede, hotspots, thundering herd, and mitigations (locks, request coalescing, jitter)

---

## PART 7 — Scalability 🟡🔴
*Goal: grow throughput and data size without falling over.*

- 7.1 Vertical vs horizontal scaling; statelessness as the enabler
- 7.2 Stateless services + externalized session/state
- 7.3 Sharding/partitioning strategies: range, hash, consistent hashing, directory
- 7.4 Hotspots, skew, and rebalancing
- 7.5 Read scaling (replicas) vs write scaling (sharding) vs both
- 7.6 Multi-tier scaling and the database as the usual bottleneck
- 7.7 Capacity planning and load testing

---

## PART 8 — Distributed Systems Core 🔴⚫
*Goal: the theory that makes everything else correct.*

**Module 8.1 — Fundamental Difficulties**
- 8.1.1 Unreliable networks, partitions, partial failure
- 8.1.2 Unreliable clocks: NTP, clock skew, monotonic vs wall-clock
- 8.1.3 Timeouts, retries, and why "is it dead?" is undecidable

**Module 8.2 — Time & Ordering**
- 8.2.1 Logical clocks: Lamport timestamps
- 8.2.2 Vector clocks and causal ordering
- 8.2.3 Happens-before; total vs partial order
- 8.2.4 Hybrid logical clocks and TrueTime-style approaches (representative)

**Module 8.3 — Coordination & Consensus**
- 8.3.1 The consensus problem and FLP impossibility
- 8.3.2 Paxos (single-decree and multi-Paxos)
- 8.3.3 Raft: leader election, log replication, safety
- 8.3.4 Quorums, read/write intersection (R + W > N)
- 8.3.5 Leader election, failure detectors, membership (gossip, SWIM)
- 8.3.6 Distributed mutual exclusion and distributed locks (and their dangers — fencing tokens)
- 8.3.7 Byzantine faults and BFT (overview)
- 8.3.8 Coordination services (ZooKeeper/etcd, representative)

**Module 8.4 — Remote Communication**
- 8.4.1 RPC/RMI semantics, failure modes, idempotency
- 8.4.2 Middleware and distributed objects (historical → modern)

---

## PART 9 — Messaging & Streaming 🔴
*Goal: asynchronous, decoupled, high-throughput communication.*

- 9.1 Messaging fundamentals: queues vs topics, push vs pull, delivery semantics
- 9.2 Message brokers (RabbitMQ-style) vs logs (Kafka-style): the key distinction
- 9.3 The distributed log: partitions, offsets, consumer groups, retention
- 9.4 Delivery guarantees: at-most-once, at-least-once, exactly-once (and what "exactly-once" really means)
- 9.5 Ordering, partitioning keys, and idempotent consumers
- 9.6 Stream processing: windowing, watermarks, stateful operators
- 9.7 Batch processing and the batch/stream unification (Lambda/Kappa)
- 9.8 Data pipelines, CDC (change data capture), and the outbox pattern
- 9.9 Backpressure, dead-letter queues, poison messages

---

## PART 10 — Consistency & Replication 🔴⚫
*Goal: reason precisely about what readers see.*

- 10.1 Replication topologies: leader-follower, multi-leader, leaderless
- 10.2 Synchronous vs asynchronous replication; replication lag effects
- 10.3 Read-your-writes, monotonic reads, consistent prefix reads
- 10.4 Conflict detection & resolution; LWW, CRDTs, version vectors
- 10.5 The consistency spectrum: strong, sequential, causal, eventual
- 10.6 Linearizability vs serializability (and why they're different)
- 10.7 CAP theorem — precisely, with its real meaning and limits
- 10.8 PACELC — the more useful framing
- 10.9 Quorum tuning and sloppy quorums / hinted handoff

---

## PART 11 — Fault Tolerance & Resilience 🔴
*Goal: keep serving despite failures.*

- 11.1 Failure models and the fallacies of distributed computing
- 11.2 Redundancy, replication, and failover
- 11.3 Resilience patterns: timeout, retry (with jitter/backoff), circuit breaker, bulkhead
- 11.4 Graceful degradation, load shedding, fail-fast vs fail-safe
- 11.5 Idempotency, deduplication, and exactly-once effects
- 11.6 Distributed transactions: 2PC/3PC, their failure modes
- 11.7 Sagas (orchestration vs choreography), compensating transactions
- 11.8 Disaster recovery: RPO/RTO, backups, multi-region failover

---

## PART 12 — Microservices 🔴
*Goal: build, decompose, and operate service-based systems.*

- 12.1 Why/why-not microservices; monolith-first and the decomposition triggers
- 12.2 Service decomposition: by business capability, by subdomain
- 12.3 Inter-service communication: sync vs async, API design, versioning
- 12.4 Data management: database-per-service, distributed query (API composition, CQRS)
- 12.5 Saga & Outbox in microservices
- 12.6 Service discovery, API gateway, BFF (backend-for-frontend)
- 12.7 Service mesh (sidecars, mTLS, traffic policy — representative: Istio/Linkerd)
- 12.8 Testing strategies: contract tests, consumer-driven contracts
- 12.9 Migration: strangler fig, anti-corruption layer

---

## PART 13 — Cloud Native 🟡🔴
*Goal: run on modern infrastructure correctly.*

- 13.1 The cloud-native model and the 12/15-factor app
- 13.2 Containers: images, namespaces, cgroups, OCI
- 13.3 Orchestration with Kubernetes: pods, deployments, services, controllers, scheduling
- 13.4 K8s networking, ingress, config/secrets, stateful workloads
- 13.5 Autoscaling: HPA/VPA/cluster autoscaler; scale-to-zero
- 13.6 Cloud-native patterns: sidecar, ambassador, adapter, init
- 13.7 Infrastructure as Code, immutable infrastructure, deployment strategies (blue-green, canary, rolling)
- 13.8 Multi-region, multi-AZ, and global traffic management

---

## PART 14 — Reliability Engineering (SRE) 🔴
*Goal: operate systems to a defined reliability target.*

- 14.1 SLI / SLO / SLA and the error budget
- 14.2 Eliminating toil; the SRE operating model
- 14.3 Monitoring vs observability; the four golden signals
- 14.4 Alerting that doesn't burn people out; on-call practice
- 14.5 Incident response, command, postmortems (blameless)
- 14.6 Capacity planning and demand forecasting
- 14.7 Release engineering and progressive delivery
- 14.8 Chaos engineering and fault injection

---

## PART 15 — Security 🔴
*Goal: secure systems by design.*

- 15.1 Threat modeling (STRIDE), trust boundaries, attack surface
- 15.2 AuthN vs AuthZ; sessions, JWT, OAuth2, OIDC
- 15.3 Cryptography for architects: symmetric/asymmetric, hashing, signing, key management
- 15.4 Transport & data-at-rest encryption; secrets management
- 15.5 Network security: zero-trust, mTLS, WAF, DDoS mitigation
- 15.6 Common vulnerabilities (OWASP), input validation, injection, SSRF
- 15.7 Rate limiting & abuse prevention as security controls
- 15.8 Compliance: PII, GDPR, PCI-DSS, audit logging (relevant to the capstone)

---

## PART 16 — Observability 🔴
*Goal: understand running systems.*

- 16.1 The three pillars: metrics, logs, traces (and their limits)
- 16.2 Metrics systems, time-series databases, cardinality
- 16.3 Structured logging and log pipelines
- 16.4 Distributed tracing: context propagation, spans, sampling (OpenTelemetry)
- 16.5 Dashboards, SLO burn-rate alerts, anomaly detection
- 16.6 Designing a metrics/monitoring platform (interview-grade deep dive)

---

## PART 17 — Performance Engineering 🔴
*Goal: make systems fast and efficient on purpose.*

- 17.1 Performance methodology: USE and RED methods, measuring before optimizing
- 17.2 Latency analysis: tail latency, percentiles, fan-out amplification
- 17.3 Concurrency & parallelism: thread pools, async I/O, event loops, the C10K→C10M story
- 17.4 Reducing latency: batching, pipelining, prefetching, connection reuse
- 17.5 Data-layer performance: query tuning, hot partitions, N+1
- 17.6 Cost/performance tradeoffs and efficiency engineering

---

## PART 18 — Real-World Architectures (Case Studies) 🔴⚫
*Goal: see the principles composed in documented systems (representative).*

- 18.1 The distributed log at the center: LinkedIn/Kafka lineage
- 18.2 Wide-column at scale: Bigtable/Cassandra/DynamoDB design lineage
- 18.3 Globally-distributed SQL: Spanner/CockroachDB lineage
- 18.4 CDN & edge: Cloudflare-style architecture
- 18.5 Streaming & recommendations: Netflix-style architecture
- 18.6 Ride-sharing & geo: Uber-style architecture
- 18.7 Search: inverted indexes, Elasticsearch-style architecture
- 18.8 Chat at scale: Discord/WhatsApp-style architecture

---

## PART 19 — Interview System Designs 🔴⚫
*Goal: drilled, end-to-end designs using the standard problem template.*

**Module 19.1 — Volume 1 problems**
- 19.1.1 Design a URL shortener (TinyURL)
- 19.1.2 Design a rate limiter
- 19.1.3 Design a web crawler
- 19.1.4 Design a notification system
- 19.1.5 Design a news feed / Instagram
- 19.1.6 Design a chat system (WhatsApp)
- 19.1.7 Design a file storage/sync (Dropbox/Google Drive)
- 19.1.8 Design a video platform (YouTube)
- 19.1.9 Design a search autocomplete / typeahead
- 19.1.10 Design a unique-ID generator and key-value store

**Module 19.2 — Volume 2 problems**
- 19.2.1 Design Google Docs (collaborative editing, OT/CRDT)
- 19.2.2 Design a news feed system (deep)
- 19.2.3 Design a payment system / payment gateway
- 19.2.4 Design ride-sharing (Uber/Lyft)
- 19.2.5 Design a distributed lock service
- 19.2.6 Design a metrics/monitoring platform
- 19.2.7 Design a recommendation system
- 19.2.8 Design proximity/location services (Yelp/nearby)
- 19.2.9 Design an ad click aggregator / stream analytics
- 19.2.10 Design a stock exchange / matching engine

---

## PART 20 — Enterprise Capstone: Wealth Management Platform ⚫
*Goal: integrate everything into one defended, end-to-end design.*

- 20.1 Domain, requirements, compliance landscape, and bounded contexts
- 20.2 Capacity estimation and SLOs
- 20.3 Authentication, authorization, and identity
- 20.4 Portfolio, transactions, and the ledger (financial correctness, idempotency, exactly-once effects)
- 20.5 Market data ingestion (streaming, Kafka, time-series)
- 20.6 Distributed transactions & Saga across accounts/payments
- 20.7 CQRS + Event Sourcing for the ledger and audit trail
- 20.8 Search (Elasticsearch), recommendations, and AI services
- 20.9 Caching (Redis), object storage, CDN, API gateway
- 20.10 Reliability: HA, DR, multi-region, autoscaling on Kubernetes
- 20.11 Security, compliance, rate limiting, circuit breakers, distributed locks
- 20.12 Observability and the production-readiness review
- 20.13 Full architecture review: every decision defended, alternatives weighed

---

## Cross-cutting reference assets (in `reference/`)

- Latency numbers & capacity-estimation cheat sheet
- CAP/PACELC & consistency decision tree
- Database selection decision tree
- Caching pattern decision table
- Messaging guarantees comparison table
- Resilience pattern cheat sheet
- Architecture style comparison matrix
- Production-readiness checklist
- Design-review template
- Interview framework one-pager
- Flashcard deck index

## Labs (in `labs/`)

- Build a consistent-hashing router
- Implement a token-bucket rate limiter
- Implement a write-ahead log + crash recovery toy
- Raft leader-election simulation
- Failure-injection exercises (latency, partition, node loss)
- Debugging exercises (replication lag, cache stampede, deadlock, hot partition)

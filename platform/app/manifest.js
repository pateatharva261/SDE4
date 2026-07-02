// ============================================================================
//  COURSE MANIFEST
//  This is the single source of truth for the app's navigation.
//  To add a lesson: drop the .md file in lessons/... and add an entry below.
//  Paths are relative to the platform/ root (the app is served from there).
// ============================================================================

window.COURSE = {
  title: "System Design Mastery",
  subtitle: "From engineer to Staff/Principal-level system architect",

  // Top-level docs (the backbone)
  backbone: [
    { id: "start",      title: "Start Here",            path: "00-START-HERE.md" },
    { id: "curriculum", title: "Curriculum Map",        path: "01-CURRICULUM-MAP.md" },
    { id: "roadmap",    title: "Learning Roadmap",      path: "02-LEARNING-ROADMAP.md" },
    { id: "depgraph",   title: "Dependency Graph",      path: "03-CONCEPT-DEPENDENCY-GRAPH.md" },
    { id: "schedules",  title: "Study Schedules",       path: "04-STUDY-SCHEDULES.md" },
  ],

  // Reference assets
  reference: [
    { id: "ref-latency",   title: "Latency & Estimation Cheat Sheet", path: "reference/latency-and-estimation-cheatsheet.md" },
    { id: "ref-tradeoff",  title: "Tradeoff Worksheet",               path: "reference/tradeoff-worksheet.md" },
    { id: "ref-arch",      title: "Architecture Comparison Matrix",   path: "reference/architecture-comparison-matrix.md" },
    { id: "ref-protocol",  title: "Protocol & API Selection Cheat Sheet", path: "reference/protocol-selection-cheatsheet.md" },
    { id: "ref-storage",   title: "Storage Engine & Indexing Cheat Sheet", path: "reference/storage-engine-comparison.md" },
    { id: "ref-dbselect",  title: "Database Selection Decision Tree", path: "reference/database-selection-decision-tree.md" },
    { id: "ref-isolation", title: "Isolation Levels & Anomalies Cheat Sheet", path: "reference/isolation-levels-and-anomalies.md" },
    { id: "ref-caching",   title: "Caching Patterns Decision Table",       path: "reference/caching-patterns-decision-table.md" },
    { id: "ref-scaling",   title: "Scalability & Partitioning Cheat Sheet", path: "reference/scalability-and-partitioning-cheatsheet.md" },
    { id: "ref-consensus", title: "Consensus & Quorums Cheat Sheet",       path: "reference/consensus-and-quorums-cheatsheet.md" },
    { id: "ref-time",      title: "Time & Ordering Cheat Sheet",           path: "reference/time-and-ordering-cheatsheet.md" },
    { id: "ref-messaging", title: "Messaging & Streaming Guarantees Comparison", path: "reference/messaging-guarantees-comparison.md" },
    { id: "ref-consistency-cap", title: "Consistency, CAP/PACELC & Replication Decision Tree", path: "reference/consistency-and-cap-decision-tree.md" },
    { id: "ref-resilience", title: "Resilience & Fault-Tolerance Patterns Cheat Sheet", path: "reference/resilience-patterns-cheatsheet.md" },
    { id: "ref-microservices", title: "Microservices Patterns Cheat Sheet", path: "reference/microservices-patterns-cheatsheet.md" },
    { id: "ref-cloudnative", title: "Cloud-Native & Kubernetes Cheat Sheet", path: "reference/cloud-native-kubernetes-cheatsheet.md" },
    { id: "ref-sre", title: "SRE, SLOs & Error-Budget Cheat Sheet", path: "reference/sre-slo-error-budget-cheatsheet.md" },
    { id: "ref-security", title: "Security Cheat Sheet", path: "reference/security-cheatsheet.md" },
    { id: "ref-observability", title: "Observability Cheat Sheet", path: "reference/observability-cheatsheet.md" },
    { id: "ref-performance", title: "Performance Engineering Cheat Sheet", path: "reference/performance-cheatsheet.md" },
    { id: "ref-realworld", title: "Real-World Architectures Cheat Sheet", path: "reference/real-world-architectures-cheatsheet.md" },
    { id: "ref-interview", title: "Interview System Designs Cheat Sheet", path: "reference/interview-designs-cheatsheet.md" },
    { id: "ref-capstone", title: "Enterprise Capstone Blueprint", path: "reference/capstone-blueprint.md" },
  ],

  // Curriculum: Parts -> Modules -> Lessons
  // status: "done" lessons are clickable; "planned" show as upcoming (greyed).
  parts: [
    {
      id: "part-01", num: 1, title: "The Mindset of System Design", status: "done",
      modules: [
        {
          title: "1.1 Thinking in Systems",
          lessons: [
            { id: "1.1.1", title: "What System Design Actually Is",            path: "lessons/part-01-mindset/1.1.1-what-system-design-is.md" },
            { id: "1.1.2", title: "Functional vs Non-Functional Requirements", path: "lessons/part-01-mindset/1.1.2-functional-vs-nonfunctional-requirements.md" },
            { id: "1.1.3", title: "The Vocabulary of Scale",                   path: "lessons/part-01-mindset/1.1.3-vocabulary-of-scale.md" },
            { id: "1.1.4", title: "Capacity Estimation",                       path: "lessons/part-01-mindset/1.1.4-capacity-estimation.md" },
            { id: "1.1.5", title: "Tradeoffs as the Core Skill",               path: "lessons/part-01-mindset/1.1.5-tradeoffs-as-the-core-skill.md" },
          ]
        },
        {
          title: "1.2 Quality Attributes",
          lessons: [
            { id: "1.2.1", title: "Scalability, Performance, Availability, Reliability", path: "lessons/part-01-mindset/1.2.1-scalability-performance-availability-reliability.md" },
            { id: "1.2.2", title: "Maintainability, Evolvability, Operability, Observability", path: "lessons/part-01-mindset/1.2.2-maintainability-evolvability-operability-observability.md" },
            { id: "1.2.3", title: "Security, Compliance, Cost as First-Class", path: "lessons/part-01-mindset/1.2.3-security-compliance-cost.md" },
            { id: "1.2.4", title: "How Characteristics Conflict & Prioritize", path: "lessons/part-01-mindset/1.2.4-how-characteristics-conflict.md" },
          ]
        },
        {
          title: "1.3 The Design Process",
          lessons: [
            { id: "1.3.1", title: "A Repeatable Design Framework",   path: "lessons/part-01-mindset/1.3.1-the-design-framework.md" },
            { id: "1.3.2", title: "Driving a Design Conversation",   path: "lessons/part-01-mindset/1.3.2-driving-a-design-conversation.md" },
            { id: "1.3.3", title: "Architecture Decision Records",   path: "lessons/part-01-mindset/1.3.3-architecture-decision-records.md" },
          ]
        }
      ]
    },

    // ---- Upcoming parts (auto-rendered as a roadmap until lessons land) ----
    {
      id: "part-02", num: 2, title: "Architecture Fundamentals", status: "done",
      modules: [
        {
          title: "2.1 Components & Coupling",
          lessons: [
            { id: "2.1.1", title: "Modularity, Cohesion, Coupling, Connascence", path: "lessons/part-02-architecture-fundamentals/2.1.1-modularity-cohesion-coupling-connascence.md" },
            { id: "2.1.2", title: "Layering, Ports & Adapters (Hexagonal), Clean", path: "lessons/part-02-architecture-fundamentals/2.1.2-layering-hexagonal-clean.md" },
            { id: "2.1.3", title: "Domain-Driven Design Essentials", path: "lessons/part-02-architecture-fundamentals/2.1.3-domain-driven-design-essentials.md" },
          ]
        },
        {
          title: "2.2 Architecture Styles",
          lessons: [
            { id: "2.2.1", title: "Monolith & Modular Monolith", path: "lessons/part-02-architecture-fundamentals/2.2.1-monolith-and-modular-monolith.md" },
            { id: "2.2.2", title: "Layered, Pipeline, Microkernel", path: "lessons/part-02-architecture-fundamentals/2.2.2-layered-pipeline-microkernel.md" },
            { id: "2.2.3", title: "Service-Based, Microservices, SOA", path: "lessons/part-02-architecture-fundamentals/2.2.3-service-based-microservices-soa.md" },
            { id: "2.2.4", title: "Event-Driven Architecture", path: "lessons/part-02-architecture-fundamentals/2.2.4-event-driven-architecture.md" },
            { id: "2.2.5", title: "Space-Based Architecture", path: "lessons/part-02-architecture-fundamentals/2.2.5-space-based-architecture.md" },
          ]
        },
        {
          title: "2.3 Decisions & Tradeoffs",
          lessons: [
            { id: "2.3.1", title: "Characteristics → Style Selection", path: "lessons/part-02-architecture-fundamentals/2.3.1-characteristics-to-style-selection.md" },
            { id: "2.3.2", title: "The Hard Parts: Decomposition, Data, Communication", path: "lessons/part-02-architecture-fundamentals/2.3.2-the-hard-parts.md" },
            { id: "2.3.3", title: "Technical Debt, Fitness Functions, Evolutionary Architecture", path: "lessons/part-02-architecture-fundamentals/2.3.3-technical-debt-fitness-functions-evolutionary.md" },
          ]
        },
        {
          title: "2.4 Low-Level Design (LLD)",
          lessons: [
            { id: "2.4.1", title: "SOLID, GRASP, Design Smells", path: "lessons/part-02-architecture-fundamentals/2.4.1-solid-grasp-design-smells.md" },
            { id: "2.4.2", title: "Design Patterns That Matter for Systems", path: "lessons/part-02-architecture-fundamentals/2.4.2-design-patterns-for-systems.md" },
            { id: "2.4.3", title: "Concurrency Patterns", path: "lessons/part-02-architecture-fundamentals/2.4.3-concurrency-patterns.md" },
            { id: "2.4.4", title: "LLD Case Studies (Parking Lot, Rate Limiter, Cache, BookMyShow)", path: "lessons/part-02-architecture-fundamentals/2.4.4-lld-case-studies.md" },
            { id: "2.4.5", title: "From LLD to HLD: Where the Boundary Is", path: "lessons/part-02-architecture-fundamentals/2.4.5-from-lld-to-hld.md" },
          ]
        }
      ]
    },
    { id: "part-03", num: 3,  title: "Networking Deep Dive",      status: "done",
      modules: [
        {
          title: "3.1 Transport & Internet Layers",
          lessons: [
            { id: "3.1.1", title: "The Layered Model in Practice (L3/L4/L7)", path: "lessons/part-03-networking/3.1.1-layered-model-in-practice.md" },
            { id: "3.1.2", title: "IP, Routing, NAT, Subnets", path: "lessons/part-03-networking/3.1.2-ip-routing-nat-subnets.md" },
            { id: "3.1.3", title: "TCP Deep Dive", path: "lessons/part-03-networking/3.1.3-tcp-deep-dive.md" },
            { id: "3.1.4", title: "UDP and When Datagrams Win", path: "lessons/part-03-networking/3.1.4-udp-and-when-datagrams-win.md" },
            { id: "3.1.5", title: "QUIC and the Motivation Behind It", path: "lessons/part-03-networking/3.1.5-quic.md" },
          ]
        },
        {
          title: "3.2 Application Protocols",
          lessons: [
            { id: "3.2.1", title: "HTTP/1.1 Semantics (Methods, Status, Caching)", path: "lessons/part-03-networking/3.2.1-http-semantics.md" },
            { id: "3.2.2", title: "HTTP/2 Multiplexing & HTTP/3 over QUIC", path: "lessons/part-03-networking/3.2.2-http2-and-http3.md" },
            { id: "3.2.3", title: "TLS/SSL: Handshake, Certificates, mTLS, PKI", path: "lessons/part-03-networking/3.2.3-tls-ssl-mtls-pki.md" },
            { id: "3.2.4", title: "DNS: Resolution, Records, TTLs, GeoDNS", path: "lessons/part-03-networking/3.2.4-dns.md" },
            { id: "3.2.5", title: "WebSockets, SSE, Long Polling", path: "lessons/part-03-networking/3.2.5-websockets-sse-long-polling.md" },
            { id: "3.2.6", title: "API Styles & Serialization (REST/gRPC/GraphQL, Protobuf/Avro)", path: "lessons/part-03-networking/3.2.6-grpc-rest-graphql-serialization.md" },
          ]
        },
        {
          title: "3.3 Edge & Traffic Management",
          lessons: [
            { id: "3.3.1", title: "Load Balancing: L4 vs L7, Algorithms, Health Checks", path: "lessons/part-03-networking/3.3.1-load-balancing.md" },
            { id: "3.3.2", title: "Reverse Proxies, API Gateways, Ingress", path: "lessons/part-03-networking/3.3.2-reverse-proxies-api-gateways-ingress.md" },
            { id: "3.3.3", title: "CDNs: Edge Caching, Invalidation, Anycast", path: "lessons/part-03-networking/3.3.3-cdns.md" },
            { id: "3.3.4", title: "Connection Management: Keep-Alive, Pooling, Backpressure", path: "lessons/part-03-networking/3.3.4-connection-management.md" },
          ]
        }
      ]
    },
    { id: "part-04", num: 4,  title: "Storage Systems",           status: "done",
      modules: [
        {
          title: "4.1 Storage Hardware Reality",
          lessons: [
            { id: "4.1.1", title: "Memory Hierarchy & Sequential vs Random I/O", path: "lessons/part-04-storage/4.1.1-memory-hierarchy-sequential-vs-random-io.md" },
            { id: "4.1.2", title: "Disks, Page Cache, fsync, Write Amplification", path: "lessons/part-04-storage/4.1.2-disks-page-cache-fsync-write-amplification.md" },
            { id: "4.1.3", title: "Block vs File vs Object Storage", path: "lessons/part-04-storage/4.1.3-block-file-object-storage.md" },
          ]
        },
        {
          title: "4.2 Storage Engines",
          lessons: [
            { id: "4.2.1", title: "Log-Structured vs Page-Oriented Engines", path: "lessons/part-04-storage/4.2.1-log-structured-vs-page-oriented.md" },
            { id: "4.2.2", title: "B-Trees: Structure, Operations, Page Layout, WAL", path: "lessons/part-04-storage/4.2.2-b-trees.md" },
            { id: "4.2.3", title: "LSM-Trees: Memtables, SSTables, Compaction, Bloom Filters", path: "lessons/part-04-storage/4.2.3-lsm-trees.md" },
            { id: "4.2.4", title: "B-Tree vs LSM: Read/Write/Space Amplification Tradeoffs", path: "lessons/part-04-storage/4.2.4-btree-vs-lsm-tradeoffs.md" },
            { id: "4.2.5", title: "Indexing: Clustered/Secondary/Composite/Covering/Partial", path: "lessons/part-04-storage/4.2.5-indexing.md" },
          ]
        },
        {
          title: "4.3 Encoding & Evolution",
          lessons: [
            { id: "4.3.1", title: "Data Encoding Formats & Schema Evolution", path: "lessons/part-04-storage/4.3.1-data-encoding-schema-evolution.md" },
            { id: "4.3.2", title: "Object/Blob Storage Internals & Lifecycle", path: "lessons/part-04-storage/4.3.2-object-blob-storage-internals.md" },
          ]
        }
      ]
    },
    { id: "part-05", num: 5,  title: "Databases",                 status: "done",
      modules: [
        {
          title: "5.1 Data Models",
          lessons: [
            { id: "5.1.1", title: "Data Models: Relational/Document/KV/Wide-Column/Graph", path: "lessons/part-05-databases/5.1.1-data-models.md" },
            { id: "5.1.2", title: "Normalization vs Denormalization; Query-Driven Design", path: "lessons/part-05-databases/5.1.2-normalization-vs-denormalization.md" },
            { id: "5.1.3", title: "Polyglot Persistence", path: "lessons/part-05-databases/5.1.3-polyglot-persistence.md" },
          ]
        },
        {
          title: "5.2 Transactions & Concurrency",
          lessons: [
            { id: "5.2.1", title: "ACID Precisely Defined", path: "lessons/part-05-databases/5.2.1-acid.md" },
            { id: "5.2.2", title: "Isolation Levels (RC, Snapshot/RR, Serializable)", path: "lessons/part-05-databases/5.2.2-isolation-levels.md" },
            { id: "5.2.3", title: "Anomalies: Dirty/Non-Repeatable/Phantom, Lost Update, Write Skew", path: "lessons/part-05-databases/5.2.3-anomalies.md" },
            { id: "5.2.4", title: "Concurrency Control: 2PL, MVCC, Optimistic/Pessimistic, SSI", path: "lessons/part-05-databases/5.2.4-concurrency-control.md" },
            { id: "5.2.5", title: "Locking, Deadlocks, and Detection", path: "lessons/part-05-databases/5.2.5-locking-deadlocks.md" },
          ]
        },
        {
          title: "5.3 Durability & Recovery",
          lessons: [
            { id: "5.3.1", title: "WAL, Checkpoints, Crash Recovery (ARIES)", path: "lessons/part-05-databases/5.3.1-wal-checkpoints-crash-recovery.md" },
            { id: "5.3.2", title: "Query Execution & Optimization Basics", path: "lessons/part-05-databases/5.3.2-query-execution-optimization.md" },
          ]
        },
        {
          title: "5.4 Database Selection & Operation",
          lessons: [
            { id: "5.4.1", title: "SQL vs NoSQL vs NewSQL", path: "lessons/part-05-databases/5.4.1-sql-nosql-newsql.md" },
            { id: "5.4.2", title: "Connection Pooling, Read Replicas, Failover", path: "lessons/part-05-databases/5.4.2-connection-pooling-replicas-failover.md" },
            { id: "5.4.3", title: "Schema Migrations Without Downtime", path: "lessons/part-05-databases/5.4.3-schema-migrations-without-downtime.md" },
          ]
        }
      ]
    },
    { id: "part-06", num: 6,  title: "Caching",                   status: "done",
      modules: [
        {
          title: "6. Caching",
          lessons: [
            { id: "6.1", title: "Why Caching Works: Locality & the Probabilistic Shortcut", path: "lessons/part-06-caching/6.1-why-caching-works.md" },
            { id: "6.2", title: "Cache Topologies: Client/CDN/Proxy/Application/Distributed", path: "lessons/part-06-caching/6.2-cache-topologies.md" },
            { id: "6.3", title: "Patterns: Cache-Aside, Read-Through, Write-Through/Back/Around", path: "lessons/part-06-caching/6.3-caching-patterns.md" },
            { id: "6.4", title: "Eviction Policies: LRU, LFU, ARC, TTL & Their Internals", path: "lessons/part-06-caching/6.4-eviction-policies.md" },
            { id: "6.5", title: "Invalidation Strategies (One of the Two Hard Things)", path: "lessons/part-06-caching/6.5-invalidation-strategies.md" },
            { id: "6.6", title: "Distributed Caching with Redis/Memcached", path: "lessons/part-06-caching/6.6-distributed-caching-redis-memcached.md" },
            { id: "6.7", title: "Cache Stampede, Hotspots, Thundering Herd & Mitigations", path: "lessons/part-06-caching/6.7-stampede-hotspots-thundering-herd.md" },
          ]
        }
      ]
    },
    { id: "part-07", num: 7,  title: "Scalability",               status: "done",
      modules: [
        {
          title: "7. Scalability",
          lessons: [
            { id: "7.1", title: "Vertical vs Horizontal Scaling; Statelessness as Enabler", path: "lessons/part-07-scalability/7.1-vertical-vs-horizontal-scaling.md" },
            { id: "7.2", title: "Stateless Services + Externalized Session/State", path: "lessons/part-07-scalability/7.2-stateless-services-externalized-state.md" },
            { id: "7.3", title: "Sharding/Partitioning: Range, Hash, Consistent Hashing, Directory", path: "lessons/part-07-scalability/7.3-sharding-partitioning-strategies.md" },
            { id: "7.4", title: "Hotspots, Skew, and Rebalancing", path: "lessons/part-07-scalability/7.4-hotspots-skew-rebalancing.md" },
            { id: "7.5", title: "Read Scaling (Replicas) vs Write Scaling (Sharding) vs Both", path: "lessons/part-07-scalability/7.5-read-scaling-write-scaling.md" },
            { id: "7.6", title: "Multi-Tier Scaling & the Database as the Bottleneck", path: "lessons/part-07-scalability/7.6-multitier-scaling-database-bottleneck.md" },
            { id: "7.7", title: "Capacity Planning and Load Testing", path: "lessons/part-07-scalability/7.7-capacity-planning-load-testing.md" },
          ]
        }
      ]
    },
    { id: "part-08", num: 8,  title: "Distributed Systems Core",  status: "done",
      modules: [
        {
          title: "8.1 Fundamental Difficulties",
          lessons: [
            { id: "8.1.1", title: "Unreliable Networks, Partitions, Partial Failure", path: "lessons/part-08-distributed-systems-core/8.1.1-unreliable-networks-partitions-partial-failure.md" },
            { id: "8.1.2", title: "Unreliable Clocks: NTP, Skew, Monotonic vs Wall-Clock", path: "lessons/part-08-distributed-systems-core/8.1.2-unreliable-clocks.md" },
            { id: "8.1.3", title: "Timeouts, Retries & Why 'Is It Dead?' Is Undecidable", path: "lessons/part-08-distributed-systems-core/8.1.3-timeouts-retries-failure-detection.md" },
          ]
        },
        {
          title: "8.2 Time & Ordering",
          lessons: [
            { id: "8.2.1", title: "Logical Clocks: Lamport Timestamps", path: "lessons/part-08-distributed-systems-core/8.2.1-lamport-timestamps.md" },
            { id: "8.2.2", title: "Vector Clocks and Causal Ordering", path: "lessons/part-08-distributed-systems-core/8.2.2-vector-clocks-causal-ordering.md" },
            { id: "8.2.3", title: "Happens-Before; Total vs Partial Order", path: "lessons/part-08-distributed-systems-core/8.2.3-happens-before-total-vs-partial-order.md" },
            { id: "8.2.4", title: "Hybrid Logical Clocks and TrueTime", path: "lessons/part-08-distributed-systems-core/8.2.4-hybrid-logical-clocks-truetime.md" },
          ]
        },
        {
          title: "8.3 Coordination & Consensus",
          lessons: [
            { id: "8.3.1", title: "The Consensus Problem and FLP Impossibility", path: "lessons/part-08-distributed-systems-core/8.3.1-consensus-problem-flp.md" },
            { id: "8.3.2", title: "Paxos (Single-Decree and Multi-Paxos)", path: "lessons/part-08-distributed-systems-core/8.3.2-paxos.md" },
            { id: "8.3.3", title: "Raft: Leader Election, Log Replication, Safety", path: "lessons/part-08-distributed-systems-core/8.3.3-raft.md" },
            { id: "8.3.4", title: "Quorums and Read/Write Intersection (R + W > N)", path: "lessons/part-08-distributed-systems-core/8.3.4-quorums.md" },
            { id: "8.3.5", title: "Leader Election, Failure Detectors, Membership (Gossip, SWIM)", path: "lessons/part-08-distributed-systems-core/8.3.5-leader-election-failure-detectors-membership.md" },
            { id: "8.3.6", title: "Distributed Locks and Fencing Tokens", path: "lessons/part-08-distributed-systems-core/8.3.6-distributed-locks-fencing.md" },
            { id: "8.3.7", title: "Byzantine Faults and BFT (Overview)", path: "lessons/part-08-distributed-systems-core/8.3.7-byzantine-faults-bft.md" },
            { id: "8.3.8", title: "Coordination Services (ZooKeeper/etcd)", path: "lessons/part-08-distributed-systems-core/8.3.8-coordination-services-zookeeper-etcd.md" },
          ]
        },
        {
          title: "8.4 Remote Communication",
          lessons: [
            { id: "8.4.1", title: "RPC/RMI Semantics, Failure Modes, Idempotency", path: "lessons/part-08-distributed-systems-core/8.4.1-rpc-semantics-failure-modes-idempotency.md" },
            { id: "8.4.2", title: "Middleware and Distributed Objects (Historical → Modern)", path: "lessons/part-08-distributed-systems-core/8.4.2-middleware-distributed-objects.md" },
          ]
        }
      ]
    },
    { id: "part-09", num: 9,  title: "Messaging & Streaming",     status: "done",
      modules: [
        {
          title: "9. Messaging & Streaming",
          lessons: [
            { id: "9.1", title: "Messaging Fundamentals: Queues/Topics, Push/Pull, Delivery Semantics", path: "lessons/part-09-messaging-streaming/9.1-messaging-fundamentals.md" },
            { id: "9.2", title: "Message Brokers vs Logs (RabbitMQ-style vs Kafka-style)", path: "lessons/part-09-messaging-streaming/9.2-brokers-vs-logs.md" },
            { id: "9.3", title: "The Distributed Log: Partitions, Offsets, Consumer Groups, Retention", path: "lessons/part-09-messaging-streaming/9.3-distributed-log.md" },
            { id: "9.4", title: "Delivery Guarantees & What 'Exactly-Once' Really Means", path: "lessons/part-09-messaging-streaming/9.4-delivery-guarantees.md" },
            { id: "9.5", title: "Ordering, Partition Keys, and Idempotent Consumers", path: "lessons/part-09-messaging-streaming/9.5-ordering-partition-keys-idempotent-consumers.md" },
            { id: "9.6", title: "Stream Processing: Windowing, Watermarks, Stateful Operators", path: "lessons/part-09-messaging-streaming/9.6-stream-processing.md" },
            { id: "9.7", title: "Batch Processing & the Batch/Stream Unification (Lambda/Kappa)", path: "lessons/part-09-messaging-streaming/9.7-batch-stream-unification.md" },
            { id: "9.8", title: "Data Pipelines, CDC, and the Outbox Pattern", path: "lessons/part-09-messaging-streaming/9.8-data-pipelines-cdc-outbox.md" },
            { id: "9.9", title: "Backpressure, Dead-Letter Queues, and Poison Messages", path: "lessons/part-09-messaging-streaming/9.9-backpressure-dlq-poison-messages.md" },
          ]
        }
      ]
    },
    { id: "part-10", num: 10, title: "Consistency & Replication", status: "done",
      modules: [
        {
          title: "10. Consistency & Replication",
          lessons: [
            { id: "10.1", title: "Replication Topologies: Leader-Follower, Multi-Leader, Leaderless", path: "lessons/part-10-consistency-replication/10.1-replication-topologies.md" },
            { id: "10.2", title: "Synchronous vs Asynchronous Replication; Replication Lag", path: "lessons/part-10-consistency-replication/10.2-sync-async-replication-lag.md" },
            { id: "10.3", title: "Read-Your-Writes, Monotonic Reads, Consistent Prefix Reads", path: "lessons/part-10-consistency-replication/10.3-read-your-writes-monotonic-consistent-prefix.md" },
            { id: "10.4", title: "Conflict Detection & Resolution; LWW, CRDTs, Version Vectors", path: "lessons/part-10-consistency-replication/10.4-conflict-detection-resolution-crdts.md" },
            { id: "10.5", title: "The Consistency Spectrum: Strong, Sequential, Causal, Eventual", path: "lessons/part-10-consistency-replication/10.5-consistency-spectrum.md" },
            { id: "10.6", title: "Linearizability vs Serializability (and Why They're Different)", path: "lessons/part-10-consistency-replication/10.6-linearizability-vs-serializability.md" },
            { id: "10.7", title: "CAP Theorem — Precisely, With Its Real Meaning and Limits", path: "lessons/part-10-consistency-replication/10.7-cap-theorem.md" },
            { id: "10.8", title: "PACELC — The More Useful Framing", path: "lessons/part-10-consistency-replication/10.8-pacelc.md" },
            { id: "10.9", title: "Quorum Tuning and Sloppy Quorums / Hinted Handoff", path: "lessons/part-10-consistency-replication/10.9-quorum-tuning-sloppy-quorums.md" },
          ]
        }
      ]
    },
    { id: "part-11", num: 11, title: "Fault Tolerance & Resilience", status: "done",
      modules: [
        {
          title: "11. Fault Tolerance & Resilience",
          lessons: [
            { id: "11.1", title: "Failure Models and the Fallacies of Distributed Computing", path: "lessons/part-11-fault-tolerance/11.1-failure-models-fallacies.md" },
            { id: "11.2", title: "Redundancy, Replication, and Failover", path: "lessons/part-11-fault-tolerance/11.2-redundancy-replication-failover.md" },
            { id: "11.3", title: "Resilience Patterns: Timeout, Retry, Circuit Breaker, Bulkhead", path: "lessons/part-11-fault-tolerance/11.3-resilience-patterns.md" },
            { id: "11.4", title: "Graceful Degradation, Load Shedding, Fail-Fast vs Fail-Safe", path: "lessons/part-11-fault-tolerance/11.4-graceful-degradation-load-shedding.md" },
            { id: "11.5", title: "Idempotency, Deduplication, and Exactly-Once Effects", path: "lessons/part-11-fault-tolerance/11.5-idempotency-deduplication-exactly-once.md" },
            { id: "11.6", title: "Distributed Transactions: 2PC/3PC, Their Failure Modes", path: "lessons/part-11-fault-tolerance/11.6-distributed-transactions-2pc-3pc.md" },
            { id: "11.7", title: "Sagas (Orchestration vs Choreography), Compensating Transactions", path: "lessons/part-11-fault-tolerance/11.7-sagas-compensating-transactions.md" },
            { id: "11.8", title: "Disaster Recovery: RPO/RTO, Backups, Multi-Region Failover", path: "lessons/part-11-fault-tolerance/11.8-disaster-recovery-rpo-rto.md" },
          ]
        }
      ]
    },
    { id: "part-12", num: 12, title: "Microservices",             status: "done",
      modules: [
        {
          title: "12. Microservices",
          lessons: [
            { id: "12.1", title: "Why/Why-Not Microservices; Monolith-First & Decomposition Triggers", path: "lessons/part-12-microservices/12.1-why-why-not-microservices.md" },
            { id: "12.2", title: "Service Decomposition: By Business Capability, By Subdomain", path: "lessons/part-12-microservices/12.2-service-decomposition.md" },
            { id: "12.3", title: "Inter-Service Communication: Sync vs Async, API Design, Versioning", path: "lessons/part-12-microservices/12.3-inter-service-communication.md" },
            { id: "12.4", title: "Data Management: Database-per-Service, Distributed Query (API Composition, CQRS)", path: "lessons/part-12-microservices/12.4-data-management.md" },
            { id: "12.5", title: "Saga & Outbox in Microservices", path: "lessons/part-12-microservices/12.5-saga-and-outbox.md" },
            { id: "12.6", title: "Service Discovery, API Gateway, and BFF", path: "lessons/part-12-microservices/12.6-discovery-gateway-bff.md" },
            { id: "12.7", title: "Service Mesh: Sidecars, mTLS, Traffic Policy", path: "lessons/part-12-microservices/12.7-service-mesh.md" },
            { id: "12.8", title: "Testing Strategies: Contract Tests, Consumer-Driven Contracts", path: "lessons/part-12-microservices/12.8-testing-strategies.md" },
            { id: "12.9", title: "Migration: Strangler Fig, Anti-Corruption Layer", path: "lessons/part-12-microservices/12.9-migration-strangler-fig-acl.md" },
          ]
        }
      ]
    },
    { id: "part-13", num: 13, title: "Cloud Native",              status: "done",
      modules: [
        {
          title: "13. Cloud Native",
          lessons: [
            { id: "13.1", title: "The Cloud-Native Model and the 12/15-Factor App", path: "lessons/part-13-cloud-native/13.1-cloud-native-model-12-factor.md" },
            { id: "13.2", title: "Containers: Images, Namespaces, cgroups, OCI", path: "lessons/part-13-cloud-native/13.2-containers.md" },
            { id: "13.3", title: "Orchestration with Kubernetes: Pods, Deployments, Services, Scheduling", path: "lessons/part-13-cloud-native/13.3-kubernetes-orchestration.md" },
            { id: "13.4", title: "K8s Networking, Ingress, Config/Secrets, Stateful Workloads", path: "lessons/part-13-cloud-native/13.4-k8s-networking-config-stateful.md" },
            { id: "13.5", title: "Autoscaling: HPA, VPA, Cluster Autoscaler, Scale-to-Zero", path: "lessons/part-13-cloud-native/13.5-autoscaling.md" },
            { id: "13.6", title: "Cloud-Native Patterns: Sidecar, Ambassador, Adapter, Init", path: "lessons/part-13-cloud-native/13.6-cloud-native-patterns.md" },
            { id: "13.7", title: "IaC, Immutable Infrastructure, Deployment Strategies (Blue-Green, Canary, Rolling)", path: "lessons/part-13-cloud-native/13.7-iac-immutable-deployment-strategies.md" },
            { id: "13.8", title: "Multi-Region, Multi-AZ, and Global Traffic Management", path: "lessons/part-13-cloud-native/13.8-multi-region-multi-az-global-traffic.md" },
          ]
        }
      ]
    },
    { id: "part-14", num: 14, title: "Reliability Engineering (SRE)", status: "done",
      modules: [
        {
          title: "14. Reliability Engineering (SRE)",
          lessons: [
            { id: "14.1", title: "SLI / SLO / SLA and the Error Budget", path: "lessons/part-14-sre/14.1-sli-slo-sla-error-budget.md" },
            { id: "14.2", title: "Eliminating Toil; The SRE Operating Model", path: "lessons/part-14-sre/14.2-toil-sre-operating-model.md" },
            { id: "14.3", title: "Monitoring vs Observability; The Four Golden Signals", path: "lessons/part-14-sre/14.3-monitoring-observability-golden-signals.md" },
            { id: "14.4", title: "Alerting That Doesn't Burn People Out; On-Call Practice", path: "lessons/part-14-sre/14.4-alerting-on-call.md" },
            { id: "14.5", title: "Incident Response, Command, Postmortems (Blameless)", path: "lessons/part-14-sre/14.5-incident-response-postmortems.md" },
            { id: "14.6", title: "Capacity Planning and Demand Forecasting", path: "lessons/part-14-sre/14.6-capacity-planning-demand-forecasting.md" },
            { id: "14.7", title: "Release Engineering and Progressive Delivery", path: "lessons/part-14-sre/14.7-release-engineering-progressive-delivery.md" },
            { id: "14.8", title: "Chaos Engineering and Fault Injection", path: "lessons/part-14-sre/14.8-chaos-engineering-fault-injection.md" },
          ]
        }
      ]
    },
    { id: "part-15", num: 15, title: "Security",                  status: "done",
      modules: [
        {
          title: "15. Security",
          lessons: [
            { id: "15.1", title: "Threat Modeling (STRIDE), Trust Boundaries, Attack Surface", path: "lessons/part-15-security/15.1-threat-modeling-stride-trust-boundaries.md" },
            { id: "15.2", title: "AuthN vs AuthZ; Sessions, JWT, OAuth2, OIDC", path: "lessons/part-15-security/15.2-authn-authz-sessions-jwt-oauth-oidc.md" },
            { id: "15.3", title: "Cryptography for Architects: Symmetric/Asymmetric, Hashing, Signing, Key Management", path: "lessons/part-15-security/15.3-cryptography-for-architects.md" },
            { id: "15.4", title: "Transport & Data-at-Rest Encryption; Secrets Management", path: "lessons/part-15-security/15.4-encryption-transit-rest-secrets.md" },
            { id: "15.5", title: "Network Security: Zero-Trust, mTLS, WAF, DDoS Mitigation", path: "lessons/part-15-security/15.5-network-security-zero-trust-mtls-waf-ddos.md" },
            { id: "15.6", title: "Common Vulnerabilities (OWASP), Input Validation, Injection, SSRF", path: "lessons/part-15-security/15.6-owasp-vulnerabilities-injection-ssrf.md" },
            { id: "15.7", title: "Rate Limiting & Abuse Prevention as Security Controls", path: "lessons/part-15-security/15.7-rate-limiting-abuse-prevention.md" },
            { id: "15.8", title: "Compliance: PII, GDPR, PCI-DSS, Audit Logging", path: "lessons/part-15-security/15.8-compliance-pii-gdpr-pci-audit.md" },
          ]
        }
      ]
    },
    { id: "part-16", num: 16, title: "Observability",             status: "done",
      modules: [
        {
          title: "16. Observability",
          lessons: [
            { id: "16.1", title: "The Three Pillars: Metrics, Logs, Traces (and Their Limits)", path: "lessons/part-16-observability/16.1-three-pillars-metrics-logs-traces.md" },
            { id: "16.2", title: "Metrics Systems, Time-Series Databases, Cardinality", path: "lessons/part-16-observability/16.2-metrics-tsdb-cardinality.md" },
            { id: "16.3", title: "Structured Logging and Log Pipelines", path: "lessons/part-16-observability/16.3-structured-logging-pipelines.md" },
            { id: "16.4", title: "Distributed Tracing: Context Propagation, Spans, Sampling (OpenTelemetry)", path: "lessons/part-16-observability/16.4-distributed-tracing-opentelemetry.md" },
            { id: "16.5", title: "Dashboards, SLO Burn-Rate Alerts, Anomaly Detection", path: "lessons/part-16-observability/16.5-dashboards-slo-alerts-anomaly-detection.md" },
            { id: "16.6", title: "Designing a Metrics/Monitoring Platform (Deep Dive)", path: "lessons/part-16-observability/16.6-designing-a-monitoring-platform.md" },
          ]
        }
      ]
    },
    { id: "part-17", num: 17, title: "Performance Engineering",   status: "done",
      modules: [
        {
          title: "17. Performance Engineering",
          lessons: [
            { id: "17.1", title: "Performance Methodology: USE and RED, Measuring Before Optimizing", path: "lessons/part-17-performance/17.1-performance-methodology-use-red.md" },
            { id: "17.2", title: "Latency Analysis: Tail Latency, Percentiles, Fan-Out Amplification", path: "lessons/part-17-performance/17.2-tail-latency-percentiles-fanout.md" },
            { id: "17.3", title: "Concurrency & Parallelism: Thread Pools, Async I/O, Event Loops, C10K→C10M", path: "lessons/part-17-performance/17.3-concurrency-parallelism-async-io.md" },
            { id: "17.4", title: "Reducing Latency: Batching, Pipelining, Prefetching, Connection Reuse", path: "lessons/part-17-performance/17.4-reducing-latency-batching-pipelining-prefetching.md" },
            { id: "17.5", title: "Data-Layer Performance: Query Tuning, Hot Partitions, N+1", path: "lessons/part-17-performance/17.5-data-layer-performance-query-tuning-hot-partitions-n-plus-1.md" },
            { id: "17.6", title: "Cost/Performance Tradeoffs and Efficiency Engineering", path: "lessons/part-17-performance/17.6-cost-performance-efficiency-engineering.md" },
          ]
        }
      ]
    },
    { id: "part-18", num: 18, title: "Real-World Architectures",  status: "done",
      modules: [
        {
          title: "18. Real-World Architectures",
          lessons: [
            { id: "18.1", title: "The Distributed Log at the Center: LinkedIn/Kafka Lineage", path: "lessons/part-18-real-world-architectures/18.1-distributed-log-kafka-lineage.md" },
            { id: "18.2", title: "Wide-Column at Scale: Bigtable/Cassandra/DynamoDB Lineage", path: "lessons/part-18-real-world-architectures/18.2-wide-column-bigtable-cassandra-dynamo.md" },
            { id: "18.3", title: "Globally-Distributed SQL: Spanner/CockroachDB Lineage", path: "lessons/part-18-real-world-architectures/18.3-globally-distributed-sql-spanner-cockroach.md" },
            { id: "18.4", title: "CDN & Edge: Cloudflare-Style Architecture", path: "lessons/part-18-real-world-architectures/18.4-cdn-edge-cloudflare.md" },
            { id: "18.5", title: "Streaming & Recommendations: Netflix-Style Architecture", path: "lessons/part-18-real-world-architectures/18.5-streaming-recommendations-netflix.md" },
            { id: "18.6", title: "Ride-Sharing & Geo: Uber-Style Architecture", path: "lessons/part-18-real-world-architectures/18.6-ride-sharing-geo-uber.md" },
            { id: "18.7", title: "Search: Inverted Indexes, Elasticsearch-Style Architecture", path: "lessons/part-18-real-world-architectures/18.7-search-inverted-index-elasticsearch.md" },
            { id: "18.8", title: "Chat at Scale: Discord/WhatsApp-Style Architecture", path: "lessons/part-18-real-world-architectures/18.8-chat-at-scale-discord-whatsapp.md" },
          ]
        }
      ]
    },
    { id: "part-19", num: 19, title: "Interview System Designs",  status: "done",
      modules: [
        {
          title: "19.1 Volume 1 Problems",
          lessons: [
            { id: "19.1.1",  title: "Design a URL Shortener (TinyURL)", path: "lessons/part-19-interview-designs/19.1.1-design-url-shortener.md" },
            { id: "19.1.2",  title: "Design a Rate Limiter", path: "lessons/part-19-interview-designs/19.1.2-design-rate-limiter.md" },
            { id: "19.1.3",  title: "Design a Web Crawler", path: "lessons/part-19-interview-designs/19.1.3-design-web-crawler.md" },
            { id: "19.1.4",  title: "Design a Notification System", path: "lessons/part-19-interview-designs/19.1.4-design-notification-system.md" },
            { id: "19.1.5",  title: "Design a News Feed (Instagram)", path: "lessons/part-19-interview-designs/19.1.5-design-news-feed-instagram.md" },
            { id: "19.1.6",  title: "Design a Chat System (WhatsApp)", path: "lessons/part-19-interview-designs/19.1.6-design-chat-system-whatsapp.md" },
            { id: "19.1.7",  title: "Design File Storage & Sync (Dropbox)", path: "lessons/part-19-interview-designs/19.1.7-design-file-storage-sync-dropbox.md" },
            { id: "19.1.8",  title: "Design a Video Platform (YouTube)", path: "lessons/part-19-interview-designs/19.1.8-design-video-platform-youtube.md" },
            { id: "19.1.9",  title: "Design Search Autocomplete / Typeahead", path: "lessons/part-19-interview-designs/19.1.9-design-search-autocomplete-typeahead.md" },
            { id: "19.1.10", title: "Design a Unique-ID Generator & KV Store", path: "lessons/part-19-interview-designs/19.1.10-design-id-generator-kv-store.md" },
          ]
        },
        {
          title: "19.2 Volume 2 Problems",
          lessons: [
            { id: "19.2.1",  title: "Design Google Docs (Collaborative Editing)", path: "lessons/part-19-interview-designs/19.2.1-design-google-docs-collaborative-editing.md" },
            { id: "19.2.2",  title: "Design a News Feed System (Deep)", path: "lessons/part-19-interview-designs/19.2.2-design-news-feed-deep.md" },
            { id: "19.2.3",  title: "Design a Payment System", path: "lessons/part-19-interview-designs/19.2.3-design-payment-system.md" },
            { id: "19.2.4",  title: "Design Ride-Sharing (Uber/Lyft)", path: "lessons/part-19-interview-designs/19.2.4-design-ride-sharing-uber.md" },
            { id: "19.2.5",  title: "Design a Distributed Lock Service", path: "lessons/part-19-interview-designs/19.2.5-design-distributed-lock-service.md" },
            { id: "19.2.6",  title: "Design a Metrics / Monitoring Platform", path: "lessons/part-19-interview-designs/19.2.6-design-metrics-monitoring-platform.md" },
            { id: "19.2.7",  title: "Design a Recommendation System", path: "lessons/part-19-interview-designs/19.2.7-design-recommendation-system.md" },
            { id: "19.2.8",  title: "Design Proximity / Nearby Services (Yelp)", path: "lessons/part-19-interview-designs/19.2.8-design-proximity-nearby-yelp.md" },
            { id: "19.2.9",  title: "Design an Ad Click Aggregator / Stream Analytics", path: "lessons/part-19-interview-designs/19.2.9-design-ad-click-aggregator.md" },
            { id: "19.2.10", title: "Design a Stock Exchange / Matching Engine", path: "lessons/part-19-interview-designs/19.2.10-design-stock-exchange-matching-engine.md" },
          ]
        }
      ]
    },
    { id: "part-20", num: 20, title: "Enterprise Capstone",       status: "done",
      modules: [
        {
          title: "20. Enterprise Capstone: Wealth Management Platform",
          lessons: [
            { id: "20.1",  title: "Domain, Requirements, Compliance & Bounded Contexts", path: "lessons/part-20-capstone/20.1-domain-requirements-compliance-bounded-contexts.md" },
            { id: "20.2",  title: "Capacity Estimation & SLOs", path: "lessons/part-20-capstone/20.2-capacity-estimation-and-slos.md" },
            { id: "20.3",  title: "Authentication, Authorization & Identity", path: "lessons/part-20-capstone/20.3-authentication-authorization-identity.md" },
            { id: "20.4",  title: "Portfolio, Transactions & the Ledger", path: "lessons/part-20-capstone/20.4-portfolio-transactions-ledger.md" },
            { id: "20.5",  title: "Market Data Ingestion (Streaming, Kafka, Time-Series)", path: "lessons/part-20-capstone/20.5-market-data-ingestion-streaming.md" },
            { id: "20.6",  title: "Distributed Transactions & Saga", path: "lessons/part-20-capstone/20.6-distributed-transactions-saga.md" },
            { id: "20.7",  title: "CQRS + Event Sourcing for the Ledger & Audit Trail", path: "lessons/part-20-capstone/20.7-cqrs-event-sourcing.md" },
            { id: "20.8",  title: "Search, Recommendations & AI Services", path: "lessons/part-20-capstone/20.8-search-recommendations-ai.md" },
            { id: "20.9",  title: "Caching, Object Storage, CDN & API Gateway", path: "lessons/part-20-capstone/20.9-caching-object-storage-cdn-gateway.md" },
            { id: "20.10", title: "Reliability: HA, DR, Multi-Region, Autoscaling on Kubernetes", path: "lessons/part-20-capstone/20.10-reliability-ha-dr-multiregion-kubernetes.md" },
            { id: "20.11", title: "Security, Compliance, Rate Limiting, Circuit Breakers & Distributed Locks", path: "lessons/part-20-capstone/20.11-security-compliance-resilience-locks.md" },
            { id: "20.12", title: "Observability & the Production-Readiness Review", path: "lessons/part-20-capstone/20.12-observability-production-readiness.md" },
            { id: "20.13", title: "Full Architecture Review: Every Decision Defended", path: "lessons/part-20-capstone/20.13-full-architecture-review.md" },
          ]
        }
      ]
    },
  ]
};

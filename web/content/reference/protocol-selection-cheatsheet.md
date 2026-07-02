# Reference — Protocol & API Selection Cheat Sheet

Pairs with [Part 3 Networking] — especially [3.2.5 real-time transports], [3.2.6 API styles & serialization], and [3.3.x edge]. Use it to pick **transport**, **API style**, **serialization format**, and **real-time mechanism** by their guarantees and the **boundary** they serve. Directional guidance, not law — a well-built "lower-fit" choice can beat a poorly-built "best-fit" one.

---

## 1. Transport: TCP vs UDP vs QUIC (3.1.3–3.1.5)

| Need | Choose | Why |
|---|---|---|
| Reliable, ordered byte stream (most apps) | **TCP** | handshake + retransmit + ordering + congestion control |
| Lowest latency, can tolerate loss; you control reliability | **UDP** | no handshake/ordering/retransmit overhead (games, voice/video, DNS) |
| Reliable + multiplexed + encrypted, no TCP head-of-line blocking | **QUIC** | UDP-based, TLS 1.3 built in, per-stream delivery; basis for HTTP/3 |

---

## 2. HTTP version (3.2.1–3.2.2)

| Situation | Version |
|---|---|
| Universal compatibility, simple | HTTP/1.1 (keep-alive on) |
| Many concurrent requests per origin; reduce HoL at HTTP layer | **HTTP/2** (multiplexed streams, one connection) |
| Lossy/mobile networks, avoid TCP-level HoL, faster connection setup | **HTTP/3** (over QUIC) |

> HTTP/2 still suffers **TCP-level** HoL blocking on loss; HTTP/3 (QUIC) removes it.

---

## 3. API style: REST vs gRPC vs GraphQL (3.2.6)

| Boundary / need | Style | Notes |
|---|---|---|
| **Public API**, many/unknown clients, cacheable, debuggable | **REST + JSON** | universal, HTTP caching, readable; over/under-fetch + chatty |
| **Internal service-to-service**, high throughput, typed, streaming | **gRPC + Protobuf** (HTTP/2) | fast, codegen contracts, streaming; weak in browsers, no HTTP cache |
| **Rich UI / aggregate many sources**, client picks fields | **GraphQL** | one round trip, no over/under-fetch; caching hard, N+1/query-cost risk |

**Decision flow:** public edge → REST (or GraphQL for rich clients) · internal mesh → gRPC · aggregation/BFF → GraphQL · let a **gateway translate** edge↔internal (3.3.2).

---

## 4. Serialization format (3.2.6 · 4.3.1)

| Need | Format | Notes |
|---|---|---|
| Human-readable, public, debuggable, ubiquitous | **JSON** | verbose, no enforced schema, slower parse |
| Compact, fast, typed, internal RPC | **Protobuf** (or Thrift) | numeric field tags enable evolution; used by gRPC |
| Evolving schemas across many producers/consumers, big data/Kafka | **Avro** (+ schema registry) | reader/writer schema resolution |

**Evolution rules:** never reuse/renumber Protobuf tags; add fields as **optional with defaults**; additive-only for JSON; tolerant reader (ignore unknown fields); enforce compatibility in CI.

---

## 5. Real-time / server-push (3.2.5)

| Need | Mechanism | Notes |
|---|---|---|
| No real push; low-rate, simple | **Short polling** | wasteful, latency = interval; works everywhere |
| Near-real-time over plain HTTP; universal fallback | **Long polling** | server holds request until data; full req/resp per message |
| **One-way** server→client stream (notifications, feeds, token streaming) | **SSE** | plain HTTP, auto-reconnect + `Last-Event-ID` resume; HTTP/2 helps |
| **Two-way**, high-rate, low-latency (chat, multiplayer, collab) | **WebSocket** | full-duplex after HTTP upgrade; you build framing/heartbeats/reconnect |

> SSE/WebSocket hold a **connection per client** → memory/FDs (C10M), sticky routing (3.3.1), **pub/sub backplane** to scale fan-out (Part 9), and reconnect/resume/backpressure (Part 11).

---

## 6. Edge & traffic management (3.3.x)

| Concern | Tool | Rule of thumb |
|---|---|---|
| Which **region**? | **DNS** (GeoDNS/latency/weighted/health) + **anycast** | coarse, slow to change (TTL); lower TTL *before* migrations |
| Which **server**? | **Load balancer** (L4 fast/blind · L7 content-aware) | algorithm to workload; readiness checks; draining; redundant LBs |
| Cross-cutting **edge policy** (authN/Z, rate limit, routing, translation) | **API gateway / Ingress** | single front door (north-south); keep it **thin** (no business logic) |
| Serve content **near users** + offload origin + security | **CDN** | versioned/immutable assets > purge; `stale-while-revalidate`; WAF/DDoS |
| Reuse/limit **connections**, avoid overload | **keep-alive + pooling + backpressure** | small DB pools; align idle timeouts; bound queues; load shed (429/503) |

---

## 7. The end-to-end request path

```
DNS (region) → CDN edge (cached?) → Cloud LB (L4/L7) → API gateway/Ingress (policy)
   → Service (HTTP/2 or gRPC over TLS) → connection pool → DB / downstream
   (real-time? WebSocket/SSE; everything over TCP/QUIC + TLS)
```

---

## 8. Common red flags

- Using **gRPC for public browser APIs** (poor reach/caching) or **GraphQL for cache-critical CRUD** (caching is hard).
- **Round-robin DNS as a load balancer** (no health awareness) — use a real LB.
- **Purging** instead of **versioning** static assets; **caching personalized content publicly** (data leak).
- **Business logic in the API gateway** → distributed-monolith choke point; routing **east-west** traffic through it (use a mesh, 12.7).
- **Oversized DB connection pools** → exhaust DB connection limit (outage); **unbounded queues** → OOM/cascade.
- **Breaking schema evolution** (renumbered Protobuf tags, required new fields).
- **Single LB/gateway/DNS/CDN** with no redundancy → SPOF.

---

*Cross-references: [3.1.3–3.1.5], [3.2.1–3.2.6], [3.3.1–3.3.4], [Part 6 Caching], [Part 7 Scalability], [Part 9 Messaging], [Part 11 Resilience], [Part 12 Microservices], [Part 13 Cloud Native].*

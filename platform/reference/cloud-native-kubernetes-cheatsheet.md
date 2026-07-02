# Reference — Cloud-Native & Kubernetes Cheat Sheet

Pairs with [Part 13] (13.1–13.8). Core idea: **cloud-native = stateless, disposable, 12-factor cattle in immutable containers, run by a declarative self-healing orchestrator, scaled elastically, deployed safely, and spread across failure domains — powerful but not free.**

---

## 1. Cloud-native & 12/15-factor (13.1)

```
Cloud-native = DESIGNED to exploit the cloud (elastic, disposable, self-healing, automated) — NOT merely hosted there.
Cattle not pets: identical disposable instances killed+replaced on failure (not unique hand-tended servers).
```
- **App must be:** stateless (state externalized — 7.2) · disposable (fast start + graceful shutdown) · horizontally scalable · self-healing-friendly (health checks) · config-externalized · observable.
- **12-factor core:** 3 config-in-env · 4 backing services · 6 stateless processes · 8 scale-out concurrency · 9 disposability · 11 logs as streams · 5 build/release/run · 10 dev/prod parity.
- **15-factor adds:** API-first (13) · telemetry/observability (14) · authN/Z/security (15).
- **Cloud-native ≠ microservices:** a modular monolith can be fully cloud-native. Cloud-native = how you build/run; microservices = how you decompose.

---

## 2. Containers (13.2)

```
Container = isolated PROCESS on the SHARED host kernel = process + namespaces + cgroups + image. No guest OS/hypervisor.
Namespaces = what it SEES (PID/net/mount/UTS/IPC/user). cgroups = what it USES (CPU/mem/IO limits + accounting).
```
- **Image:** immutable, read-only, LAYERED; layers content-addressed → shared/cached; CoW writable layer at runtime; change = new image.
- **OCI:** image + runtime + distribution specs → portability (CRI → containerd/CRI-O → runc).
- **Container vs VM:** shared kernel, MBs, sub-second, dense, WEAKER isolation | full guest OS, GBs, slower, STRONGER isolation. Run containers in VMs; gVisor/Kata/Firecracker for hostile tenants.
- **Ops:** small multi-stage images, layer-cache order (deps before code), pin by digest (not `latest`), resource limits, non-root, scan.

---

## 3. Kubernetes (13.3)

```
Declarative + reconciliation: you declare DESIRED state; controllers observe→compare→act to converge, forever → self-healing.
```
- **Objects:** Pod (smallest unit; 1+ containers sharing net/storage; ephemeral) · ReplicaSet (keep N) · **Deployment** (rolling update + rollback — the workhorse) · StatefulSet (stateful) · DaemonSet (per-node) · Job/CronJob (batch) · **Service** (stable VIP/DNS load-balancing to healthy pods — built-in discovery).
- **Control plane:** API server (front door) · **etcd** (Raft-consistent state — 8.3.3) · scheduler · controller manager. **Node:** kubelet · container runtime (CRI) · kube-proxy.
- **Scheduler:** filter (feasibility: requests/affinity/taints) → score (spread vs bin-pack, topology spread).
- **Probes:** liveness (fail→restart) · readiness (fail→remove from Service, no restart) · startup (slow starters). Requests (scheduling) vs limits (cgroup cap).

---

## 4. Networking, config, stateful (13.4)

- **Flat network:** every pod a routable IP; every pod reaches every pod (no NAT); CNI implements it → everything reachable by default.
- **Service + kube-proxy + CoreDNS:** stable name → VIP → healthy pod (server-side discovery).
- **Ingress:** L7 host/path routing + TLS at the cluster edge (API-gateway role — 12.6); Gateway API = successor. **NetworkPolicy:** default-deny + allow (segment; zero-trust).
- **ConfigMap** (non-sensitive) / **Secret** (sensitive) → injected into the immutable image. **Secrets = base64, NOT encrypted** → enable etcd encryption + RBAC + external secrets manager.
- **Stateful:** StatefulSet (stable ordinal identity + ordered lifecycle + per-pod PV) + PV/PVC/StorageClass (dynamic provisioning; access modes RWO/ROX/RWX). **Prefer managed services for state**; self-host only with expertise + operator.

---

## 5. Autoscaling (13.5)

| Autoscaler | Scales | Notes |
|---|---|---|
| **HPA** | pod replicas | horizontal (default); metric vs target |
| **VPA** | pod CPU/mem requests | vertical; recreates pods; often recommendation-mode |
| **Cluster Autoscaler** | nodes | adds nodes for Pending pods; removes idle |

```
Elasticity needs stateless cattle. HPA + CA compose (pods → nodes). Don't run HPA + VPA on the same signal.
```
- **Scale-to-zero:** 0 instances idle (pay nothing) → spin up on demand; cost = COLD START latency. Serverless/KEDA/Knative.
- **Metrics:** concurrency / RPS / latency / queue-lag > CPU (poor proxy); target BELOW the knee (7.7) with headroom.
- **CRITICAL LIMIT:** autoscaling does NOT scale non-elastic dependencies (DB — 7.6) — scaling app tier into a fixed DB worsens overload. Pair with data-tier scaling/pooling + load shedding (11.4) + min/max bounds.

---

## 6. Cloud-native patterns (13.6)

```
Multi-container pod → compose behavior around the app WITHOUT modifying it (language-agnostic, reusable).
```
| Pattern | Role | ≈ OO pattern |
|---|---|---|
| **Sidecar** | add a capability (log shipper, mesh proxy) | Decorator |
| **Ambassador** | proxy OUTBOUND (localhost → discovery/LB/retry/TLS) | Proxy |
| **Adapter** | normalize app OUTPUT to a standard interface (metrics/logs) | Adapter |
| **Init container** | run setup BEFORE the app (migrations, wait-for-dep, fetch config) | ordered setup step |
- **Service mesh (12.7) = sidecar+ambassador+adapter productized.** Costs: resources × fleet, complexity, lifecycle ordering. Library for single-language/simple cases.

---

## 7. IaC, immutable, deployments (13.7)

- **IaC:** infra as version-controlled code; declarative (desired state, converges) > imperative; no ClickOps drift; reproducible/reviewable/DR-ready.
- **Immutable infra:** never patch running servers; rebuild image + replace → no drift, easy rollback (cattle).

| Strategy | Downtime | Cost | Blast radius | Rollback |
|---|---|---|---|---|
| **Rolling** | none | efficient | grows as it rolls | another roll |
| **Blue-green** | none | 2x (two envs) | all-at-once cutover | instant (flip router) |
| **Canary** | none | small | smallest (small %) | fast (auto on metrics) |

- **All require:** readiness probes + graceful shutdown + backward/forward-compatible (expand/contract — 5.4.3) changes + observability + automated rollback.
- **Feature flags:** decouple deploy from release; enable gradually, kill instantly.

---

## 8. Multi-AZ / multi-region / global traffic (13.8)

```
AZ = isolated data center in a region (close, ms → sync feasible). Region = geographically distant, independent (tens–hundreds ms → async → CAP/PACELC).
```
- **Multi-AZ = HA baseline** (≥3 AZs, topology spread, 3-AZ quorums, sync replication) — survive a data-center failure cheaply. Everyone should have this.
- **Multi-region = disaster resilience + global latency + residency** — costly; hard async data.
- **Global traffic:** GeoDNS (location, TTL-limited) · anycast (same IP, BGP nearest + reroute) · global LB (health-aware) · CDN edge (static).
- **Data topology:** active-passive (one write region + async standby; failover; RPO from lag) | active-active (multi-master; low latency, no write failover; conflict resolution — 10.4) | global strong-consistency DB (Spanner-style; strong but higher write latency).
- **Map to RPO/RTO** (11.8); test failover; beware global-config correlated failure (per-region canary).

---

## 9. One-line recall

| Concept | One line |
|---|---|
| Cloud-native | Designed to exploit the cloud (elastic/disposable/self-healing), not merely hosted; cattle not pets |
| 12/15-factor | Stateless processes, config in env, disposability, logs as streams, + API-first/telemetry/security |
| Container | Isolated process: namespaces (see) + cgroups (use) + immutable layered image; lighter than VMs |
| Kubernetes | Declarative reconciliation → self-healing; Pods/Deployments/Services; etcd (Raft) state |
| Networking | Flat pod net + Services/DNS; Ingress (edge); NetworkPolicy (segment) |
| Config/state | ConfigMaps/Secrets (weak by default); StatefulSets/PV; prefer managed services for state |
| Autoscaling | HPA (replicas) + VPA (size) + CA (nodes); scale-to-zero + cold start; can't scale a fixed DB |
| Patterns | Sidecar/ambassador/adapter/init = decorator/proxy/adapter at container level; mesh productizes them |
| IaC + immutable | Version-controlled declarative infra; rebuild+replace, never patch |
| Deployments | Rolling (efficient) / blue-green (instant rollback, 2x) / canary (smallest blast radius) + flags |
| Multi-AZ/region | Multi-AZ = HA baseline; multi-region = disaster + global (hard async data, CAP/PACELC) |

---

*Pairs with: Part 13 lessons; builds on 7.1/7.2 (scaling/stateless), 11.2/11.8 (redundancy/DR), 12.6/12.7 (discovery/mesh), 8.3.3 (Raft/etcd), 10.7/10.8 (CAP/PACELC), 3.2.4/3.3.3 (GeoDNS/anycast/CDN), 5.4.3 (zero-downtime migration). Leads into Parts 14–16.*

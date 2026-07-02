# Reference — Security Cheat Sheet

Pairs with [Part 15] (15.1–15.8). Core idea: **security is designed in, not bolted on — threat-model early, authenticate/authorize precisely, use vetted crypto + careful key/secret management, encrypt everywhere, adopt zero-trust, prevent the common OWASP vulns (separate data from code), rate-limit abuse, and design for compliance.**

---

## 1. Threat modeling (15.1)

```
Security = design property, not a feature. Four questions: What are we building? What can go wrong? What do we do? Did we do a good job?
Data crossing a TRUST BOUNDARY is never trusted → validate + authenticate + authorize.
```
- **STRIDE:** Spoofing(auth) · Tampering(integrity) · Repudiation(audit) · Info disclosure(confidentiality) · DoS(availability) · Elevation(authorization).
- **Attack surface:** all points an attacker can interact with → MINIMIZE (close ports/endpoints, hide internal services, minimal deps).
- **Principles:** least privilege · defense in depth · fail secure (fail closed) · assume breach · secure by default · KISS · don't roll your own crypto.
- Risk = likelihood × impact → mitigate/eliminate/transfer/accept.

---

## 2. AuthN / AuthZ (15.2)

```
AuthN = WHO are you (identity). AuthZ = WHAT may you do (permissions). Authenticate first, authorize EVERY action server-side.
Broken access control (IDOR) = #1 vuln — never trust the client for authz.
```
| | Session | JWT |
|---|---|---|
| State | stateful (server stores) | stateless (self-contained signed) |
| Revoke | easy (delete session) | hard (valid until exp) → short-lived + refresh |
| Scale | needs shared store (7.2) | scales freely (12.3) |
- **AuthZ models:** RBAC (roles), ABAC (attributes/policy), ReBAC (relationships); enforce centrally + least privilege.
- **OAuth2 = delegated AUTHORIZATION** (app accesses your data, scoped, no password) — NOT login. **OIDC = AUTHENTICATION** on top (ID token). "Sign in with Google" = OIDC.

---

## 3. Cryptography (15.3)

```
DON'T ROLL YOUR OWN. Match primitive to goal. Key management is the hardest part (crypto rarely breaks; keys do).
```
- **Symmetric** (shared key, fast — AES/AEAD): bulk data; key-distribution problem.
- **Asymmetric** (keypair, slow — RSA/ECC): solves distribution + signatures. **Hybrid (TLS):** asymmetric exchanges a symmetric key, symmetric does bulk.
- **Hash** (one-way, collision-resistant — SHA-256): integrity/fingerprint. **Password hash** = slow + salted (bcrypt/scrypt/Argon2), NOT fast hashes.
- **MAC/HMAC** (shared key): integrity+authenticity, NO non-repudiation. **Signature** (private key): integrity+authenticity+non-repudiation, verifiable by anyone.
- **Keys:** generate (CSPRNG) → store in KMS/HSM (never leaves) → rotate → revoke; never hardcode/commit.

---

## 4. Encryption & secrets (15.4)

```
Encrypt in transit (TLS everywhere incl. INTERNAL service-to-service) AND at rest (defense in depth). Guard keys > data.
```
- **At rest levels:** storage/disk (transparent, broad, but decrypted once loaded) vs application/field-level (protects vs DB compromise/insiders) + tokenization. Encrypt BACKUPS too (11.8).
- **Secrets failures:** hardcoded / committed to Git (leaked forever) / in images/logs/chat / never rotated / over-shared.
- **Secrets manager:** central encrypted store, least-privilege access, audit, rotation, **short-lived dynamic secrets**.
- **Envelope encryption:** data←DEK; DEK←KEK (KEK in KMS/HSM, never leaves); rotate KEK = re-wrap DEKs. K8s Secrets = base64 → external manager + etcd encryption (13.4).

---

## 5. Network security (15.5)

```
Perimeter (castle-and-moat) FAILED: breach → lateral movement; perimeter dissolved. → ZERO-TRUST: never trust the network, verify every request by IDENTITY.
```
- **Zero-trust:** verify explicitly (identity), assume breach, least privilege, micro-segmentation (13.4 NetworkPolicy), continuous verification.
- **mTLS:** mutual auth (both sides) + encryption for service-to-service; automatic via a service mesh (12.7).
- **WAF:** L7 filtering (SQLi/XSS/OWASP) — defense-in-depth layer, NOT a substitute for secure code.
- **DDoS:** volumetric/protocol/L7; can't out-provision at origin → absorb at edge (CDN/anycast/scrubbing — 3.3.3) + rate limit (15.7) + shed load (11.4).

---

## 6. OWASP vulnerabilities (15.6)

```
Injection root cause = mixing untrusted DATA with CODE (concatenation) → data executes as instructions. Fix = SEPARATE data from code.
```
- **SQLi fix:** parameterized queries / prepared statements (structure + data separate → structurally immune). NOT escaping/blocklists.
- **XSS fix:** output encoding / framework auto-escape (render as text) + CSP + HttpOnly cookies. (Injection into the browser.)
- **Input validation:** allow-list (positive, secure by default) at trust boundaries — defense in depth, NOT a substitute for parameterization/encoding.
- **SSRF:** server tricked into fetching attacker URLs → internal resources/cloud metadata (credential theft). Fix: allow-list dest, block internal/metadata, segmentation, zero-trust.
- **Broken access control (#1):** enforce authz server-side per request (15.2). Also: misconfig, vulnerable deps (14.7).

---

## 7. Rate limiting & abuse (15.7)

```
Dual-purpose: reliability (capacity/fairness — 11.4) + security (throttle volume-based abuse). Makes "many times fast" infeasible.
```
- **Algorithms:** token bucket (bursts + avg cap — default) · leaky bucket (steady rate) · fixed window (boundary bursts) · sliding window (accurate).
- **Dimensions:** per-IP (misses botnets/hurts NAT) · per-account · per-key · per-endpoint · global — COMBINE (no single one suffices).
- **Enforce:** edge/gateway (early load shedding — 12.6/11.4) + distributed (shared HA Redis counter across instances). Return 429 + Retry-After.
- **Abuse:** brute force (per-account+IP limit + lockout + CAPTCHA + MFA) · credential stuffing (per-IP + anomaly detection) · scraping (bot detection) · L7 DoS. Layer complementary controls.

---

## 8. Compliance (15.8)

```
Compliance = meet legal/regulatory rules; a FIRST-CLASS architectural driver; design in, not bolt on. (Not legal advice.)
```
- **Data:** classify (know your PII/regulated data) + minimize (collect/retain only what's needed).
- **GDPR:** data rights (access, **erasure/"right to be forgotten"** — hard: delete across services/caches/backups → crypto-shredding), consent, minimization, **residency** (13.8), breach notification.
- **PCI-DSS:** encrypt/restrict/segment card data; **reduce scope** via tokenization + third-party processors (raw card data never touches most systems).
- **Audit logging:** immutable, tamper-evident (append-only/signed), attributable (verified identity — 15.2), retained; for non-repudiation + compliance + incident investigation. REDACT secrets/PII (don't log passwords/tokens/card #s).
- Largely reuses security controls (encryption/access control/segmentation/audit) + privacy/rights/retention/residency.

---

## 9. One-line recall

| Concept | One line |
|---|---|
| Threat modeling | Design security in; STRIDE at trust boundaries; minimize attack surface; least privilege / defense in depth / assume breach |
| AuthN vs AuthZ | Who you are vs what you may do; enforce authz server-side; broken access control is #1 |
| Sessions vs JWT | Stateful/easy-revoke vs stateless/hard-revoke (short-lived + refresh) |
| OAuth2 vs OIDC | OAuth2 = delegated authorization; OIDC = authentication. Don't use OAuth2 to log in |
| Cryptography | Don't roll your own; symmetric/asymmetric/hybrid; slow+salted passwords; MAC vs signature; KMS keys |
| Encryption/secrets | Encrypt in transit + at rest; secrets manager + envelope encryption; never commit secrets |
| Zero-trust | Never trust the network; verify every request by identity; mTLS; contain breaches |
| OWASP/injection | Separate data from code (parameterize/encode); allow-list; SSRF; broken access control |
| Rate limiting | Reliability + security; token bucket; combine dimensions; edge + distributed; layer CAPTCHA/lockout/MFA |
| Compliance | First-class driver; classify+minimize PII; GDPR rights/residency; PCI scope reduction; immutable audit logs |

---

*Pairs with: Part 15 lessons; builds on 1.2.3 (security/compliance), 3.2.3 (TLS/mTLS/PKI), 8.1.1 (untrusted network), 12.6/12.7 (gateway/mesh), 13.4/13.8 (secrets/NetworkPolicy/residency), 11.4/6.7/2.4.4 (rate limiting), 14.7 (supply chain), 11.8 (backups). Leads into Parts 16–17 & the Part 20 capstone.*

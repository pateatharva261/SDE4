# Reference — Tradeoff Analysis Worksheet

A reusable template for any architectural decision. Pairs with [1.1.5 Tradeoffs as the Core Skill] and [1.3.3 ADRs]. Copy the block below per decision.

---

## The worksheet

```
DECISION: ___________________________________________
DATE / OWNER: _______________________________________
DOOR TYPE: [ one-way (irreversible, deliberate) | two-way (reversible, move fast) ]

CONTEXT (current scale, constraints, ranked NFRs):
  - Dominant NFR ranking (top 3): 1)______ 2)______ 3)______
  - Hard constraints (budget/time/team/legal/tech mandate): ______

OPTIONS CONSIDERED (≥2; if you only have 1, you don't understand the decision yet):
  A) _______________________
  B) _______________________
  C) _______________________

AXES & POSITIONS  (mark winner per axis + the cost paid)
  | Axis                    | A | B | C | Notes / cost |
  |-------------------------|---|---|---|--------------|
  | Latency                 |   |   |   |              |
  | Throughput              |   |   |   |              |
  | Consistency             |   |   |   |              |
  | Availability            |   |   |   |              |
  | Durability              |   |   |   |              |
  | Scalability             |   |   |   |              |
  | Space / $ cost          |   |   |   |              |
  | Operational simplicity  |   |   |   |              |
  | Evolvability / flexibility |   |   |   |           |
  | Security                |   |   |   |              |
  | Team familiarity        |   |   |   |              |

DOMINANCE CHECK:
  Is any option strictly worse on ALL axes you care about?  → reject it (false tradeoff).
  (Double-check you didn't miss a hidden axis before declaring dominance.)

DOMINANT CONSTRAINT (the thing that breaks the tie): __________________

DECISION:
  Choose ______ , ACCEPTING [cost] ____________ TO GAIN [benefit] ____________ ,
  BECAUSE [dominant constraint] ____________ .

MITIGATIONS for the accepted cost: _________________________________

REVERSAL TRIGGER (future fact/metric that should reopen this decision):
  __________________________________________________________________

HOW WE'LL KNOW WE WERE WRONG (metric / fitness function): _____________
```

---

## The recurring axes (quick reference, from 1.1.5 §3.2)

| Axis | One side | Other side | Where covered |
|---|---|---|---|
| Latency ↔ Durability/Consistency | ack fast, risk loss/staleness | replicate+confirm, slower | Part 4, Part 10 |
| Consistency ↔ Availability | refuse stale (CP) | serve stale (AP) | Part 10 (CAP/PACELC) |
| Space ↔ Time | precompute/cache/index | compute on demand | Part 4, Part 6 |
| Read-opt ↔ Write-opt | B-Tree / denormalized | LSM / normalized | Part 4, Part 5 |
| Simplicity ↔ Flexibility | rigid, easy to operate | abstract, evolvable | Part 2 |
| Coupling ↔ Autonomy | integrated, efficient | decoupled, independent | Part 12 |
| Latency ↔ Throughput | per-request speed | batch volume | Part 17 |
| Time-to-market ↔ Maintainability | ship with debt | build it right | Part 2.3 |
| Cost ↔ everything | cheaper | more nines/speed/redundancy | Part 14, Part 17 |

---

## Verbal pattern for interviews / reviews

> "Two reasonable options. On the **[axis]** axis, A gives **[gain]** but costs **[cost]**; B is the reverse. Since this system's dominant constraint is **[ranked NFR]**, I choose **[option]**, accepting **[cost]**, mitigated by **[mitigation]**. If the dominant constraint were **[other]**, I'd flip to **[other option]**. I'd revisit if **[reversal trigger]**."

That single structured sentence is the difference between sounding like a feature brochure and sounding like an architect.

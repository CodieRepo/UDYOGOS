# UDYOGSETU (उद्योगसेतु)
### *Industrial Approval Dependency & Critical-Path Execution Platform*
**SIH 2026 Problem Statement: SIH26130**

---

## 📌 Executive Summary
**UDYOGSETU** transforms industrial statutory compliance from a disconnected bureaucratic checklist into an **interactive, directed dependency graph (DAG)**. 

Given an enterprise’s physical and operational parameters (industry sector, regulatory categorization, power demand, built-up footprint, and workforce size), UDYOGSETU executes a deterministic statutory ruleset to identify:
1. **Applicable Clearances:** Exactly which statutory approvals apply across State & Central authorities.
2. **Current Blockers:** Approvals locked by unfulfilled prerequisite milestones.
3. **Parallel Fast-Tracks:** Approvals whose prerequisites are satisfied and can execute concurrently today.
4. **Active Critical Bottleneck:** The single prerequisite gating the longest remaining dependency chain.
5. **Next Best Actions:** A priority queue dynamically derived from graph topology.
6. **Live Recalculation:** Instant updates to lead times, remaining critical path, and downstream readiness whenever a milestone is cleared.

---

## 🎯 The Core Innovation: Dependency Graph vs. Static Portals

| Conventional Government Portals | **UDYOGSETU Engine** |
| :--- | :--- |
| **Flat Checklist:** "You need 10 approvals." | **Directed Dependency Graph:** "You need 10 approvals: 3 actionable today, 6 blocked by prior statutory milestones." |
| **Uncoordinated Sequences:** Filing out of order leads to 45-day review rejections. | **Pre-Flight Dependency Validation:** Prevents premature filing; isolates exact prerequisite chains. |
| **Opaque Deadlines:** "Application status: Pending". | **Critical Path Lead-Time Engine:** Pinpoints the active critical bottleneck gating the project's operational go-live date. |
| **Siloed Document Filing:** Re-uploading the same blueprint 4 times to 4 departments. | **Pre-Flight Document Cross-Check:** Maps shared documents across multiple department filings and flags single-point documentary blockers. |
| **Probabilistic Chatbots:** Hallucination risk on legal regulations. | **Deterministic Rule Engine:** Auditable, reproducible graph topology with no runtime dependency on external APIs during the prototype demo. |

---

## 📐 Mathematical Formulation & Derived Graph Metrics

### 1. Serialized Duration ($\mathcal{D}_{\text{serial}}$)
The algebraic sum of the statutory SLA durations of all applicable approvals in the graph (i.e. total duration if handled sequentially):
$$\mathcal{D}_{\text{serial}} = \sum_{u \in \mathcal{V}_{\text{active}}} \text{SLA}(u)$$

### 2. State-Aware Remaining Critical Path ($\mathcal{D}_{\text{critical}}$)
Computed via Dynamic Programming on the remaining incomplete DAG where completed nodes contribute $0$ remaining duration:
$$\text{RemainingEF}(u) = \text{SLA}(u) + \max_{p \in \text{Prerequisites}(u) \setminus \mathcal{V}_{\text{completed}}} \text{RemainingEF}(p)$$
$$\mathcal{D}_{\text{critical}} = \max_{u \notin \mathcal{V}_{\text{completed}}} \text{RemainingEF}(u)$$

### 3. Concurrency Savings ($\mathcal{S}_{\text{parallel}}$)
$$\mathcal{S}_{\text{parallel}} = \mathcal{D}_{\text{serial}} - \mathcal{D}_{\text{critical}}$$

---

## 🔬 Benchmark Synthetic Scenario: Apex Precision Engineering

* **Entity:** Apex Precision Engineering Pvt. Ltd. (Chakan Industrial Area, Pune)
* **Parameters:** Orange Category | 150 kVA Power Sanction | 65 Workers | 18,000 sq.ft Built-Up

### Benchmark State Progression:

```
INITIAL BENCHMARK STATE:
• Total Clearances:           10
• Initial Status Breakdown:   1 Completed (Plot Allotment), 3 Ready, 6 Blocked
• Original Critical Path:     105 Calendar Days
• Remaining Critical Path:    95 Calendar Days
• Remaining Serialized Time:  215 Calendar Days
• Parallel Concurrency Gain:  120 Calendar Days Saved
• Active Critical Bottleneck: Consent to Establish (CTE) - SPCB (45d SLA)

AFTER PRIMARY DEMO ACTION (CTE SIMULATED AS CLEARED):
• Status Breakdown:           2 Completed, 3 Ready, 5 Blocked
• Downstream Unlocks:         Consent to Operate (CTO) unlocks to READY!
• Remaining Blocker Update:   Factory Plan Approval drops CTE from its blocker list;
                              now waiting ONLY on Building Plan Sanction!
• Remaining Critical Path:    Recalculates from 95d -> 75d (20 Days Saved!)
• Serialized Remaining Time:  Drops from 215d -> 170d
• Dynamic Next Action:        Building Plan Approval promoted to #1 Critical Bottleneck!
```

---

## 🚀 Running the Project Locally

```bash
# 1. Install dependencies
npm install

# 2. Run the deterministic engine verification test suite
npm run test:engine

# 3. Start the Next.js development server
npm run dev

# 4. Open http://localhost:3000 in your browser
```

---

## 🧭 Project Directory Structure

```
UDYOGSETU/
├── src/
│   ├── types/
│   │   └── compliance.ts           # Unified TypeScript domain schemas
│   ├── data/
│   │   └── demonstrationDataset.ts # Single source of truth (10 nodes, 8 docs, 3 profiles)
│   ├── engine/
│   │   └── dependencyEngine.ts     # Topological sorter, DP critical-path & action synthesizer
│   ├── context/
│   │   └── ComplianceContext.tsx   # Reactive state management with 0ms local state updates
│   ├── components/
│   │   ├── Header.tsx              # Command strip & scenario selector
│   │   ├── NavigationTabs.tsx      # Multi-view navigation
│   │   ├── CommandCockpit.tsx      # KPI cards & readiness meter
│   │   ├── DependencyMap.tsx       # HERO View: 3-stage critical vs parallel pipeline
│   │   ├── ApprovalCard.tsx        # Status-styled clearance cards
│   │   ├── NextBestActions.tsx     # Priority action queue
│   │   ├── DocumentMatrix.tsx      # Pre-flight document cross-check & reuse
│   │   └── ClearanceDrawer.tsx     # Inspection drawer with 1-click simulator
│   ├── scripts/
│   │   └── verify-engine.ts        # Automated unit verification of graph transitions
│   └── app/
│       ├── layout.tsx              # Root HTML shell
│       ├── page.tsx                # App viewport
│       └── globals.css             # Tailwind theme & custom scrollbars
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## ⚖️ Illustrative Demonstration Disclaimer
*All statutory rules, approval dependencies, SLA durations, and legal citations (`Water Act 1974`, `Factories Act 1948`) are configured within an illustrative demonstration ruleset designed to demonstrate platform architecture and operational feasibility. Not intended as universal legal counsel.*

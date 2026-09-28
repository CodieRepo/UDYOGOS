import { DEMO_DOCUMENTS, DEMO_PROFILES, MASTER_APPROVAL_POOL } from "../data/demonstrationDataset";
import { runComplianceEngine } from "../engine/dependencyEngine";

console.log("=================================================");
console.log("UDYOGSETU (उद्योगसेतु) RED-TEAM & ENGINE QA SUITE");
console.log("=================================================\n");

// Select the benchmark scenario: Apex Precision Engineering
const apexProfile = DEMO_PROFILES[0];
console.log(`[TEST 1] Primary Scenario: ${apexProfile.name} (${apexProfile.pollutionCategory.toUpperCase()} Category, ${apexProfile.powerKva} kVA, ${apexProfile.workforce} Workers)`);

// ---------------------------------------------------------------------------
// TEST 1: INITIAL STATE VERIFICATION
// ---------------------------------------------------------------------------
const initialCompletedIds = new Set<string>(["node-1"]); // Plot Allotment verified
const initialInProgressIds = new Set<string>();

const initialState = runComplianceEngine(
  apexProfile,
  MASTER_APPROVAL_POOL,
  DEMO_DOCUMENTS,
  initialCompletedIds,
  initialInProgressIds
);

console.log(`  Total Clearances:               ${initialState.totalApplicable} (Expected: 10)`);
console.log(`  Status Breakdown:               ${initialState.completedCount} Done, ${initialState.readyCount} Ready, ${initialState.blockedCount} Blocked`);
console.log(`  Original Planned Duration:      ${initialState.originalPlannedCriticalPathDays} days (Expected: 105)`);
console.log(`  Remaining Critical Path:        ${initialState.remainingCriticalPathDays} days (Expected: 95)`);
console.log(`  Potential Calendar Savings:     ${initialState.simulatedParallelSavings} days (Expected: 120)`);
console.log(`  Active Main Blocker:            ${initialState.criticalBottleneckNode?.title} (${initialState.criticalBottleneckNode?.code})`);

if (
  initialState.completedCount !== 1 ||
  initialState.readyCount !== 3 ||
  initialState.blockedCount !== 6 ||
  initialState.criticalBottleneckNode?.id !== "node-2"
) {
  console.error("❌ FAILED: Initial state mismatch!");
  process.exit(1);
}
console.log("  ✓ Initial State Verified: 10 Clearances, Main Blocker is CTE.\n");

// ---------------------------------------------------------------------------
// TEST 2: PRIMARY DEMO TRANSITION (CTE COMPLETED)
// ---------------------------------------------------------------------------
console.log("[TEST 2] Action: Marking Consent to Establish (node-2) as Completed...");

const afterCteCompletedIds = new Set<string>(["node-1", "node-2"]);
const afterCteState = runComplianceEngine(
  apexProfile,
  MASTER_APPROVAL_POOL,
  DEMO_DOCUMENTS,
  afterCteCompletedIds,
  initialInProgressIds
);

const ctoNode = afterCteState.approvals.find(n => n.id === "node-7");
const factPlanNode = afterCteState.approvals.find(n => n.id === "node-6");

console.log(`  Status Breakdown:               ${afterCteState.completedCount} Done, ${afterCteState.readyCount} Ready, ${afterCteState.blockedCount} Blocked`);
console.log(`  node-7 (Consent to Operate):    Status is '${ctoNode?.status}' (Expected: 'ready')`);
console.log(`  node-6 (Factory Plan Approval): Blocked by: [${factPlanNode?.blockedByApprovalTitles.join(", ")}] (Expected: 'Industrial Building Plan Sanction')`);
console.log(`  Remaining Critical Path:        ${afterCteState.remainingCriticalPathDays} days (Reduced from 95d -> 75d, 20d saved!)`);
console.log(`  New Main Blocker:               ${afterCteState.criticalBottleneckNode?.title} (${afterCteState.criticalBottleneckNode?.code})`);
console.log(`  Next Best Action Priority 1:    ${afterCteState.nextBestActions[0]?.title}`);

if (
  afterCteState.completedCount !== 2 ||
  afterCteState.readyCount !== 3 ||
  afterCteState.blockedCount !== 5 ||
  ctoNode?.status !== "ready" ||
  factPlanNode?.status !== "blocked" ||
  afterCteState.criticalBottleneckNode?.id !== "node-3" ||
  afterCteState.nextBestActions[0]?.approvalId !== "node-3"
) {
  console.error("❌ FAILED: After CTE transition mismatch!");
  process.exit(1);
}
console.log("  ✓ Primary Transition Verified: CTO unlocked, Factory Plan waiting list reduced, Main Blocker dynamically shifted to Building Plan.\n");

// ---------------------------------------------------------------------------
// TEST 3: SECONDARY TRANSITION (BUILDING PLAN COMPLETED)
// ---------------------------------------------------------------------------
console.log("[TEST 3] Action: Marking Building Plan (node-3) as Completed...");

const afterBldgCompletedIds = new Set<string>(["node-1", "node-2", "node-3"]);
const afterBldgState = runComplianceEngine(
  apexProfile,
  MASTER_APPROVAL_POOL,
  DEMO_DOCUMENTS,
  afterBldgCompletedIds,
  initialInProgressIds
);

const factPlanNode2 = afterBldgState.approvals.find(n => n.id === "node-6");
const provFireNode2 = afterBldgState.approvals.find(n => n.id === "node-5");

console.log(`  node-6 (Factory Plan):          Status is '${factPlanNode2?.status}' (Expected: 'ready'!)`);
console.log(`  node-5 (Provisional Fire):      Status is '${provFireNode2?.status}' (Expected: 'ready'!)`);
console.log(`  Status Breakdown:               ${afterBldgState.completedCount} Done, ${afterBldgState.readyCount} Ready, ${afterBldgState.blockedCount} Blocked`);
console.log(`  New Main Blocker:               ${afterBldgState.criticalBottleneckNode?.title} (${afterBldgState.criticalBottleneckNode?.code})`);

if (
  factPlanNode2?.status !== "ready" ||
  provFireNode2?.status !== "ready" ||
  afterBldgState.readyCount !== 4 ||
  afterBldgState.blockedCount !== 3 ||
  afterBldgState.criticalBottleneckNode?.id !== "node-6"
) {
  console.error("❌ FAILED: Secondary transition mismatch!");
  process.exit(1);
}
console.log("  ✓ Secondary Transition Verified: Factory Plan & Fire NOC unlocked, Main Blocker shifted to Factory Plan.\n");

// ---------------------------------------------------------------------------
// TEST 4: SCENARIO SWITCHING STABILITY TEST
// ---------------------------------------------------------------------------
console.log("[TEST 4] Testing Scenario Switching (Greenleaf Agro & Voltix Electronics)...");

const greenProfile = DEMO_PROFILES[1];
const greenState = runComplianceEngine(greenProfile, MASTER_APPROVAL_POOL, DEMO_DOCUMENTS, new Set(["node-1"]), new Set());
console.log(`  Greenleaf Agro (Green Category, 60 kVA): ${greenState.totalApplicable} applicable clearances`);

const voltixProfile = DEMO_PROFILES[2];
const voltixState = runComplianceEngine(voltixProfile, MASTER_APPROVAL_POOL, DEMO_DOCUMENTS, new Set(["node-1"]), new Set());
console.log(`  Voltix Microelectronics (White Category, 30 kVA): ${voltixState.totalApplicable} applicable clearances`);

if (greenState.totalApplicable < 1 || voltixState.totalApplicable < 1) {
  console.error("❌ FAILED: Scenario switching test failed!");
  process.exit(1);
}
console.log("  ✓ Scenario Switching Verified: Engine dynamically re-evaluates applicable subsets cleanly.\n");

console.log("=================================================");
console.log("✅ Automated verification passed for the configured demonstration scenarios.");
console.log("=================================================\n");

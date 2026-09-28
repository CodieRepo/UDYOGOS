/**
 * UDYOGSETU Phase 2 Verification Suite
 * 
 * Tests the real-data grounding features implemented in Phase 2:
 * 1. CPCB Industrial Sector Resolver (deterministic keyword scoring & category lookup)
 * 2. Maharashtra Industrial Cluster & Competent Authority Resolver
 * 3. Statutory Regulatory Provenance Integrity (Acts, Sections, RTSA SLA days, MAITRI codes)
 * 4. Deterministic Graph & Critical Path Invariance
 * 5. Document Cascade Blocker Invariance
 */

import { searchCpcbSectors, getCpcbSectorById } from "../engine/cpcbResolver";
import {
  getAllIndustrialClusters,
  getAvailableDistricts,
  getClustersByDistrict,
  getClusterById,
} from "../engine/clusterResolver";
import { MASTER_APPROVAL_POOL, DEMO_DOCUMENTS, DEMO_PROFILES } from "../data/demonstrationDataset";
import { runComplianceEngine } from "../engine/dependencyEngine";

let passCount = 0;
let failCount = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  if (condition) {
    passCount++;
    console.log(`  ✓ PASS: ${testName}`);
  } else {
    failCount++;
    console.error(`  ✗ FAIL: ${testName}${detail ? ` - ${detail}` : ""}`);
  }
}

console.log("\n=======================================================");
console.log("   UDYOGSETU PHASE 2 REAL-DATA GROUNDING VERIFICATION");
console.log("=======================================================\n");

// TEST SUITE 1: CPCB Sector Resolver
console.log("--- 1. Testing CPCB Industrial Sector Resolver ---");
const cncResults = searchCpcbSectors("CNC machining");
assert(cncResults.length > 0, "CNC query returns matching sector");
assert(cncResults[0]?.sector.id === "CPCB-001", "Top match for CNC is CPCB-001 (Precision CNC Machining)");
assert(cncResults[0]?.sector.category === "orange", "CNC category is Orange");
assert(cncResults[0]?.sector.pollution_index_range.includes("41"), "CNC Pollution Index is 41-59");

const solarResults = searchCpcbSectors("electronics pcb surface mount");
assert(solarResults.length > 0, "Electronics query returns matching sector");
assert(solarResults[0]?.sector.category === "white", "PCB assembly is classified as White");

const electroResults = searchCpcbSectors("electroplating chromium metal finishing");
assert(electroResults.length > 0, "Electroplating query returns matching sector");
assert(electroResults[0]?.sector.category === "red", "Electroplating is classified as Red");
assert(electroResults[0]?.sector.pollution_index_range.includes("60"), "Electroplating PI is 60 and above");

const directLookup = getCpcbSectorById("CPCB-002");
assert(directLookup !== undefined, "Lookup by ID CPCB-002 (Electroplating) succeeds");
assert(directLookup?.category === "red", "Electroplating is Red category");

// TEST SUITE 2: Maharashtra Industrial Clusters
console.log("\n--- 2. Testing Maharashtra Industrial Cluster & Authority Resolver ---");
const allClusters = getAllIndustrialClusters();
assert(allClusters.length >= 8, `Loaded ${allClusters.length} verified Maharashtra clusters (expected >= 8)`);

const districts = getAvailableDistricts();
assert(districts.includes("Pune"), "Districts list includes Pune");
assert(districts.includes("Thane"), "Districts list includes Thane");
assert(districts.includes("Nagpur"), "Districts list includes Nagpur");

const puneClusters = getClustersByDistrict("Pune");
assert(puneClusters.length >= 3, `Pune district has ${puneClusters.length} clusters (expected >= 3)`);

const chakan = getClusterById("CLUSTER-MH-01");
assert(chakan !== undefined, "Lookup Chakan Phase II by ID CLUSTER-MH-01 succeeds");
assert(chakan?.dic_office.includes("Pune") ?? false, "Chakan DIC office is located in Pune");
assert(chakan?.planning_authority.includes("MIDC") ?? false, "Chakan planning authority is MIDC SPA");
assert(chakan?.environmental_authority.includes("MPCB") ?? false, "Chakan environmental authority is MPCB");
assert(chakan?.power_distribution_authority.includes("MSEDCL") ?? false, "Chakan DISCOM is MSEDCL");

// TEST SUITE 3: Statutory Regulatory Provenance Integrity
console.log("\n--- 3. Testing Master Approvals Statutory Provenance ---");
let allHaveProvenance = true;
let allHaveActs = true;
let allHaveSections = true;
let allHaveSla = true;

for (const approval of MASTER_APPROVAL_POOL) {
  if (!approval.provenance) {
    allHaveProvenance = false;
    console.error(`Missing provenance for approval: ${approval.id}`);
  } else {
    if (!approval.provenance.statutory_act || approval.provenance.statutory_act.trim().length === 0) {
      allHaveActs = false;
    }
    if (!approval.provenance.section_or_rule || approval.provenance.section_or_rule.trim().length === 0) {
      allHaveSections = false;
    }
    if (!approval.provenance.rtsa_statutory_timeline_days || approval.provenance.rtsa_statutory_timeline_days <= 0) {
      allHaveSla = false;
    }
  }
}

assert(allHaveProvenance, "All 10 approvals in Master Pool have statutory provenance attached");
assert(allHaveActs, "All approvals cite official statutory Acts");
assert(allHaveSections, "All approvals cite enabling Section or Rule numbers");
assert(allHaveSla, "All approvals cite positive RTSA 2015 SLA calendar days");

// TEST SUITE 4: Deterministic Graph Execution & Critical Path Invariance
console.log("\n--- 4. Testing Deterministic Graph Engine Invariance ---");
const apexProfile = DEMO_PROFILES[0];
const initialCompletedIds = new Set<string>(["node-1"]); // Land Allotment Demarcation is cleared
const inProgressIds = new Set<string>();

const initialState = runComplianceEngine(
  apexProfile,
  MASTER_APPROVAL_POOL,
  DEMO_DOCUMENTS,
  initialCompletedIds,
  inProgressIds
);

assert(initialState.totalApplicable === 10, `Apex profile has 10 applicable clearances (got ${initialState.totalApplicable})`);
assert(initialState.completedCount === 1, `1 completed approval (got ${initialState.completedCount})`);
assert(initialState.readyCount === 3, `3 ready approvals at baseline (got ${initialState.readyCount})`);
assert(initialState.blockedCount === 6, `6 blocked approvals (got ${initialState.blockedCount})`);
assert(initialState.originalPlannedCriticalPathDays === 105, `Original planned duration = 105 days (got ${initialState.originalPlannedCriticalPathDays})`);
assert(initialState.remainingCriticalPathDays === 95, `Remaining critical path = 95 days (got ${initialState.remainingCriticalPathDays})`);
assert(initialState.criticalBottleneckNode?.id === "node-2", `Main bottleneck is node-2 CTE (got ${initialState.criticalBottleneckNode?.id})`);

// Next action check
const nextAction = initialState.nextBestActions[0];
assert(nextAction !== undefined, "Next Best Action is generated");
assert(nextAction.approvalId === "node-2", `Top Next Best Action is CTE node-2 (got ${nextAction?.approvalId})`);
assert(nextAction.provenance !== undefined, "Next Best Action preserves statutory provenance");

// Simulate completing node-2 (CTE)
const step2CompletedIds = new Set<string>(["node-1", "node-2"]);
const step2State = runComplianceEngine(
  apexProfile,
  MASTER_APPROVAL_POOL,
  DEMO_DOCUMENTS,
  step2CompletedIds,
  inProgressIds
);
assert(step2State.completedCount === 2, "After completing node-2, completedCount is 2");
assert(step2State.remainingCriticalPathDays === 75, `Remaining critical path drops from 95 to 75 days (got ${step2State.remainingCriticalPathDays})`);

// TEST SUITE 5: Document Cascade Blocker Verification
console.log("\n--- 5. Testing Document Cascade Blockers ---");
const doc4 = DEMO_DOCUMENTS.find((d) => d.id === "DOC-4")!;
assert(doc4 !== undefined, "DOC-4 (Structural Stability Certificate) exists");
assert(doc4.requiredByApprovalIds.includes("node-3"), "DOC-4 is required by Building Plan Sanction (node-3)");
assert(doc4.requiredByApprovalIds.includes("node-6"), "DOC-4 is required by Factory Plan (node-6)");

console.log("\n=======================================================");
console.log(`Phase 2 Verification Complete: ${passCount} passed, ${failCount} failed.`);
console.log("=======================================================\n");

if (failCount > 0) {
  process.exit(1);
}

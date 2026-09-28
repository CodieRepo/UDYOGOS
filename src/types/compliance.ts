// Core TypeScript definitions for UDYOGSETU (उद्योगसेतु)
// Scope: Illustrative Demonstration Ruleset

export type Sector = "engineering" | "food_processing" | "electronics" | "textile" | "chemical";
export type PollutionCategory = "white" | "green" | "orange" | "red";
export type ApprovalStatus = "completed" | "in_progress" | "ready" | "blocked";
export type StageType = "pre_establishment" | "pre_operation" | "operational";
export type ActionPriority = "critical_path" | "parallel_fast_track";

export interface PlantProfile {
  id: string;
  name: string;
  companyName: string;
  location: string;
  stateOrRegion: string;
  sector: Sector;
  sectorLabel: string;
  pollutionCategory: PollutionCategory;
  powerKva: number;
  workforce: number;
  builtUpAreaSqFt: number;
  description: string;
}

export interface DocumentSpec {
  id: string;
  code: string;
  title: string;
  category: "site" | "legal" | "engineering" | "environmental" | "safety";
  description: string;
  isAvailableDefault: boolean;
  requiredByApprovalIds: string[]; // Demonstrates multi-department re-use
}

export interface ApprovalNode {
  id: string;
  code: string;                 // e.g., "SPCB-CTE", "DISCOM-HT"
  title: string;                // e.g., "Consent to Establish (CTE)"
  department: string;           // e.g., "Maharashtra Pollution Control Board (SPCB)"
  stage: StageType;
  stageLabel: string;
  slaDays: number;              // Statutory/Demo processing timeline in calendar days
  statutoryRuleRef: string;     // e.g., "Water Act 1974 & Air Act 1981 - Demo Ruleset"
  isCriticalSpineVisual: boolean; // Structural presentation flag (upper spine vs lower parallel)
  
  prerequisiteIds: string[];    // IDs of approvals that MUST be 'completed'
  requiredDocumentIds: string[];// Document IDs required for filing
  inspectionChecklist: string[];// On-site inspection/compliance checkpoints
  
  // Dynamic Applicability Conditions (evaluated against PlantProfile)
  applicability: {
    minWorkforce?: number;
    minPowerKva?: number;
    pollutionCategories?: PollutionCategory[];
    sectors?: Sector[];
  };

  // Runtime Evaluated State
  status: ApprovalStatus;
  blockedByApprovalTitles: string[];
  unblocksApprovalTitles: string[];
  isOnRemainingCriticalPath: boolean;
}

export interface NextActionItem {
  approvalId: string;
  code: string;
  title: string;
  department: string;
  stage: StageType;
  priority: ActionPriority;
  priorityLabel: string;
  slaDays: number;
  rationale: string;
  unblocksTitles: string[];
  missingDocumentTitles: string[];
}

export interface EngineState {
  profile: PlantProfile;
  approvals: ApprovalNode[];
  documents: DocumentSpec[];
  
  // Counts
  totalApplicable: number;
  completedCount: number;
  readyCount: number;
  inProgressCount: number;
  blockedCount: number;
  
  // Operational Graph Metrics
  originalPlannedCriticalPathDays: number; // Theoretical duration from ground zero
  remainingCriticalPathDays: number;       // Shortest time to completion from current runtime state
  remainingSerializedDays: number;         // Sum of remaining incomplete node SLAs
  simulatedParallelSavings: number;        // remainingSerializedDays - remainingCriticalPathDays
  readinessPercentage: number;             // Weighted / completed percentage
  
  // Dynamic Guidance
  criticalBottleneckNode: ApprovalNode | null;
  nextBestActions: NextActionItem[];
  remainingCriticalPathNodeIds: string[];
}

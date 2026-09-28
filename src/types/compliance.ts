// Core TypeScript definitions for UDYOGSETU (उद्योगसेतु)
// Scope: Grounded Regulatory Architecture (Maharashtra Pilot & CPCB Standard)

export type Sector = "engineering" | "food_processing" | "electronics" | "textile" | "chemical";
export type PollutionCategory = "white" | "green" | "orange" | "red";
export type ApprovalStatus = "completed" | "in_progress" | "ready" | "blocked";
export type StageType = "pre_establishment" | "pre_operation" | "operational";
export type ActionPriority = "critical_path" | "parallel_fast_track";
export type ProvenanceVerificationStatus = "verified_statutory" | "curated_demo";

export interface RegulatoryProvenance {
  verification_status: ProvenanceVerificationStatus;
  source_organization: string;     // e.g. "State Pollution Control Board / CPCB"
  statutory_act: string;           // e.g. "Water Act 1974 & Air Act 1981"
  section_or_rule?: string;        // e.g. "Section 25 (Water Act) & Section 21 (Air Act)"
  service_code?: string;           // e.g. "MAITRI-MPCB-001"
  rtsa_statutory_timeline_days: number; // Statutory timeline under Right to Public Services Act
  source_url: string;              // Official public link
  last_verified: string;           // "2026-09"
  legal_disclaimer?: string;
}

export interface CpcbSectorEntry {
  id: string;
  sector_name: string;
  category: PollutionCategory;
  pollution_index_range: string;
  description: string;
  effluent_characteristic?: string;
  hazardous_waste_flag?: boolean;
  keywords: string[];
  source: string;
  source_url: string;
  last_verified: string;
}

export interface IndustrialCluster {
  id: string;
  district: string;
  industrial_estate: string;
  zone_classification: string;
  industrial_authority: string;
  planning_authority: string;
  environmental_authority: string;
  power_distribution_authority: string;
  water_supply_authority: string;
  fire_services_authority: string;
  dic_office: string;
  source: string;
  source_url: string;
}

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

  // Grounded Metadata
  cpcbSectorId?: string;
  cpcbSectorName?: string;
  cpcbPollutionIndex?: string;
  clusterId?: string;
  district?: string;
  industrialEstate?: string;
  authorities?: {
    industrial: string;
    planning: string;
    environmental: string;
    power: string;
    dic: string;
  };
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
  slaDays: number;              // Statutory processing timeline under RTSA / citizen charter
  statutoryRuleRef: string;     // Statutory Act and Section reference
  isCriticalSpineVisual: boolean; // Structural presentation flag (upper spine vs lower parallel)
  
  prerequisiteIds: string[];    // IDs of approvals that MUST be 'completed'
  requiredDocumentIds: string[];// Document IDs required for filing
  inspectionChecklist: string[];// On-site inspection/compliance checkpoints
  
  // Real Statutory Grounding & Provenance
  provenance: RegulatoryProvenance;

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
  provenance: RegulatoryProvenance;
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
  originalPlannedCriticalPathDays: number; // Baseline project duration from inception
  remainingCriticalPathDays: number;       // Shortest time to completion from current runtime state
  remainingSerializedDays: number;         // Sum of remaining incomplete node SLAs
  simulatedParallelSavings: number;        // remainingSerializedDays - remainingCriticalPathDays
  readinessPercentage: number;             // Weighted / completed percentage
  
  // Dynamic Guidance
  criticalBottleneckNode: ApprovalNode | null;
  nextBestActions: NextActionItem[];
  remainingCriticalPathNodeIds: string[];
}

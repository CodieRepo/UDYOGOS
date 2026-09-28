import { ApprovalNode, DocumentSpec, PlantProfile } from "../types/compliance";

// ==========================================
// 1. GROUNDED PLANT PROFILES (With CPCB & Cluster Metadata)
// ==========================================
export const DEMO_PROFILES: PlantProfile[] = [
  {
    id: "profile-apex-eng",
    name: "Apex Precision Engineering",
    companyName: "Apex Precision Engineering Pvt. Ltd.",
    location: "Chakan Industrial Area, Phase II, Pune",
    stateOrRegion: "Maharashtra",
    sector: "engineering",
    sectorLabel: "Light Engineering & CNC Machining",
    pollutionCategory: "orange",
    powerKva: 150,
    workforce: 65,
    builtUpAreaSqFt: 18000,
    description: "High-precision CNC turning, metal component washing, and surface finishing facility requiring dedicated industrial effluent containment and high-tension electrical sanction.",
    
    // Grounded CPCB and Location Metadata
    cpcbSectorId: "CPCB-001",
    cpcbSectorName: "CNC Machining, Turning & Light Engineering",
    cpcbPollutionIndex: "41 - 59 (Orange)",
    clusterId: "CLUSTER-MH-01",
    district: "Pune",
    industrialEstate: "Chakan Industrial Area (Phase II)",
    authorities: {
      industrial: "Maharashtra Industrial Development Corporation (MIDC)",
      planning: "MIDC Special Planning Authority (SPA)",
      environmental: "Maharashtra Pollution Control Board (MPCB) - Regional Office, Pune",
      power: "MSEDCL - Bhosari/Chakan HT Industrial Circle",
      dic: "District Industries Centre (DIC), Agriculture College Campus, Pune"
    }
  },
  {
    id: "profile-greenleaf-agro",
    name: "Greenleaf Agro-Processing",
    companyName: "Greenleaf Agro Foods Ltd.",
    location: "Baramati Mega Food Park, Pune",
    stateOrRegion: "Maharashtra",
    sector: "food_processing",
    sectorLabel: "Agro-Foods & Grain Milling",
    pollutionCategory: "green",
    powerKva: 60,
    workforce: 35,
    builtUpAreaSqFt: 12500,
    description: "Grain sorting, dehydration, and packaging unit with organic wash-water discharge under green regulatory threshold.",
    
    // Grounded CPCB and Location Metadata
    cpcbSectorId: "CPCB-003",
    cpcbSectorName: "Agro-Foods, Grain Milling & Flour Mills",
    cpcbPollutionIndex: "21 - 40 (Green)",
    clusterId: "CLUSTER-MH-04",
    district: "Pune",
    industrialEstate: "Baramati Mega Food Park & Agro Cluster",
    authorities: {
      industrial: "Maharashtra Industrial Development Corporation (MIDC)",
      planning: "MIDC Special Planning Authority (SPA)",
      environmental: "MPCB Sub-Regional Office, Baramati",
      power: "MSEDCL - Baramati Circle",
      dic: "District Industries Centre (DIC), Pune"
    }
  },
  {
    id: "profile-voltix-elec",
    name: "Voltix Microelectronics",
    companyName: "Voltix Electronics Assembly LLP",
    location: "TTC Industrial Zone, Navi Mumbai",
    stateOrRegion: "Maharashtra",
    sector: "electronics",
    sectorLabel: "PCB Surface Mount Assembly",
    pollutionCategory: "white",
    powerKva: 30,
    workforce: 45,
    builtUpAreaSqFt: 8500,
    description: "Cleanroom electronic board assembly, zero effluent discharge, non-polluting dry assembly operations.",
    
    // Grounded CPCB and Location Metadata
    cpcbSectorId: "CPCB-004",
    cpcbSectorName: "Electronics & PCB Surface Mount Assembly (Cleanroom)",
    cpcbPollutionIndex: "Up to 20 (White)",
    clusterId: "CLUSTER-MH-05",
    district: "Thane",
    industrialEstate: "TTC Industrial Area, Navi Mumbai",
    authorities: {
      industrial: "Maharashtra Industrial Development Corporation (MIDC)",
      planning: "MIDC Special Planning Authority / NMMC",
      environmental: "MPCB Regional Office, Navi Mumbai",
      power: "MSEDCL - Vashi/Turbhe Circle",
      dic: "District Industries Centre (DIC), Thane"
    }
  }
];

// ==========================================
// 2. CURATED DEMO DOCUMENTS (With Multi-Dept Reuse)
// ==========================================
export const DEMO_DOCUMENTS: DocumentSpec[] = [
  {
    id: "DOC-1",
    code: "DOC-SITE-PLAN",
    title: "Approved Site Layout & Contour Plan",
    category: "site",
    description: "Master site boundary blueprint showing entry/exit gates, setbacks, and utility corridors certified by a Registered Architect.",
    isAvailableDefault: true,
    requiredByApprovalIds: ["node-2", "node-3", "node-5", "node-6"]
  },
  {
    id: "DOC-2",
    code: "DOC-TITLE-LEASE",
    title: "Land Title Deed / MIDC Industrial Lease Agreement",
    category: "legal",
    description: "Registered 95-year industrial lease deed along with possession receipt and survey demarcation certificate.",
    isAvailableDefault: true,
    requiredByApprovalIds: ["node-1", "node-3", "node-4"]
  },
  {
    id: "DOC-3",
    code: "DOC-DPR-MACH",
    title: "Detailed Project Report (DPR) & Machinery Schedule",
    category: "engineering",
    description: "List of capital plant equipment, installed HP rating, raw material flow diagram, and manufacturing process description.",
    isAvailableDefault: true,
    requiredByApprovalIds: ["node-2", "node-4", "node-6"]
  },
  {
    id: "DOC-4",
    code: "DOC-STRUCT-STAB",
    title: "Structural Stability Certificate (Chartered Engineer)",
    category: "engineering",
    description: "Civil structural soundness endorsement confirming floor load-bearing capacity for heavy CNC equipment.",
    isAvailableDefault: false, // Intentionally missing in initial state to demonstrate pre-flight blocker
    requiredByApprovalIds: ["node-3", "node-6"]
  },
  {
    id: "DOC-5",
    code: "DOC-FIRE-SCHEME",
    title: "Fire Hydrant, Riser & Emergency Evacuation Scheme",
    category: "safety",
    description: "National Building Code (NBC) Part 4 compliance schematic detailing water storage tank, pump capacity, and escape corridors.",
    isAvailableDefault: true,
    requiredByApprovalIds: ["node-5", "node-8"]
  },
  {
    id: "DOC-6",
    code: "DOC-EFFLUENT-SCHEME",
    title: "Water Balance & Effluent Treatment Plant (ETP) Scheme",
    category: "environmental",
    description: "Mass balance calculations for daily fresh water intake, metal wash recycling loop, and zero liquid discharge (ZLD) specs.",
    isAvailableDefault: true,
    requiredByApprovalIds: ["node-2", "node-7", "node-10"]
  },
  {
    id: "DOC-7",
    code: "DOC-DISCOM-LOAD",
    title: "Connected Electrical Load Distribution Diagram",
    category: "engineering",
    description: "Single-line electrical diagram (SLD) prepared by a Class-A Electrical Contractor showing transformer & breaker ratings.",
    isAvailableDefault: false,
    requiredByApprovalIds: ["node-4", "node-9"]
  },
  {
    id: "DOC-8",
    code: "DOC-BLDG-COMPL",
    title: "Factory Shed Building Completion Certificate",
    category: "site",
    description: "Architect's certificate confirming construction executed strictly in accordance with sanctioned building plans.",
    isAvailableDefault: false,
    requiredByApprovalIds: ["node-6", "node-9"]
  }
];

// ==========================================
// 3. MASTER APPROVAL REPOSITORY (Ground Truth & Provenance)
// ==========================================
export const MASTER_APPROVAL_POOL: ApprovalNode[] = [
  {
    id: "node-1",
    code: "PLOT-VERIF",
    title: "Industrial Plot Allotment Verification",
    department: "District Industries Centre / Industrial Dev Corp",
    stage: "pre_establishment",
    stageLabel: "Pre-Establishment",
    slaDays: 10,
    statutoryRuleRef: "MIDC Industrial Land Disposal Regulations, 1975 - Demo Model",
    isCriticalSpineVisual: true,
    prerequisiteIds: [],
    requiredDocumentIds: ["DOC-2"],
    inspectionChecklist: [
      "Site boundary pillar demarcation confirmed",
      "Road frontage width verification (min. 15m)",
      "Zone classification validation (Industrial General)"
    ],
    provenance: {
      verification_status: "curated_demo",
      source_organization: "MIDC & District Industries Centre",
      statutory_act: "MIDC Industrial Land Disposal Regulations, 1975",
      section_or_rule: "Regulation 4 (Possession Demarcation)",
      service_code: "MAITRI-MIDC-010",
      rtsa_statutory_timeline_days: 10,
      source_url: "https://maitri.maharashtra.gov.in/",
      last_verified: "2026-09",
      legal_disclaimer: "Curated procedural verification step for baseline industrial onboarding."
    },
    applicability: {},
    status: "completed",
    blockedByApprovalTitles: [],
    unblocksApprovalTitles: [],
    isOnRemainingCriticalPath: false
  },
  {
    id: "node-2",
    code: "SPCB-CTE",
    title: "Consent to Establish (CTE)",
    department: "State Pollution Control Board (SPCB)",
    stage: "pre_establishment",
    stageLabel: "Pre-Establishment",
    slaDays: 45,
    statutoryRuleRef: "Water Act 1974 (Sec 25) & Air Act 1981 (Sec 21)",
    isCriticalSpineVisual: true,
    prerequisiteIds: ["node-1"],
    requiredDocumentIds: ["DOC-1", "DOC-3", "DOC-6"],
    inspectionChecklist: [
      "Review distance from nearest natural water body",
      "Air emission stack height specification check",
      "Adequacy of effluent containment trenching"
    ],
    provenance: {
      verification_status: "verified_statutory",
      source_organization: "Maharashtra Pollution Control Board (MPCB)",
      statutory_act: "Water (Prevention & Control of Pollution) Act 1974 & Air Act 1981",
      section_or_rule: "Section 25 (Water Act) & Section 21 (Air Act)",
      service_code: "MAITRI-MPCB-001",
      rtsa_statutory_timeline_days: 45,
      source_url: "https://mpcb.gov.in/",
      last_verified: "2026-09",
      legal_disclaimer: "Mandatory statutory consent prior to civil construction or machinery installation."
    },
    applicability: {
      pollutionCategories: ["orange", "red", "green"]
    },
    status: "ready",
    blockedByApprovalTitles: [],
    unblocksApprovalTitles: [],
    isOnRemainingCriticalPath: true
  },
  {
    id: "node-3",
    code: "BLDG-SANCT",
    title: "Industrial Building Plan Sanction",
    department: "Town Planning Authority / Planning Desk",
    stage: "pre_establishment",
    stageLabel: "Pre-Establishment",
    slaDays: 25,
    statutoryRuleRef: "MRTP Act 1966 (Sec 44) & Standard UDCPR",
    isCriticalSpineVisual: true,
    prerequisiteIds: ["node-1"],
    requiredDocumentIds: ["DOC-1", "DOC-2", "DOC-4"],
    inspectionChecklist: [
      "Ground coverage ratio verification (<50% footprint)",
      "Mandatory front/rear open setback verification",
      "Parking bay calculation against factory workforce"
    ],
    provenance: {
      verification_status: "verified_statutory",
      source_organization: "MIDC Special Planning Authority (SPA) / Town Planning Desk",
      statutory_act: "Maharashtra Regional and Town Planning (MRTP) Act, 1966 & Standard UDCPR",
      section_or_rule: "Section 44 (Permission for Development)",
      service_code: "MAITRI-TP-002",
      rtsa_statutory_timeline_days: 25,
      source_url: "https://maitri.maharashtra.gov.in/",
      last_verified: "2026-09",
      legal_disclaimer: "Statutory building blueprint sanction prior to breaking ground."
    },
    applicability: {},
    status: "ready",
    blockedByApprovalTitles: [],
    unblocksApprovalTitles: [],
    isOnRemainingCriticalPath: true
  },
  {
    id: "node-4",
    code: "DISCOM-HT",
    title: "HT Power Load Sanction (150 kVA)",
    department: "State Power Distribution Corporation (DISCOM)",
    stage: "pre_establishment",
    stageLabel: "Pre-Establishment",
    slaDays: 20,
    statutoryRuleRef: "Electricity Act 2003 (Sec 43) & MERC Supply Code",
    isCriticalSpineVisual: false,
    prerequisiteIds: ["node-1"],
    requiredDocumentIds: ["DOC-2", "DOC-3", "DOC-7"],
    inspectionChecklist: [
      "Substation feeder capacity load-flow check",
      "HT metering room location & safety clearance",
      "Earthing pit layout inspection"
    ],
    provenance: {
      verification_status: "verified_statutory",
      source_organization: "Maharashtra State Electricity Distribution Co. Ltd. (MSEDCL)",
      statutory_act: "Electricity Act 2003 & MERC Electricity Supply Code",
      section_or_rule: "Section 43 (Duty to Supply on Request) & Supply Code Reg 4.2",
      service_code: "MAITRI-MSEDCL-005",
      rtsa_statutory_timeline_days: 20,
      source_url: "https://www.mahadiscom.in/",
      last_verified: "2026-09",
      legal_disclaimer: "Mandatory statutory sanction for High-Tension (11kV/22kV) electrical demand >= 50 kVA."
    },
    applicability: {
      minPowerKva: 50
    },
    status: "ready",
    blockedByApprovalTitles: [],
    unblocksApprovalTitles: [],
    isOnRemainingCriticalPath: false
  },
  {
    id: "node-5",
    code: "FIRE-PROV",
    title: "Provisional Fire NOC",
    department: "State Directorate of Fire Services",
    stage: "pre_establishment",
    stageLabel: "Pre-Establishment",
    slaDays: 15,
    statutoryRuleRef: "Maharashtra Fire Prevention Act 2006 (Sec 3)",
    isCriticalSpineVisual: false,
    prerequisiteIds: ["node-3"],
    requiredDocumentIds: ["DOC-1", "DOC-5"],
    inspectionChecklist: [
      "Fire tender turnaround turning radius (min. 6m)",
      "Underground static water storage tank sizing (100,000L)",
      "Emergency staircase separation & fire doors"
    ],
    provenance: {
      verification_status: "verified_statutory",
      source_organization: "Directorate of Maharashtra Fire Services / MIDC Fire",
      statutory_act: "Maharashtra Fire Prevention and Life Safety Measures Act, 2006",
      section_or_rule: "Section 3 & National Building Code (NBC) 2016 Part 4",
      service_code: "MAITRI-FIRE-001",
      rtsa_statutory_timeline_days: 15,
      source_url: "https://mahafireservice.gov.in/",
      last_verified: "2026-09",
      legal_disclaimer: "Provisional fire safety schematic approval prior to structural construction."
    },
    applicability: {},
    status: "blocked",
    blockedByApprovalTitles: [],
    unblocksApprovalTitles: [],
    isOnRemainingCriticalPath: false
  },
  {
    id: "node-6",
    code: "FACT-PLAN",
    title: "Factory Building Plan Approval",
    department: "Directorate of Industrial Safety & Health (DISH)",
    stage: "pre_operation",
    stageLabel: "Pre-Operation",
    slaDays: 30,
    statutoryRuleRef: "Factories Act 1948 (Sec 6) & State Factory Rules",
    isCriticalSpineVisual: true,
    prerequisiteIds: ["node-2", "node-3"],
    requiredDocumentIds: ["DOC-1", "DOC-3", "DOC-4", "DOC-8"],
    inspectionChecklist: [
      "Worker ventilation & cubic space per operator calculation",
      "Emergency exit gangway widths (min. 1.8m)",
      "Sanitary & drinking water facilities headcount ratio",
      "First aid and occupational health post space"
    ],
    provenance: {
      verification_status: "verified_statutory",
      source_organization: "Directorate of Industrial Safety and Health (DISH)",
      statutory_act: "Factories Act, 1948 & Maharashtra Factories Rules, 1963",
      section_or_rule: "Section 6 (Approval, licensing and registration) & Rule 3",
      service_code: "MAITRI-DISH-001",
      rtsa_statutory_timeline_days: 30,
      source_url: "https://dish.maharashtra.gov.in/",
      last_verified: "2026-09",
      legal_disclaimer: "Mandatory manufacturing plant layout approval for establishments with >= 10 workers."
    },
    applicability: {
      minWorkforce: 10
    },
    status: "blocked",
    blockedByApprovalTitles: [],
    unblocksApprovalTitles: [],
    isOnRemainingCriticalPath: true
  },
  {
    id: "node-7",
    code: "SPCB-CTO",
    title: "Consent to Operate (CTO)",
    department: "State Pollution Control Board (SPCB)",
    stage: "pre_operation",
    stageLabel: "Pre-Operation",
    slaDays: 30,
    statutoryRuleRef: "Water Act 1974 (Sec 26) & Air Act 1981 (Sec 21)",
    isCriticalSpineVisual: true,
    prerequisiteIds: ["node-2"],
    requiredDocumentIds: ["DOC-6"],
    inspectionChecklist: [
      "Physical verification of Effluent Treatment Plant (ETP)",
      "Online continuous effluent monitoring system (OCEMS) link",
      "Acoustic enclosure inspection on DG sets",
      "Hazardous waste storage shed concrete flooring"
    ],
    provenance: {
      verification_status: "verified_statutory",
      source_organization: "Maharashtra Pollution Control Board (MPCB)",
      statutory_act: "Water (Prevention & Control of Pollution) Act 1974 & Air Act 1981",
      section_or_rule: "Section 26 (Water Act) & Section 21 (Air Act)",
      service_code: "MAITRI-MPCB-002",
      rtsa_statutory_timeline_days: 30,
      source_url: "https://mpcb.gov.in/",
      last_verified: "2026-09",
      legal_disclaimer: "Statutory operating consent required prior to trial runs or commercial production."
    },
    applicability: {
      pollutionCategories: ["orange", "red", "green"]
    },
    status: "blocked",
    blockedByApprovalTitles: [],
    unblocksApprovalTitles: [],
    isOnRemainingCriticalPath: true
  },
  {
    id: "node-8",
    code: "FIRE-FINAL",
    title: "Final Fire Safety Certificate",
    department: "State Directorate of Fire Services",
    stage: "pre_operation",
    stageLabel: "Pre-Operation",
    slaDays: 15,
    statutoryRuleRef: "Maharashtra Fire Prevention Act 2006 (Sec 3(1))",
    isCriticalSpineVisual: false,
    prerequisiteIds: ["node-5"],
    requiredDocumentIds: ["DOC-5"],
    inspectionChecklist: [
      "Live wet riser pressure gauge testing (min. 3.5 bar)",
      "Smoke detector alarm panel trigger test",
      "Fire extinguisher valid hydrostatic test dates",
      "Illuminated exit signage emergency backup battery check"
    ],
    provenance: {
      verification_status: "verified_statutory",
      source_organization: "Directorate of Maharashtra Fire Services",
      statutory_act: "Maharashtra Fire Prevention and Life Safety Measures Act, 2006",
      section_or_rule: "Section 3(1) & Form 'A' / Form 'B' Verification",
      service_code: "MAITRI-FIRE-002",
      rtsa_statutory_timeline_days: 15,
      source_url: "https://mahafireservice.gov.in/",
      last_verified: "2026-09",
      legal_disclaimer: "Final on-site verification of live hydrant pressure and emergency exits before occupancy."
    },
    applicability: {},
    status: "blocked",
    blockedByApprovalTitles: [],
    unblocksApprovalTitles: [],
    isOnRemainingCriticalPath: false
  },
  {
    id: "node-9",
    code: "FACT-LIC",
    title: "Factory Registration & Operating License",
    department: "Directorate of Industrial Safety & Health (DISH)",
    stage: "pre_operation",
    stageLabel: "Pre-Operation",
    slaDays: 20,
    statutoryRuleRef: "Factories Act 1948 (Sec 6(1) & Form 4)",
    isCriticalSpineVisual: true,
    prerequisiteIds: ["node-6", "node-7"],
    requiredDocumentIds: ["DOC-7", "DOC-8"],
    inspectionChecklist: [
      "Notice of occupation verification (Form 2)",
      "Machinery safety guard installation inspection",
      "Appointment of qualified safety officer (workforce threshold)",
      "Statutory registers & worker insurance verification"
    ],
    provenance: {
      verification_status: "verified_statutory",
      source_organization: "Directorate of Industrial Safety and Health (DISH)",
      statutory_act: "Factories Act, 1948",
      section_or_rule: "Section 6(1) & Form 4 (Grant of Factory License)",
      service_code: "MAITRI-DISH-002",
      rtsa_statutory_timeline_days: 20,
      source_url: "https://dish.maharashtra.gov.in/",
      last_verified: "2026-09",
      legal_disclaimer: "Mandatory operating permit before commencing commercial factory shifts."
    },
    applicability: {
      minWorkforce: 10
    },
    status: "blocked",
    blockedByApprovalTitles: [],
    unblocksApprovalTitles: [],
    isOnRemainingCriticalPath: true
  },
  {
    id: "node-10",
    code: "HAZ-AUTH",
    title: "Hazardous Waste Authorization (HWM)",
    department: "State Pollution Control Board (SPCB)",
    stage: "operational",
    stageLabel: "Operational Compliance",
    slaDays: 15,
    statutoryRuleRef: "Hazardous Wastes Rules 2016 (Rule 6)",
    isCriticalSpineVisual: false,
    prerequisiteIds: ["node-7"],
    requiredDocumentIds: ["DOC-6"],
    inspectionChecklist: [
      "Designated hazardous waste storage bay inspection (impervious floor)",
      "Disposal agreement with Common HW Management Facility (CHWTSDF)",
      "Manifest system record keeping compliance"
    ],
    provenance: {
      verification_status: "verified_statutory",
      source_organization: "Maharashtra Pollution Control Board (MPCB)",
      statutory_act: "Hazardous and Other Wastes (Management and Transboundary Movement) Rules, 2016",
      section_or_rule: "Rule 6 (Grant of authorization for handling hazardous wastes)",
      service_code: "MAITRI-MPCB-004",
      rtsa_statutory_timeline_days: 15,
      source_url: "https://mpcb.gov.in/",
      last_verified: "2026-09",
      legal_disclaimer: "Statutory authorization for generation, storage, and disposal of industrial hazardous waste."
    },
    applicability: {
      pollutionCategories: ["orange", "red"]
    },
    status: "blocked",
    blockedByApprovalTitles: [],
    unblocksApprovalTitles: [],
    isOnRemainingCriticalPath: false
  }
];

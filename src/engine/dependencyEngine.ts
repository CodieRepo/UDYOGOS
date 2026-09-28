import { ApprovalNode, DocumentSpec, EngineState, NextActionItem, PlantProfile } from "../types/compliance";

/**
 * Filter approvals applicable to the provided plant profile based on statutory triggers.
 */
export function filterApplicableApprovals(
  profile: PlantProfile,
  pool: ApprovalNode[]
): ApprovalNode[] {
  return pool.filter(node => {
    const { applicability } = node;
    if (!applicability) return true;

    // Workforce threshold (e.g. Factories Act requires >= 10 workers)
    if (applicability.minWorkforce !== undefined && profile.workforce < applicability.minWorkforce) {
      return false;
    }

    // Power threshold (e.g. High Tension electricity clearance)
    if (applicability.minPowerKva !== undefined && profile.powerKva < applicability.minPowerKva) {
      return false;
    }

    // Pollution categorization (White / Green / Orange / Red)
    if (
      applicability.pollutionCategories &&
      applicability.pollutionCategories.length > 0 &&
      !applicability.pollutionCategories.includes(profile.pollutionCategory)
    ) {
      return false;
    }

    // Sector restriction
    if (
      applicability.sectors &&
      applicability.sectors.length > 0 &&
      !applicability.sectors.includes(profile.sector)
    ) {
      return false;
    }

    return true;
  });
}

/**
 * Topologically resolve node states (completed, in_progress, ready, blocked)
 * based strictly on completed prerequisite IDs.
 */
export function resolveGraphStates(
  applicableNodes: ApprovalNode[],
  completedIds: Set<string>,
  inProgressIds: Set<string>
): ApprovalNode[] {
  const nodeMap = new Map<string, ApprovalNode>(applicableNodes.map(n => [n.id, n]));

  // Step 1: Assign preliminary status and populate blockedBy
  const resolvedNodes = applicableNodes.map(node => {
    let status: "completed" | "in_progress" | "ready" | "blocked" = "blocked";
    const blockedByTitles: string[] = [];

    if (completedIds.has(node.id)) {
      status = "completed";
    } else if (inProgressIds.has(node.id)) {
      status = "in_progress";
    } else {
      // Check if all prerequisites belonging to the applicable graph are completed
      let allPrereqsMet = true;
      for (const pId of node.prerequisiteIds) {
        if (!completedIds.has(pId)) {
          allPrereqsMet = false;
          const prereqNode = nodeMap.get(pId);
          if (prereqNode) {
            blockedByTitles.push(prereqNode.title);
          }
        }
      }
      status = allPrereqsMet ? "ready" : "blocked";
    }

    return {
      ...node,
      status,
      blockedByApprovalTitles: blockedByTitles,
      unblocksApprovalTitles: [],
      isOnRemainingCriticalPath: false
    };
  });

  // Step 2: Populate unblocksApprovalTitles (which applicable downstream nodes depend on this node)
  const resolvedMap = new Map<string, ApprovalNode>(resolvedNodes.map(n => [n.id, n]));
  for (const node of resolvedNodes) {
    for (const pId of node.prerequisiteIds) {
      const parent = resolvedMap.get(pId);
      if (parent) {
        if (!parent.unblocksApprovalTitles.includes(node.title)) {
          parent.unblocksApprovalTitles.push(node.title);
        }
      }
    }
  }

  return resolvedNodes;
}

/**
 * Calculate the original planned critical path (from ground zero)
 * using topological dynamic programming on all applicable nodes.
 */
export function calculateOriginalCriticalPath(nodes: ApprovalNode[]): number {
  const nodeMap = new Map(nodes.map(n => [n.id, n]));
  const earliestFinish = new Map<string, number>();

  function getEF(nodeId: string, visited = new Set<string>()): number {
    if (earliestFinish.has(nodeId)) return earliestFinish.get(nodeId)!;
    if (visited.has(nodeId)) return 0; // Prevent cycle if any

    visited.add(nodeId);
    const node = nodeMap.get(nodeId);
    if (!node) return 0;

    let maxPrereqEF = 0;
    for (const pId of node.prerequisiteIds) {
      if (nodeMap.has(pId)) {
        const pEF = getEF(pId, new Set(visited));
        if (pEF > maxPrereqEF) maxPrereqEF = pEF;
      }
    }

    const ef = node.slaDays + maxPrereqEF;
    earliestFinish.set(nodeId, ef);
    return ef;
  }

  let maxTotal = 0;
  for (const node of nodes) {
    const ef = getEF(node.id);
    if (ef > maxTotal) maxTotal = ef;
  }

  return maxTotal;
}

/**
 * State-aware calculation of Remaining Critical Path and identification
 * of nodes actively lying on the critical path to completion.
 */
export function calculateRemainingCriticalPath(
  nodes: ApprovalNode[],
  completedIds: Set<string>
): {
  remainingCriticalPathDays: number;
  remainingSerializedDays: number;
  remainingCriticalNodeIds: Set<string>;
} {
  const incompleteNodes = nodes.filter(n => !completedIds.has(n.id));
  const nodeMap = new Map(nodes.map(n => [n.id, n]));

  // Sum of SLAs of all remaining incomplete work
  const remainingSerializedDays = incompleteNodes.reduce((sum, n) => sum + n.slaDays, 0);

  if (incompleteNodes.length === 0) {
    return {
      remainingCriticalPathDays: 0,
      remainingSerializedDays: 0,
      remainingCriticalNodeIds: new Set<string>()
    };
  }

  // Dynamic Programming on remaining DAG:
  // For each incomplete node u, calculate Earliest Finish Time given currently completed nodes:
  // If prerequisite is already completed, its remaining contribution is 0.
  // If prerequisite is incomplete, it contributes its own remaining Earliest Finish.
  const remainingEF = new Map<string, number>();
  const criticalPredecessor = new Map<string, string | null>();

  function getRemainingEF(nodeId: string, visited = new Set<string>()): number {
    if (completedIds.has(nodeId)) return 0;
    if (remainingEF.has(nodeId)) return remainingEF.get(nodeId)!;
    if (visited.has(nodeId)) return 0;

    visited.add(nodeId);
    const node = nodeMap.get(nodeId);
    if (!node) return 0;

    let maxPrereqEF = 0;
    let bestPrereqId: string | null = null;

    for (const pId of node.prerequisiteIds) {
      if (nodeMap.has(pId) && !completedIds.has(pId)) {
        const pEF = getRemainingEF(pId, new Set(visited));
        if (pEF > maxPrereqEF) {
          maxPrereqEF = pEF;
          bestPrereqId = pId;
        }
      }
    }

    const ef = node.slaDays + maxPrereqEF;
    remainingEF.set(nodeId, ef);
    criticalPredecessor.set(nodeId, bestPrereqId);
    return ef;
  }

  // Find the terminal node with maximum remaining duration
  let maxRemainingDays = 0;
  let terminalCriticalNodeId: string | null = null;

  for (const node of incompleteNodes) {
    const ef = getRemainingEF(node.id);
    if (ef > maxRemainingDays) {
      maxRemainingDays = ef;
      terminalCriticalNodeId = node.id;
    }
  }

  // Trace back the remaining critical path nodes
  const remainingCriticalNodeIds = new Set<string>();
  let curr = terminalCriticalNodeId;
  while (curr) {
    remainingCriticalNodeIds.add(curr);
    curr = criticalPredecessor.get(curr) || null;
  }

  return {
    remainingCriticalPathDays: maxRemainingDays,
    remainingSerializedDays,
    remainingCriticalNodeIds
  };
}

/**
 * Dynamically derive the "Next Best Actions" based on current graph state
 * and critical-path membership.
 */
export function deriveNextBestActions(
  nodes: ApprovalNode[],
  documents: DocumentSpec[],
  remainingCriticalNodeIds: Set<string>
): NextActionItem[] {
  const readyNodes = nodes.filter(n => n.status === "ready");
  const docMap = new Map(documents.map(d => [d.id, d]));

  const actions: NextActionItem[] = readyNodes.map(node => {
    const isCritical = remainingCriticalNodeIds.has(node.id);
    const unblocks = node.unblocksApprovalTitles;

    // Detect missing documents for this node
    const missingDocs: string[] = [];
    for (const docId of node.requiredDocumentIds) {
      const doc = docMap.get(docId);
      if (doc && !doc.isAvailableDefault) {
        missingDocs.push(doc.title);
      }
    }

    let rationale = "";
    if (isCritical) {
      rationale = `Lies on the active Remaining Critical Path (${node.slaDays}d SLA). Resolving this immediately advances downstream milestones: ${
        unblocks.length > 0 ? unblocks.join(", ") : "project completion"
      }.`;
    } else {
      rationale = `Concurrent Fast-Track opportunity (${node.slaDays}d SLA). Can execute today in parallel without waiting for primary civil/environmental clearances.`;
    }

    return {
      approvalId: node.id,
      code: node.code,
      title: node.title,
      department: node.department,
      stage: node.stage,
      priority: isCritical ? "critical_path" : "parallel_fast_track",
      priorityLabel: isCritical ? "CRITICAL PATH BOTTLENECK" : "CONCURRENT FAST-TRACK",
      slaDays: node.slaDays,
      rationale,
      unblocksTitles: unblocks,
      missingDocumentTitles: missingDocs,
      provenance: node.provenance
    };
  });

  // Sort: Critical path priority first, then by number of unblocked nodes descending
  return actions.sort((a, b) => {
    if (a.priority === "critical_path" && b.priority !== "critical_path") return -1;
    if (a.priority !== "critical_path" && b.priority === "critical_path") return 1;
    return b.unblocksTitles.length - a.unblocksTitles.length;
  });
}

/**
 * Full master execution function: runs the complete statutory compliance pipeline
 * and returns the unified immutable EngineState.
 */
export function runComplianceEngine(
  profile: PlantProfile,
  masterApprovalPool: ApprovalNode[],
  masterDocumentPool: DocumentSpec[],
  completedIds: Set<string>,
  inProgressIds: Set<string>
): EngineState {
  // 1. Filter applicable approvals
  const applicableRaw = filterApplicableApprovals(profile, masterApprovalPool);

  // 2. Resolve topological statuses (completed, in_progress, ready, blocked)
  const resolvedNodes = resolveGraphStates(applicableRaw, completedIds, inProgressIds);

  // 3. Original planned critical path (baseline from project inception)
  const originalPlannedCriticalPathDays = calculateOriginalCriticalPath(resolvedNodes);

  // 4. State-aware remaining critical path & critical node derivation
  const {
    remainingCriticalPathDays,
    remainingSerializedDays,
    remainingCriticalNodeIds
  } = calculateRemainingCriticalPath(resolvedNodes, completedIds);

  // 5. Annotate nodes with their runtime critical-path membership
  const annotatedNodes = resolvedNodes.map(node => ({
    ...node,
    isOnRemainingCriticalPath: remainingCriticalNodeIds.has(node.id)
  }));

  // 6. Counts & Readiness
  const completedCount = annotatedNodes.filter(n => n.status === "completed").length;
  const readyCount = annotatedNodes.filter(n => n.status === "ready").length;
  const inProgressCount = annotatedNodes.filter(n => n.status === "in_progress").length;
  const blockedCount = annotatedNodes.filter(n => n.status === "blocked").length;
  const totalApplicable = annotatedNodes.length;
  const readinessPercentage = totalApplicable > 0 ? Math.round((completedCount / totalApplicable) * 100) : 0;

  // 7. Simulated Concurrency Savings for remaining work
  const simulatedParallelSavings = Math.max(0, remainingSerializedDays - remainingCriticalPathDays);

  // 8. Derive dynamic Next Best Actions
  const nextBestActions = deriveNextBestActions(annotatedNodes, masterDocumentPool, remainingCriticalNodeIds);

  // 9. Identify single most urgent critical bottleneck node
  const criticalBottleneckNode =
    annotatedNodes.find(n => n.status === "ready" && remainingCriticalNodeIds.has(n.id)) ||
    annotatedNodes.find(n => n.status === "ready") ||
    null;

  return {
    profile,
    approvals: annotatedNodes,
    documents: masterDocumentPool,
    totalApplicable,
    completedCount,
    readyCount,
    inProgressCount,
    blockedCount,
    originalPlannedCriticalPathDays,
    remainingCriticalPathDays,
    remainingSerializedDays,
    simulatedParallelSavings,
    readinessPercentage,
    criticalBottleneckNode,
    nextBestActions,
    remainingCriticalPathNodeIds: Array.from(remainingCriticalNodeIds)
  };
}

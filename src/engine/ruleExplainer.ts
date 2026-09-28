import { ApprovalNode, PlantProfile, PollutionCategory, Sector } from "../types/compliance";

export interface RuleCriterion {
  label: string;
  actual: string;
  requirement: string;
  passed: boolean;
  explanation: string;
}

export interface RuleExplanation {
  isApplicable: boolean;
  summary: string;
  statutoryBasis: string;
  criteria: RuleCriterion[];
}

export interface DependencyExplanation {
  isBlocked: boolean;
  unmetPrerequisites: Array<{
    id: string;
    code: string;
    title: string;
    slaDays: number;
    status: string;
  }>;
  unlocksUponCompletion: Array<{
    id: string;
    code: string;
    title: string;
  }>;
  directMessage: string;
}

/**
 * Returns a detailed, deterministic explanation of why an approval applies
 * to a specific plant profile under statutory rules.
 */
export function explainRuleApplicability(
  profile: PlantProfile,
  node: ApprovalNode
): RuleExplanation {
  const criteria: RuleCriterion[] = [];
  const { applicability } = node;

  // 1. Pollution Category Check
  if (applicability.pollutionCategories && applicability.pollutionCategories.length > 0) {
    const passed = applicability.pollutionCategories.includes(profile.pollutionCategory);
    criteria.push({
      label: "Pollution Categorization",
      actual: profile.pollutionCategory.toUpperCase(),
      requirement: applicability.pollutionCategories.map((c) => c.toUpperCase()).join(", "),
      passed,
      explanation: passed
        ? `Industry is classified as ${profile.pollutionCategory.toUpperCase()}, which falls under the regulatory purview (${applicability.pollutionCategories.map((c) => c.toUpperCase()).join("/")}).`
        : `Industry is classified as ${profile.pollutionCategory.toUpperCase()}, which is exempt from this clearance (${applicability.pollutionCategories.map((c) => c.toUpperCase()).join("/")} required).`
    });
  }

  // 2. Power Threshold Check
  if (applicability.minPowerKva !== undefined) {
    const passed = profile.powerKva >= applicability.minPowerKva;
    criteria.push({
      label: "Connected Power Sanction",
      actual: `${profile.powerKva} kVA`,
      requirement: `≥ ${applicability.minPowerKva} kVA`,
      passed,
      explanation: passed
        ? `Sanctioned power load of ${profile.powerKva} kVA meets/exceeds the ${applicability.minPowerKva} kVA High-Tension (HT) regulatory threshold.`
        : `Connected power of ${profile.powerKva} kVA is below the ${applicability.minPowerKva} kVA threshold (standard Low-Tension commercial meter applies instead).`
    });
  }

  // 3. Workforce Threshold Check
  if (applicability.minWorkforce !== undefined) {
    const passed = profile.workforce >= applicability.minWorkforce;
    criteria.push({
      label: "Workforce / Headcount",
      actual: `${profile.workforce} workers`,
      requirement: `≥ ${applicability.minWorkforce} workers`,
      passed,
      explanation: passed
        ? `Workforce of ${profile.workforce} workers satisfies the statutory threshold (≥ ${applicability.minWorkforce}) triggering the Factories Act.`
        : `Workforce of ${profile.workforce} workers is below the statutory threshold of ${applicability.minWorkforce} workers.`
    });
  }

  // 4. Sector Check
  if (applicability.sectors && applicability.sectors.length > 0) {
    const passed = applicability.sectors.includes(profile.sector);
    criteria.push({
      label: "Industrial Sector Classification",
      actual: profile.sectorLabel || profile.sector,
      requirement: applicability.sectors.join(", "),
      passed,
      explanation: passed
        ? `Plant sector matches the designated statutory applicability criteria.`
        : `Plant sector does not trigger this industry-specific compliance.`
    });
  }

  // If no specific constraints exist, it is a universal baseline requirement
  if (criteria.length === 0) {
    criteria.push({
      label: "Statutory Baseline",
      actual: "All Industrial Units",
      requirement: "Mandatory Universal Clearances",
      passed: true,
      explanation: "Universal statutory clearance applicable to all manufacturing and industrial establishments regardless of size or category."
    });
  }

  const isApplicable = criteria.every((c) => c.passed);
  const summary = isApplicable
    ? `Applies to this plant based on ${criteria.map((c) => c.label.toLowerCase()).join(", ")}.`
    : `Exempt or non-applicable under current operational parameters.`;

  return {
    isApplicable,
    summary,
    statutoryBasis: node.statutoryRuleRef,
    criteria
  };
}

/**
 * Returns a clear explanation of why an approval cannot currently start,
 * which approvals are blocking it, and what it will unlock once finished.
 */
export function explainDependencyBlockers(
  node: ApprovalNode,
  allApprovals: ApprovalNode[]
): DependencyExplanation {
  const approvalMap = new Map(allApprovals.map((a) => [a.id, a]));
  const isBlocked = node.status === "blocked";

  const unmetPrerequisites: DependencyExplanation["unmetPrerequisites"] = [];
  for (const pId of node.prerequisiteIds) {
    const pNode = approvalMap.get(pId);
    if (pNode && pNode.status !== "completed") {
      unmetPrerequisites.push({
        id: pNode.id,
        code: pNode.code,
        title: pNode.title,
        slaDays: pNode.slaDays,
        status: pNode.status
      });
    }
  }

  const unlocksUponCompletion: DependencyExplanation["unlocksUponCompletion"] = [];
  for (const a of allApprovals) {
    if (a.prerequisiteIds.includes(node.id)) {
      unlocksUponCompletion.push({
        id: a.id,
        code: a.code,
        title: a.title
      });
    }
  }

  let directMessage = "";
  if (!isBlocked) {
    directMessage = "All statutory prerequisites are cleared. This approval is ready to be initiated immediately.";
  } else if (unmetPrerequisites.length === 1) {
    directMessage = `Locked: Cannot start until ${unmetPrerequisites[0].title} (${unmetPrerequisites[0].code}) is officially sanctioned.`;
  } else {
    directMessage = `Locked: Cannot start until ${unmetPrerequisites.length} prior approvals (${unmetPrerequisites.map((p) => p.code).join(", ")}) are officially sanctioned.`;
  }

  return {
    isBlocked,
    unmetPrerequisites,
    unlocksUponCompletion,
    directMessage
  };
}

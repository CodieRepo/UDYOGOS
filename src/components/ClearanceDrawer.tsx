"use client";

import React from "react";
import { useCompliance } from "../context/ComplianceContext";
import { DEMO_DOCUMENTS } from "../data/demonstrationDataset";
import { explainRuleApplicability } from "../engine/ruleExplainer";
import {
  AlertCircle,
  Building,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileCheck2,
  FileWarning,
  GitBranch,
  HelpCircle,
  Lock,
  Route,
  Scale,
  ShieldCheck,
  Sparkles,
  X,
  Zap
} from "lucide-react";

export const ClearanceDrawer: React.FC = () => {
  const { profile, selectedApproval, selectApproval, simulateClearance, engineState, availableDocumentIds } = useCompliance();

  if (!selectedApproval) return null;

  const node = selectedApproval;
  const isCompleted = node.status === "completed";
  const isReady = node.status === "ready";
  const isBlocked = node.status === "blocked";

  const missingDocIds = node.requiredDocumentIds.filter((id) => !availableDocumentIds.has(id));
  const hasDocumentIssue = isReady && missingDocIds.length > 0;

  const docMap = new Map(DEMO_DOCUMENTS.map((d) => [d.id, d]));
  const nodeMap = new Map(engineState.approvals.map((a) => [a.id, a]));

  // Rule applicability breakdown
  const ruleExplanation = explainRuleApplicability(profile, node);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-2xs flex justify-end">
      <div className="w-full max-w-lg bg-white h-full shadow-2xl border-l border-slate-200 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-50 sticky top-0 z-10">
          <div className="flex items-center justify-between gap-3 mb-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-white text-slate-800 border border-slate-300">
              {node.code}
            </span>
            <div className="flex items-center gap-2">
              {node.isOnRemainingCriticalPath && !isCompleted && (
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500 text-white flex items-center gap-1 shadow-2xs">
                  <Sparkles className="w-3 h-3 text-white" />
                  MAIN BLOCKER
                </span>
              )}
              <button
                onClick={() => selectApproval(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <h3 className="text-base font-bold text-slate-900 leading-snug">
            {node.title}
          </h3>
          <p className="text-xs text-slate-600 mt-1 flex items-center gap-1 font-medium">
            <Building className="w-3.5 h-3.5 text-slate-400" />
            {node.department}
          </p>
        </div>

        {/* Drawer Body */}
        <div className="p-5 space-y-6 flex-1 text-xs">
          {/* Statutory & Legal Provenance Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-slate-600" />
                Statutory Authority & Grounding
              </span>
              {node.provenance?.verification_status === "verified_statutory" ? (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-700" />
                  Verified Statutory Source
                </span>
              ) : (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                  Demonstration Rule
                </span>
              )}
            </div>

            {node.provenance ? (
              <div className="space-y-1.5 pt-1 border-t border-slate-200">
                <div className="flex items-baseline justify-between text-xs">
                  <span className="text-slate-500 text-[11px]">Governing Act:</span>
                  <span className="font-bold text-slate-900 text-right">{node.provenance.statutory_act}</span>
                </div>
                {node.provenance.section_or_rule && (
                  <div className="flex items-baseline justify-between text-xs">
                    <span className="text-slate-500 text-[11px]">Enabling Section / Rule:</span>
                    <span className="font-mono font-semibold text-blue-900 text-right">{node.provenance.section_or_rule}</span>
                  </div>
                )}
                {node.provenance.service_code && (
                  <div className="flex items-baseline justify-between text-xs">
                    <span className="text-slate-500 text-[11px]">Single Window Service Code:</span>
                    <span className="font-mono text-slate-800 text-right font-medium">{node.provenance.service_code}</span>
                  </div>
                )}
                {node.provenance.rtsa_statutory_timeline_days && (
                  <div className="flex items-baseline justify-between text-xs">
                    <span className="text-slate-500 text-[11px]">Right to Services Act (RTSA) SLA:</span>
                    <span className="font-mono font-semibold text-emerald-800 text-right">{node.provenance.rtsa_statutory_timeline_days} Days</span>
                  </div>
                )}
                {node.provenance.source_url && (
                  <div className="pt-1.5 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Official Portal:</span>
                    <a
                      href={node.provenance.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-semibold underline"
                    >
                      <span>{node.provenance.source_organization || "Public Portal"}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
                {node.provenance.legal_disclaimer && (
                  <p className="text-[10px] text-slate-500 italic pt-1">
                    Note: {node.provenance.legal_disclaimer}
                  </p>
                )}
              </div>
            ) : (
              <p className="font-mono text-slate-900 font-semibold text-xs pt-1">{node.statutoryRuleRef}</p>
            )}
          </div>

          {/* Key Metrics Strip */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center">
              <span className="text-[10px] text-slate-500 uppercase block font-semibold">Department SLA</span>
              <span className="text-sm font-bold text-slate-900 flex items-center justify-center gap-1 mt-0.5 font-mono">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                {node.slaDays} Calendar Days
              </span>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center">
              <span className="text-[10px] text-slate-500 uppercase block font-semibold">Roadmap Track</span>
              <span className="text-xs font-bold text-slate-900 mt-1 block">
                {node.isCriticalSpineVisual ? "Main Sequence Spine" : "Concurrent Parallel Track"}
              </span>
            </div>
          </div>

          {/* Rule Explainer: Why Does This Apply to Your Plant? */}
          <div className="bg-blue-50/60 border border-blue-200 rounded-lg p-3.5 space-y-2.5">
            <div className="flex items-center gap-1.5 text-blue-950 font-bold text-xs">
              <HelpCircle className="w-4 h-4 text-blue-600" />
              <span>Why Does This Apply to Your Plant?</span>
            </div>
            <p className="text-[11px] text-slate-600">
              {ruleExplanation.summary} Evaluated deterministically against active plant profile parameters:
            </p>
            <div className="space-y-2 pt-1">
              {ruleExplanation.criteria.map((c, i) => (
                <div
                  key={i}
                  className="bg-white p-2.5 rounded-md border border-blue-100 flex items-start gap-2 shadow-2xs"
                >
                  <div className="mt-0.5">
                    {c.passed ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    )}
                  </div>
                  <div className="flex-1 text-[11px]">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-slate-900">{c.label}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-700">
                        {c.requirement}
                      </span>
                    </div>
                    <div className="text-slate-600 mt-0.5">{c.explanation}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Current Status Box */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block">
              Current Status
            </span>
            {isCompleted && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-950 p-3 rounded-lg flex items-center gap-2 font-semibold">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Sanction Issued & Verified. Downstream requirements unlocked.</span>
              </div>
            )}
            {isReady && (
              <div className="space-y-2">
                <div className="bg-blue-50 border border-blue-200 text-blue-950 p-3 rounded-lg flex items-center gap-2 font-semibold">
                  <Zap className="w-5 h-5 text-blue-600 shrink-0" />
                  <span>Ready to Start: All prior statutory approval prerequisites are satisfied.</span>
                </div>
                {hasDocumentIssue ? (
                  <div className="bg-amber-50 border border-amber-300 text-amber-950 p-2.5 rounded-lg text-[11px]">
                    <div className="font-bold flex items-center gap-1 text-amber-900 mb-0.5">
                      <FileWarning className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      Document Required Before Final Submission:
                    </div>
                    <span>
                      You can initiate this application, but final department sanction requires the missing document(s) listed below.
                    </span>
                  </div>
                ) : (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-2 rounded-lg text-[11px] flex items-center gap-1.5 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>All required documents are attached and ready for submission.</span>
                  </div>
                )}
              </div>
            )}
            {isBlocked && (
              <div className="bg-amber-50 border border-amber-200 text-amber-950 p-3 rounded-lg flex items-start gap-2">
                <Lock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Why can&apos;t I start this?</span>
                  <span className="text-amber-900 text-[11px] font-bold block mt-0.5">
                    Waiting for: {node.blockedByApprovalTitles.join(", ")}
                  </span>
                  <span className="text-[10px] text-slate-600 block mt-1">
                    The department will not accept or process your application until the prior statutory approvals above are officially sanctioned.
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Prerequisite Breakdown */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block">
              Prerequisite Approvals ({node.prerequisiteIds.length})
            </span>
            {node.prerequisiteIds.length > 0 ? (
              <div className="space-y-1.5">
                {node.prerequisiteIds.map((pId) => {
                  const pNode = nodeMap.get(pId);
                  const isPrereqCleared = pNode?.status === "completed";

                  return (
                    <div
                      key={pId}
                      className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 bg-white"
                    >
                      <div className="flex items-center gap-2">
                        {isPrereqCleared ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Lock className="w-4 h-4 text-slate-400" />
                        )}
                        <div>
                          <div className="font-semibold text-slate-900">
                            {pNode?.title || pId}
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            {pNode?.code}
                          </div>
                        </div>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          isPrereqCleared
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {isPrereqCleared ? "COMPLETED" : "WAITING"}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-3 bg-slate-50 rounded-lg text-slate-500 text-xs">
                No prior approvals required (Can be initiated on Day 1).
              </div>
            )}
          </div>

          {/* Downstream Unlocks */}
          {node.unblocksApprovalTitles.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block">
                What Will This Unlock When Completed?
              </span>
              <div className="bg-emerald-50/80 border border-emerald-200 rounded-lg p-3">
                <div className="text-emerald-950 font-bold mb-1 flex items-center gap-1.5 text-xs">
                  <Route className="w-3.5 h-3.5 text-emerald-700" />
                  Completing this approval directly satisfies requirements for:
                </div>
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {node.unblocksApprovalTitles.map((t) => (
                    <span
                      key={t}
                      className="text-[10px] bg-white border border-emerald-300 text-emerald-900 font-bold px-2.5 py-0.5 rounded shadow-2xs"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Required Documents */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block">
              Required Documents ({node.requiredDocumentIds.length})
            </span>
            <div className="space-y-1.5">
              {node.requiredDocumentIds.map((docId) => {
                const doc = docMap.get(docId);
                const isAvail = availableDocumentIds.has(docId);

                return (
                  <div
                    key={docId}
                    className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 bg-white"
                  >
                    <div className="flex items-center gap-2">
                      {isAvail ? (
                        <FileCheck2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <FileWarning className="w-4 h-4 text-red-500" />
                      )}
                      <div>
                        <div className="font-semibold text-slate-900">
                          {doc?.title || docId}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          {doc?.code}
                        </div>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        isAvail
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-red-50 text-red-700 border border-red-200"
                      }`}
                    >
                      {isAvail ? "READY" : "MISSING"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Drawer Footer Actions */}
        <div className="p-5 border-t border-slate-200 bg-slate-50 sticky bottom-0 z-10 flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <button
              onClick={() => selectApproval(null)}
              className="flex-1 text-xs font-semibold py-2.5 px-4 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Close
            </button>

            {isReady && (
              <button
                onClick={() => simulateClearance(node.id)}
                className="flex-1 text-xs font-bold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-xs cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>Mark as Completed</span>
              </button>
            )}

            {isCompleted && (
              <button
                onClick={() => simulateClearance(node.id)}
                className="flex-1 text-xs font-bold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white shadow-xs cursor-pointer"
              >
                <span>Revert to Incomplete</span>
              </button>
            )}

            {isBlocked && (
              <div className="flex-1 py-2.5 px-3 rounded-lg border border-slate-300 bg-slate-100 text-slate-500 text-xs font-bold text-center flex items-center justify-center gap-1.5 cursor-not-allowed">
                <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="line-clamp-1">Locked: Prerequisites Pending</span>
              </div>
            )}
          </div>
          <p className="text-[10px] text-center text-slate-500 font-medium">
            {isBlocked
              ? "Cannot be completed yet — prior required statutory approvals must be cleared first."
              : "Prototype action — completing this milestone triggers a live dependency recalculation."}
          </p>
        </div>
      </div>
    </div>
  );
};

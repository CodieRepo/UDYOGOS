"use client";

import React, { useState } from "react";
import { ApprovalNode } from "../types/compliance";
import { useCompliance } from "../context/ComplianceContext";
import { DEMO_DOCUMENTS } from "../data/demonstrationDataset";
import { explainRuleApplicability } from "../engine/ruleExplainer";
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  FileWarning,
  HelpCircle,
  Lock,
  ShieldCheck,
  Sparkles,
  Zap
} from "lucide-react";

interface ApprovalCardProps {
  node: ApprovalNode;
  onSelect: (nodeId: string) => void;
  onSimulate: (nodeId: string) => void;
}

export const ApprovalCard: React.FC<ApprovalCardProps> = ({ node, onSelect, onSimulate }) => {
  const { profile, availableDocumentIds } = useCompliance();
  const [showRuleWhy, setShowRuleWhy] = useState<boolean>(false);

  const isCompleted = node.status === "completed";
  const isReady = node.status === "ready";
  const isBlocked = node.status === "blocked";

  // Check if any required document for this approval is missing
  const missingDocIds = node.requiredDocumentIds.filter((id) => !availableDocumentIds.has(id));
  const hasDocumentIssue = isReady && missingDocIds.length > 0;

  const docMap = new Map(DEMO_DOCUMENTS.map((d) => [d.id, d]));
  const missingDocTitles = missingDocIds.map((id) => docMap.get(id)?.title || id);

  // Dynamic Rule Explanation
  const ruleExplanation = explainRuleApplicability(profile, node);

  // Visual container styles
  let containerClasses = "bg-white border-slate-200 hover:border-slate-300";
  let statusBadge = null;

  if (isCompleted) {
    containerClasses = "bg-emerald-50/60 border-emerald-300 hover:border-emerald-400";
    statusBadge = (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
        <CheckCircle2 className="w-3 h-3 text-emerald-700" />
        COMPLETED
      </span>
    );
  } else if (isReady) {
    containerClasses = "bg-blue-50/40 border-blue-400 hover:border-blue-500 shadow-xs ring-1 ring-blue-300/80";
    statusBadge = (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-300">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
        READY TO START
      </span>
    );
  } else {
    // Blocked / Waiting
    containerClasses = "bg-slate-50/90 border-slate-300 hover:border-slate-400";
    statusBadge = (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 border border-slate-300">
        <Lock className="w-3 h-3 text-slate-500" />
        WAITING
      </span>
    );
  }

  return (
    <div
      onClick={() => onSelect(node.id)}
      className={`rounded-xl border p-4 transition-all cursor-pointer relative flex flex-col justify-between ${containerClasses}`}
    >
      {/* Main Blocker Badge if on critical path */}
      {node.isOnRemainingCriticalPath && !isCompleted && (
        <div className="absolute -top-2.5 right-3 bg-amber-500 text-white text-[9px] font-mono font-bold px-2.5 py-0.5 rounded-full shadow-2xs tracking-wider flex items-center gap-1">
          <Sparkles className="w-2.5 h-2.5" />
          MAIN BLOCKER
        </div>
      )}

      <div>
        {/* Top Header: Code & Status */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-[11px] font-mono font-bold text-slate-700 px-1.5 py-0.5 rounded bg-white border border-slate-200">
            {node.code}
          </span>
          {statusBadge}
        </div>

        {/* Title & Department */}
        <h4 className="text-xs font-bold text-slate-900 leading-snug">
          {node.title}
        </h4>
        <p className="text-[11px] text-slate-500 mt-0.5 font-medium line-clamp-1">
          {node.department}
        </p>

        {/* Provenance Indicator */}
        {node.provenance?.verification_status === "verified_statutory" ? (
          <div className="mt-1.5 flex items-center gap-1 text-[10px] text-emerald-800 font-medium bg-emerald-50/80 px-1.5 py-0.5 rounded border border-emerald-200">
            <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
            <span className="line-clamp-1">{node.provenance.statutory_act}</span>
          </div>
        ) : (
          <div className="mt-1.5 flex items-center gap-1 text-[10px] text-slate-500 font-medium bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0"></span>
            <span className="line-clamp-1">Demonstration Procedural Rule</span>
          </div>
        )}

        {/* Concise Card Body Hierarchy */}
        <div className="mt-3 text-xs space-y-2">
          {isReady && (
            <div className="space-y-1.5">
              <div className="bg-blue-100/70 text-blue-950 rounded-lg p-2 border border-blue-200 text-[11px] leading-relaxed">
                <span className="font-bold text-blue-900 block text-[10px] uppercase">
                  Ready to Start Today
                </span>
                All statutory prerequisites are satisfied. Process can be initiated.
              </div>

              {/* Explicit Document Semantics */}
              {hasDocumentIssue ? (
                <div className="bg-amber-50/90 text-amber-950 rounded-lg p-2 border border-amber-300 text-[11px] leading-relaxed">
                  <div className="flex items-center gap-1 font-bold text-amber-900 text-[10px] uppercase">
                    <FileWarning className="w-3 h-3 text-amber-600 shrink-0" />
                    Document Required Before Submission:
                  </div>
                  <div className="font-semibold text-amber-900 mt-0.5 line-clamp-1">
                    {missingDocTitles.join(", ")}
                  </div>
                  <div className="text-[10px] text-slate-600 mt-0.5">
                    You can initiate this approval, but final submission requires the missing document.
                  </div>
                </div>
              ) : (
                <div className="bg-emerald-50 text-emerald-900 rounded-md px-2 py-1 border border-emerald-200 text-[10px] font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span>All required documents ready for submission</span>
                </div>
              )}
            </div>
          )}

          {isBlocked && (
            <div className="bg-amber-50/80 text-amber-950 rounded-lg p-2 border border-amber-200 text-[11px] leading-relaxed">
              <div className="flex items-center gap-1 font-bold text-amber-900 text-[10px] uppercase">
                <Lock className="w-3 h-3 text-amber-600" />
                Why can&apos;t I start this?
              </div>
              <div className="text-[10px] text-slate-700 mt-0.5">
                Waiting for prior statutory clearance:
              </div>
              <div className="font-bold text-amber-900 line-clamp-1 mt-0.5">
                {node.blockedByApprovalTitles.join(", ")}
              </div>
              <div className="text-[10px] text-slate-600 mt-1 font-normal">
                Department will not accept application until prerequisites are sanctioned.
              </div>
            </div>
          )}

          {isCompleted && (
            <div className="bg-emerald-100/60 text-emerald-950 rounded-lg p-2 border border-emerald-200 text-[11px]">
              <span className="font-bold text-[10px] uppercase block text-emerald-900">Cleared ✓</span>
              Sanctioned. Downstream requirements unlocked.
            </div>
          )}

          {/* Rule Explainer Accordion: "Why does this apply?" */}
          <div className="pt-1">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowRuleWhy(!showRuleWhy);
              }}
              className="w-full flex items-center justify-between text-[10px] font-medium text-slate-600 hover:text-blue-700 bg-slate-50 hover:bg-slate-100 px-2 py-1 rounded border border-slate-200 transition-colors"
            >
              <span className="flex items-center gap-1">
                <HelpCircle className="w-3 h-3 text-blue-500" />
                <span>Why does this apply?</span>
              </span>
              {showRuleWhy ? (
                <ChevronUp className="w-3 h-3 text-slate-400" />
              ) : (
                <ChevronDown className="w-3 h-3 text-slate-400" />
              )}
            </button>

            {showRuleWhy && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="mt-1.5 p-2 bg-slate-50 rounded-lg border border-slate-200 text-[10px] space-y-1.5 animate-in fade-in duration-150"
              >
                <div className="text-slate-600 font-semibold mb-1">
                  Triggered by plant parameters:
                </div>
                {ruleExplanation.criteria.map((c, i) => (
                  <div key={i} className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold shrink-0">✓</span>
                    <div className="text-slate-700">
                      <strong className="text-slate-900">{c.label}:</strong> {c.actual} ({c.requirement})
                    </div>
                  </div>
                ))}
                <div className="pt-1 border-t border-slate-200/80 text-[9px] text-slate-500 font-mono line-clamp-1">
                  Ref: {node.statutoryRuleRef}
                </div>
              </div>
            )}
          </div>

          {/* Direct Unlocks summary */}
          {node.unblocksApprovalTitles.length > 0 && !isCompleted && (
            <div className="text-[10px] text-slate-500 font-medium">
              <span className="font-bold text-slate-700">Unlocks: </span>
              <span className="text-slate-600">{node.unblocksApprovalTitles.join(", ")}</span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-200/70 text-xs">
        {/* SLA and Lane */}
        <div className="flex items-center justify-between text-slate-500 text-[11px] mb-2 font-mono">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-400" />
            SLA: <strong className="text-slate-800">{node.slaDays} Days</strong>
          </span>
          <span className="text-slate-400 text-[10px]">
            {node.isCriticalSpineVisual ? "Main Sequence" : "Parallel Track"}
          </span>
        </div>

        {/* Primary Action Button */}
        {isReady && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSimulate(node.id);
            }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
            <span>Mark as Completed</span>
          </button>
        )}

        {isCompleted && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSimulate(node.id);
            }}
            className="w-full py-1.5 text-center text-xs font-semibold text-emerald-800 bg-emerald-100/70 hover:bg-emerald-200/70 border border-emerald-300 rounded-lg transition-colors cursor-pointer"
          >
            ✓ Completed (Click to Revert)
          </button>
        )}

        {isBlocked && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(node.id);
            }}
            className="w-full py-1.5 text-center text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            View Blocking Requirements
          </button>
        )}
      </div>
    </div>
  );
};

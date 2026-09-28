"use client";

import React from "react";
import { useCompliance } from "../context/ComplianceContext";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Compass,
  FileWarning,
  Lock,
  Sparkles,
  Zap
} from "lucide-react";

export const NextBestActions: React.FC = () => {
  const { engineState, selectApproval, simulateClearance } = useCompliance();
  const { nextBestActions, approvals } = engineState;

  const blockedApprovals = approvals.filter((n) => n.status === "blocked");

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Compass className="w-5 h-5 text-blue-600" />
              <h3 className="text-base font-bold text-slate-900">
                What Should I Do Next?
              </h3>
            </div>
            <p className="text-xs text-slate-600">
              Prioritized by the dependency engine: resolving the <strong>Main Blocker</strong> comes first, followed by concurrent fast-tracks.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-100 text-blue-900 border border-blue-200">
              {nextBestActions.length} Actions Ready to Start Today
            </span>
          </div>
        </div>
      </div>

      {/* Priority Actions Feed */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-blue-600" />
          <span>Priority Action Queue (Ready to Start Today)</span>
        </h4>

        {nextBestActions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {nextBestActions.map((action, index) => {
              const isMainBlocker = action.priority === "critical_path";

              return (
                <div
                  key={action.approvalId}
                  className={`rounded-xl border p-5 flex flex-col justify-between shadow-xs transition-all ${
                    isMainBlocker
                      ? "bg-amber-50/60 border-amber-300 ring-1 ring-amber-300/80"
                      : "bg-blue-50/40 border-blue-200 hover:border-blue-300"
                  }`}
                >
                  <div>
                    {/* Header Label: DO THIS NEXT */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          isMainBlocker
                            ? "bg-amber-500 text-white shadow-2xs"
                            : "bg-blue-100 text-blue-900 border border-blue-300"
                        }`}
                      >
                        {isMainBlocker ? (
                          <>
                            <Sparkles className="w-3 h-3 text-white" />
                            DO THIS NEXT: MAIN BLOCKER
                          </>
                        ) : (
                          <>
                            <Zap className="w-3 h-3 text-blue-600" />
                            CAN ALSO START IN PARALLEL
                          </>
                        )}
                      </span>
                      <span className="text-[11px] font-mono font-semibold text-slate-600">
                        {action.slaDays} Days SLA
                      </span>
                    </div>

                    {/* Title */}
                    <h5 className="text-sm font-bold text-slate-900 leading-snug">
                      {action.title}
                    </h5>
                    <p className="text-xs text-slate-600 mt-0.5 font-medium">{action.department}</p>

                    {/* Concise BECAUSE box */}
                    <div className="mt-3 bg-white/95 border border-slate-200 rounded-lg p-3 text-xs text-slate-800 leading-relaxed">
                      <span className="font-bold text-slate-900 block text-[10px] uppercase mb-0.5">
                        BECAUSE:
                      </span>
                      {action.rationale}
                    </div>

                    {/* THIS WILL UNLOCK */}
                    {action.unblocksTitles.length > 0 && (
                      <div className="mt-3 text-xs">
                        <span className="text-[11px] font-bold text-emerald-800 flex items-center gap-1 mb-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          THIS WILL UNLOCK:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {action.unblocksTitles.map((t) => (
                            <span
                              key={t}
                              className="text-[10px] font-semibold bg-emerald-50 text-emerald-900 border border-emerald-200 px-2 py-0.5 rounded"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Missing Document Warnings */}
                    {action.missingDocumentTitles.length > 0 && (
                      <div className="mt-3 text-xs bg-red-50 border border-red-200 rounded-lg p-2.5 text-red-900">
                        <span className="font-bold flex items-center gap-1 text-[11px]">
                          <FileWarning className="w-3.5 h-3.5 text-red-600" />
                          Missing Document Required for Filing:
                        </span>
                        <ul className="list-disc list-inside text-[11px] mt-0.5 font-medium">
                          {action.missingDocumentTitles.map((doc) => (
                            <li key={doc}>{doc}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between gap-3">
                    <button
                      onClick={() => selectApproval(action.approvalId)}
                      className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                    >
                      Inspect Checklist & Docs
                    </button>
                    <button
                      onClick={() => simulateClearance(action.approvalId)}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-1.5 px-3.5 rounded-lg flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Mark as Completed</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-800">All Available Clearances Completed</p>
            <p className="text-xs text-slate-500 mt-1">No pending clearances ready to file at this moment.</p>
          </div>
        )}
      </div>

      {/* Approvals Currently Waiting */}
      <div className="space-y-3 pt-4 border-t border-slate-200">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-slate-500" />
            <span>Approvals Currently Waiting ({blockedApprovals.length} Clearances Locked)</span>
          </h4>
          <span className="text-[11px] text-slate-500">
            Cannot be submitted until prior statutory approvals are completed
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {blockedApprovals.map((bNode) => (
            <div
              key={bNode.id}
              onClick={() => selectApproval(bNode.id)}
              className="bg-white rounded-xl border border-slate-200 p-3.5 hover:border-slate-300 cursor-pointer transition-all shadow-2xs"
            >
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 mb-1">
                <span className="font-bold text-slate-800">{bNode.code}</span>
                <span>{bNode.slaDays}d SLA</span>
              </div>
              <h5 className="text-xs font-bold text-slate-900 leading-snug line-clamp-1">
                {bNode.title}
              </h5>
              <div className="mt-2 text-[11px] bg-slate-50 border border-slate-200 rounded p-2 text-slate-700">
                <span className="font-bold text-slate-900 block text-[10px] uppercase mb-0.5">Waiting for:</span>
                <span className="text-amber-900 font-semibold line-clamp-1">
                  {bNode.blockedByApprovalTitles.join(", ")}
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  Must be approved before department accepts filing.
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

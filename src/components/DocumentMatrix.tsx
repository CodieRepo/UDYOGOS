"use client";

import React, { useState } from "react";
import { useCompliance } from "../context/ComplianceContext";
import { DEMO_DOCUMENTS } from "../data/demonstrationDataset";
import {
  AlertTriangle,
  ArrowRight,
  Building,
  CheckCircle2,
  Clock,
  FileCheck2,
  FileSpreadsheet,
  FileWarning,
  GitFork,
  Info,
  Layers,
  ShieldAlert,
  UploadCloud,
  X
} from "lucide-react";

export const DocumentMatrix: React.FC = () => {
  const { engineState, availableDocumentIds, updateDocumentStatus, selectedDocId, setSelectedDocId } = useCompliance();
  const { approvals } = engineState;

  const approvalMap = new Map(approvals.map((a) => [a.id, a]));

  const activeDoc = selectedDocId
    ? DEMO_DOCUMENTS.find((d) => d.id === selectedDocId)
    : DEMO_DOCUMENTS.find((d) => !availableDocumentIds.has(d.id)) || DEMO_DOCUMENTS[0];

  // Downstream cascade dependency calculation
  const directlyBlockedApprovals = (activeDoc?.requiredByApprovalIds || [])
    .map((id) => approvalMap.get(id))
    .filter((a): a is NonNullable<typeof a> => Boolean(a));

  const downstreamCascadeMap = new Map<string, Array<{ id: string; title: string; slaDays: number }>>();
  const allStalledApprovalIds = new Set<string>(directlyBlockedApprovals.map((a) => a.id));

  directlyBlockedApprovals.forEach((directApp) => {
    const queue = [directApp.id];
    const visited = new Set<string>();
    const downstreamList: Array<{ id: string; title: string; slaDays: number }> = [];

    while (queue.length > 0) {
      const currId = queue.shift()!;
      for (const app of approvals) {
        if (app.prerequisiteIds.includes(currId) && !visited.has(app.id)) {
          visited.add(app.id);
          allStalledApprovalIds.add(app.id);
          downstreamList.push({ id: app.id, title: app.title, slaDays: app.slaDays });
          queue.push(app.id);
        }
      }
    }
    if (downstreamList.length > 0) {
      downstreamCascadeMap.set(directApp.id, downstreamList);
    }
  });

  const totalStalledSlaDays = Array.from(allStalledApprovalIds)
    .map((id) => approvalMap.get(id)?.slaDays || 0)
    .reduce((sum, d) => sum + d, 0);

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <FileCheck2 className="w-5 h-5 text-blue-600" />
              <h3 className="text-base font-bold text-slate-900">
                Document Readiness
              </h3>
            </div>
            <p className="text-xs text-slate-600">
              "Do I have everything I need to apply?" • One document can be reused across multiple government departments.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-300">
              {availableDocumentIds.size} of {DEMO_DOCUMENTS.length} Documents Ready
            </span>
          </div>
        </div>
      </div>

      {/* 2. Interactive Document Inspection Card (When a doc is clicked) */}
      {activeDoc && (
        <div
          className={`rounded-xl border p-5 shadow-sm transition-all ${
            !availableDocumentIds.has(activeDoc.id)
              ? "bg-amber-50/80 border-amber-300 ring-1 ring-amber-300/80"
              : "bg-blue-50/50 border-blue-200"
          }`}
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white border border-slate-300 text-slate-800">
                  {activeDoc.code}
                </span>
                {!availableDocumentIds.has(activeDoc.id) ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-600 text-white flex items-center gap-1 shadow-2xs">
                    <FileWarning className="w-2.5 h-2.5" />
                    MISSING DOCUMENT
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1">
                    <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                    READY TO USE
                  </span>
                )}
              </div>
              <h4 className="text-sm font-bold text-slate-900">{activeDoc.title}</h4>
              <p className="text-xs text-slate-600 mt-0.5">{activeDoc.description}</p>
            </div>

            <button
              onClick={() => updateDocumentStatus(activeDoc.id, !availableDocumentIds.has(activeDoc.id))}
              className={`text-xs font-bold py-2 px-4 rounded-lg transition-colors shadow-2xs cursor-pointer ${
                availableDocumentIds.has(activeDoc.id)
                  ? "bg-slate-200 hover:bg-slate-300 text-slate-700"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {availableDocumentIds.has(activeDoc.id)
                ? "Mark as Missing"
                : "Mark as Uploaded / Ready"}
            </button>
          </div>

          {/* Blocking Impact & Downstream Cascade View */}
          <div className="mt-4 pt-3 border-t border-slate-200/80 space-y-3">
            {!availableDocumentIds.has(activeDoc.id) ? (
              <div className="bg-white/95 border border-red-200 rounded-lg p-3.5 text-xs text-red-950 space-y-3 shadow-2xs">
                {/* Header summary strip */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-red-100">
                  <div className="font-bold text-red-900 uppercase text-[10px] flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>Statutory Impact & Downstream Cascade Blocker Analysis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-100 text-red-900 border border-red-300">
                      {allStalledApprovalIds.size} Total Approvals Frozen
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-700" />
                      ~{totalStalledSlaDays} Days Cumulative Processing at Risk
                    </span>
                  </div>
                </div>

                {/* Level 1: Direct Blockers */}
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1.5">
                    Tier 1: Direct Filing Blockers (Cannot submit application without this document):
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {directlyBlockedApprovals.map((app) => (
                      <div
                        key={app.id}
                        className="bg-red-50 border border-red-300 rounded-md p-2 flex items-center gap-2 shadow-2xs"
                      >
                        <ShieldAlert className="w-3.5 h-3.5 text-red-600 shrink-0" />
                        <div>
                          <div className="font-bold text-red-950 text-xs">{app.title}</div>
                          <div className="text-[10px] text-red-700 font-mono">
                            {app.code} • {app.department} ({app.slaDays}d SLA)
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Level 2: Downstream Cascade Chains */}
                {downstreamCascadeMap.size > 0 && (
                  <div className="space-y-2 pt-1">
                    <span className="text-[10px] font-bold uppercase text-slate-500 block">
                      Tier 2: Downstream Approvals Stalled in Cascade:
                    </span>
                    <div className="space-y-2 bg-slate-50 rounded-lg p-2.5 border border-slate-200">
                      {Array.from(downstreamCascadeMap.entries()).map(([directId, downstreamList]) => {
                        const directApp = approvalMap.get(directId);
                        return (
                          <div key={directId} className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-[11px]">
                            <div className="font-semibold text-slate-800 bg-white border border-slate-300 rounded px-2 py-0.5 shrink-0">
                              {directApp?.title || directId}
                            </div>
                            <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0 hidden sm:inline" />
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="text-[10px] text-slate-500 font-medium">stalls downstream:</span>
                              {downstreamList.map((ds) => (
                                <span
                                  key={ds.id}
                                  className="font-mono text-[10px] font-semibold bg-amber-50 border border-amber-300 text-amber-900 rounded px-2 py-0.5"
                                >
                                  {ds.title}
                                </span>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Practical Advice */}
                <p className="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-200">
                  <strong className="text-slate-800">Scrutiny Warning:</strong> Under the Maharashtra Right to Public Services Act (RTSA), submitting an application without this prerequisite document will trigger a formal scrutiny rejection or Deficiency Memo, pausing the statutory timeline until rectified.
                </p>
              </div>
            ) : (
              <div className="bg-white/90 border border-emerald-200 rounded-lg p-3 text-xs text-emerald-950">
                <div className="font-bold text-emerald-900 uppercase text-[10px] flex items-center gap-1 mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  SHARED ACROSS {activeDoc.requiredByApprovalIds.length} STATUTORY APPROVALS:
                </div>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {activeDoc.requiredByApprovalIds.map((id) => {
                    const app = approvalMap.get(id);
                    return (
                      <span
                        key={id}
                        className="text-xs font-semibold bg-emerald-50 text-emerald-900 border border-emerald-200 px-2.5 py-0.5 rounded"
                      >
                        {app?.title || id}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. Clean, Streamlined Document Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                <th className="py-3 px-4">Document</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4">Used For</th>
                <th className="py-3 px-4">Blocking Impact</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs">
              {DEMO_DOCUMENTS.map((doc) => {
                const isAvailable = availableDocumentIds.has(doc.id);
                const isSelected = activeDoc?.id === doc.id;
                const linkedApprovals = doc.requiredByApprovalIds
                  .map((id) => approvalMap.get(id))
                  .filter(Boolean);

                return (
                  <tr
                    key={doc.id}
                    onClick={() => setSelectedDocId(doc.id)}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? "bg-blue-50/60" : "hover:bg-slate-50/70"
                    }`}
                  >
                    {/* Document Title & Code */}
                    <td className="py-3 px-4 max-w-sm">
                      <div className="font-bold text-slate-900">{doc.title}</div>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                        {doc.code}
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      {isAvailable ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Ready
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-red-100 text-red-900 border border-red-300">
                          <FileWarning className="w-3.5 h-3.5 text-red-600" />
                          Missing
                        </span>
                      )}
                    </td>

                    {/* Re-Use Across Approvals */}
                    <td className="py-3 px-4 font-semibold text-slate-700 whitespace-nowrap">
                      Used for {linkedApprovals.length} approvals
                    </td>

                    {/* Impact When Missing */}
                    <td className="py-3 px-4">
                      {isAvailable ? (
                        <span className="text-emerald-800 text-[11px] font-medium">
                          ✓ Verified for filing
                        </span>
                      ) : (
                        <span className="text-red-900 font-bold text-[11px] bg-red-50 border border-red-200 rounded px-2 py-0.5">
                          Blocks {linkedApprovals.length} approvals
                        </span>
                      )}
                    </td>

                    {/* Interactive Toggle */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateDocumentStatus(doc.id, !isAvailable);
                        }}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                          isAvailable
                            ? "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-300"
                            : "bg-blue-600 hover:bg-blue-700 text-white border-transparent shadow-2xs"
                        }`}
                      >
                        {isAvailable ? "Mark Missing" : "Mark Ready"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

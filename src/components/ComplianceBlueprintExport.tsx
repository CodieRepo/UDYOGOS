"use client";

import React, { useState } from "react";
import { useCompliance } from "../context/ComplianceContext";
import {
  CheckCircle2,
  Clock,
  Copy,
  Download,
  FileCheck2,
  FileText,
  Lock,
  Printer,
  ShieldCheck,
  X
} from "lucide-react";

export const ComplianceBlueprintExport: React.FC = () => {
  const { profile, engineState, isExportModalOpen, setIsExportModalOpen, availableDocumentIds } = useCompliance();
  const [copied, setCopied] = useState<boolean>(false);

  if (!isExportModalOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyJson = () => {
    const blueprintData = {
      dossier_type: "UDYOGSETU Statutory Industrial Filing Blueprint",
      version: "2.0-grounded",
      framework: "Maharashtra Right to Public Services Act (RTSA) 2015 & Central BRAP Standards",
      generated_at: new Date().toISOString(),
      plant_profile: {
        company_name: profile.companyName,
        industrial_estate: profile.industrialEstate || profile.location,
        district: profile.district || "Pune",
        state: profile.stateOrRegion,
        cpcb_sector: profile.cpcbSectorName || profile.sectorLabel,
        pollution_category: profile.pollutionCategory.toUpperCase(),
        connected_load_kva: profile.powerKva,
        workforce_headcount: profile.workforce,
        authorities: profile.authorities
      },
      metrics: {
        total_statutory_clearances: engineState.totalApplicable,
        original_critical_path_days: engineState.originalPlannedCriticalPathDays,
        remaining_critical_path_days: engineState.remainingCriticalPathDays,
        simulated_concurrency_savings_days: engineState.simulatedParallelSavings,
        readiness_percentage: `${engineState.readinessPercentage}%`
      },
      statutory_roadmap: engineState.approvals.map((a) => ({
        code: a.code,
        title: a.title,
        department: a.department,
        stage: a.stageLabel,
        sla_days: a.slaDays,
        status: a.status,
        governing_act: a.provenance.statutory_act,
        section: a.provenance.section_or_rule,
        service_code: a.provenance.service_code,
        prerequisites: a.prerequisiteIds,
        unblocks: a.unblocksApprovalTitles
      })),
      document_readiness: engineState.documents.map((d) => ({
        code: d.code,
        title: d.title,
        status: availableDocumentIds.has(d.id) ? "READY" : "MISSING",
        required_by_approvals: d.requiredByApprovalIds
      }))
    };

    navigator.clipboard.writeText(JSON.stringify(blueprintData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex justify-center p-3 sm:p-6 print:p-0 print:bg-white print:static">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full border border-slate-200 overflow-hidden flex flex-col print:border-none print:shadow-none print:max-w-none">
        {/* Top Control Bar (Hidden during Print) */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between gap-4 print:hidden">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span className="font-bold text-sm">
              Compliance Filing Blueprint — Executive Dossier
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyJson}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copied ? "Copied JSON!" : "Copy JSON"}</span>
            </button>
            <button
              onClick={handlePrint}
              className="text-xs font-bold px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={() => setIsExportModalOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dossier Content Body */}
        <div className="p-6 sm:p-8 space-y-6 text-slate-800 print:p-4 print:space-y-4">
          {/* Official Document Letterhead */}
          <div className="border-b-2 border-slate-900 pb-4 flex items-start justify-between gap-4">
            <div>
              <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-blue-700">
                UDYOGSETU (उद्योगसेतु) • STATUTORY PLANNING DOSSIER
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-950 mt-1">
                Industrial Approval Dependency &amp; Execution Blueprint
              </h1>
              <p className="text-xs text-slate-600 mt-1 font-medium">
                Standardized under Maharashtra Right to Public Services Act (RTSA) 2015 &amp; Central BRAP Framework
              </p>
            </div>
            <div className="text-right text-[11px] font-mono text-slate-500">
              <div>Ruleset: v2.0-grounded</div>
              <div>Audited: September 2026</div>
              <div className="text-emerald-700 font-bold mt-1">✓ Audit-Ready Reference</div>
            </div>
          </div>

          {/* Section 1: Enterprise Profile & Jurisdiction */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              1. Enterprise &amp; Location Jurisdiction
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">Enterprise Name</span>
                <span className="font-bold text-slate-900">{profile.companyName}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">Industrial Location</span>
                <span className="font-bold text-slate-900">{profile.industrialEstate || profile.location}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">CPCB Sector Classification</span>
                <span className="font-bold text-slate-900">{profile.cpcbSectorName || profile.sectorLabel}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">Pollution Category</span>
                <span className="font-bold uppercase text-amber-700 font-mono">
                  {profile.pollutionCategory} ({profile.cpcbPollutionIndex || "CPCB Index"})
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">Power Sanction</span>
                <span className="font-bold text-slate-900 font-mono">{profile.powerKva} kVA (HT Threshold &ge; 50 kVA)</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">Workforce</span>
                <span className="font-bold text-slate-900 font-mono">{profile.workforce} Headcount (Factories Act &ge; 10)</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">Planning Authority</span>
                <span className="font-bold text-slate-900">{profile.authorities?.planning || "MIDC SPA"}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">Pollution Control Desk</span>
                <span className="font-bold text-slate-900">{profile.authorities?.environmental || "MPCB Regional Office"}</span>
              </div>
            </div>
          </div>

          {/* Section 2: Statutory Lead-Time Metrics */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Total Statutory Clearances</span>
              <span className="text-xl font-bold font-mono text-slate-900">{engineState.totalApplicable} Approvals</span>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Critical Path Lead Time</span>
              <span className="text-xl font-bold font-mono text-blue-700">{engineState.remainingCriticalPathDays} Calendar Days</span>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Parallel Concurrency Savings</span>
              <span className="text-xl font-bold font-mono text-emerald-700">{engineState.simulatedParallelSavings} Days Saved</span>
            </div>
          </div>

          {/* Section 3: Sequenced Statutory Clearances */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              2. Sequenced Statutory Clearance Matrix &amp; Provenance
            </h3>
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 text-[10px] uppercase font-bold text-slate-600">
                    <th className="p-2">Code</th>
                    <th className="p-2">Approval Title &amp; Department</th>
                    <th className="p-2">Statutory Act &amp; Section</th>
                    <th className="p-2 text-center">RTSA SLA</th>
                    <th className="p-2 text-center">Status</th>
                    <th className="p-2">Pre-requisite Clearances</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {engineState.approvals.map((a) => (
                    <tr key={a.id} className="hover:bg-slate-50/50">
                      <td className="p-2 font-mono font-bold text-[11px] text-slate-700">{a.code}</td>
                      <td className="p-2">
                        <div className="font-bold text-slate-900">{a.title}</div>
                        <div className="text-[10px] text-slate-500">{a.department}</div>
                      </td>
                      <td className="p-2 text-[11px]">
                        <div className="font-semibold text-slate-800">{a.provenance.statutory_act}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{a.provenance.section_or_rule || a.provenance.service_code}</div>
                      </td>
                      <td className="p-2 text-center font-mono font-bold">{a.slaDays}d</td>
                      <td className="p-2 text-center">
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded font-mono ${
                            a.status === "completed"
                              ? "bg-emerald-100 text-emerald-800"
                              : a.status === "ready"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {a.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-2 text-[10px] text-slate-600 font-mono">
                        {a.prerequisiteIds.length > 0 ? a.prerequisiteIds.join(", ") : "None (Day 1)"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 4: Cross-Department Document Verification Checklist */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              3. Cross-Department Document Readiness Checklist
            </h3>
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 text-[10px] uppercase font-bold text-slate-600">
                    <th className="p-2">Code</th>
                    <th className="p-2">Document Title</th>
                    <th className="p-2">Category</th>
                    <th className="p-2 text-center">Readiness Status</th>
                    <th className="p-2">Re-used Across Approvals</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {engineState.documents.map((d) => {
                    const isAvail = availableDocumentIds.has(d.id);
                    return (
                      <tr key={d.id} className="hover:bg-slate-50/50">
                        <td className="p-2 font-mono font-bold text-[11px] text-slate-700">{d.code}</td>
                        <td className="p-2 font-bold text-slate-900">{d.title}</td>
                        <td className="p-2 uppercase text-[10px] text-slate-500 font-mono">{d.category}</td>
                        <td className="p-2 text-center">
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded font-mono ${
                              isAvail ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                            }`}
                          >
                            {isAvail ? "READY" : "MISSING"}
                          </span>
                        </td>
                        <td className="p-2 text-[10px] text-slate-600 font-mono">
                          {d.requiredByApprovalIds.join(", ")}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Regulatory Disclaimer & Attestation */}
          <div className="border-t border-slate-200 pt-3 text-[10px] text-slate-500 leading-relaxed">
            <p>
              <strong>Administrative Disclaimer:</strong> This dossier is a deterministic compliance roadmap generated for industrial planning purposes. Timelines reflect statutory citizen charter SLAs under the Maharashtra Right to Public Services Act (RTSA) 2015. Actual clearance issuance is contingent upon complete documentary submission and statutory departmental site inspection.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

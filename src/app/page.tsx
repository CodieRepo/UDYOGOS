"use client";

import React from "react";
import { useCompliance } from "../context/ComplianceContext";
import { Header } from "../components/Header";
import { NavigationTabs } from "../components/NavigationTabs";
import { CommandCockpit } from "../components/CommandCockpit";
import { DependencyMap } from "../components/DependencyMap";
import { NextBestActions } from "../components/NextBestActions";
import { DocumentMatrix } from "../components/DocumentMatrix";
import { ClearanceDrawer } from "../components/ClearanceDrawer";
import { ComplianceBlueprintExport } from "../components/ComplianceBlueprintExport";
import { WhatIfLab } from "../components/WhatIfLab";
import { Cpu, GitGraph, ShieldCheck } from "lucide-react";

export default function Home() {
  const { activeTab } = useCompliance();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Platform Header */}
      <Header />

      {/* Navigation Tabs (Overview, Roadmap, Next Actions, Documents, What-If Lab) */}
      <NavigationTabs />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        {activeTab === "overview" && <CommandCockpit />}
        {activeTab === "roadmap" && <DependencyMap />}
        {activeTab === "actions" && <NextBestActions />}
        {activeTab === "documents" && <DocumentMatrix />}
        {activeTab === "whatif" && <WhatIfLab />}
      </main>

      {/* Slide-over Inspection Drawer */}
      <ClearanceDrawer />

      {/* Printable Compliance Blueprint Export Modal */}
      <ComplianceBlueprintExport />

      {/* Platform Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 font-bold text-slate-800">
              <span>UDYOGSETU (उद्योगसेतु)</span>
              <span>•</span>
              <span className="font-normal text-slate-500">
                SIH 2026 Problem Statement SIH26130
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Industrial Approval Dependency & Critical-Path Execution Platform. Built with deterministic graph topology and state-aware lead-time recalculation.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 font-mono">
            <span className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-blue-600" />
              Deterministic Rule Engine
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <GitGraph className="w-3.5 h-3.5 text-emerald-600" />
              DAG Topological DP
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
              Zero External Dependency
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

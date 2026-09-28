"use client";

import React, { useMemo, useState } from "react";
import { useCompliance } from "../context/ComplianceContext";
import { DEMO_DOCUMENTS, MASTER_APPROVAL_POOL } from "../data/demonstrationDataset";
import { runComplianceEngine } from "../engine/dependencyEngine";
import { PlantProfile, PollutionCategory, Sector } from "../types/compliance";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Clock,
  Cpu,
  Factory,
  FlaskConical,
  Gauge,
  HelpCircle,
  Info,
  Layers,
  MinusCircle,
  PlusCircle,
  RefreshCw,
  RotateCcw,
  Sliders,
  Sparkles,
  Users,
  Zap
} from "lucide-react";

export const WhatIfLab: React.FC = () => {
  const { profile, engineState, setActiveTab } = useCompliance();

  // Scenario parameters initialized from active profile
  const [powerKva, setPowerKva] = useState<number>(profile.powerKva);
  const [workforce, setWorkforce] = useState<number>(profile.workforce);
  const [pollutionCategory, setPollutionCategory] = useState<PollutionCategory>(profile.pollutionCategory);
  const [sector, setSector] = useState<Sector>(profile.sector);
  const [builtUpAreaSqFt, setBuiltUpAreaSqFt] = useState<number>(profile.builtUpAreaSqFt);

  // Synthesize scenario plant profile
  const scenarioProfile: PlantProfile = useMemo(() => {
    const sectorLabels: Record<Sector, string> = {
      engineering: "Light Engineering & Machining",
      food_processing: "Agro-Foods & Grain Milling",
      electronics: "Electronics & PCB Assembly",
      textile: "Textile Weaving & Dyeing",
      chemical: "Specialty Chemicals Formulation"
    };

    return {
      id: "scenario-custom",
      name: `${profile.name} (Simulation Scenario)`,
      companyName: profile.companyName,
      location: profile.location,
      stateOrRegion: profile.stateOrRegion,
      sector,
      sectorLabel: sectorLabels[sector] || sector,
      pollutionCategory,
      powerKva,
      workforce,
      builtUpAreaSqFt,
      description: "Custom parameters simulated in UDYOGSETU What-If Scenario Lab."
    };
  }, [profile, sector, pollutionCategory, powerKva, workforce, builtUpAreaSqFt]);

  // Run deterministic compliance engine on simulated parameters
  const scenarioEngineState = useMemo(() => {
    // Keep node-1 completed as baseline ground-zero plot check
    return runComplianceEngine(
      scenarioProfile,
      MASTER_APPROVAL_POOL,
      DEMO_DOCUMENTS,
      new Set(["node-1"]),
      new Set()
    );
  }, [scenarioProfile]);

  // Diff Calculations
  const currentApprovalIds = new Set(engineState.approvals.map((a) => a.id));
  const scenarioApprovalIds = new Set(scenarioEngineState.approvals.map((a) => a.id));

  // Clearances removed in scenario
  const removedApprovals = engineState.approvals.filter((a) => !scenarioApprovalIds.has(a.id));

  // Clearances added in scenario
  const addedApprovals = scenarioEngineState.approvals.filter((a) => !currentApprovalIds.has(a.id));

  // Metric Deltas
  const countDelta = scenarioEngineState.totalApplicable - engineState.totalApplicable;
  const remCriticalDelta = scenarioEngineState.remainingCriticalPathDays - engineState.remainingCriticalPathDays;
  const origPlannedDelta = scenarioEngineState.originalPlannedCriticalPathDays - engineState.originalPlannedCriticalPathDays;

  // Preset Configurations
  const applyPreset = (preset: {
    powerKva: number;
    workforce: number;
    category: PollutionCategory;
    sector: Sector;
    area: number;
  }) => {
    setPowerKva(preset.powerKva);
    setWorkforce(preset.workforce);
    setPollutionCategory(preset.category);
    setSector(preset.sector);
    setBuiltUpAreaSqFt(preset.area);
  };

  const resetToCurrent = () => {
    setPowerKva(profile.powerKva);
    setWorkforce(profile.workforce);
    setPollutionCategory(profile.pollutionCategory);
    setSector(profile.sector);
    setBuiltUpAreaSqFt(profile.builtUpAreaSqFt);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-blue-900 to-slate-900 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-blue-200 border border-white/20 text-xs font-mono font-semibold mb-3">
            <Cpu className="w-3.5 h-3.5 text-blue-300" />
            INTELLIGENCE SHOWCASE LAYER • DETERMINISTIC WHAT-IF LAB
          </div>
          <h2 className="text-2xl font-bold tracking-tight">
            What-If Scenario Simulation Lab
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed">
            Test how changes in connected electrical load, workforce headcount, pollution categorization, and industrial sector dynamically reshape the entire statutory approval graph and critical path in real time.
          </p>
        </div>

        <div className="absolute right-4 bottom-4 opacity-10 pointer-events-none hidden sm:block">
          <Sliders className="w-48 h-48 text-white" />
        </div>
      </div>

      {/* Main Grid: Control Panel (Left) & Live Impact Dashboard (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Scenario Parameters (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Simulation Parameters
                </h3>
              </div>
              <button
                onClick={resetToCurrent}
                className="text-xs font-medium text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                Reset to Current
              </button>
            </div>

            {/* Quick Presets Strip */}
            <div>
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-2">
                Quick Demonstration Presets
              </label>
              <div className="grid grid-cols-2 gap-1.5 text-xs">
                <button
                  onClick={() =>
                    applyPreset({
                      powerKva: 150,
                      workforce: 65,
                      category: "orange",
                      sector: "engineering",
                      area: 18000
                    })
                  }
                  className="p-2 text-left rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 transition-colors cursor-pointer"
                >
                  <div className="font-bold text-slate-800 text-[11px]">Apex Baseline</div>
                  <div className="text-[10px] text-slate-500">Orange • 150kVA • 65w</div>
                </button>
                <button
                  onClick={() =>
                    applyPreset({
                      powerKva: 30,
                      workforce: 45,
                      category: "white",
                      sector: "electronics",
                      area: 8500
                    })
                  }
                  className="p-2 text-left rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 transition-colors cursor-pointer"
                >
                  <div className="font-bold text-slate-800 text-[11px]">Clean Electronics</div>
                  <div className="text-[10px] text-slate-500">White • 30kVA • Exempt CTE</div>
                </button>
                <button
                  onClick={() =>
                    applyPreset({
                      powerKva: 40,
                      workforce: 8,
                      category: "green",
                      sector: "food_processing",
                      area: 4000
                    })
                  }
                  className="p-2 text-left rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 transition-colors cursor-pointer"
                >
                  <div className="font-bold text-slate-800 text-[11px]">Micro-Unit (&lt;10w)</div>
                  <div className="text-[10px] text-slate-500">Green • 8w • No Fact. Act</div>
                </button>
                <button
                  onClick={() =>
                    applyPreset({
                      powerKva: 300,
                      workforce: 120,
                      category: "red",
                      sector: "chemical",
                      area: 35000
                    })
                  }
                  className="p-2 text-left rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 transition-colors cursor-pointer"
                >
                  <div className="font-bold text-slate-800 text-[11px]">Heavy Chemical</div>
                  <div className="text-[10px] text-slate-500">Red • 300kVA • HazWaste</div>
                </button>
              </div>
            </div>

            {/* Slider 1: Connected Power Load (kVA) */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  Connected Power Load
                </span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200">
                  {powerKva} kVA
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="500"
                step="10"
                value={powerKva}
                onChange={(e) => setPowerKva(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>10 kVA (LT)</span>
                <span className={powerKva >= 50 ? "text-amber-700 font-bold" : ""}>
                  50 kVA HT Threshold
                </span>
                <span>500 kVA</span>
              </div>
              {powerKva < 50 ? (
                <div className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                  ✓ Low-Tension: Exempt from DISCOM High-Tension (HT) Sanction (node-4).
                </div>
              ) : (
                <div className="text-[10px] text-amber-800 bg-amber-50 px-2 py-1 rounded border border-amber-200">
                  ⚠ High-Tension: ≥ 50 kVA triggers mandatory DISCOM HT Sanction (node-4).
                </div>
              )}
            </div>

            {/* Slider 2: Workforce Headcount */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-blue-600" />
                  Total Workforce
                </span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-900 border border-blue-200">
                  {workforce} Workers
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="200"
                step="1"
                value={workforce}
                onChange={(e) => setWorkforce(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>5 workers</span>
                <span className={workforce >= 10 ? "text-blue-700 font-bold" : ""}>
                  10 Workers Threshold (Factories Act)
                </span>
                <span>200 workers</span>
              </div>
              {workforce < 10 ? (
                <div className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                  ✓ Under 10 workers: Exempt from Factory Plan Approval &amp; License (node-6, node-9).
                </div>
              ) : (
                <div className="text-[10px] text-blue-800 bg-blue-50 px-2 py-1 rounded border border-blue-200">
                  ℹ ≥ 10 workers triggers full Factories Act registration and DISH plan approval.
                </div>
              )}
            </div>

            {/* Selector: Pollution Category */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <FlaskConical className="w-3.5 h-3.5 text-purple-600" />
                Pollution Categorization
              </label>
              <div className="grid grid-cols-4 gap-1.5 text-xs">
                {(["white", "green", "orange", "red"] as PollutionCategory[]).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setPollutionCategory(cat)}
                    className={`py-1.5 px-2 rounded-lg font-bold text-center border transition-all cursor-pointer text-[11px] uppercase ${
                      pollutionCategory === cat
                        ? cat === "white"
                          ? "bg-slate-100 border-slate-400 text-slate-800 ring-2 ring-slate-400"
                          : cat === "green"
                          ? "bg-emerald-100 border-emerald-400 text-emerald-900 ring-2 ring-emerald-400"
                          : cat === "orange"
                          ? "bg-orange-100 border-orange-400 text-orange-900 ring-2 ring-orange-400"
                          : "bg-red-100 border-red-400 text-red-900 ring-2 ring-red-400"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-slate-500">
                {pollutionCategory === "white" && "White category: Non-polluting assembly. Complete exemption from CTE & CTO."}
                {pollutionCategory === "green" && "Green category: Low pollution potential. Standard CTE & CTO required."}
                {pollutionCategory === "orange" && "Orange category: Moderate pollution. CTE, CTO & Hazardous Waste Authorization applicable."}
                {pollutionCategory === "red" && "Red category: Heavy pollution index. Full CTE, CTO, and specialized environmental oversight."}
              </p>
            </div>

            {/* Selector: Sector */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Factory className="w-3.5 h-3.5 text-slate-600" />
                Industrial Sector
              </label>
              <select
                value={sector}
                onChange={(e) => setSector(e.target.value as Sector)}
                className="w-full text-xs font-medium p-2 rounded-lg border border-slate-300 bg-white text-slate-800 cursor-pointer"
              >
                <option value="engineering">Light Engineering &amp; CNC Machining</option>
                <option value="food_processing">Agro-Foods &amp; Grain Milling</option>
                <option value="electronics">Electronics &amp; PCB Assembly</option>
                <option value="textile">Textile Weaving &amp; Finishing</option>
                <option value="chemical">Specialty Chemicals &amp; Formulations</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Column: Live Side-by-Side Impact & Graph Diff (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Comparison Delta Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {/* Total Clearances Delta */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">
                Total Clearances
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold text-slate-900 font-mono">
                  {scenarioEngineState.totalApplicable}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  vs {engineState.totalApplicable} current
                </span>
              </div>
              <div className="mt-1">
                {countDelta === 0 ? (
                  <span className="text-[10px] text-slate-500 font-mono">No change in count</span>
                ) : countDelta < 0 ? (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                    {countDelta} clearances eliminated
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                    +{countDelta} clearances required
                  </span>
                )}
              </div>
            </div>

            {/* Remaining Critical Path Delta */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">
                Critical Path SLA
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold text-blue-700 font-mono">
                  {scenarioEngineState.remainingCriticalPathDays}d
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  vs {engineState.remainingCriticalPathDays}d
                </span>
              </div>
              <div className="mt-1">
                {remCriticalDelta === 0 ? (
                  <span className="text-[10px] text-slate-500 font-mono">Identical critical path</span>
                ) : remCriticalDelta < 0 ? (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                    {remCriticalDelta} days faster!
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                    +{remCriticalDelta} days added
                  </span>
                )}
              </div>
            </div>

            {/* Concurrency Parallel Savings */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs col-span-2 sm:col-span-1">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">
                Parallel Concurrency
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold text-emerald-700 font-mono">
                  {scenarioEngineState.simulatedParallelSavings}d
                </span>
                <span className="text-xs text-slate-400 font-mono">saved</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-1">
                Serialized sum: {scenarioEngineState.remainingSerializedDays} days
              </div>
            </div>
          </div>

          {/* Detailed Structural Diff Breakdown */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-600" />
                <h4 className="text-sm font-bold text-slate-900">
                  Statutory Rule Engine Graph Diff
                </h4>
              </div>
              <span className="text-[10px] font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                Deterministic DAG Diff
              </span>
            </div>

            {/* Clearances Dropped */}
            {removedApprovals.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                  <MinusCircle className="w-4 h-4 text-emerald-600" />
                  Clearances Dropped in This Scenario ({removedApprovals.length})
                </div>
                <div className="space-y-1.5">
                  {removedApprovals.map((node) => (
                    <div
                      key={node.id}
                      className="p-3 rounded-lg bg-emerald-50/70 border border-emerald-200 text-xs flex items-start justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-[10px] px-1.5 py-0.2 bg-white rounded border border-emerald-300 text-emerald-900">
                            {node.code}
                          </span>
                          <span className="font-bold text-slate-900">{node.title}</span>
                          <span className="text-slate-500 font-mono text-[10px]">
                            ({node.slaDays}d SLA eliminated)
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-600 mt-1">
                          {node.code === "DISCOM-HT" &&
                            `Power capacity (${powerKva} kVA) is below the 50 kVA threshold. Replaced by standard low-tension utility billing.`}
                          {(node.code === "FACT-PLAN" || node.code === "FACT-LIC") &&
                            `Workforce (${workforce} headcount) is below the statutory threshold of 10 workers under the Factories Act.`}
                          {(node.code === "SPCB-CTE" || node.code === "SPCB-CTO") &&
                            `White Category operations are formally exempted from Pollution Board Consent to Establish and Consent to Operate.`}
                          {node.code === "HAZ-AUTH" &&
                            `Hazardous Waste Authorization only applies to Orange and Red categories with hazardous residues.`}
                        </div>
                      </div>
                      <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 shrink-0">
                        EXEMPT
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Clearances Added */}
            {addedApprovals.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
                  <PlusCircle className="w-4 h-4 text-amber-600" />
                  Additional Clearances Triggered in This Scenario ({addedApprovals.length})
                </div>
                <div className="space-y-1.5">
                  {addedApprovals.map((node) => (
                    <div
                      key={node.id}
                      className="p-3 rounded-lg bg-amber-50/70 border border-amber-200 text-xs flex items-start justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-[10px] px-1.5 py-0.2 bg-white rounded border border-amber-300 text-amber-900">
                            {node.code}
                          </span>
                          <span className="font-bold text-slate-900">{node.title}</span>
                          <span className="text-amber-800 font-mono text-[10px]">
                            (+{node.slaDays}d SLA added)
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-600 mt-1">
                          Triggered by updated scenario parameters (Workforce: {workforce}, Power: {powerKva} kVA, Category: {pollutionCategory.toUpperCase()}).
                        </div>
                      </div>
                      <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-800 shrink-0">
                        REQUIRED
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* If identical */}
            {removedApprovals.length === 0 && addedApprovals.length === 0 && (
              <div className="p-4 bg-slate-50 rounded-lg text-center text-xs text-slate-600 border border-slate-200">
                <Info className="w-4 h-4 mx-auto mb-1 text-blue-500" />
                The simulated parameters match the statutory threshold requirements of your current baseline. No clearances were added or removed.
              </div>
            )}

            {/* Active Critical Bottleneck in Scenario */}
            <div className="pt-2 border-t border-slate-100">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-1.5">
                Simulated Critical Bottleneck
              </span>
              {scenarioEngineState.criticalBottleneckNode ? (
                <div className="p-3 rounded-lg bg-blue-50/70 border border-blue-200 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-blue-950">
                      {scenarioEngineState.criticalBottleneckNode.title}
                    </div>
                    <div className="text-[11px] text-slate-600 mt-0.5">
                      {scenarioEngineState.criticalBottleneckNode.department} • SLA: {scenarioEngineState.criticalBottleneckNode.slaDays} days
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-600 text-white shadow-2xs">
                    ACTIVE BLOCKER
                  </span>
                </div>
              ) : (
                <div className="text-xs text-slate-500 italic">
                  All clearances simulated as completed.
                </div>
              )}
            </div>
          </div>

          {/* Plant Specification Comparison Table */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">
              Baseline vs Simulated Plant Specification
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                    <th className="pb-2">Parameter</th>
                    <th className="pb-2">Current Baseline</th>
                    <th className="pb-2">Simulated Scenario</th>
                    <th className="pb-2">Impact State</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-2 font-medium text-slate-700">Power Capacity</td>
                    <td className="py-2 font-mono text-slate-600">{profile.powerKva} kVA</td>
                    <td className="py-2 font-mono font-bold text-blue-900">{powerKva} kVA</td>
                    <td className="py-2">
                      {powerKva === profile.powerKva ? (
                        <span className="text-slate-400 font-mono text-[10px]">Unchanged</span>
                      ) : (
                        <span className="text-blue-700 font-bold font-mono text-[10px]">
                          {powerKva > profile.powerKva ? `+${powerKva - profile.powerKva} kVA` : `${powerKva - profile.powerKva} kVA`}
                        </span>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 font-medium text-slate-700">Workforce Headcount</td>
                    <td className="py-2 font-mono text-slate-600">{profile.workforce} workers</td>
                    <td className="py-2 font-mono font-bold text-blue-900">{workforce} workers</td>
                    <td className="py-2">
                      {workforce === profile.workforce ? (
                        <span className="text-slate-400 font-mono text-[10px]">Unchanged</span>
                      ) : (
                        <span className="text-blue-700 font-bold font-mono text-[10px]">
                          {workforce > profile.workforce ? `+${workforce - profile.workforce} workers` : `${workforce - profile.workforce} workers`}
                        </span>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 font-medium text-slate-700">Pollution Category</td>
                    <td className="py-2 font-mono uppercase text-slate-600">{profile.pollutionCategory}</td>
                    <td className="py-2 font-mono uppercase font-bold text-blue-900">{pollutionCategory}</td>
                    <td className="py-2">
                      {pollutionCategory === profile.pollutionCategory ? (
                        <span className="text-slate-400 font-mono text-[10px]">Unchanged</span>
                      ) : (
                        <span className="text-purple-700 font-bold font-mono text-[10px]">
                          Re-categorized
                        </span>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 font-medium text-slate-700">Industrial Sector</td>
                    <td className="py-2 text-slate-600 line-clamp-1">{profile.sectorLabel}</td>
                    <td className="py-2 font-bold text-blue-900">{scenarioProfile.sectorLabel}</td>
                    <td className="py-2">
                      {sector === profile.sector ? (
                        <span className="text-slate-400 font-mono text-[10px]">Unchanged</span>
                      ) : (
                        <span className="text-amber-700 font-bold font-mono text-[10px]">
                          Sector shift
                        </span>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

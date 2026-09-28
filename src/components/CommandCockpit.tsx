"use client";

import React from "react";
import { useCompliance } from "../context/ComplianceContext";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Factory,
  FastForward,
  HelpCircle,
  Lock,
  Route,
  Sparkles,
  TrendingDown,
  Zap
} from "lucide-react";

export const CommandCockpit: React.FC = () => {
  const { engineState, profile, setActiveTab, selectApproval, simulateClearance } = useCompliance();

  const readyClearances = engineState.approvals.filter((n) => n.status === "ready");

  return (
    <div className="space-y-6">
      {/* 1. First 15 Seconds Hero Summary */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 uppercase tracking-wider">
                Industrial Setup Profile
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {profile.stateOrRegion} • Illustrative Demonstration Ruleset
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {profile.companyName}
            </h2>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
              {profile.description}
            </p>
          </div>

          {/* Core Factory Physical Parameters */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-center">
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Category</span>
              <span className="text-xs font-black text-amber-700 uppercase">
                {profile.pollutionCategory}
              </span>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-center">
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Power Sanction</span>
              <span className="text-xs font-black text-slate-900">
                {profile.powerKva} kVA
              </span>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-center">
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Workforce</span>
              <span className="text-xs font-black text-slate-900">
                {profile.workforce} Staff
              </span>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-center">
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Factory Shed</span>
              <span className="text-xs font-black text-slate-900">
                {profile.builtUpAreaSqFt.toLocaleString()} sq.ft
              </span>
            </div>
          </div>
        </div>

        {/* Live Progress Bar & Roadmap CTA */}
        <div className="pt-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex-1 min-w-[240px]">
            <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
              <span className="text-slate-800 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Overall Clearance Progress: {engineState.readinessPercentage}% Complete
              </span>
              <span className="text-slate-500 font-mono text-[11px]">
                {engineState.completedCount} of {engineState.totalApplicable} Approvals Sanctioned
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
              <div
                className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                style={{ width: `${engineState.readinessPercentage}%` }}
              />
            </div>
          </div>

          <button
            onClick={() => setActiveTab("roadmap")}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 px-4 rounded-lg flex items-center gap-2 transition-all shadow-xs cursor-pointer shrink-0"
          >
            <span>Open Approval Roadmap (Hero View)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. The 4 Essential Answers for the Evaluator */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Answer 1: What does my business need? */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              1. What does my factory need?
            </span>
            <div className="text-2xl font-black text-slate-900">
              {engineState.totalApplicable}{" "}
              <span className="text-xs font-normal text-slate-500">Approvals Identified</span>
            </div>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              Filtered specifically by statutory rules for your {profile.sectorLabel} unit.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              ✓ {engineState.completedCount} Done
            </span>
            <span className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              ⚡ {engineState.readyCount} Ready
            </span>
            <span className="text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              🔒 {engineState.blockedCount} Waiting
            </span>
          </div>
        </div>

        {/* Answer 2: What can I do right now? */}
        <div className="bg-white rounded-xl border border-blue-200 bg-blue-50/20 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider block mb-1">
              2. What can I do right now?
            </span>
            <div className="text-2xl font-black text-blue-700">
              {engineState.readyCount}{" "}
              <span className="text-xs font-normal text-slate-500">Ready to Start Today</span>
            </div>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              All required prerequisites are met. You can apply for all {engineState.readyCount} concurrently today!
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-blue-100">
            <button
              onClick={() => setActiveTab("actions")}
              className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1 transition-colors"
            >
              <span>See What Should I Do Next?</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Answer 3: What is blocking me? */}
        <div className="bg-white rounded-xl border border-amber-200 bg-amber-50/20 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">
                3. What is my main blocker?
              </span>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 border border-amber-300">
                Critical Path
              </span>
            </div>
            {engineState.criticalBottleneckNode ? (
              <div>
                <h4 className="text-sm font-bold text-slate-900 leading-snug line-clamp-1">
                  {engineState.criticalBottleneckNode.title}
                </h4>
                <div className="text-xs text-slate-600 mt-0.5 font-medium">
                  {engineState.criticalBottleneckNode.department} ({engineState.criticalBottleneckNode.slaDays}d SLA)
                </div>
                <div className="text-[11px] text-amber-950 bg-amber-100/70 border border-amber-300 rounded p-2 mt-2 leading-relaxed">
                  <strong>Completing this unlocks the next approval stage</strong> and advances {engineState.criticalBottleneckNode.unblocksApprovalTitles.length} downstream clearances.
                </div>
              </div>
            ) : (
              <div>
                <div className="text-sm font-bold text-emerald-700">No Blockers Remaining</div>
                <p className="text-xs text-slate-500 mt-1">All primary statutory clearances have been satisfied.</p>
              </div>
            )}
          </div>
          <div className="mt-4 pt-3 border-t border-amber-100">
            {engineState.criticalBottleneckNode && (
              <button
                onClick={() => selectApproval(engineState.criticalBottleneckNode!.id)}
                className="text-xs font-bold text-amber-900 hover:text-amber-950 flex items-center gap-1 transition-colors"
              >
                <span>Inspect Main Blocker Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Answer 4: Potential Calendar Savings from Parallel Processing */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                4. Parallel Processing Gain
              </span>
              <TrendingDown className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-emerald-700">
              {engineState.simulatedParallelSavings}{" "}
              <span className="text-xs font-normal text-slate-500">Days Potential Savings</span>
            </div>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              Potential calendar savings from concurrent processing vs. serial queuing.
            </p>
            <span className="text-[10px] text-slate-400 font-mono block mt-1">
              Calculated from illustrative demonstration ruleset.
            </span>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-mono text-slate-600 space-y-0.5">
            <div className="flex justify-between">
              <span>Remaining Calendar Days:</span>
              <strong className="text-slate-900">{engineState.remainingCriticalPathDays} days</strong>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>If queued one-by-one:</span>
              <span className="line-through">{engineState.remainingSerializedDays} days</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Section: "Ready to Start Today" */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              Ready to Start Today ({readyClearances.length} Approvals Actionable Now)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              These approvals have zero remaining prerequisites. You can initiate them right now!
            </p>
          </div>
          <button
            onClick={() => setActiveTab("actions")}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
          >
            View Full Action Queue &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {readyClearances.map((node) => {
            const isMainBlocker = node.id === engineState.criticalBottleneckNode?.id;

            return (
              <div
                key={node.id}
                onClick={() => selectApproval(node.id)}
                className={`rounded-xl border p-4.5 flex flex-col justify-between transition-all cursor-pointer shadow-2xs ${
                  isMainBlocker
                    ? "bg-amber-50/60 border-amber-300 ring-1 ring-amber-300/80"
                    : "bg-blue-50/40 border-blue-200 hover:border-blue-300"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-800">
                      {node.code}
                    </span>
                    {isMainBlocker ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-white flex items-center gap-1 shadow-2xs">
                        <Sparkles className="w-2.5 h-2.5" />
                        MAIN BLOCKER
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-300">
                        CAN RUN IN PARALLEL
                      </span>
                    )}
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 leading-snug">
                    {node.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1 font-medium">
                    {node.department}
                  </p>

                  <div className="mt-3 bg-white/90 border border-slate-200/80 rounded-lg p-2.5 text-xs text-slate-700">
                    <span className="font-bold text-slate-900 block text-[10px] uppercase mb-0.5">
                      Why can I start this today?
                    </span>
                    {isMainBlocker ? (
                      <span className="text-amber-950 font-medium leading-relaxed block">
                        Plot verification is complete. Completing this unlocks <strong>Consent to Operate</strong> and advances the entire project schedule.
                      </span>
                    ) : (
                      <span className="text-blue-950 font-medium leading-relaxed block">
                        Prerequisites are clear. This runs concurrently with your other approvals to eliminate idle waiting days.
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {node.slaDays} Days SLA
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      simulateClearance(node.id);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-1.5 px-3 rounded-lg flex items-center gap-1 transition-colors shadow-2xs cursor-pointer"
                  >
                    <span>Mark as Completed</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

"use client";

import React from "react";
import { useCompliance } from "../context/ComplianceContext";
import { DEMO_PROFILES } from "../data/demonstrationDataset";
import { Factory, RefreshCw } from "lucide-react";

export const Header: React.FC = () => {
  const { profile, setProfileById, resetDemo } = useCompliance();

  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-30 shadow-xs">
      {/* Top Banner with Clear Scope & Prototype Disclaimer */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-white tracking-wide flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            SIH 2026 (PS SIH26130):
          </span>
          <span className="text-slate-300">
            Industrial Approvals, Compliance & Dependency Intelligence Platform
          </span>
        </div>
        <div className="flex items-center gap-3 text-slate-400 text-[11px]">
          <span className="text-slate-300 font-medium">Demonstration Mode (Illustrative Ruleset)</span>
          <span>•</span>
          <span className="text-emerald-400 font-mono">Deterministic Graph Engine</span>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3.5 flex flex-wrap items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-700 to-indigo-800 text-white flex items-center justify-center font-black text-lg shadow-sm tracking-wider">
            YS
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black tracking-tight text-slate-900">
                UDYOGSETU
              </h1>
              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 border border-blue-200">
                उद्योगसेतु
              </span>
            </div>
            <p className="text-xs text-slate-600 font-medium">
              Your industrial approval roadmap — generated from your factory profile.
            </p>
          </div>
        </div>

        {/* Factory Profile Picker & Reset */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg p-1">
            <span className="text-xs font-semibold text-slate-600 pl-2 pr-1 flex items-center gap-1.5">
              <Factory className="w-3.5 h-3.5 text-slate-400" />
              Factory Profile:
            </span>
            <select
              value={profile.id}
              onChange={(e) => setProfileById(e.target.value)}
              className="text-xs font-bold bg-white border border-slate-300 rounded-md py-1 px-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer shadow-2xs"
            >
              {DEMO_PROFILES.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.pollutionCategory.toUpperCase()} • {p.powerKva} kVA • {p.workforce} Staff)
                </option>
              ))}
            </select>
          </div>

          {/* Reset Demo Button */}
          <button
            onClick={resetDemo}
            title="Reset scenario back to original Apex baseline state"
            className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg py-1.5 px-3 transition-colors shadow-2xs cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>
    </header>
  );
};

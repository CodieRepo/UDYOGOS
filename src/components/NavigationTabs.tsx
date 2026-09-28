"use client";

import React from "react";
import { useCompliance } from "../context/ComplianceContext";
import { Compass, FileCheck2, FlaskConical, GitGraph, LayoutDashboard } from "lucide-react";

export const NavigationTabs: React.FC = () => {
  const { activeTab, setActiveTab, engineState } = useCompliance();

  const tabs = [
    {
      id: "overview" as const,
      label: "Overview",
      sublabel: "Where am I?",
      icon: LayoutDashboard,
      badge: `${engineState.readinessPercentage}% Complete`,
      badgeStyle: "bg-emerald-50 text-emerald-800 border-emerald-200"
    },
    {
      id: "roadmap" as const,
      label: "Approval Roadmap",
      sublabel: "What approvals do I need & what is waiting?",
      icon: GitGraph,
      badge: "DAG ENGINE",
      badgeStyle: "bg-blue-100 text-blue-900 border-blue-300 font-bold"
    },
    {
      id: "actions" as const,
      label: "What Should I Do Next?",
      sublabel: "What action should I take now?",
      icon: Compass,
      badge: `${engineState.readyCount} Ready Now`,
      badgeStyle: "bg-amber-100 text-amber-900 border-amber-300 font-bold"
    },
    {
      id: "documents" as const,
      label: "Document Readiness",
      sublabel: "Do I have what I need to apply?",
      icon: FileCheck2,
      badge: "8 Required Files",
      badgeStyle: "bg-slate-100 text-slate-700 border-slate-200"
    },
    {
      id: "whatif" as const,
      label: "What-If Lab",
      sublabel: "Simulate parameter changes & graph diff",
      icon: FlaskConical,
      badge: "INTELLIGENCE SHOWCASE",
      badgeStyle: "bg-purple-100 text-purple-900 border-purple-300 font-bold"
    }
  ];

  return (
    <div className="border-b border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 flex gap-1 sm:gap-2 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 py-3 px-3.5 sm:px-4 border-b-2 transition-all shrink-0 text-left cursor-pointer ${
                isActive
                  ? "border-blue-600 text-blue-900 bg-blue-50/60"
                  : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <div
                className={`p-1.5 rounded-lg shrink-0 ${
                  isActive ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500"
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold ${isActive ? "text-blue-950" : "text-slate-800"}`}>
                    {tab.label}
                  </span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${tab.badgeStyle}`}>
                    {tab.badge}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 font-medium hidden sm:block">
                  {tab.sublabel}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

"use client";

import React, { createContext, useContext, useMemo, useState } from "react";
import { DEMO_DOCUMENTS, DEMO_PROFILES, MASTER_APPROVAL_POOL } from "../data/demonstrationDataset";
import { runComplianceEngine } from "../engine/dependencyEngine";
import { ApprovalNode, EngineState, PlantProfile } from "../types/compliance";

export interface RecalculationEvent {
  nodeId: string;
  nodeTitle: string;
  nodeCode: string;
  wasCompleted: boolean;
  unlockedTitles: string[];
  advancedTitles: string[];
  remainingDaysBefore: number;
  remainingDaysAfter: number;
  newNextActionTitle: string;
  timestamp: number;
}

export type ActiveTab = "overview" | "roadmap" | "actions" | "documents" | "whatif";

interface ComplianceContextType {
  profile: PlantProfile;
  engineState: EngineState;
  selectedApproval: ApprovalNode | null;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  selectApproval: (nodeId: string | null) => void;
  simulateClearance: (nodeId: string) => void;
  resetDemo: () => void;
  setProfileById: (profileId: string) => void;
  updateDocumentStatus: (docId: string, isAvailable: boolean) => void;
  availableDocumentIds: Set<string>;
  lastEvent: RecalculationEvent | null;
  clearLastEvent: () => void;
  selectedDocId: string | null;
  setSelectedDocId: (id: string | null) => void;
}

const ComplianceContext = createContext<ComplianceContextType | undefined>(undefined);

export const ComplianceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Always initialize directly to Apex Precision Engineering (index 0)
  const [profileId, setProfileId] = useState<string>(DEMO_PROFILES[0].id);
  const [completedNodeIds, setCompletedNodeIds] = useState<Set<string>>(new Set(["node-1"]));
  const [inProgressNodeIds, setInProgressNodeIds] = useState<Set<string>>(new Set());
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>("overview");
  const [lastEvent, setLastEvent] = useState<RecalculationEvent | null>(null);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);

  // Document availability tracker
  const [availableDocIds, setAvailableDocIds] = useState<Set<string>>(
    new Set(DEMO_DOCUMENTS.filter(d => d.isAvailableDefault).map(d => d.id))
  );

  const profile = useMemo(() => {
    return DEMO_PROFILES.find(p => p.id === profileId) || DEMO_PROFILES[0];
  }, [profileId]);

  // Compute master engine state reactively
  const engineState = useMemo(() => {
    return runComplianceEngine(
      profile,
      MASTER_APPROVAL_POOL,
      DEMO_DOCUMENTS,
      completedNodeIds,
      inProgressNodeIds
    );
  }, [profile, completedNodeIds, inProgressNodeIds]);

  const selectedApproval = useMemo(() => {
    if (!selectedNodeId) return null;
    return engineState.approvals.find(n => n.id === selectedNodeId) || null;
  }, [selectedNodeId, engineState.approvals]);

  const selectApproval = (nodeId: string | null) => {
    setSelectedNodeId(nodeId);
  };

  const simulateClearance = (nodeId: string) => {
    const targetNode = engineState.approvals.find(n => n.id === nodeId);
    const wasAlreadyCompleted = completedNodeIds.has(nodeId);
    const daysBefore = engineState.remainingCriticalPathDays;

    let nextCompleted = new Set(completedNodeIds);
    if (wasAlreadyCompleted) {
      nextCompleted.delete(nodeId);
    } else {
      nextCompleted.add(nodeId);
    }

    // Compute preview of next state to capture exact cause-and-effect
    const nextEngineState = runComplianceEngine(
      profile,
      MASTER_APPROVAL_POOL,
      DEMO_DOCUMENTS,
      nextCompleted,
      inProgressNodeIds
    );

    const unlockedTitles: string[] = [];
    const advancedTitles: string[] = [];

    if (!wasAlreadyCompleted && targetNode) {
      for (const nextNode of nextEngineState.approvals) {
        const prevNode = engineState.approvals.find(n => n.id === nextNode.id);
        if (prevNode && prevNode.status === "blocked" && nextNode.status === "ready") {
          unlockedTitles.push(nextNode.title);
        } else if (
          prevNode &&
          prevNode.status === "blocked" &&
          nextNode.status === "blocked" &&
          prevNode.blockedByApprovalTitles.length > nextNode.blockedByApprovalTitles.length
        ) {
          advancedTitles.push(nextNode.title);
        }
      }

      const nextTopAction = nextEngineState.nextBestActions[0]?.title || "All clearances complete";

      setLastEvent({
        nodeId,
        nodeTitle: targetNode.title,
        nodeCode: targetNode.code,
        wasCompleted: true,
        unlockedTitles,
        advancedTitles,
        remainingDaysBefore: daysBefore,
        remainingDaysAfter: nextEngineState.remainingCriticalPathDays,
        newNextActionTitle: nextTopAction,
        timestamp: Date.now()
      });
    } else {
      setLastEvent(null);
    }

    setCompletedNodeIds(nextCompleted);
    setInProgressNodeIds(prev => {
      const next = new Set(prev);
      next.delete(nodeId);
      return next;
    });
  };

  const clearLastEvent = () => setLastEvent(null);

  // Reset Demo always resets to Apex Precision Engineering baseline
  const resetDemo = () => {
    setProfileId(DEMO_PROFILES[0].id);
    setCompletedNodeIds(new Set(["node-1"]));
    setInProgressNodeIds(new Set());
    setSelectedNodeId(null);
    setSelectedDocId(null);
    setAvailableDocIds(new Set(DEMO_DOCUMENTS.filter(d => d.isAvailableDefault).map(d => d.id)));
    setLastEvent(null);
    setActiveTab("overview");
  };

  const setProfileById = (id: string) => {
    setProfileId(id);
    setCompletedNodeIds(new Set(["node-1"]));
    setInProgressNodeIds(new Set());
    setSelectedNodeId(null);
    setSelectedDocId(null);
    setLastEvent(null);
  };

  const updateDocumentStatus = (docId: string, isAvailable: boolean) => {
    setAvailableDocIds(prev => {
      const next = new Set(prev);
      if (isAvailable) {
        next.add(docId);
      } else {
        next.delete(docId);
      }
      return next;
    });
  };

  return (
    <ComplianceContext.Provider
      value={{
        profile,
        engineState,
        selectedApproval,
        activeTab,
        setActiveTab,
        selectApproval,
        simulateClearance,
        resetDemo,
        setProfileById,
        updateDocumentStatus,
        availableDocumentIds: availableDocIds,
        lastEvent,
        clearLastEvent,
        selectedDocId,
        setSelectedDocId
      }}
    >
      {children}
    </ComplianceContext.Provider>
  );
};

export const useCompliance = (): ComplianceContextType => {
  const context = useContext(ComplianceContext);
  if (!context) {
    throw new Error("useCompliance must be used within a ComplianceProvider");
  }
  return context;
};

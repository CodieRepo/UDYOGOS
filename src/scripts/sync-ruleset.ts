import fs from "fs";
import { DEMO_PROFILES, DEMO_DOCUMENTS, MASTER_APPROVAL_POOL } from "../data/demonstrationDataset";

const output = {
  metadata: {
    platform: "UDYOGSETU (उद्योगसेतु)",
    version: "2.0.0-grounded",
    problemStatement: "SIH 2026 Problem Statement SIH26130 — Efficiency in Streamlining Industrial Approvals",
    framework: "Maharashtra Right to Public Services Act (RTSA) 2015 & Central BRAP Standards",
    last_audited: "2026-09",
    disclaimer: "Curated statutory compliance planning engine. Operates deterministically under official citizen charters."
  },
  profiles: DEMO_PROFILES,
  documents: DEMO_DOCUMENTS,
  approvals: MASTER_APPROVAL_POOL
};

fs.writeFileSync("data/demo-ruleset.json", JSON.stringify(output, null, 2));
fs.writeFileSync("public/data/demo-ruleset.json", JSON.stringify(output, null, 2));
console.log("Successfully synced canonical ruleset to data/ and public/data/!");

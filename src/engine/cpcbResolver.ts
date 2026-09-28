import cpcbData from "../../data/cpcb-sectors.json";
import { CpcbSectorEntry, PollutionCategory } from "../types/compliance";

export interface CpcbSearchResult {
  sector: CpcbSectorEntry;
  matchScore: number;
  matchedOn: string;
}

const SECTOR_POOL: CpcbSectorEntry[] = cpcbData.sectors as CpcbSectorEntry[];

/**
 * Deterministic keyword search across the CPCB industrial classification compendium.
 * Zero-LLM, instant client-side resolution.
 */
export function searchCpcbSectors(query: string): CpcbSearchResult[] {
  if (!query || query.trim().length === 0) {
    return SECTOR_POOL.slice(0, 6).map((sector) => ({
      sector,
      matchScore: 1,
      matchedOn: "Default CPCB Catalogue"
    }));
  }

  const cleanQuery = query.toLowerCase().trim();
  const queryTokens = cleanQuery.split(/\s+/).filter((t) => t.length > 1);

  const results: CpcbSearchResult[] = [];

  for (const sector of SECTOR_POOL) {
    let score = 0;
    let matchReason = "";

    const nameLower = sector.sector_name.toLowerCase();
    const descLower = sector.description.toLowerCase();

    // Exact title match
    if (nameLower.includes(cleanQuery)) {
      score += 100;
      matchReason = `Title matches "${cleanQuery}"`;
    }

    // Token title matches
    for (const token of queryTokens) {
      if (nameLower.includes(token)) {
        score += 30;
        if (!matchReason) matchReason = `Title contains "${token}"`;
      }
    }

    // Keyword array matches
    for (const kw of sector.keywords) {
      const kwLower = kw.toLowerCase();
      if (cleanQuery.includes(kwLower) || kwLower.includes(cleanQuery)) {
        score += 40;
        if (!matchReason) matchReason = `Statutory keyword "${kw}" matches`;
      }
      for (const token of queryTokens) {
        if (kwLower === token) {
          score += 25;
          if (!matchReason) matchReason = `Keyword "${kw}" matches`;
        }
      }
    }

    // Description text matches
    if (descLower.includes(cleanQuery)) {
      score += 15;
      if (!matchReason) matchReason = `Process description matches`;
    }

    if (score > 0) {
      results.push({
        sector,
        matchScore: score,
        matchedOn: matchReason
      });
    }
  }

  return results.sort((a, b) => b.matchScore - a.matchScore);
}

export function getCpcbSectorById(id: string): CpcbSectorEntry | undefined {
  return SECTOR_POOL.find((s) => s.id === id);
}

export function getAllCpcbSectors(): CpcbSectorEntry[] {
  return SECTOR_POOL;
}

import clusterData from "../../data/industrial-clusters.json";
import { IndustrialCluster } from "../types/compliance";

const CLUSTER_POOL: IndustrialCluster[] = clusterData.clusters as IndustrialCluster[];

export function getAllIndustrialClusters(): IndustrialCluster[] {
  return CLUSTER_POOL;
}

export function getAvailableDistricts(): string[] {
  const set = new Set<string>();
  for (const c of CLUSTER_POOL) {
    set.add(c.district);
  }
  return Array.from(set).sort();
}

export function getClustersByDistrict(district: string): IndustrialCluster[] {
  return CLUSTER_POOL.filter((c) => c.district.toLowerCase() === district.toLowerCase());
}

export function getClusterById(id: string): IndustrialCluster | undefined {
  return CLUSTER_POOL.find((c) => c.id === id);
}

export function findClusterByName(name: string): IndustrialCluster | undefined {
  const clean = name.toLowerCase();
  return CLUSTER_POOL.find(
    (c) => c.industrial_estate.toLowerCase().includes(clean) || clean.includes(c.industrial_estate.toLowerCase())
  );
}

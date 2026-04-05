import fs from "fs";
import path from "path";

const pipelineOutput = path.join(
  process.cwd(),
  "..",
  "trend_pipeline",
  "output",
  "latest.json"
);

export interface TrendItem {
  source: string;
  rank: number;
  title: string;
  url: string;
  score: number;
  category?: string;
  tags: string[];
  fetched_at: string;
  board?: string;
}

export interface TrendsData {
  generated_at: string;
  week: string;
  total_items: number;
  sources: string[];
  top_50_cross_platform: TrendItem[];
  platform_rankings: Record<string, TrendItem[]>;
  category_summary: Record<string, number>;
}

export function getTrends(): TrendsData | null {
  try {
    const raw = fs.readFileSync(pipelineOutput, "utf8");
    return JSON.parse(raw) as TrendsData;
  } catch {
    return null;
  }
}

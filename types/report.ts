// types/report.ts
// Mirrors the Go backend's JSON response exactly.

export type RiskBucket = "red_zone" | "watch_list" | "manage_it" | "ignore";

export type RiskCategory =
  | "dependency"
  | "financial"
  | "operational"
  | "market"
  | "legal"
  | "technology"
  | "people"
  | "reputational";

export type UrgencyLevel = "immediate" | "this_week" | "this_month";

export interface Risk {
  id: string;
  name: string;
  description: string;
  category: RiskCategory;
  probabilityScore: number; // 1–10
  impactScore: number; // 1–10
  bucket: RiskBucket;
  hedgeAction: string;
  thirtyDayNote: string;
}

export interface TopAction {
  riskId: string;
  riskName: string;
  action: string;
  urgency: UrgencyLevel;
}

export interface HeatMapPoint {
  riskId: string;
  name: string;
  x: number; // 0–100, probability (left=low)
  y: number; // 0–100, impact (bottom=low)
  bucket: RiskBucket;
  category: RiskCategory;
}

export interface ReportData {
  sessionId: string;
  businessName?: string;
  generatedAt: string; // ISO date string
  executiveSummary: string;
  risks: Risk[];
  topActions: TopAction[];
  heatMapPoints: HeatMapPoint[];
}

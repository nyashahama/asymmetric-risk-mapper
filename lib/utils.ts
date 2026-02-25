// lib/utils.ts

import type { RiskBucket, RiskCategory, UrgencyLevel } from "@/types/report";

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

export const BUCKET_CONFIG: Record<
  RiskBucket,
  {
    label: string;
    shortLabel: string;
    color: string;
    bg: string;
    border: string;
  }
> = {
  red_zone: {
    label: "Red Zone",
    shortLabel: "HEDGE NOW",
    color: "#ef4444",
    bg: "rgba(239,68,68,0.07)",
    border: "rgba(239,68,68,0.25)",
  },
  watch_list: {
    label: "Watch List",
    shortLabel: "ON FIRE SLOWLY",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.07)",
    border: "rgba(245,158,11,0.25)",
  },
  manage_it: {
    label: "Manage It",
    shortLabel: "OPERATIONAL",
    color: "#3b82f6",
    bg: "rgba(59,130,246,0.07)",
    border: "rgba(59,130,246,0.2)",
  },
  ignore: {
    label: "Ignore For Now",
    shortLabel: "LOW PRIORITY",
    color: "#475569",
    bg: "rgba(71,85,105,0.07)",
    border: "rgba(71,85,105,0.2)",
  },
};

export const CATEGORY_CONFIG: Record<
  RiskCategory,
  { label: string; color: string }
> = {
  dependency: { label: "Dependency", color: "#a855f7" },
  financial: { label: "Financial", color: "#ec4899" },
  operational: { label: "Operational", color: "#f97316" },
  market: { label: "Market", color: "#84cc16" },
  legal: { label: "Legal", color: "#eab308" },
  technology: { label: "Technology", color: "#ef4444" },
  people: { label: "People", color: "#06b6d4" },
  reputational: { label: "Reputational", color: "#64748b" },
};

export const URGENCY_CONFIG: Record<
  UrgencyLevel,
  { label: string; color: string }
> = {
  immediate: { label: "Do today", color: "#ef4444" },
  this_week: { label: "This week", color: "#f59e0b" },
  this_month: { label: "This month", color: "#3b82f6" },
};

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(iso));
}

// Demo risks for landing page heat map — kept here so DemoHeatMap doesn't need config
export const DEMO_RISKS = [
  {
    id: 1,
    label: "Key person dependency",
    prob: 18,
    impact: 94,
    category: "people" as RiskCategory,
  },
  {
    id: 2,
    label: "Single supplier failure",
    prob: 12,
    impact: 89,
    category: "dependency" as RiskCategory,
  },
  {
    id: 3,
    label: "Data breach / hack",
    prob: 22,
    impact: 97,
    category: "technology" as RiskCategory,
  },
  {
    id: 4,
    label: "Cash runway < 3 months",
    prob: 35,
    impact: 100,
    category: "financial" as RiskCategory,
  },
  {
    id: 5,
    label: "Regulatory change",
    prob: 8,
    impact: 76,
    category: "legal" as RiskCategory,
  },
  {
    id: 6,
    label: "Top customer churns",
    prob: 41,
    impact: 71,
    category: "dependency" as RiskCategory,
  },
  {
    id: 7,
    label: "Competitor price war",
    prob: 55,
    impact: 48,
    category: "market" as RiskCategory,
  },
  {
    id: 8,
    label: "Team hiring lag",
    prob: 62,
    impact: 38,
    category: "operational" as RiskCategory,
  },
  {
    id: 9,
    label: "Bad press cycle",
    prob: 29,
    impact: 52,
    category: "reputational" as RiskCategory,
  },
  {
    id: 10,
    label: "IP dispute",
    prob: 6,
    impact: 88,
    category: "legal" as RiskCategory,
  },
] as const;

// components/report/RiskCard.tsx

import { Badge } from "@/components/ui/Badge";
import { BUCKET_CONFIG, CATEGORY_CONFIG } from "@/lib/utils";
import type { Risk } from "@/types/report";

interface RiskCardProps {
  risk: Risk;
}

export function RiskCard({ risk }: RiskCardProps) {
  const bucket = BUCKET_CONFIG[risk.bucket];
  const cat = CATEGORY_CONFIG[risk.category];

  return (
    <div
      style={{
        background: "#0f1419",
        border: "1px solid #1e293b",
        borderRadius: 8,
        padding: "22px 26px",
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      {/* Header row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", gap: 6 }}>
          <Badge color={bucket.color} bg={bucket.bg}>
            {bucket.shortLabel}
          </Badge>
          <Badge color={cat.color}>{cat.label}</Badge>
        </div>

        <div
          style={{
            display: "flex",
            gap: 10,
            fontSize: 11,
            color: "#334155",
          }}
        >
          <span>P:{risk.probabilityScore}</span>
          <span
            style={{
              color: risk.impactScore >= 7 ? "#ef4444" : "#334155",
            }}
          >
            I:{risk.impactScore}
          </span>
        </div>
      </div>

      {/* Name */}
      <h3
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 18,
          fontWeight: 700,
          color: "#f1f5f9",
          lineHeight: 1.3,
        }}
      >
        {risk.name}
      </h3>

      {/* Description */}
      <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.75 }}>
        {risk.description}
      </p>

      <hr style={{ border: "none", borderTop: "1px solid #1e293b" }} />

      {/* Hedge action */}
      <div>
        <p
          style={{
            fontSize: 9,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "#ef4444",
            marginBottom: 5,
          }}
        >
          Recommended action
        </p>
        <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.65 }}>
          {risk.hedgeAction}
        </p>
      </div>

      {/* 30-day note */}
      <div>
        <p
          style={{
            fontSize: 9,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "#3b82f6",
            marginBottom: 5,
          }}
        >
          In 30 days
        </p>
        <p style={{ fontSize: 12, color: "#334155", lineHeight: 1.65 }}>
          {risk.thirtyDayNote}
        </p>
      </div>
    </div>
  );
}

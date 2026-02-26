"use client";

import { ComputedRisk, TIER_CONFIG, RiskTier } from "@/lib/risks";

const TIER_ORDER: RiskTier[] = ["watch", "red", "manage", "ignore"];

interface RiskRowProps {
  risk: ComputedRisk;
}

function RiskRow({ risk }: RiskRowProps) {
  const cfg = TIER_CONFIG[risk.tier];

  return (
    <div
      className="risk-row"
      style={{
        display: "grid",
        gridTemplateColumns: "28px 1fr auto auto",
        gap: 12,
        alignItems: "start",
        padding: 16,
        marginBottom: 8,
        border: "1.5px solid rgba(14,14,14,0.1)",
        borderRadius: 2,
        background: cfg.bgDim,
        transition: "box-shadow 0.15s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "3px 3px 0 rgba(14,14,14,0.1)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
      }}
    >
      {/* Rank */}
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          color: "rgba(14,14,14,0.35)",
          paddingTop: 2,
        }}
      >
        #{risk.idx}
      </div>

      {/* Name + desc + hedge */}
      <div>
        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 3 }}>
          {risk.name}
        </div>
        <div
          style={{
            fontSize: 12,
            color: "rgba(14,14,14,0.55)",
            lineHeight: 1.55,
          }}
        >
          {risk.desc}
        </div>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            color: "var(--green)",
            marginTop: 6,
          }}
        >
          ▶ {risk.hedge}
        </div>
      </div>

      {/* P / I stats */}
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          textAlign: "right",
          whiteSpace: "nowrap",
        }}
      >
        <div style={{ fontSize: 13, fontWeight: 700 }}>{risk.p}/10</div>
        <div style={{ color: "rgba(14,14,14,0.35)", fontSize: 9 }}>Prob.</div>
        <div style={{ height: 8 }} />
        <div style={{ fontSize: 13, fontWeight: 700 }}>{risk.i}/10</div>
        <div style={{ color: "rgba(14,14,14,0.35)", fontSize: 9 }}>Impact</div>
      </div>

      {/* Score pill */}
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 9,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          padding: "3px 8px",
          borderRadius: 2,
          background: cfg.pillBg,
          color: cfg.pillColor,
          alignSelf: "start",
          marginTop: 2,
          whiteSpace: "nowrap",
        }}
      >
        Score {risk.score}
      </div>
    </div>
  );
}

interface RiskListProps {
  risks: ComputedRisk[];
}

export function RiskList({ risks }: RiskListProps) {
  return (
    <div>
      {TIER_ORDER.map((tier) => {
        const items = risks.filter((r) => r.tier === tier);
        if (!items.length) return null;

        const cfg = TIER_CONFIG[tier];

        return (
          <div key={tier} style={{ marginBottom: 32 }}>
            {/* Tier header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 16,
                paddingBottom: 8,
                borderBottom: `1.5px solid ${cfg.color}`,
                color: cfg.color,
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 9,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  padding: "4px 10px",
                  borderRadius: 2,
                  background: cfg.pillBg,
                  color: cfg.pillColor,
                }}
              >
                {cfg.label}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  opacity: 0.5,
                  marginLeft: "auto",
                }}
              >
                {items.length} risk{items.length > 1 ? "s" : ""}
              </div>
            </div>

            {/* Rows */}
            {items.map((risk) => (
              <RiskRow key={risk.id} risk={risk} />
            ))}
          </div>
        );
      })}
    </div>
  );
}

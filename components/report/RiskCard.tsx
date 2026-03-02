import { ComputedRisk, TIER_CONFIG, RiskTier } from "@/lib/risks";

const THIRTY_DAY_PLANS: Record<RiskTier, string> = {
  red: "Schedule a 2-hour working session to document the specific scenario. Identify the single most impactful action you could take to reduce exposure. Start that action this week — don't plan to plan.",
  watch:
    "This is on fire, slowly. Set a 90-day deadline with a specific owner. Check in monthly. If it's not trending better, escalate your response.",
  manage:
    "Add to your quarterly operating review. Assign an owner. A 30-minute process improvement session will likely surface an easy fix.",
  ignore:
    "Note it, calendar a check-in in 6 months, and move on. Your attention is better spent elsewhere.",
};

interface Props {
  risk: ComputedRisk;
  rank: number;
}

export function RiskCard({ risk, rank }: Props) {
  const cfg = TIER_CONFIG[risk.tier];
  return (
    <div
      style={{
        background: cfg.bgDim,
        border: "1.5px solid rgba(14,14,14,0.09)",
        borderLeft: `4px solid ${cfg.color}`,
        borderRadius: "0 2px 2px 0",
        padding: "24px 24px 20px",
        marginBottom: 12,
        transition: "box-shadow 0.15s",
      }}
      onMouseEnter={(e) =>
        ((e.currentTarget as HTMLDivElement).style.boxShadow =
          "3px 3px 0 rgba(14,14,14,0.08)")
      }
      onMouseLeave={(e) =>
        ((e.currentTarget as HTMLDivElement).style.boxShadow = "none")
      }
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 12,
          marginBottom: 8,
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              color: "rgba(14,14,14,0.3)",
              flexShrink: 0,
            }}
          >
            #{rank}
          </span>
          <h3 style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.3 }}>
            {risk.name}
          </h3>
        </div>
        <div
          style={{
            display: "flex",
            gap: 8,
            flexShrink: 0,
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 9,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              padding: "3px 9px",
              borderRadius: 2,
              background: cfg.pillBg,
              color: cfg.pillColor,
              whiteSpace: "nowrap",
            }}
          >
            {cfg.label.split(" — ")[0]}
          </div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              color: "rgba(14,14,14,0.4)",
              whiteSpace: "nowrap",
            }}
          >
            P:{risk.p} · I:{risk.i}
          </div>
        </div>
      </div>

      <p
        style={{
          fontSize: 13,
          color: "rgba(14,14,14,0.6)",
          lineHeight: 1.6,
          marginBottom: 10,
        }}
      >
        {risk.desc}
      </p>

      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          color: "var(--green)",
          paddingTop: 10,
          borderTop: "1px solid rgba(14,14,14,0.07)",
        }}
      >
        ▶ {risk.hedge}
      </div>

      {rank <= 3 && (
        <div
          style={{
            marginTop: 10,
            padding: "10px 12px",
            background: "rgba(14,14,14,0.04)",
            borderRadius: 2,
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 9,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "rgba(14,14,14,0.35)",
              marginBottom: 4,
            }}
          >
            What acting on this looks like in 30 days
          </div>
          <div
            style={{
              fontSize: 12,
              color: "rgba(14,14,14,0.55)",
              lineHeight: 1.55,
            }}
          >
            {THIRTY_DAY_PLANS[risk.tier]}
          </div>
        </div>
      )}
    </div>
  );
}

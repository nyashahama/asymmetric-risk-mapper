import { ComputedRisk, TIER_CONFIG, RiskTier } from "@/lib/risks";
import { RiskCard } from "./RiskCard";

const TIER_ORDER: RiskTier[] = ["red", "watch", "manage", "ignore"];

interface Props {
  risks: ComputedRisk[];
}

export function RiskRegister({ risks }: Props) {
  return (
    <div style={{ marginBottom: 48 }}>
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 9,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "rgba(14,14,14,0.35)",
          marginBottom: 16,
        }}
      >
        Risk Register
      </div>

      {TIER_ORDER.map((tier) => {
        const items = risks.filter((r) => r.tier === tier);
        if (!items.length) return null;
        const cfg = TIER_CONFIG[tier];
        return (
          <div key={tier} style={{ marginBottom: 32 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 14,
                paddingBottom: 8,
                borderBottom: `1.5px solid ${cfg.color}`,
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
                  color: cfg.color,
                  opacity: 0.7,
                }}
              >
                {cfg.sublabel}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  color: "rgba(14,14,14,0.3)",
                  marginLeft: "auto",
                }}
              >
                {items.length} risk{items.length > 1 ? "s" : ""}
              </div>
            </div>
            {items.map((risk) => (
              <RiskCard
                key={risk.id}
                risk={risk}
                rank={risks.indexOf(risk) + 1}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}

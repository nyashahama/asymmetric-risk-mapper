import { ComputedRisk, TIER_CONFIG } from "@/lib/risks";

interface Props {
  risk: ComputedRisk;
  idx: number;
}

export function BlurredRiskRow({ risk, idx }: Props) {
  const cfg = TIER_CONFIG[risk.tier];
  const isLocked = idx > 1;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "28px 1fr auto",
        gap: 12,
        alignItems: "start",
        padding: "16px",
        border: "1.5px solid rgba(14,14,14,0.08)",
        borderRadius: 2,
        background: cfg.bgDim,
        marginBottom: 8,
        position: "relative",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          color: "rgba(14,14,14,0.3)",
          paddingTop: 3,
        }}
      >
        #{risk.idx}
      </div>

      <div
        style={{
          filter: isLocked ? "blur(5px)" : "none",
          userSelect: isLocked ? "none" : "auto",
          transition: "filter 0.3s",
        }}
      >
        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 3 }}>
          {risk.name}
        </div>
        <div
          style={{ fontSize: 12, color: "rgba(14,14,14,0.5)", lineHeight: 1.5 }}
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
          whiteSpace: "nowrap",
          alignSelf: "start",
        }}
      >
        {cfg.label.split(" — ")[0]}
      </div>
    </div>
  );
}

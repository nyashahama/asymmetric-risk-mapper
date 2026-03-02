import { useState } from "react";
import {
  ComputedRisk,
  TIER_CONFIG,
  RiskTier,
  cellColor,
  toGridCell,
  toImpactRow,
} from "@/lib/risks";

const IMPACT_LABELS = ["Very High", "High", "Medium", "Low", "Very Low"];
const PROB_LABELS = ["Very Low", "Low", "Medium", "High", "Very High"];

interface Props {
  risks: ComputedRisk[];
}

export function HeatMap({ risks }: Props) {
  const [tooltip, setTooltip] = useState<{
    risk: ComputedRisk;
    x: number;
    y: number;
  } | null>(null);

  return (
    <div
      style={{
        background: "white",
        border: "2px solid var(--ink)",
        boxShadow: "5px 5px 0 var(--ink)",
        padding: 8,
        marginBottom: 40,
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "36px repeat(5, 1fr)",
          gridTemplateRows: "repeat(5, 1fr) 36px",
          gap: 0,
          aspectRatio: "6/6",
        }}
      >
        {[0, 1, 2, 3, 4].map((row) => (
          <>
            <div
              key={`y-${row}`}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                writingMode: "vertical-rl",
                transform: "rotate(180deg)",
                fontFamily: "var(--font-mono)",
                fontSize: 8,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "rgba(14,14,14,0.38)",
              }}
            >
              {IMPACT_LABELS[row]}
            </div>
            {[0, 1, 2, 3, 4].map((col) => {
              const dots = risks.filter(
                (r) => toGridCell(r.p) === col && toImpactRow(r.i) === row,
              );
              return (
                <div
                  key={`cell-${row}-${col}`}
                  style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: cellColor(row, col),
                    border: "1px solid rgba(14,14,14,0.06)",
                  }}
                >
                  {dots.map((risk, di) => {
                    const cfg = TIER_CONFIG[risk.tier];
                    return (
                      <div
                        key={risk.id}
                        onMouseEnter={(e) =>
                          setTooltip({ risk, x: e.clientX, y: e.clientY })
                        }
                        onMouseLeave={() => setTooltip(null)}
                        onMouseMove={(e) =>
                          setTooltip((t) =>
                            t ? { ...t, x: e.clientX, y: e.clientY } : null,
                          )
                        }
                        style={{
                          position: "absolute",
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          background: cfg.pillBg,
                          border: "2px solid white",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontFamily: "var(--font-mono)",
                          fontSize: 9,
                          fontWeight: 700,
                          color: "white",
                          left: `calc(50% + ${di * 22 - 14}px)`,
                          top: "calc(50% - 14px)",
                          zIndex: 2 + di,
                          cursor: "default",
                          transition: "transform 0.15s",
                        }}
                        onMouseOver={(e) => {
                          (e.currentTarget as HTMLDivElement).style.transform =
                            "scale(1.2)";
                          (e.currentTarget as HTMLDivElement).style.zIndex =
                            "20";
                        }}
                        onMouseOut={(e) => {
                          (e.currentTarget as HTMLDivElement).style.transform =
                            "scale(1)";
                          (e.currentTarget as HTMLDivElement).style.zIndex =
                            String(2 + di);
                        }}
                      >
                        {risk.idx}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </>
        ))}
        <div />
        {PROB_LABELS.map((l) => (
          <div
            key={l}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--font-mono)",
              fontSize: 8,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "rgba(14,14,14,0.38)",
              textAlign: "center",
              lineHeight: 1.2,
            }}
          >
            {l}
          </div>
        ))}
      </div>

      {/* Axis labels */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "6px 8px 2px",
          fontFamily: "var(--font-mono)",
          fontSize: 9,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "rgba(14,14,14,0.3)",
        }}
      >
        <span>↑ Impact</span>
        <span>Probability →</span>
      </div>

      {/* Legend */}
      <div
        style={{
          display: "flex",
          gap: 16,
          padding: "8px 8px 4px",
          flexWrap: "wrap",
        }}
      >
        {(
          Object.entries(TIER_CONFIG) as [
            RiskTier,
            (typeof TIER_CONFIG)[RiskTier],
          ][]
        ).map(([key, cfg]) => (
          <div
            key={key}
            style={{ display: "flex", alignItems: "center", gap: 6 }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: cfg.pillBg,
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 9,
                color: cfg.color,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              {key}
            </span>
          </div>
        ))}
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          style={{
            position: "fixed",
            left: tooltip.x + 14,
            top: tooltip.y - 8,
            zIndex: 999,
            background: "var(--ink)",
            color: "var(--paper)",
            padding: "10px 14px",
            borderRadius: 2,
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            maxWidth: 240,
            lineHeight: 1.5,
            boxShadow: "3px 3px 0 rgba(14,14,14,0.25)",
            pointerEvents: "none",
          }}
        >
          <div style={{ fontWeight: 700, fontSize: 12, marginBottom: 4 }}>
            {tooltip.risk.name}
          </div>
          <div style={{ color: "rgba(244,240,232,0.55)", fontSize: 10 }}>
            P: {tooltip.risk.p}/10 · Impact: {tooltip.risk.i}/10 · Score:{" "}
            {tooltip.risk.score}
          </div>
        </div>
      )}
    </div>
  );
}

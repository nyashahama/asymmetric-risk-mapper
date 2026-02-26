"use client";

import { useState } from "react";
import {
  ComputedRisk,
  TIER_CONFIG,
  cellColor,
  toGridCell,
  toImpactRow,
} from "@/lib/risks";

interface TooltipState {
  risk: ComputedRisk;
  x: number;
  y: number;
}

const IMPACT_LABELS = ["Very High", "High", "Medium", "Low", "Very Low"];
const PROB_LABELS = ["Very Low", "Low", "Medium", "High", "Very High"];

interface HeatMapProps {
  risks: ComputedRisk[];
}

export function HeatMap({ risks }: HeatMapProps) {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  return (
    <div
      style={{
        background: "white",
        border: "2px solid var(--ink)",
        boxShadow: "5px 5px 0 var(--ink)",
        padding: 8,
        marginBottom: 32,
      }}
    >
      {/* Grid: 6 cols (label + 5 data), 6 rows (5 data + label) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "36px repeat(5, 1fr)",
          gridTemplateRows: "repeat(5, 1fr) 36px",
          gap: 0,
          aspectRatio: "6/6",
        }}
      >
        {/* Data rows */}
        {[0, 1, 2, 3, 4].map((row) => (
          <>
            {/* Y-axis label */}
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

            {/* Data cells */}
            {[0, 1, 2, 3, 4].map((col) => {
              const dotsHere = risks.filter(
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
                  {dotsHere.map((risk, di) => {
                    const cfg = TIER_CONFIG[risk.tier];
                    return (
                      <div
                        key={risk.id}
                        title={risk.name}
                        onMouseEnter={(e) =>
                          setTooltip({
                            risk,
                            x: e.clientX,
                            y: e.clientY,
                          })
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
                          boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontFamily: "var(--font-mono)",
                          fontSize: 9,
                          fontWeight: 700,
                          color: "white",
                          cursor: "default",
                          zIndex: 2 + di,
                          left: `calc(50% + ${di * 22 - 14}px)`,
                          top: "calc(50% - 14px)",
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
        {/* X-axis labels row */}
        <div /> {/* empty corner */}
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

      {/* Axis titles */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "8px 8px 2px",
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
          padding: "10px 8px 4px",
          flexWrap: "wrap",
        }}
      >
        {(
          Object.entries(TIER_CONFIG) as [
            string,
            (typeof TIER_CONFIG)[keyof typeof TIER_CONFIG],
          ][]
        ).map(([key, cfg]) => (
          <div
            key={key}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              color: cfg.color,
            }}
          >
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                background: cfg.pillBg,
              }}
            />
            {key.toUpperCase()}
          </div>
        ))}
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="heatmap-tooltip"
          style={{ left: tooltip.x + 16, top: tooltip.y - 10 }}
        >
          <div style={{ fontWeight: 700, fontSize: 12, marginBottom: 4 }}>
            {tooltip.risk.name}
          </div>
          <div style={{ color: "rgba(244,240,232,0.6)", fontSize: 10 }}>
            Probability: {tooltip.risk.p}/10 · Impact: {tooltip.risk.i}/10
          </div>
          <div style={{ color: "rgba(244,240,232,0.6)", fontSize: 10 }}>
            Score: {tooltip.risk.score} · {tooltip.risk.tier.toUpperCase()}
          </div>
        </div>
      )}
    </div>
  );
}

// components/report/HeatMap.tsx
"use client";

import { useState } from "react";
import { BUCKET_CONFIG, CATEGORY_CONFIG } from "@/lib/utils";
import type { HeatMapPoint, RiskBucket } from "@/types/report";

interface HeatMapProps {
  points: HeatMapPoint[];
}

export function HeatMap({ points }: HeatMapProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  const buckets: RiskBucket[] = [
    "red_zone",
    "watch_list",
    "manage_it",
    "ignore",
  ];

  return (
    <section>
      <p
        style={{
          fontSize: 10,
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          color: "#334155",
          marginBottom: 16,
        }}
      >
        Risk Heat Map
      </p>

      <div
        style={{
          background: "#0f1419",
          border: "1px solid #1e293b",
          borderRadius: 8,
          padding: 20,
          maxWidth: 540,
          aspectRatio: "1 / 1",
        }}
      >
        <svg
          viewBox="0 0 100 100"
          style={{ width: "100%", height: "100%", overflow: "visible" }}
          preserveAspectRatio="none"
        >
          {/* Quadrant fills */}
          <rect
            x="0"
            y="0"
            width="50"
            height="50"
            fill="rgba(239,68,68,0.04)"
          />
          <rect
            x="50"
            y="0"
            width="50"
            height="50"
            fill="rgba(245,158,11,0.04)"
          />
          <rect
            x="0"
            y="50"
            width="50"
            height="50"
            fill="rgba(71,85,105,0.03)"
          />
          <rect
            x="50"
            y="50"
            width="50"
            height="50"
            fill="rgba(59,130,246,0.04)"
          />

          {/* Dividers */}
          <line
            x1="50"
            y1="0"
            x2="50"
            y2="100"
            stroke="#1e293b"
            strokeWidth="0.5"
          />
          <line
            x1="0"
            y1="50"
            x2="100"
            y2="50"
            stroke="#1e293b"
            strokeWidth="0.5"
          />

          {/* Quadrant labels */}
          <text
            x="2"
            y="7"
            fill="#ef4444"
            fontSize="3.2"
            opacity="0.6"
            fontFamily="monospace"
          >
            RED ZONE
          </text>
          <text
            x="52"
            y="7"
            fill="#f59e0b"
            fontSize="3.2"
            opacity="0.6"
            fontFamily="monospace"
          >
            WATCH LIST
          </text>
          <text
            x="2"
            y="98"
            fill="#334155"
            fontSize="3.2"
            opacity="0.6"
            fontFamily="monospace"
          >
            IGNORE
          </text>
          <text
            x="52"
            y="98"
            fill="#3b82f6"
            fontSize="3.2"
            opacity="0.6"
            fontFamily="monospace"
          >
            MANAGE IT
          </text>

          {/* Axis labels */}
          <text
            x="50"
            y="104.5"
            fill="#1e293b"
            fontSize="2.8"
            textAnchor="middle"
            fontFamily="monospace"
          >
            PROBABILITY →
          </text>

          {/* Risk dots */}
          {points.map((pt) => {
            const cx = pt.x;
            const cy = 100 - pt.y; // Invert Y for SVG (high impact = top)
            const catColor = CATEGORY_CONFIG[pt.category].color;
            const bucketColor = BUCKET_CONFIG[pt.bucket].color;
            const isHov = hovered === pt.riskId;
            const isExist =
              pt.bucket === "red_zone" || pt.bucket === "watch_list";
            const probScore = Math.round((pt.x / 100) * 9 + 1);
            const impactScore = Math.round((pt.y / 100) * 9 + 1);

            return (
              <g
                key={pt.riskId}
                style={{ cursor: "pointer" }}
                onMouseEnter={() => setHovered(pt.riskId)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Glow ring for existential risks */}
                {isExist && (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isHov ? "5" : "3.8"}
                    fill={bucketColor}
                    opacity="0.12"
                    style={{ transition: "r 0.2s ease" }}
                  />
                )}

                {/* Main dot */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={isHov ? "2.2" : "1.7"}
                  fill={catColor}
                  opacity={isHov ? 1 : 0.85}
                  style={{ transition: "r 0.2s ease, opacity 0.2s ease" }}
                />

                {/* Tooltip */}
                {isHov && (
                  <foreignObject
                    x={pt.x > 65 ? `${cx - 29}%` : `${cx + 3}%`}
                    y={pt.y > 65 ? `${cy + 3}%` : `${cy - 13}%`}
                    width="27%"
                    height="11%"
                  >
                    <div
                      style={{
                        background: "rgba(8,10,13,0.97)",
                        border: `1px solid ${catColor}`,
                        borderRadius: 3,
                        padding: "4px 8px",
                        fontFamily: "monospace",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <div
                        style={{
                          color: catColor,
                          fontWeight: 700,
                          fontSize: 11,
                          marginBottom: 2,
                        }}
                      >
                        {pt.name}
                      </div>
                      <div style={{ color: "#475569", fontSize: 10 }}>
                        P: {probScore} · I: {impactScore}
                      </div>
                    </div>
                  </foreignObject>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div
        style={{
          display: "flex",
          gap: 24,
          marginTop: 16,
          flexWrap: "wrap",
        }}
      >
        {buckets.map((bucket) => {
          const cfg = BUCKET_CONFIG[bucket];
          const count = points.filter((p) => p.bucket === bucket).length;
          return (
            <div
              key={bucket}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: 12,
              }}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: cfg.color,
                  flexShrink: 0,
                }}
              />
              <span style={{ color: cfg.color }}>{cfg.label}</span>
              <span style={{ color: "#334155" }}>{count}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// components/landing/DemoHeatMap.tsx
"use client";

import { useState } from "react";
import { CATEGORY_CONFIG, DEMO_RISKS } from "@/lib/utils";

export function DemoHeatMap() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div
      style={{
        background: "#0f1419",
        border: "1px solid #1e293b",
        borderRadius: 8,
        padding: 20,
        aspectRatio: "1 / 1",
        width: "100%",
        maxWidth: 520,
      }}
    >
      <style>{`
        @keyframes dotFade {
          from { opacity: 0; transform: scale(0.4); }
          to   { opacity: 1; transform: scale(1); }
        }
        .demo-dot { animation: dotFade 0.6s ease forwards; opacity: 0; }
      `}</style>

      <svg
        viewBox="0 0 100 100"
        style={{ width: "100%", height: "100%", overflow: "visible" }}
        preserveAspectRatio="none"
      >
        {/* Quadrant fills */}
        <rect x="0" y="0" width="50" height="50" fill="rgba(239,68,68,0.04)" />
        <rect
          x="50"
          y="0"
          width="50"
          height="50"
          fill="rgba(245,158,11,0.04)"
        />
        <rect x="0" y="50" width="50" height="50" fill="rgba(71,85,105,0.03)" />
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
          opacity="0.5"
          fontFamily="monospace"
        >
          RED ZONE
        </text>
        <text
          x="52"
          y="7"
          fill="#f59e0b"
          fontSize="3.2"
          opacity="0.5"
          fontFamily="monospace"
        >
          WATCH LIST
        </text>
        <text
          x="2"
          y="98"
          fill="#334155"
          fontSize="3.2"
          opacity="0.5"
          fontFamily="monospace"
        >
          IGNORE
        </text>
        <text
          x="52"
          y="98"
          fill="#3b82f6"
          fontSize="3.2"
          opacity="0.5"
          fontFamily="monospace"
        >
          MANAGE IT
        </text>

        {/* Axis */}
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

        {/* Dots */}
        {DEMO_RISKS.map((risk, index) => {
          const x = (risk.prob / 100) * 85 + 7.5;
          const y = 100 - ((risk.impact / 100) * 85 + 7.5);
          const isExistential = risk.impact > 75 && risk.prob < 30;
          const color = CATEGORY_CONFIG[risk.category].color;
          const isHov = hovered === risk.id;

          return (
            <g
              key={risk.id}
              className="demo-dot"
              style={{
                cursor: "pointer",
                animationDelay: `${index * 100}ms`,
              }}
              onMouseEnter={() => setHovered(risk.id)}
              onMouseLeave={() => setHovered(null)}
            >
              {isExistential && (
                <circle
                  cx={`${x}%`}
                  cy={`${y}%`}
                  r={isHov ? "3.8%" : "2.8%"}
                  fill={color}
                  opacity="0.13"
                  style={{ transition: "r 0.2s ease" }}
                />
              )}
              <circle
                cx={`${x}%`}
                cy={`${y}%`}
                r={isHov ? "1.8%" : "1.3%"}
                fill={color}
                opacity={isHov ? 1 : 0.85}
                style={{ transition: "r 0.2s ease, opacity 0.2s ease" }}
              />
              {isHov && (
                <foreignObject
                  x={risk.prob > 65 ? `${x - 28}%` : `${x + 2}%`}
                  y={risk.impact > 75 ? `${y + 2}%` : `${y - 12}%`}
                  width="26%"
                  height="10%"
                >
                  <div
                    style={{
                      background: "rgba(8,10,13,0.96)",
                      border: `1px solid ${color}`,
                      borderRadius: 3,
                      padding: "4px 8px",
                      fontFamily: "monospace",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <div
                      style={{
                        color,
                        fontWeight: 700,
                        fontSize: 11,
                        marginBottom: 2,
                      }}
                    >
                      {risk.label}
                    </div>
                    <div style={{ color: "#475569", fontSize: 10 }}>
                      P: {risk.prob}% · I: {risk.impact}%
                    </div>
                  </div>
                </foreignObject>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

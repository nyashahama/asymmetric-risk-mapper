// components/landing/RankedOutput.tsx
"use client";

import { useState } from "react";

// Shared category color map (subset matching the demo)
const CATEGORY_COLORS: Record<string, string> = {
  people: "#06b6d4",
  dependency: "#a855f7",
  technology: "#ef4444",
  financial: "#ec4899",
  legal: "#eab308",
  market: "#84cc16",
  operational: "#f97316",
  reputational: "#64748b",
};

const RISKS = [
  {
    id: 1,
    label: "Cash runway < 3 months",
    prob: 35,
    impact: 100,
    category: "financial",
  },
  {
    id: 2,
    label: "Data breach / hack",
    prob: 22,
    impact: 97,
    category: "technology",
  },
  {
    id: 3,
    label: "Key person dependency",
    prob: 18,
    impact: 94,
    category: "people",
  },
  {
    id: 4,
    label: "Single supplier failure",
    prob: 12,
    impact: 89,
    category: "dependency",
  },
  { id: 5, label: "IP dispute", prob: 6, impact: 88, category: "legal" },
  { id: 6, label: "Regulatory change", prob: 8, impact: 76, category: "legal" },
  {
    id: 7,
    label: "Top customer churns",
    prob: 41,
    impact: 71,
    category: "dependency",
  },
] as const;

// Sort by asymmetric score: low prob × high impact first
const sorted = [...RISKS]
  .sort((a, b) => (100 - a.prob) * a.impact - (100 - b.prob) * b.impact)
  .reverse();

function getPriority(risk: (typeof RISKS)[number], rank: number) {
  const isExistential = risk.impact > 75 && risk.prob < 30;
  if (isExistential) return { label: "HEDGE NOW", color: "#ef4444", dot: true };
  if (rank < 3) return { label: "MONITOR", color: "#f59e0b", dot: false };
  return { label: "LOW", color: "#334155", dot: false };
}

export function RankedOutput() {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  return (
    <section
      style={{
        background: "#0a0d11",
        borderTop: "1px solid #1e293b",
        borderBottom: "1px solid #1e293b",
        padding: "120px 60px",
      }}
    >
      <style>{`
        @keyframes rowSlide {
          from { opacity: 0; transform: translateX(-8px); }
          to   { opacity: 1; transform: translateX(0);    }
        }
        .output-row {
          animation: rowSlide 0.4s ease forwards;
          opacity: 0;
        }
      `}</style>

      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Section header */}
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <p
            style={{
              fontSize: 10,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "#475569",
              marginBottom: 16,
              fontFamily: "'DM Mono', monospace",
            }}
          >
            The output
          </p>
          <h2
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(36px, 4vw, 56px)",
              lineHeight: 1.1,
              fontWeight: 700,
              color: "#f1f5f9",
            }}
          >
            Not a 40-page report.
            <br />
            <em style={{ fontWeight: 400, color: "#94a3b8" }}>
              A ranked hit list.
            </em>
          </h2>
          <p
            style={{
              marginTop: 20,
              fontSize: 13,
              color: "#475569",
              fontFamily: "'DM Mono', monospace",
              lineHeight: 1.8,
              maxWidth: 480,
              margin: "20px auto 0",
            }}
          >
            Every risk scored, sorted, and labelled. The ones that could end
            your company float to the top — with a specific hedge action for
            each.
          </p>
        </div>

        {/* Table */}
        <div
          style={{
            maxWidth: 860,
            margin: "0 auto",
            border: "1px solid #1e293b",
            borderRadius: 12,
            overflow: "hidden",
            boxShadow: "0 40px 80px rgba(0,0,0,0.4)",
          }}
        >
          {/* Table header */}
          <div
            style={{
              padding: "0 28px",
              background: "#0d1117",
              borderBottom: "1px solid #1e293b",
              display: "grid",
              gridTemplateColumns: "36px 1fr 72px 72px 110px",
              gap: 16,
              height: 44,
              alignItems: "center",
            }}
          >
            {["#", "RISK", "PROB", "IMPACT", "PRIORITY"].map((h) => (
              <div
                key={h}
                style={{
                  fontSize: 9,
                  letterSpacing: "0.18em",
                  color: "#1e293b",
                  fontFamily: "'DM Mono', monospace",
                  textTransform: "uppercase",
                }}
              >
                {h}
              </div>
            ))}
          </div>

          {/* Rows */}
          {sorted.map((risk, i) => {
            const priority = getPriority(risk, i);
            const color = CATEGORY_COLORS[risk.category];
            const isHov = hoveredRow === risk.id;
            const isExist = priority.label === "HEDGE NOW";

            // Impact bar width (visual)
            const barW = `${risk.impact}%`;

            return (
              <div
                key={risk.id}
                className="output-row"
                onMouseEnter={() => setHoveredRow(risk.id)}
                onMouseLeave={() => setHoveredRow(null)}
                style={{
                  padding: "18px 28px",
                  borderBottom:
                    i < sorted.length - 1 ? "1px solid #1e293b" : "none",
                  display: "grid",
                  gridTemplateColumns: "36px 1fr 72px 72px 110px",
                  gap: 16,
                  alignItems: "center",
                  background: isHov
                    ? isExist
                      ? "rgba(239,68,68,0.04)"
                      : "rgba(255,255,255,0.015)"
                    : "transparent",
                  transition: "background 0.15s ease",
                  animationDelay: `${i * 80}ms`,
                  cursor: "default",
                }}
              >
                {/* Rank number */}
                <div
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontStyle: "italic",
                    fontSize: 22,
                    color: isExist ? "#ef444430" : "#1e293b",
                    fontWeight: 700,
                    lineHeight: 1,
                    transition: "color 0.15s ease",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>

                {/* Risk name + category tag */}
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 5 }}
                >
                  <span
                    style={{
                      fontSize: 13,
                      color: isHov ? "#f1f5f9" : "#e2e8f0",
                      transition: "color 0.15s ease",
                      lineHeight: 1.3,
                    }}
                  >
                    {risk.label}
                  </span>
                  <span
                    style={{
                      display: "inline-block",
                      fontSize: 9,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      padding: "2px 6px",
                      borderRadius: 3,
                      background: color + "18",
                      color,
                      alignSelf: "flex-start",
                      fontFamily: "'DM Mono', monospace",
                    }}
                  >
                    {risk.category}
                  </span>
                </div>

                {/* Probability */}
                <div
                  style={{
                    fontSize: 13,
                    color: "#475569",
                    fontFamily: "'DM Mono', monospace",
                  }}
                >
                  {risk.prob}%
                </div>

                {/* Impact — with micro bar */}
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 4 }}
                >
                  <span
                    style={{
                      fontSize: 13,
                      color: risk.impact > 75 ? "#ef4444" : "#475569",
                      fontWeight: risk.impact > 75 ? 500 : 400,
                      fontFamily: "'DM Mono', monospace",
                    }}
                  >
                    {risk.impact}%
                  </span>
                  {/* Mini bar */}
                  <div
                    style={{
                      height: 2,
                      background: "#1e293b",
                      borderRadius: 1,
                      overflow: "hidden",
                      width: "100%",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: barW,
                        background: risk.impact > 75 ? "#ef4444" : "#334155",
                        borderRadius: 1,
                        transition: "width 0.6s ease",
                        opacity: 0.7,
                      }}
                    />
                  </div>
                </div>

                {/* Priority badge */}
                <div>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 5,
                      fontSize: 9,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      padding: isExist ? "4px 9px" : "3px 8px",
                      borderRadius: 3,
                      background: priority.color + "15",
                      color: priority.color,
                      border: isExist
                        ? `1px solid ${priority.color}35`
                        : "none",
                      fontFamily: "'DM Mono', monospace",
                      boxShadow: isExist
                        ? `0 0 8px ${priority.color}18`
                        : "none",
                    }}
                  >
                    {priority.dot && (
                      <span
                        style={{
                          width: 4,
                          height: 4,
                          borderRadius: "50%",
                          background: priority.color,
                          flexShrink: 0,
                          animation: "statusBlink 1.8s ease-in-out infinite",
                        }}
                      />
                    )}
                    {priority.label}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Footer row */}
          <div
            style={{
              padding: "14px 28px",
              background: "#0d1117",
              borderTop: "1px solid #1e293b",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span
              style={{
                fontSize: 10,
                color: "#1e293b",
                fontFamily: "'DM Mono', monospace",
              }}
            >
              Sample output — your audit maps to your actual business
            </span>
            <a
              href="/assessment"
              style={{
                fontSize: 11,
                color: "#ef4444",
                textDecoration: "none",
                fontFamily: "'DM Mono', monospace",
                letterSpacing: "0.06em",
                opacity: 0.8,
                transition: "opacity 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.8")}
            >
              Get your list →
            </a>
          </div>
        </div>

        {/* Callout strip below table */}
        <div
          style={{
            maxWidth: 860,
            margin: "32px auto 0",
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 1,
            border: "1px solid #1e293b",
            borderRadius: 8,
            overflow: "hidden",
          }}
        >
          {[
            {
              label: "Existential risks",
              value: "4",
              note: "need a hedge",
              color: "#ef4444",
            },
            {
              label: "Watch-list risks",
              value: "3",
              note: "monitor monthly",
              color: "#f59e0b",
            },
            {
              label: "Avg. completion",
              value: "8 min",
              note: "to a clear picture",
              color: "#22c55e",
            },
          ].map(({ label, value, note, color }) => (
            <div
              key={label}
              style={{
                padding: "22px 24px",
                background: "#0d1117",
                display: "flex",
                flexDirection: "column",
                gap: 4,
              }}
            >
              <div
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 32,
                  fontStyle: "italic",
                  color,
                  lineHeight: 1,
                  fontWeight: 700,
                }}
              >
                {value}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "#475569",
                  fontFamily: "'DM Mono', monospace",
                }}
              >
                {label}
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: "#334155",
                  fontFamily: "'DM Mono', monospace",
                }}
              >
                {note}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

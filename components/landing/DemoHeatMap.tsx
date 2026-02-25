// components/landing/DemoHeatMap.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { CATEGORY_CONFIG, DEMO_RISKS } from "@/lib/utils";

// ─── internal types ───────────────────────────────────────────────
type Risk = (typeof DEMO_RISKS)[number];

// ─── helpers ──────────────────────────────────────────────────────
function toSvg(prob: number, impact: number) {
  // map 0-100 → [8, 92] so dots never hug the border
  const x = (prob / 100) * 84 + 8;
  const y = 100 - ((impact / 100) * 84 + 8);
  return { x, y };
}

const EXISTENTIAL_THRESHOLD = { impact: 75, prob: 30 };

function isExistential(r: Risk) {
  return (
    r.impact > EXISTENTIAL_THRESHOLD.impact &&
    r.prob < EXISTENTIAL_THRESHOLD.prob
  );
}

// ─── animated pulse ring (existential risks only) ─────────────────
function PulseRing({
  cx,
  cy,
  color,
}: {
  cx: number;
  cy: number;
  color: string;
}) {
  return (
    <>
      <circle
        cx={cx}
        cy={cy}
        r="5.5"
        fill="none"
        stroke={color}
        strokeWidth="0.4"
        opacity="0"
        style={{
          animation: "pulseRing1 2.8s ease-out infinite",
          transformOrigin: `${cx}% ${cy}%`,
        }}
      />
      <circle
        cx={cx}
        cy={cy}
        r="4"
        fill={color}
        opacity="0.12"
        style={{
          animation: "pulseGlow 2.8s ease-in-out infinite",
          transformOrigin: `${cx}% ${cy}%`,
        }}
      />
    </>
  );
}

// ─── tooltip ─────────────────────────────────────────────────────
function Tooltip({
  risk,
  x,
  y,
  color,
}: {
  risk: Risk;
  x: number;
  y: number;
  color: string;
}) {
  const flipX = x > 68;
  const flipY = y < 20;

  return (
    <foreignObject
      x={`${flipX ? x - 30 : x + 2.5}%`}
      y={`${flipY ? y + 2 : y - 14}%`}
      width="28%"
      height="13%"
      style={{ pointerEvents: "none", overflow: "visible" }}
    >
      <div
        style={{
          background: "rgba(6,8,12,0.97)",
          border: `1px solid ${color}60`,
          borderRadius: 4,
          padding: "6px 10px",
          fontFamily: "'DM Mono', monospace",
          whiteSpace: "nowrap",
          boxShadow: `0 8px 24px rgba(0,0,0,0.6), 0 0 12px ${color}18`,
        }}
      >
        <div
          style={{
            color,
            fontWeight: 700,
            fontSize: 11,
            marginBottom: 3,
            letterSpacing: "0.03em",
          }}
        >
          {risk.label}
        </div>
        <div
          style={{
            display: "flex",
            gap: 8,
            fontSize: 10,
            color: "#475569",
          }}
        >
          <span>PROB&nbsp;{risk.prob}%</span>
          <span style={{ color: "#1e293b" }}>·</span>
          <span style={{ color: risk.impact > 75 ? "#ef4444" : "#475569" }}>
            IMPACT&nbsp;{risk.impact}%
          </span>
        </div>
        {isExistential(risk) && (
          <div
            style={{
              marginTop: 4,
              fontSize: 9,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#ef4444",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <span
              style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: "#ef4444",
                display: "inline-block",
              }}
            />
            Existential tier
          </div>
        )}
      </div>
    </foreignObject>
  );
}

// ─── main component ───────────────────────────────────────────────
export function DemoHeatMap() {
  const [hovered, setHovered] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Intersection observer: trigger dot animations when in viewport
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          obs.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const existentialRisks = DEMO_RISKS.filter(isExistential);

  return (
    <div
      ref={ref}
      style={{
        background: "linear-gradient(135deg, #0d1117 0%, #0a0f14 100%)",
        border: "1px solid #1e293b",
        borderRadius: 12,
        overflow: "hidden",
        width: "100%",
        maxWidth: 520,
        boxShadow:
          "0 0 0 1px rgba(30,41,59,0.5), 0 40px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.03)",
      }}
    >
      <style>{`
        @keyframes dotPop {
          0%   { opacity: 0; transform: scale(0.2); }
          70%  { transform: scale(1.15); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes pulseRing1 {
          0%   { r: 3.5; opacity: 0.6; }
          100% { r: 7;   opacity: 0;   }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.12; r: 4;   }
          50%       { opacity: 0.22; r: 5.2; }
        }
        @keyframes scanline {
          from { transform: translateY(-100%); }
          to   { transform: translateY(100%);  }
        }
        @keyframes statusBlink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.3; }
        }
        .hm-dot {
          opacity: 0;
        }
        .hm-dot.revealed {
          animation: dotPop 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `}</style>

      {/* ── Terminal-style header ── */}
      <div
        style={{
          padding: "12px 18px",
          background: "rgba(0,0,0,0.3)",
          borderBottom: "1px solid #1e293b",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Traffic lights */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ display: "flex", gap: 6 }}>
            {["#ef4444", "#f59e0b", "#22c55e"].map((c, i) => (
              <div
                key={i}
                style={{
                  width: 9,
                  height: 9,
                  borderRadius: "50%",
                  background: c,
                  opacity: 0.55,
                  boxShadow: `0 0 6px ${c}`,
                }}
              />
            ))}
          </div>
          <span
            style={{
              fontSize: 10,
              color: "#334155",
              letterSpacing: "0.08em",
              fontFamily: "'DM Mono', monospace",
              marginLeft: 6,
            }}
          >
            arm — risk-landscape.svg
          </span>
        </div>

        {/* Live badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.2)",
            borderRadius: 4,
            padding: "3px 8px",
          }}
        >
          <span
            style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: "#ef4444",
              animation: "statusBlink 1.6s ease-in-out infinite",
              boxShadow: "0 0 5px #ef4444",
            }}
          />
          <span
            style={{
              fontSize: 9,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#ef4444",
              fontFamily: "'DM Mono', monospace",
            }}
          >
            Live Preview
          </span>
        </div>
      </div>

      {/* ── Sub-header: meta row ── */}
      <div
        style={{
          padding: "10px 18px",
          borderBottom: "1px solid #0f1825",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            fontSize: 11,
            color: "#475569",
            fontFamily: "'DM Mono', monospace",
          }}
        >
          ACME CORP · <span style={{ color: "#64748b" }}>10 risks mapped</span>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <span
            style={{
              fontSize: 10,
              color: "#ef4444",
              fontFamily: "'DM Mono', monospace",
              letterSpacing: "0.05em",
            }}
          >
            {existentialRisks.length} existential
          </span>
          <span
            style={{
              fontSize: 10,
              color: "#334155",
              fontFamily: "'DM Mono', monospace",
            }}
          >
            ·
          </span>
          <span
            style={{
              fontSize: 10,
              color: "#475569",
              fontFamily: "'DM Mono', monospace",
            }}
          >
            {DEMO_RISKS.length - existentialRisks.length} manageable
          </span>
        </div>
      </div>

      {/* ── The SVG heatmap ── */}
      <div style={{ position: "relative", padding: "16px 18px 8px" }}>
        {/* Scanline effect overlay */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.008) 2px, rgba(255,255,255,0.008) 4px)",
            pointerEvents: "none",
            zIndex: 1,
            borderRadius: 4,
          }}
        />

        <svg
          viewBox="0 0 100 100"
          style={{
            width: "100%",
            aspectRatio: "1 / 1",
            display: "block",
            overflow: "visible",
          }}
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Danger zone gradient */}
            <radialGradient id="redGlow" cx="0%" cy="0%" r="70%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
            </radialGradient>
            {/* Safe zone gradient */}
            <radialGradient id="greenGlow" cx="100%" cy="100%" r="70%">
              <stop offset="0%" stopColor="#22c55e" stopOpacity="0.07" />
              <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
            </radialGradient>
            {/* Amber zone */}
            <radialGradient id="amberGlow" cx="100%" cy="0%" r="70%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.07" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
            </radialGradient>

            {/* Fine grid pattern */}
            <pattern
              id="finegrid"
              width="10"
              height="10"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 10 0 L 0 0 0 10"
                fill="none"
                stroke="rgba(30,41,59,0.5)"
                strokeWidth="0.3"
              />
            </pattern>
          </defs>

          {/* Background grid */}
          <rect x="0" y="0" width="100" height="100" fill="url(#finegrid)" />

          {/* Quadrant atmosphere fills */}
          <rect x="0" y="0" width="50" height="50" fill="url(#redGlow)" />
          <rect x="50" y="0" width="50" height="50" fill="url(#amberGlow)" />
          <rect x="0" y="50" width="100" height="50" fill="url(#greenGlow)" />

          {/* Axis dividers */}
          <line
            x1="50"
            y1="0"
            x2="50"
            y2="100"
            stroke="#1e293b"
            strokeWidth="0.6"
            strokeDasharray="2 2"
          />
          <line
            x1="0"
            y1="50"
            x2="100"
            y2="50"
            stroke="#1e293b"
            strokeWidth="0.6"
            strokeDasharray="2 2"
          />

          {/* Quadrant labels */}
          <text
            x="2.5"
            y="6.5"
            fill="#ef4444"
            fontSize="3"
            opacity="0.5"
            fontFamily="monospace"
            letterSpacing="0.5"
          >
            RED ZONE
          </text>
          <text
            x="52"
            y="6.5"
            fill="#f59e0b"
            fontSize="3"
            opacity="0.5"
            fontFamily="monospace"
            letterSpacing="0.5"
          >
            WATCH LIST
          </text>
          <text
            x="2.5"
            y="97.5"
            fill="#334155"
            fontSize="3"
            opacity="0.6"
            fontFamily="monospace"
            letterSpacing="0.5"
          >
            IGNORE
          </text>
          <text
            x="52"
            y="97.5"
            fill="#3b82f6"
            fontSize="3"
            opacity="0.5"
            fontFamily="monospace"
            letterSpacing="0.5"
          >
            MANAGE IT
          </text>

          {/* Axis labels */}
          <text
            x="50"
            y="105"
            fill="#1e293b"
            fontSize="2.8"
            textAnchor="middle"
            fontFamily="monospace"
            letterSpacing="0.5"
          >
            PROBABILITY →
          </text>
          <text
            x="-50"
            y="2.5"
            fill="#1e293b"
            fontSize="2.8"
            textAnchor="middle"
            fontFamily="monospace"
            letterSpacing="0.5"
            transform="rotate(-90)"
          >
            IMPACT →
          </text>

          {/* Risk dots */}
          {DEMO_RISKS.map((risk, index) => {
            const { x, y } = toSvg(risk.prob, risk.impact);
            const exist = isExistential(risk);
            const color = CATEGORY_CONFIG[risk.category].color;
            const isHov = hovered === risk.id;

            return (
              <g
                key={risk.id}
                className={`hm-dot${revealed ? " revealed" : ""}`}
                style={{
                  cursor: "crosshair",
                  animationDelay: `${index * 90 + 150}ms`,
                }}
                onMouseEnter={() => setHovered(risk.id)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Pulse ring — existential only */}
                {exist && !isHov && <PulseRing cx={x} cy={y} color={color} />}

                {/* Hover expand ring */}
                {isHov && (
                  <circle
                    cx={x}
                    cy={y}
                    r="4.5"
                    fill="none"
                    stroke={color}
                    strokeWidth="0.5"
                    opacity="0.4"
                  />
                )}

                {/* Main dot — existential slightly bigger */}
                <circle
                  cx={x}
                  cy={y}
                  r={isHov ? (exist ? 2.8 : 2.2) : exist ? 2 : 1.4}
                  fill={color}
                  opacity={isHov ? 1 : exist ? 0.95 : 0.7}
                  style={{ transition: "r 0.18s ease, opacity 0.18s ease" }}
                />

                {/* Inner highlight for depth */}
                <circle
                  cx={x - 0.4}
                  cy={y - 0.4}
                  r={isHov ? (exist ? 1 : 0.7) : exist ? 0.7 : 0.5}
                  fill="white"
                  opacity={0.25}
                  style={{ pointerEvents: "none" }}
                />

                {/* Tooltip */}
                {isHov && <Tooltip risk={risk} x={x} y={y} color={color} />}
              </g>
            );
          })}
        </svg>
      </div>

      {/* ── Legend ── */}
      <div
        style={{
          padding: "10px 18px 14px",
          borderTop: "1px solid #0f1825",
          display: "flex",
          flexWrap: "wrap",
          gap: "8px 16px",
        }}
      >
        {Object.entries(CATEGORY_CONFIG).map(([key, { label, color }]) => {
          const count = DEMO_RISKS.filter((r) => r.category === key).length;
          if (count === 0) return null;
          return (
            <div
              key={key}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                fontSize: 10,
                color: "#475569",
                fontFamily: "'DM Mono', monospace",
              }}
            >
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: color,
                  flexShrink: 0,
                  boxShadow: `0 0 4px ${color}80`,
                }}
              />
              {label}
              <span style={{ color: "#1e293b" }}>×{count}</span>
            </div>
          );
        })}
      </div>

      {/* ── Bottom CTA strip ── */}
      <div
        style={{
          padding: "12px 18px",
          borderTop: "1px solid #1e293b",
          background: "rgba(239,68,68,0.03)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            fontSize: 10,
            color: "#334155",
            fontFamily: "'DM Mono', monospace",
          }}
        >
          ↑ hover the dots · your map will have your actual risks
        </div>
        <a
          href="/assessment"
          style={{
            fontSize: 10,
            letterSpacing: "0.08em",
            color: "#ef4444",
            fontFamily: "'DM Mono', monospace",
            textDecoration: "none",
            opacity: 0.8,
            transition: "opacity 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.8")}
        >
          Map my risks →
        </a>
      </div>
    </div>
  );
}

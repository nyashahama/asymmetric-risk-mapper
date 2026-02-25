// components/landing/SampleQuestions.tsx
"use client";

import { useState, useEffect, useRef } from "react";

// ─── data ─────────────────────────────────────────────────────────
const SAMPLES = [
  {
    section: "Dependencies",
    sectionColor: "#a855f7",
    q: "Name the one supplier, tool, or platform that if it disappeared tomorrow would take you more than 3 months to replace.",
    tag: "Key person / supplier risk",
    tagLevel: "critical" as const,
    signal:
      "Single points of failure are the most common source of company-ending events. If your answer took less than 3 seconds, this is a live risk.",
    options: [
      "We have full redundancy",
      "1–2 weeks to replace",
      "1–3 months to replace",
      "We'd be stuck for 3+ months",
    ],
    dangerIdx: 3,
    warnIdx: 2,
  },
  {
    section: "Market",
    sectionColor: "#84cc16",
    q: "Could a well-funded competitor offer your core product for free — and survive doing it?",
    tag: "Competitive moat",
    tagLevel: "warning" as const,
    signal:
      "If the answer is 'yes', your pricing power is structural rather than protective. The moat question isn't about now — it's about a funded attacker.",
    options: [
      "No — our moat is structural",
      "Unlikely — switching costs are high",
      "Maybe — it would hurt us badly",
      "Yes — we'd lose most customers",
    ],
    dangerIdx: 3,
    warnIdx: 2,
  },
  {
    section: "Operations",
    sectionColor: "#f97316",
    q: "How many months of operating expenses can you cover if revenue dropped 40% tomorrow?",
    tag: "Cash runway",
    tagLevel: "critical" as const,
    signal:
      "A 40% revenue drop is a supply shock, a large customer churn, or a platform policy change. It happens. The question is whether you survive it.",
    options: [
      "< 2 months",
      "2–4 months",
      "4–8 months",
      "> 8 months — we're solid",
    ],
    dangerIdx: 0,
    warnIdx: 1,
  },
  {
    section: "Blind Spots",
    sectionColor: "#64748b",
    q: "What would a smart, motivated ex-employee tell your biggest competitor about you?",
    tag: "Blind spot probe",
    tagLevel: "dark" as const,
    signal:
      "This question surfaces cultural risks, operational leaks, and capability gaps that internal surveys never catch. The discomfort you feel is data.",
    options: null, // open-ended — show freeform
  },
  {
    section: "Blind Spots",
    sectionColor: "#64748b",
    q: "What assumption is your entire business model built on — that you've never actually tested?",
    tag: "Untested assumption",
    tagLevel: "dark" as const,
    signal:
      "Most business models have one load-bearing assumption that goes unexamined for years. Naming it is the first step to stress-testing it.",
    options: null,
  },
];

const TAG_STYLES = {
  critical: {
    bg: "rgba(239,68,68,0.1)",
    border: "rgba(239,68,68,0.25)",
    color: "#ef4444",
    icon: "●",
  },
  warning: {
    bg: "rgba(245,158,11,0.1)",
    border: "rgba(245,158,11,0.25)",
    color: "#f59e0b",
    icon: "▲",
  },
  dark: {
    bg: "rgba(71,85,105,0.12)",
    border: "rgba(71,85,105,0.3)",
    color: "#64748b",
    icon: "◆",
  },
};

// ─── terminal typing cursor ───────────────────────────────────────
function Cursor() {
  return (
    <span
      style={{
        display: "inline-block",
        width: 7,
        height: 13,
        background: "#ef4444",
        marginLeft: 2,
        verticalAlign: "middle",
        animation: "cursorBlink 1.1s step-end infinite",
        borderRadius: 1,
        opacity: 0.9,
      }}
    />
  );
}

// ─── option row ───────────────────────────────────────────────────
function OptionRow({
  label,
  index,
  dangerIdx,
  warnIdx,
}: {
  label: string;
  index: number;
  dangerIdx: number;
  warnIdx: number;
}) {
  const isDanger = index === dangerIdx;
  const isWarn = index === warnIdx;
  const color = isDanger ? "#ef4444" : isWarn ? "#f59e0b" : "#1e293b";
  const bg = isDanger
    ? "rgba(239,68,68,0.06)"
    : isWarn
      ? "rgba(245,158,11,0.04)"
      : "transparent";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 14px",
        border: `1px solid ${color}`,
        borderRadius: 4,
        fontSize: 12,
        color: isDanger ? "#ef4444" : isWarn ? "#f59e0b" : "#334155",
        background: bg,
        fontFamily: "'DM Mono', monospace",
        lineHeight: 1.4,
      }}
    >
      <span>{label}</span>
      {isDanger && (
        <span
          style={{
            fontSize: 9,
            letterSpacing: "0.12em",
            color: "#ef4444",
            flexShrink: 0,
          }}
        >
          HIGH RISK
        </span>
      )}
      {isWarn && !isDanger && (
        <span
          style={{
            fontSize: 9,
            letterSpacing: "0.12em",
            color: "#f59e0b",
            flexShrink: 0,
          }}
        >
          CAUTION
        </span>
      )}
    </div>
  );
}

// ─── main component ───────────────────────────────────────────────
export function SampleQuestions() {
  const [active, setActive] = useState(0);
  const [typed, setTyped] = useState("");
  const [typing, setTyping] = useState(false);
  const typingRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const sample = SAMPLES[active];
  const tagStyle = TAG_STYLES[sample.tagLevel];

  // Animate the question text when switching
  useEffect(() => {
    setTyped("");
    setTyping(true);
    let i = 0;
    const text = sample.q;

    function tick() {
      i++;
      setTyped(text.slice(0, i));
      if (i < text.length) {
        typingRef.current = setTimeout(tick, 18 + Math.random() * 14);
      } else {
        setTyping(false);
      }
    }

    typingRef.current = setTimeout(tick, 120);
    return () => {
      if (typingRef.current) clearTimeout(typingRef.current);
    };
  }, [active, sample.q]);

  return (
    <section
      style={{
        padding: "120px 60px",
        maxWidth: 1200,
        margin: "0 auto",
      }}
    >
      <style>{`
        @keyframes cursorBlink {
          0%, 100% { opacity: 0.9; }
          50%       { opacity: 0;   }
        }
        @keyframes signalFade {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0);   }
        }
        @keyframes statusBlink {
          0%, 100% { opacity: 1;   }
          50%       { opacity: 0.3; }
        }
        .signal-in { animation: signalFade 0.4s ease forwards; }
      `}</style>

      {/* ── Section label + heading ── */}
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
        The audit experience
      </p>

      <h2
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: "clamp(32px, 4vw, 52px)",
          lineHeight: 1.1,
          fontWeight: 700,
          marginBottom: 12,
          color: "#f1f5f9",
          maxWidth: 560,
        }}
      >
        Unusual questions.
        <br />
        <em style={{ fontWeight: 400, color: "#f59e0b" }}>Unusual clarity.</em>
      </h2>

      <p
        style={{
          fontSize: 13,
          color: "#475569",
          lineHeight: 1.85,
          maxWidth: 480,
          marginBottom: 52,
          fontFamily: "'DM Mono', monospace",
        }}
      >
        Most risk frameworks ask the obvious stuff. We ask the questions that
        make founders uncomfortable — because those are the ones that matter.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 48,
          alignItems: "start",
        }}
      >
        {/* ── Left: question list ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {SAMPLES.map((s, i) => {
            const ts = TAG_STYLES[s.tagLevel];
            const isAct = active === i;
            return (
              <button
                key={i}
                onClick={() => setActive(i)}
                style={{
                  background: isAct ? "rgba(239,68,68,0.04)" : "transparent",
                  border: "1px solid",
                  borderColor: isAct ? "#ef4444" : "#1e293b",
                  borderRadius: 6,
                  color: isAct ? "#e2e8f0" : "#64748b",
                  cursor: "pointer",
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 12,
                  lineHeight: 1.6,
                  padding: "14px 18px",
                  textAlign: "left",
                  transition: "all 0.15s ease",
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                }}
              >
                {/* Section label */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span
                    style={{
                      fontSize: 10,
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      color: isAct ? "#ef4444" : "#334155",
                      display: "block",
                      transition: "color 0.15s ease",
                    }}
                  >
                    {s.section}
                  </span>
                  {/* Tag pill */}
                  <span
                    style={{
                      fontSize: 9,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      padding: "2px 6px",
                      borderRadius: 3,
                      background: ts.bg,
                      border: `1px solid ${ts.border}`,
                      color: ts.color,
                      fontFamily: "'DM Mono', monospace",
                    }}
                  >
                    {ts.icon} {s.tag}
                  </span>
                </div>
                {/* Question preview */}
                <span
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    fontSize: 12,
                  }}
                >
                  {s.q}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── Right: terminal panel ── */}
        <div
          style={{
            position: "sticky",
            top: 100,
            background: "#0d1117",
            border: "1px solid #1e293b",
            borderRadius: 10,
            overflow: "hidden",
            boxShadow:
              "0 32px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.02)",
          }}
        >
          {/* Terminal chrome */}
          <div
            style={{
              padding: "11px 16px",
              background: "rgba(0,0,0,0.3)",
              borderBottom: "1px solid #1e293b",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ display: "flex", gap: 5 }}>
                {["#ef4444", "#f59e0b", "#22c55e"].map((c, i) => (
                  <div
                    key={i}
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: c,
                      opacity: 0.55,
                      boxShadow: `0 0 5px ${c}`,
                    }}
                  />
                ))}
              </div>
              <span
                style={{
                  fontSize: 10,
                  color: "#334155",
                  fontFamily: "'DM Mono', monospace",
                  marginLeft: 6,
                  letterSpacing: "0.06em",
                }}
              >
                arm — risk-scanner
              </span>
            </div>

            {/* Scanning badge */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                background: "rgba(245,158,11,0.07)",
                border: "1px solid rgba(245,158,11,0.2)",
                borderRadius: 4,
                padding: "3px 8px",
              }}
            >
              <span
                style={{
                  width: 4,
                  height: 4,
                  borderRadius: "50%",
                  background: "#f59e0b",
                  animation: "statusBlink 1.4s ease-in-out infinite",
                  boxShadow: "0 0 4px #f59e0b",
                }}
              />
              <span
                style={{
                  fontSize: 9,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#f59e0b",
                  fontFamily: "'DM Mono', monospace",
                }}
              >
                Scanning
              </span>
            </div>
          </div>

          <div style={{ padding: "28px 28px 24px" }}>
            {/* Prompt prefix */}
            <div
              style={{
                fontSize: 11,
                color: "#1e293b",
                fontFamily: "'DM Mono', monospace",
                marginBottom: 14,
              }}
            >
              {">"} Question {active + 1} of {SAMPLES.length} · {sample.section}
            </div>

            {/* The typed question */}
            <div
              style={{
                borderLeft: "2px solid #ef4444",
                paddingLeft: 14,
                marginBottom: 24,
                minHeight: 72,
              }}
            >
              <p
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: "clamp(15px, 1.8vw, 18px)",
                  lineHeight: 1.5,
                  color: "#f1f5f9",
                  fontStyle: "italic",
                  fontWeight: 400,
                }}
              >
                &ldquo;{typed}&rdquo;{typing && <Cursor />}
              </p>
            </div>

            {/* Options OR open-ended label */}
            {sample.options ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {sample.options.map((opt, oi) => (
                  <OptionRow
                    key={opt}
                    label={opt}
                    index={oi}
                    dangerIdx={sample.dangerIdx ?? -1}
                    warnIdx={sample.warnIdx ?? -1}
                  />
                ))}
              </div>
            ) : (
              <div
                style={{
                  border: "1px solid #1e293b",
                  borderRadius: 4,
                  padding: "14px 16px",
                  fontSize: 12,
                  color: "#1e293b",
                  fontFamily: "'DM Mono', monospace",
                  fontStyle: "italic",
                  background: "rgba(255,255,255,0.01)",
                }}
              >
                Free-text response — AI interprets the signal behind the words
              </div>
            )}

            {/* Signal detected */}
            {!typing && (
              <div
                key={active}
                className="signal-in"
                style={{
                  marginTop: 20,
                  padding: "14px 16px",
                  background: `${tagStyle.color}08`,
                  border: `1px solid ${tagStyle.color}25`,
                  borderRadius: 6,
                  fontSize: 12,
                  color: "#64748b",
                  lineHeight: 1.7,
                  fontFamily: "'DM Mono', monospace",
                }}
              >
                <span style={{ color: tagStyle.color }}>
                  {tagStyle.icon} Signal:&nbsp;
                </span>
                {sample.signal}
              </div>
            )}
          </div>

          {/* Bottom strip */}
          <div
            style={{
              borderTop: "1px solid #1e293b",
              padding: "10px 28px",
              background: "rgba(0,0,0,0.2)",
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
              {active + 1} / {SAMPLES.length} sample questions shown
            </span>
            <div
              style={{
                display: "flex",
                gap: 4,
              }}
            >
              {SAMPLES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  style={{
                    width: 20,
                    height: 3,
                    borderRadius: 2,
                    background: active === i ? "#ef4444" : "#1e293b",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    transition: "background 0.2s ease",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

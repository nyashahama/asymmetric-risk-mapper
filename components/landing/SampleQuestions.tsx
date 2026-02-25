// components/landing/SampleQuestions.tsx
"use client";

import { useState } from "react";

const SAMPLES = [
  {
    section: "Dependencies",
    q: "Name the one supplier, tool, or platform that if it disappeared tomorrow would take you more than 3 months to replace.",
    tag: "🔴 Key person / supplier risk",
  },
  {
    section: "Market",
    q: "Could a well-funded competitor offer your core product for free — and survive doing it?",
    tag: "🟡 Competitive moat",
  },
  {
    section: "Operations",
    q: "How many months of operating expenses can you cover if revenue dropped 40% tomorrow?",
    tag: "🔴 Cash runway",
  },
  {
    section: "Blind Spots",
    q: "What would a smart, motivated ex-employee tell your biggest competitor about you?",
    tag: "⚫ Blind spot probe",
  },
  {
    section: "Blind Spots",
    q: "What assumption is your entire business model built on — that you've never actually tested?",
    tag: "⚫ Untested assumption",
  },
];

export function SampleQuestions() {
  const [active, setActive] = useState(0);

  return (
    <section
      style={{
        padding: "120px 60px",
        maxWidth: 1200,
        margin: "0 auto",
      }}
    >
      <p
        style={{
          fontSize: 10,
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          color: "#475569",
          marginBottom: 16,
        }}
      >
        The questions
      </p>

      <h2
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: "clamp(32px, 4vw, 52px)",
          lineHeight: 1.1,
          fontWeight: 700,
          marginBottom: 60,
          color: "#f1f5f9",
          maxWidth: 560,
        }}
      >
        Questions most
        <br />
        <em style={{ fontWeight: 400, color: "#94a3b8" }}>
          advisors won&apos;t ask.
        </em>
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 48,
          alignItems: "start",
        }}
      >
        {/* Question list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {SAMPLES.map((s, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              style={{
                background:
                  active === i ? "rgba(239,68,68,0.04)" : "transparent",
                border: "1px solid",
                borderColor: active === i ? "#ef4444" : "#1e293b",
                borderRadius: 6,
                color: active === i ? "#e2e8f0" : "#94a3b8",
                cursor: "pointer",
                fontFamily: "'DM Mono', monospace",
                fontSize: 12,
                lineHeight: 1.6,
                padding: "14px 18px",
                textAlign: "left",
                transition: "all 0.15s ease",
              }}
            >
              <span
                style={{
                  fontSize: 10,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: active === i ? "#ef4444" : "#334155",
                  display: "block",
                  marginBottom: 6,
                }}
              >
                {s.section}
              </span>
              {s.q}
            </button>
          ))}
        </div>

        {/* Active question callout */}
        <div
          style={{
            position: "sticky",
            top: 100,
            background: "#0f1419",
            border: "1px solid #1e293b",
            borderLeft: "3px solid #ef4444",
            borderRadius: 8,
            padding: "40px 36px",
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          <span
            style={{
              fontSize: 10,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#334155",
            }}
          >
            {SAMPLES[active].section}
          </span>

          <p
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(18px, 2vw, 24px)",
              lineHeight: 1.4,
              color: "#f1f5f9",
              fontStyle: "italic",
              fontWeight: 400,
            }}
          >
            &quot;{SAMPLES[active].q}&quot;
          </p>

          <div
            style={{
              display: "inline-flex",
              alignSelf: "flex-start",
              background: "rgba(239,68,68,0.08)",
              border: "1px solid rgba(239,68,68,0.2)",
              borderRadius: 4,
              color: "#ef4444",
              fontSize: 11,
              padding: "5px 10px",
            }}
          >
            {SAMPLES[active].tag}
          </div>

          <p
            style={{
              fontSize: 12,
              color: "#475569",
              lineHeight: 1.7,
            }}
          >
            The AI scores the risk based on your answer — not on how you rate it
            yourself. Founders systematically mis-rate their own risks.
          </p>
        </div>
      </div>
    </section>
  );
}

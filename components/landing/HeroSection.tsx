// components/landing/HeroSection.tsx
"use client";

import { useEffect, useRef } from "react";
import { DemoHeatMap } from "./DemoHeatMap";

export function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);

  return (
    <section
      ref={heroRef}
      style={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 80,
        alignItems: "center",
        padding: "80px 60px",
        maxWidth: 1200,
        margin: "0 auto",
        position: "relative",
      }}
    >
      {/* Left: copy */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 32,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.2)",
            borderRadius: 4,
            padding: "6px 12px",
            alignSelf: "flex-start",
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#ef4444",
              animation: "pulse 2s ease infinite",
            }}
          />
          <span
            style={{
              fontSize: 10,
              letterSpacing: "0.2em",
              color: "#ef4444",
              textTransform: "uppercase",
            }}
          >
            Risk Assessment Tool
          </span>
        </div>

        <h1
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "clamp(42px, 5vw, 72px)",
            lineHeight: 1.05,
            fontWeight: 900,
            color: "#f1f5f9",
          }}
        >
          Find the risks
          <br />
          <em
            style={{
              fontWeight: 400,
              fontStyle: "italic",
              color: "#ef4444",
            }}
          >
            that could end
          </em>
          <br />
          your business.
        </h1>

        <p
          style={{
            fontSize: 15,
            color: "#64748b",
            lineHeight: 1.8,
            maxWidth: 460,
          }}
        >
          Most founders stress equally about everything — or nothing. This tool
          separates low-probability, existential risks from high-probability,
          survivable ones. Then tells you which ones actually need your
          attention.
        </p>

        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <a
            href="/assessment"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              background: "#ef4444",
              color: "#fff",
              padding: "14px 28px",
              borderRadius: 4,
              fontFamily: "'DM Mono', monospace",
              fontSize: 13,
              letterSpacing: "0.05em",
              textDecoration: "none",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#dc2626";
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow =
                "0 8px 30px rgba(239,68,68,0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#ef4444";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            Start free risk audit
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path
                d="M1 8h14M8 1l7 7-7 7"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>

          <span
            style={{
              fontSize: 11,
              color: "#334155",
              fontFamily: "'DM Mono', monospace",
            }}
          >
            8 minutes · no account needed
          </span>
        </div>

        {/* Stats row */}
        <div
          style={{
            display: "flex",
            gap: 32,
            paddingTop: 8,
          }}
        >
          {[
            { n: "23", label: "risks mapped" },
            { n: "5", label: "risk categories" },
            { n: "$49", label: "full report" },
          ].map(({ n, label }) => (
            <div key={label}>
              <div
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 28,
                  fontWeight: 700,
                  color: "#f1f5f9",
                  lineHeight: 1,
                }}
              >
                {n}
              </div>
              <div style={{ fontSize: 11, color: "#334155", marginTop: 4 }}>
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right: heat map */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 16,
          animation: "fadeUp 0.8s ease 0.3s forwards",
          opacity: 0,
        }}
      >
        <DemoHeatMap />
        <p
          style={{
            fontSize: 11,
            color: "#334155",
            textAlign: "center",
            fontFamily: "'DM Mono', monospace",
          }}
        >
          Sample output — hover the dots
        </p>
      </div>
    </section>
  );
}

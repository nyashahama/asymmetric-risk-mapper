// components/report/PaywallGate.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

interface PaywallGateProps {
  onUnlock: (email?: string) => Promise<void>;
  isRedirecting: boolean;
}

const INCLUDES = [
  "Interactive probability × impact heat map",
  "6–12 scored risks, specific to your answers",
  "Specific hedge action for each risk",
  "Prioritised 'What To Do This Week' list",
  "Downloadable PDF",
];

export function PaywallGate({ onUnlock, isRedirecting }: PaywallGateProps) {
  const [email, setEmail] = useState("");

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        background: "#080a0d",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        fontFamily: "'DM Mono', monospace",
      }}
    >
      {/* Blurred background suggesting a report */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          filter: "blur(14px)",
          opacity: 0.18,
          padding: "60px",
          pointerEvents: "none",
          display: "flex",
          flexDirection: "column",
          gap: 32,
        }}
      >
        <div
          style={{
            height: 360,
            border: "1px solid #1e293b",
            borderRadius: 8,
            background:
              "radial-gradient(circle at 20% 80%, rgba(239,68,68,0.4) 0%, transparent 40%), radial-gradient(circle at 65% 25%, rgba(245,158,11,0.3) 0%, transparent 35%)",
          }}
        />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 12,
          }}
        >
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              style={{
                height: 90,
                background: "#0f1419",
                border: "1px solid #1e293b",
                borderRadius: 6,
              }}
            />
          ))}
        </div>
      </div>

      {/* Paywall card */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          padding: 24,
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            background: "#0d1117",
            border: "1px solid #1e293b",
            borderRadius: 12,
            padding: "48px 40px",
            maxWidth: 480,
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 20,
            boxShadow: "0 40px 80px rgba(0,0,0,0.7)",
            color: "#e2e8f0",
          }}
        >
          <div style={{ fontSize: 28, color: "#ef4444", textAlign: "center" }}>
            ⬡
          </div>

          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 28,
              fontWeight: 700,
              textAlign: "center",
              color: "#f1f5f9",
            }}
          >
            Your risk map is ready.
          </h2>

          <p
            style={{
              fontSize: 13,
              color: "#64748b",
              lineHeight: 1.75,
              textAlign: "center",
            }}
          >
            We identified{" "}
            <span style={{ color: "#ef4444" }}>existential-tier risks</span> in
            your assessment. Unlock the full report to see what they are and
            what to do about them.
          </p>

          {/* Includes list */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {INCLUDES.map((item) => (
              <div
                key={item}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 10,
                  fontSize: 13,
                  color: "#94a3b8",
                  lineHeight: 1.5,
                }}
              >
                <span style={{ color: "#22c55e", fontSize: 11, marginTop: 1 }}>
                  ✓
                </span>
                <span>{item}</span>
              </div>
            ))}
          </div>

          {/* Price */}
          <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
            <span
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 52,
                fontWeight: 900,
                color: "#f1f5f9",
                lineHeight: 1,
              }}
            >
              $49
            </span>
            <span style={{ fontSize: 11, color: "#334155" }}>
              one-time · no subscription
            </span>
          </div>

          {/* Email */}
          <input
            type="email"
            placeholder="Email address (for PDF delivery)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid #1e293b",
              borderRadius: 6,
              color: "#e2e8f0",
              fontFamily: "'DM Mono', monospace",
              fontSize: 13,
              outline: "none",
              padding: "12px 16px",
            }}
          />

          <Button
            fullWidth
            size="lg"
            disabled={isRedirecting}
            onClick={() => onUnlock(email || undefined)}
            style={{ borderRadius: 6 }}
          >
            {isRedirecting
              ? "Redirecting to checkout..."
              : "Unlock my full report →"}
          </Button>

          <p style={{ fontSize: 11, color: "#1e293b", textAlign: "center" }}>
            Secure payment via Stripe. Your answers are never sold or shared.
          </p>
        </div>
      </div>
    </div>
  );
}

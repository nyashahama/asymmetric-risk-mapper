// app/page.tsx
"use client";

import { HeroSection } from "@/components/landing/HeroSection";
import { SampleQuestions } from "@/components/landing/SampleQuestions";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { PricingSection } from "@/components/landing/PricingSection";
import { FooterSection } from "@/components/landing/FooterSection";

export default function LandingPage() {
  return (
    <main
      style={{
        background: "#080a0d",
        color: "#e2e8f0",
        minHeight: "100vh",
        fontFamily: "'DM Mono', monospace",
        overflowX: "hidden",
      }}
    >
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.85); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Nav */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          padding: "20px 60px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "rgba(8,10,13,0.85)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(30,41,59,0.5)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 11,
            letterSpacing: "0.2em",
            color: "#334155",
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#ef4444",
            }}
          />
          ASYMMETRIC RISK MAPPER
        </div>

        <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
          {["How it works", "Pricing", "About"].map((item) => (
            <a
              key={item}
              href="#"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                color: "#64748b",
                textDecoration: "none",
                letterSpacing: "0.06em",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#e2e8f0")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#64748b")}
            >
              {item}
            </a>
          ))}
        </div>

        <a
          href="/assessment"
          style={{
            background: "#ef4444",
            color: "#fff",
            padding: "9px 18px",
            borderRadius: 4,
            fontFamily: "'DM Mono', monospace",
            fontSize: 12,
            textDecoration: "none",
            letterSpacing: "0.04em",
            transition: "background 0.15s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#dc2626")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#ef4444")}
        >
          Start audit →
        </a>
      </nav>

      {/* Page sections */}
      <div style={{ paddingTop: 64 }}>
        <HeroSection />
        <SampleQuestions />
        <HowItWorks />
        <PricingSection />
      </div>

      <FooterSection />
    </main>
  );
}

"use client";

import { ComputedRisk } from "@/lib/risks";
import { HeatMap } from "./HeatMap";

interface MapStepProps {
  risks: ComputedRisk[];
  bizName: string;
  onNext: () => void;
  onPrev: () => void;
}

export function MapStep({ risks, bizName, onNext, onPrev }: MapStepProps) {
  const criticalRisks = risks.filter((r) => r.tier === "watch");

  return (
    <div>
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 9,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "rgba(14,14,14,0.4)",
          marginBottom: 4,
        }}
      >
        Step 3 of 4
      </div>
      <h2
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: "clamp(1.4rem, 3vw, 1.9rem)",
          fontWeight: 400,
          marginBottom: 8,
        }}
      >
        Your Risk Heat Map
      </h2>
      <p
        style={{
          fontSize: 13,
          color: "rgba(14,14,14,0.6)",
          lineHeight: 1.65,
          maxWidth: 580,
          marginBottom: 32,
        }}
      >
        Each dot is a risk, plotted by probability (x-axis) vs. impact (y-axis).
        Top-right = existential. Bottom-left = acceptable. The goal is to hedge
        only the top-right ones.
      </p>

      <HeatMap risks={risks} />

      {/* Critical callout */}
      {criticalRisks.length > 0 && (
        <div
          style={{
            background: "rgba(193,40,30,0.08)",
            borderLeft: "3px solid var(--red)",
            padding: "16px 20px",
            marginBottom: 32,
            borderRadius: "0 2px 2px 0",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "var(--red)",
              marginBottom: 6,
            }}
          >
            ⚠ {criticalRisks.length} Critical Risk
            {criticalRisks.length > 1 ? "s" : ""} Detected
          </div>
          <p
            style={{
              fontSize: 13,
              lineHeight: 1.6,
              color: "rgba(14,14,14,0.7)",
            }}
          >
            {criticalRisks.map((r) => r.name).join(", ")} —{" "}
            {criticalRisks.length === 1 ? "this has" : "these have"} a high
            probability of occurring AND the potential to end the business. They
            need immediate attention.
          </p>
        </div>
      )}

      {/* Nav */}
      <div className="flex items-center gap-3 mt-8">
        <button
          onClick={onPrev}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "rgba(14,14,14,0.4)",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.color = "var(--ink)")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.color =
              "rgba(14,14,14,0.4)")
          }
        >
          ← Edit Answers
        </button>

        <button
          onClick={onNext}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            padding: "12px 28px",
            border: "1.5px solid var(--ink)",
            borderRadius: 2,
            background: "var(--ink)",
            color: "var(--paper)",
            cursor: "pointer",
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              "var(--red)";
            (e.currentTarget as HTMLButtonElement).style.borderColor =
              "var(--red)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              "var(--ink)";
            (e.currentTarget as HTMLButtonElement).style.borderColor =
              "var(--ink)";
          }}
        >
          See Full Report →
        </button>
      </div>
    </div>
  );
}

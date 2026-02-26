"use client";

import { useState } from "react";
import { ComputedRisk } from "@/lib/risks";
import { HeatMap } from "./HeatMap";
import { RiskList } from "./RiskList";
import { BusinessContext } from "./ContextStep";

interface ReportStepProps {
  risks: ComputedRisk[];
  context: BusinessContext;
  onPrev: () => void;
  onReset: () => void;
}

export function ReportStep({
  risks,
  context,
  onPrev,
  onReset,
}: ReportStepProps) {
  const [copied, setCopied] = useState(false);

  const overallScore = risks.length
    ? Math.round(risks.reduce((s, r) => s + r.score, 0) / risks.length)
    : 0;

  const criticalCount = risks.filter((r) => r.tier === "watch").length;

  const scoreColor =
    overallScore > 50
      ? "var(--red)"
      : overallScore > 30
        ? "var(--amber)"
        : "var(--green)";

  const handleCopy = () => {
    const lines = [
      `ASYMMETRIC RISK REPORT — ${context.bizName || "Your Business"}`,
      `Generated: ${new Date().toLocaleDateString()}`,
      context.industry ? `Industry: ${context.industry}` : "",
      context.stage ? `Stage: ${context.stage}` : "",
      `Overall Risk Score: ${overallScore}/100`,
      `Critical Risks: ${criticalCount}`,
      "",
      "=== RISK REGISTER ===",
      ...risks.map(
        (r) =>
          `#${r.idx} [${r.tier.toUpperCase()}] ${r.name} — Score: ${r.score} (P:${r.p}/10, I:${r.i}/10)`,
      ),
      "",
      "=== HEDGING ACTIONS ===",
      ...risks
        .filter((r) => r.tier === "watch" || r.tier === "red")
        .map((r) => `• ${r.name}: ${r.hedge}`),
    ]
      .filter(Boolean)
      .join("\n");

    navigator.clipboard.writeText(lines);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const ExportBtn = ({
    onClick,
    children,
  }: {
    onClick: () => void;
    children: React.ReactNode;
  }) => (
    <button
      onClick={onClick}
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: 10,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        padding: "8px 16px",
        border: "1.5px solid rgba(14,14,14,0.2)",
        borderRadius: 2,
        background: "white",
        color: "var(--ink)",
        cursor: "pointer",
        transition: "all 0.15s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = "var(--ink)";
        (e.currentTarget as HTMLButtonElement).style.color = "var(--paper)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = "white";
        (e.currentTarget as HTMLButtonElement).style.color = "var(--ink)";
      }}
    >
      {children}
    </button>
  );

  return (
    <div>
      {/* Report header */}
      <div
        className="flex justify-between items-start mb-10"
        style={{ flexWrap: "wrap", gap: 16 }}
      >
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
            Risk Intelligence Report
          </div>
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(1.4rem, 3vw, 1.9rem)",
              fontWeight: 400,
              marginBottom: 8,
            }}
          >
            Full Risk Report
          </h2>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              color: "rgba(14,14,14,0.4)",
              lineHeight: 1.8,
            }}
          >
            {context.bizName && <div>{context.bizName}</div>}
            {context.industry && <div>{context.industry}</div>}
            {context.stage && <div>{context.stage}</div>}
            <div>{new Date().toLocaleDateString()}</div>
          </div>
        </div>

        {/* Score */}
        <div style={{ textAlign: "right" }}>
          <div
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "3.25rem",
              lineHeight: 1,
              color: scoreColor,
            }}
          >
            {overallScore}
          </div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "rgba(14,14,14,0.4)",
            }}
          >
            Risk Score / 100
          </div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              color: scoreColor,
              marginTop: 4,
            }}
          >
            {criticalCount} critical risk{criticalCount !== 1 ? "s" : ""}
          </div>
        </div>
      </div>

      {/* Heat map */}
      <HeatMap risks={risks} />

      {/* Section header */}
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
        Prioritized Risk Register
      </div>
      <p
        style={{
          fontSize: 13,
          color: "rgba(14,14,14,0.6)",
          lineHeight: 1.65,
          maxWidth: 560,
          marginBottom: 32,
        }}
      >
        Sorted by composite score (Probability × Impact). Hedge critical risks
        first — they&apos;re the ones that can&apos;t be recovered from.
      </p>

      <RiskList risks={risks} />

      {/* Export bar */}
      <div
        className="no-print"
        style={{
          display: "flex",
          gap: 10,
          padding: 16,
          background: "var(--paper-dark)",
          border: "1.5px solid rgba(14,14,14,0.12)",
          borderRadius: 2,
          alignItems: "center",
          marginTop: 40,
          flexWrap: "wrap",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "rgba(14,14,14,0.5)",
            marginRight: 4,
          }}
        >
          Export
        </span>
        <ExportBtn onClick={handleCopy}>
          {copied ? "✓ Copied!" : "📋 Copy to clipboard"}
        </ExportBtn>
        <ExportBtn onClick={() => window.print()}>
          🖨 Print / Save PDF
        </ExportBtn>
        <ExportBtn onClick={onPrev}>← Edit Map</ExportBtn>
        <ExportBtn onClick={onReset}>↩ Start Over</ExportBtn>
      </div>
    </div>
  );
}

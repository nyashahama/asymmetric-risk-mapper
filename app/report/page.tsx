"use client";
import { useState } from "react";
import Link from "next/link";
import { useReportData } from "@/lib/useReportData";
import { ReportCover } from "@/components/report/ReportCover";
import { ExecutiveSummary } from "@/components/report/ExecutiveSummary";
import { HeatMap } from "@/components/report/HeatMap";
import { RiskRegister } from "@/components/report/RiskRegister";
import { ActionPlan } from "@/components/report/ActionPlan";
import { ExportBar } from "@/components/report/ExportBar";

export default function ReportPage() {
  const { risks, email, loaded } = useReportData();
  const [copied, setCopied] = useState(false);

  if (!loaded) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          color: "rgba(14,14,14,0.4)",
          letterSpacing: "0.1em",
        }}
      >
        Loading your report...
      </div>
    );
  }

  const overallScore = risks.length
    ? Math.round(risks.reduce((s, r) => s + r.score, 0) / risks.length)
    : 0;
  const criticalRisks = risks.filter(
    (r) => r.tier === "red" || r.tier === "watch",
  );
  const topActions = criticalRisks.slice(0, 3);
  const scoreColor =
    overallScore > 40
      ? "var(--red)"
      : overallScore > 25
        ? "var(--amber)"
        : "var(--green)";
  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleCopy = () => {
    const lines = [
      "ASYMMETRIC RISK REPORT",
      `Generated: ${date}`,
      `Overall Score: ${overallScore}/100`,
      `Risks requiring immediate attention: ${criticalRisks.length}`,
      "",
      "=== RISK REGISTER ===",
      ...risks.map(
        (r) =>
          `#${r.idx} [${r.tier.toUpperCase()}] ${r.name} — P:${r.p}/10 I:${r.i}/10`,
      ),
      "",
      "=== WHAT TO DO THIS WEEK ===",
      ...topActions.map((r, i) => `${i + 1}. ${r.name}: ${r.hedge}`),
    ].join("\n");
    navigator.clipboard.writeText(lines);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ position: "relative", zIndex: 1, minHeight: "100vh" }}>
      {/* Header */}
      <header
        style={{
          borderBottom: "1.5px solid rgba(14,14,14,0.1)",
          padding: "16px 32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Link
          href="/"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--ink)",
            textDecoration: "none",
          }}
        >
          <span style={{ color: "var(--red)" }}>▲</span> Risk Mapper
        </Link>
        <div style={{ display: "flex", gap: 10 }}>
          {[
            { label: copied ? "✓ Copied" : "Copy text", action: handleCopy },
            { label: "Print / PDF", action: () => window.print() },
          ].map((b) => (
            <button
              key={b.label}
              onClick={b.action}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 9,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                padding: "7px 14px",
                border: "1.5px solid rgba(14,14,14,0.15)",
                borderRadius: 2,
                background: "white",
                color: "var(--ink)",
                cursor: "pointer",
                transition: "all 0.12s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "var(--ink)";
                (e.currentTarget as HTMLButtonElement).style.color =
                  "var(--paper)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "white";
                (e.currentTarget as HTMLButtonElement).style.color =
                  "var(--ink)";
              }}
            >
              {b.label}
            </button>
          ))}
        </div>
      </header>

      <main
        style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px 80px" }}
      >
        <ReportCover
          email={email}
          date={date}
          totalRisks={risks.length}
          overallScore={overallScore}
          scoreColor={scoreColor}
          criticalCount={criticalRisks.length}
        />

        <ExecutiveSummary risks={risks} criticalRisks={criticalRisks} />

        <div className="fade-up-2">
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 9,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(14,14,14,0.35)",
              marginBottom: 10,
            }}
          >
            Risk Heat Map
          </div>
          <HeatMap risks={risks} />
        </div>

        <RiskRegister risks={risks} />
        <ActionPlan topActions={topActions} />
        <ExportBar copied={copied} onCopy={handleCopy} />
      </main>
    </div>
  );
}

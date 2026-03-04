"use client";

import { useState, use } from "react";
import Link from "next/link";
import { useGetReport, isReportReady } from "@/hooks/useGetReport";
import { ReportCover } from "@/components/report/ReportCover";
import { ExecutiveSummary } from "@/components/report/ExecutiveSummary";
import { HeatMap } from "@/components/report/HeatMap";
import { RiskRegister } from "@/components/report/RiskRegister";
import { ActionPlan } from "@/components/report/ActionPlan";
import { ExportBar } from "@/components/report/ExportBar";
import { ComputedRisk, RiskTier, getRiskTier } from "@/lib/risks";
import { ReportRisk } from "@/api/services/reportsService";

// ─── Convert API risk shape → ComputedRisk used by existing components ────────
function toComputedRisk(r: ReportRisk, idx: number): ComputedRisk {
  return {
    id: r.question_id,
    idx: r.rank,
    name: r.risk_name,
    desc: r.risk_desc,
    hedge: r.hedge,
    section: r.section,
    p: r.probability,
    i: r.impact,
    score: r.score,
    tier: r.tier as RiskTier,
  };
}

// ─── Loading state ────────────────────────────────────────────────────────────
function LoadingState({ message }: { message: string }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        gap: 20,
        fontFamily: "var(--font-mono)",
      }}
    >
      {/* Animated dots */}
      <div style={{ display: "flex", gap: 6 }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "var(--ink)",
              opacity: 0.3,
              animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>
      <div
        style={{
          fontSize: 11,
          color: "rgba(14,14,14,0.4)",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}
      >
        {message}
      </div>
      <style>{`
        @keyframes pulse {
          0%, 80%, 100% { opacity: 0.15; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

// ─── Generating state (report exists but not ready yet) ───────────────────────
function GeneratingState() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        gap: 24,
        padding: 32,
        textAlign: "center",
      }}
    >
      {/* Spinner ring */}
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          border: "2px solid rgba(14,14,14,0.08)",
          borderTop: "2px solid var(--ink)",
          animation: "spin 1s linear infinite",
        }}
      />
      <div>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 9,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--red)",
            marginBottom: 10,
          }}
        >
          Generating your report
        </div>
        <h2
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(1.4rem, 3vw, 2rem)",
            fontWeight: 400,
            lineHeight: 1.2,
            marginBottom: 12,
          }}
        >
          Analysing your risk profile...
        </h2>
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: "rgba(14,14,14,0.4)",
            letterSpacing: "0.06em",
            lineHeight: 1.7,
          }}
        >
          This usually takes 30–60 seconds.
          <br />
          This page will update automatically.
        </p>
      </div>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

// ─── Error state ──────────────────────────────────────────────────────────────
function ErrorState({ message }: { message: string }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        gap: 16,
        padding: 32,
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "rgba(193,40,30,0.08)",
          border: "2px solid var(--red)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 22,
        }}
      >
        ✕
      </div>
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 9,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "var(--red)",
        }}
      >
        Failed to load report
      </div>
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          color: "rgba(14,14,14,0.5)",
          maxWidth: 340,
          lineHeight: 1.6,
        }}
      >
        {message}
      </p>
      <button
        onClick={() => window.location.reload()}
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          padding: "10px 24px",
          border: "1.5px solid var(--ink)",
          borderRadius: 2,
          background: "var(--ink)",
          color: "var(--paper)",
          cursor: "pointer",
        }}
      >
        Retry
      </button>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
interface Props {
  params: Promise<{ accessToken: string }>;
}

export default function ReportPage({ params }: Props) {
  const { accessToken } = use(params);
  const { data, loading, error, isReady, isPending } =
    useGetReport(accessToken);
  const [copied, setCopied] = useState(false);

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading && !data) {
    return <LoadingState message="Loading your report..." />;
  }

  // ── Error ──────────────────────────────────────────────────────────────────
  if (error) {
    return <ErrorState message={error} />;
  }

  // ── Still generating ───────────────────────────────────────────────────────
  if (isPending || (data && !isReportReady(data))) {
    return <GeneratingState />;
  }

  // ── Ready ──────────────────────────────────────────────────────────────────
  if (!data || !isReportReady(data)) return null;

  // Map API response → ComputedRisk for existing components
  const risks: ComputedRisk[] = data.risks.map(toComputedRisk);
  const criticalRisks = risks.filter(
    (r) => r.tier === "red" || r.tier === "watch",
  );
  const topActions = criticalRisks.slice(0, 3);

  const overallScore = data.overall_score;
  const scoreColor =
    overallScore > 40
      ? "var(--red)"
      : overallScore > 25
        ? "var(--amber)"
        : "var(--green)";

  const date = data.generated_at
    ? new Date(data.generated_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : new Date().toLocaleDateString("en-US", {
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

  // Display name: biz_name > email portion > fallback
  const displayEmail = data.biz_name || "";

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
          email={displayEmail}
          date={date}
          totalRisks={risks.length}
          overallScore={overallScore}
          scoreColor={scoreColor}
          criticalCount={criticalRisks.length}
        />

        {/* Use AI executive summary if available, otherwise fall back to component */}
        {data.executive_summary ? (
          <div className="fade-up-1" style={{ marginBottom: 48 }}>
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
              What We Found
            </div>
            <div
              style={{
                background:
                  criticalRisks.length > 0
                    ? "rgba(193,40,30,0.06)"
                    : "rgba(42,110,63,0.06)",
                borderLeft: `4px solid ${criticalRisks.length > 0 ? "var(--red)" : "var(--green)"}`,
                padding: "20px 24px",
                borderRadius: "0 2px 2px 0",
              }}
            >
              <p
                style={{
                  fontSize: 15,
                  lineHeight: 1.75,
                  color: "rgba(14,14,14,0.8)",
                }}
              >
                {data.executive_summary}
              </p>
            </div>
          </div>
        ) : (
          <ExecutiveSummary risks={risks} criticalRisks={criticalRisks} />
        )}

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

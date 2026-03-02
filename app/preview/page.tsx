"use client";
import Link from "next/link";
import { usePreviewData } from "@/lib/usePreviewData";
import { PreviewHeatMap } from "@/components/preview/PreviewHeatMap";
import { BlurredRiskRow } from "@/components/preview/BlurredRiskRow";
import { PaywallOverlay } from "@/components/preview/PaywallOverlay";

export default function PreviewPage() {
  const { risks, loaded } = usePreviewData();

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
        Analysing your risks...
      </div>
    );
  }

  const criticalRisks = risks.filter(
    (r) => r.tier === "red" || r.tier === "watch",
  );
  const topRisk = risks[0];
  const overallScore = risks.length
    ? Math.round(risks.reduce((s, r) => s + r.score, 0) / risks.length)
    : 0;
  const scoreColor =
    overallScore > 40
      ? "var(--red)"
      : overallScore > 25
        ? "var(--amber)"
        : "var(--green)";

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
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            color: "rgba(14,14,14,0.35)",
            display: "flex",
            gap: 20,
          }}
        >
          <span>{risks.length} risks identified</span>
          <span
            style={{
              color: criticalRisks.length > 0 ? "var(--red)" : "var(--green)",
            }}
          >
            {criticalRisks.length} need immediate attention
          </span>
        </div>
      </header>

      <main style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px 0" }}>
        {/* Score summary */}
        <div
          className="fade-up"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: 40,
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 9,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "rgba(14,14,14,0.35)",
                marginBottom: 6,
              }}
            >
              Your Risk Profile
            </div>
            <h1
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                fontWeight: 400,
                lineHeight: 1.1,
              }}
            >
              {criticalRisks.length > 0 ? (
                <>
                  We found{" "}
                  <em style={{ color: "var(--red)" }}>
                    {criticalRisks.length} serious
                  </em>{" "}
                  {criticalRisks.length === 1 ? "risk" : "risks"} that need
                  attention.
                </>
              ) : (
                <>
                  Your risk profile looks{" "}
                  <em style={{ color: "var(--green)" }}>
                    relatively manageable.
                  </em>
                </>
              )}
            </h1>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "3rem",
                lineHeight: 1,
                color: scoreColor,
              }}
            >
              {overallScore}
            </div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 9,
                color: "rgba(14,14,14,0.35)",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              Avg Risk Score
            </div>
          </div>
        </div>

        {/* Heat map */}
        <div className="fade-up-1" style={{ marginBottom: 48 }}>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 9,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "rgba(14,14,14,0.35)",
              marginBottom: 8,
            }}
          >
            Risk Heat Map
          </div>
          <PreviewHeatMap risks={risks} />
        </div>

        {/* Risk list with paywall */}
        <div
          className="fade-up-2"
          style={{ marginBottom: 0, position: "relative" }}
        >
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 9,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "rgba(14,14,14,0.35)",
              marginBottom: 12,
            }}
          >
            Risk Register — {risks.length} risks identified
          </div>

          <div style={{ position: "relative" }}>
            {risks.map((risk, i) => (
              <BlurredRiskRow key={risk.id} risk={risk} idx={i} />
            ))}
            <PaywallOverlay
              onUnlock={() => {}}
              criticalCount={criticalRisks.length}
              topRiskName={topRisk?.name ?? ""}
            />
          </div>
        </div>

        {/* Spacer so the overlay has room */}
        <div style={{ height: 400 }} />
      </main>
    </div>
  );
}

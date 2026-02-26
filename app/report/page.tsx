"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Answers,
  computeRisks,
  ComputedRisk,
  TIER_CONFIG,
  RiskTier,
  cellColor,
  toGridCell,
  toImpactRow,
} from "@/lib/risks";
import Link from "next/link";

// ─── HEAT MAP (full, no blur) ─────────────────────────────────────────────────

const IMPACT_LABELS = ["Very High", "High", "Medium", "Low", "Very Low"];
const PROB_LABELS = ["Very Low", "Low", "Medium", "High", "Very High"];

function HeatMap({ risks }: { risks: ComputedRisk[] }) {
  const [tooltip, setTooltip] = useState<{
    risk: ComputedRisk;
    x: number;
    y: number;
  } | null>(null);

  return (
    <div
      style={{
        background: "white",
        border: "2px solid var(--ink)",
        boxShadow: "5px 5px 0 var(--ink)",
        padding: 8,
        marginBottom: 40,
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "36px repeat(5, 1fr)",
          gridTemplateRows: "repeat(5, 1fr) 36px",
          gap: 0,
          aspectRatio: "6/6",
        }}
      >
        {[0, 1, 2, 3, 4].map((row) => (
          <>
            <div
              key={`y-${row}`}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                writingMode: "vertical-rl",
                transform: "rotate(180deg)",
                fontFamily: "var(--font-mono)",
                fontSize: 8,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "rgba(14,14,14,0.38)",
              }}
            >
              {IMPACT_LABELS[row]}
            </div>
            {[0, 1, 2, 3, 4].map((col) => {
              const dots = risks.filter(
                (r) => toGridCell(r.p) === col && toImpactRow(r.i) === row,
              );
              return (
                <div
                  key={`cell-${row}-${col}`}
                  style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: cellColor(row, col),
                    border: "1px solid rgba(14,14,14,0.06)",
                  }}
                >
                  {dots.map((risk, di) => {
                    const cfg = TIER_CONFIG[risk.tier];
                    return (
                      <div
                        key={risk.id}
                        onMouseEnter={(e) =>
                          setTooltip({ risk, x: e.clientX, y: e.clientY })
                        }
                        onMouseLeave={() => setTooltip(null)}
                        onMouseMove={(e) =>
                          setTooltip((t) =>
                            t ? { ...t, x: e.clientX, y: e.clientY } : null,
                          )
                        }
                        style={{
                          position: "absolute",
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          background: cfg.pillBg,
                          border: "2px solid white",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontFamily: "var(--font-mono)",
                          fontSize: 9,
                          fontWeight: 700,
                          color: "white",
                          left: `calc(50% + ${di * 22 - 14}px)`,
                          top: "calc(50% - 14px)",
                          zIndex: 2 + di,
                          cursor: "default",
                          transition: "transform 0.15s",
                        }}
                        onMouseOver={(e) => {
                          (e.currentTarget as HTMLDivElement).style.transform =
                            "scale(1.2)";
                          (e.currentTarget as HTMLDivElement).style.zIndex =
                            "20";
                        }}
                        onMouseOut={(e) => {
                          (e.currentTarget as HTMLDivElement).style.transform =
                            "scale(1)";
                          (e.currentTarget as HTMLDivElement).style.zIndex =
                            String(2 + di);
                        }}
                      >
                        {risk.idx}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </>
        ))}
        <div />
        {PROB_LABELS.map((l) => (
          <div
            key={l}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--font-mono)",
              fontSize: 8,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "rgba(14,14,14,0.38)",
              textAlign: "center",
              lineHeight: 1.2,
            }}
          >
            {l}
          </div>
        ))}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "6px 8px 2px",
          fontFamily: "var(--font-mono)",
          fontSize: 9,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "rgba(14,14,14,0.3)",
        }}
      >
        <span>↑ Impact</span>
        <span>Probability →</span>
      </div>
      <div
        style={{
          display: "flex",
          gap: 16,
          padding: "8px 8px 4px",
          flexWrap: "wrap",
        }}
      >
        {(
          Object.entries(TIER_CONFIG) as [
            RiskTier,
            (typeof TIER_CONFIG)[RiskTier],
          ][]
        ).map(([key, cfg]) => (
          <div
            key={key}
            style={{ display: "flex", alignItems: "center", gap: 6 }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: cfg.pillBg,
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 9,
                color: cfg.color,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              {key}
            </span>
          </div>
        ))}
      </div>
      {tooltip && (
        <div
          style={{
            position: "fixed",
            left: tooltip.x + 14,
            top: tooltip.y - 8,
            zIndex: 999,
            background: "var(--ink)",
            color: "var(--paper)",
            padding: "10px 14px",
            borderRadius: 2,
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            maxWidth: 240,
            lineHeight: 1.5,
            boxShadow: "3px 3px 0 rgba(14,14,14,0.25)",
            pointerEvents: "none",
          }}
        >
          <div style={{ fontWeight: 700, fontSize: 12, marginBottom: 4 }}>
            {tooltip.risk.name}
          </div>
          <div style={{ color: "rgba(244,240,232,0.55)", fontSize: 10 }}>
            P: {tooltip.risk.p}/10 · Impact: {tooltip.risk.i}/10 · Score:{" "}
            {tooltip.risk.score}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── RISK CARD ────────────────────────────────────────────────────────────────

function RiskCard({ risk, rank }: { risk: ComputedRisk; rank: number }) {
  const cfg = TIER_CONFIG[risk.tier];
  return (
    <div
      style={{
        background: cfg.bgDim,
        border: "1.5px solid rgba(14,14,14,0.09)",
        borderLeft: `4px solid ${cfg.color}`,
        borderRadius: "0 2px 2px 0",
        padding: "24px 24px 20px",
        marginBottom: 12,
        transition: "box-shadow 0.15s",
      }}
      onMouseEnter={(e) =>
        ((e.currentTarget as HTMLDivElement).style.boxShadow =
          "3px 3px 0 rgba(14,14,14,0.08)")
      }
      onMouseLeave={(e) =>
        ((e.currentTarget as HTMLDivElement).style.boxShadow = "none")
      }
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 12,
          marginBottom: 8,
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              color: "rgba(14,14,14,0.3)",
              flexShrink: 0,
            }}
          >
            #{rank}
          </span>
          <h3 style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.3 }}>
            {risk.name}
          </h3>
        </div>
        <div
          style={{
            display: "flex",
            gap: 8,
            flexShrink: 0,
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 9,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              padding: "3px 9px",
              borderRadius: 2,
              background: cfg.pillBg,
              color: cfg.pillColor,
              whiteSpace: "nowrap",
            }}
          >
            {cfg.label.split(" — ")[0]}
          </div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              color: "rgba(14,14,14,0.4)",
              whiteSpace: "nowrap",
            }}
          >
            P:{risk.p} · I:{risk.i}
          </div>
        </div>
      </div>
      <p
        style={{
          fontSize: 13,
          color: "rgba(14,14,14,0.6)",
          lineHeight: 1.6,
          marginBottom: 10,
        }}
      >
        {risk.desc}
      </p>
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          color: "var(--green)",
          paddingTop: 10,
          borderTop: "1px solid rgba(14,14,14,0.07)",
        }}
      >
        ▶ {risk.hedge}
      </div>
      {/* 30-day note for top risks */}
      {rank <= 3 && (
        <div
          style={{
            marginTop: 10,
            padding: "10px 12px",
            background: "rgba(14,14,14,0.04)",
            borderRadius: 2,
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 9,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "rgba(14,14,14,0.35)",
              marginBottom: 4,
            }}
          >
            What acting on this looks like in 30 days
          </div>
          <div
            style={{
              fontSize: 12,
              color: "rgba(14,14,14,0.55)",
              lineHeight: 1.55,
            }}
          >
            {THIRTY_DAY_PLANS[risk.tier]}
          </div>
        </div>
      )}
    </div>
  );
}

const THIRTY_DAY_PLANS: Record<RiskTier, string> = {
  red: "Schedule a 2-hour working session to document the specific scenario. Identify the single most impactful action you could take to reduce exposure. Start that action this week — don't plan to plan.",
  watch:
    "This is on fire, slowly. Set a 90-day deadline with a specific owner. Check in monthly. If it's not trending better, escalate your response.",
  manage:
    "Add to your quarterly operating review. Assign an owner. A 30-minute process improvement session will likely surface an easy fix.",
  ignore:
    "Note it, calendar a check-in in 6 months, and move on. Your attention is better spent elsewhere.",
};

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function ReportPage() {
  const router = useRouter();
  const [risks, setRisks] = useState<ComputedRisk[]>([]);
  const [email, setEmail] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const paid = sessionStorage.getItem("rm_paid");
    if (!paid) {
      router.push("/preview");
      return;
    }
    const raw = sessionStorage.getItem("rm_answers");
    if (!raw) {
      router.push("/assessment");
      return;
    }
    setRisks(computeRisks(JSON.parse(raw) as Answers));
    setEmail(sessionStorage.getItem("rm_email") ?? "");
    setLoaded(true);
  }, [router]);

  if (!loaded)
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

  const overallScore = risks.length
    ? Math.round(risks.reduce((s, r) => s + r.score, 0) / risks.length)
    : 0;
  const criticalRisks = risks.filter(
    (r) => r.tier === "red" || r.tier === "watch",
  );
  const topActions = risks
    .filter((r) => r.tier === "red" || r.tier === "watch")
    .slice(0, 3);
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

  const TIER_ORDER: RiskTier[] = ["red", "watch", "manage", "ignore"];

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
        {/* ── COVER ── */}
        <div
          className="fade-up"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: 48,
            paddingBottom: 32,
            borderBottom: "2px solid var(--ink)",
          }}
        >
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
              Risk Intelligence Report
            </div>
            <h1
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                fontWeight: 400,
                lineHeight: 1.05,
                marginBottom: 16,
              }}
            >
              Asymmetric <em style={{ color: "var(--red)" }}>Risk</em> Report
            </h1>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                color: "rgba(14,14,14,0.4)",
                lineHeight: 1.8,
              }}
            >
              {email && <div>{email}</div>}
              <div>{date}</div>
              <div>{risks.length} risks assessed across 5 dimensions</div>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "3.5rem",
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
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "rgba(14,14,14,0.35)",
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
              {criticalRisks.length} risk{criticalRisks.length !== 1 ? "s" : ""}{" "}
              needing attention
            </div>
          </div>
        </div>

        {/* ── EXECUTIVE SUMMARY ── */}
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
              {criticalRisks.length > 0
                ? `Your assessment reveals ${criticalRisks.length} risk${criticalRisks.length > 1 ? "s" : ""} that require immediate attention — specifically ${criticalRisks
                    .slice(0, 2)
                    .map((r) => r.name)
                    .join(
                      " and ",
                    )}. ${risks.filter((r) => r.tier === "red").length > 0 ? "Your Red Zone risks are particularly concerning: low probability but company-ending if they materialise, which means they're easy to ignore until it's too late." : "Your Watch List risks are active threats that are likely to occur and will hurt badly when they do."} The good news is that most of these risks are hedgeable with specific, concrete actions — and identifying them clearly is the first step.`
                : `Your risk profile is relatively manageable. No existential threats were identified that require immediate action. Your primary focus areas are: ${risks
                    .slice(0, 3)
                    .map((r) => r.name)
                    .join(
                      ", ",
                    )}. These are worth addressing but none represent company-ending scenarios in the near term.`}
            </p>
          </div>
        </div>

        {/* ── HEAT MAP ── */}
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

        {/* ── RISK REGISTER ── */}
        <div style={{ marginBottom: 48 }}>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 9,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(14,14,14,0.35)",
              marginBottom: 16,
            }}
          >
            Risk Register
          </div>
          {TIER_ORDER.map((tier) => {
            const items = risks.filter((r) => r.tier === tier);
            if (!items.length) return null;
            const cfg = TIER_CONFIG[tier];
            return (
              <div key={tier} style={{ marginBottom: 32 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 14,
                    paddingBottom: 8,
                    borderBottom: `1.5px solid ${cfg.color}`,
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 9,
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      padding: "4px 10px",
                      borderRadius: 2,
                      background: cfg.pillBg,
                      color: cfg.pillColor,
                    }}
                  >
                    {cfg.label}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 10,
                      color: cfg.color,
                      opacity: 0.7,
                    }}
                  >
                    {cfg.sublabel}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 10,
                      color: "rgba(14,14,14,0.3)",
                      marginLeft: "auto",
                    }}
                  >
                    {items.length} risk{items.length > 1 ? "s" : ""}
                  </div>
                </div>
                {items.map((risk, i) => (
                  <RiskCard
                    key={risk.id}
                    risk={risk}
                    rank={risks.indexOf(risk) + 1}
                  />
                ))}
              </div>
            );
          })}
        </div>

        {/* ── WHAT TO DO THIS WEEK ── */}
        {topActions.length > 0 && (
          <div
            style={{
              background: "var(--ink)",
              color: "var(--paper)",
              padding: "36px 36px 40px",
              borderRadius: 2,
              marginBottom: 40,
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 9,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "rgba(244,240,232,0.35)",
                marginBottom: 12,
              }}
            >
              Action Plan
            </div>
            <h2
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "1.6rem",
                fontWeight: 400,
                marginBottom: 28,
              }}
            >
              What To Do This Week
            </h2>
            {topActions.map((risk, i) => (
              <div
                key={risk.id}
                style={{
                  display: "flex",
                  gap: 16,
                  marginBottom: 20,
                  paddingBottom: 20,
                  borderBottom:
                    i < topActions.length - 1
                      ? "1px solid rgba(244,240,232,0.08)"
                      : "none",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 28,
                    fontWeight: 700,
                    color: "rgba(244,240,232,0.1)",
                    lineHeight: 1,
                    flexShrink: 0,
                    marginTop: -4,
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div>
                  <div
                    style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}
                  >
                    {risk.name}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: "rgba(244,240,232,0.55)",
                      lineHeight: 1.6,
                    }}
                  >
                    {risk.hedge}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── EXPORT ── */}
        <div
          className="no-print"
          style={{
            display: "flex",
            gap: 10,
            padding: 16,
            background: "var(--paper-dark)",
            border: "1.5px solid rgba(14,14,14,0.1)",
            borderRadius: 2,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 9,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "rgba(14,14,14,0.4)",
              marginRight: 4,
            }}
          >
            Export
          </span>
          {[
            {
              label: copied ? "✓ Copied!" : "📋 Copy text",
              action: handleCopy,
            },
            { label: "🖨 Print / PDF", action: () => window.print() },
          ].map((b) => (
            <button
              key={b.label}
              onClick={b.action}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                padding: "8px 16px",
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
          <Link
            href="/assessment"
            onClick={() => {
              sessionStorage.clear();
            }}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              padding: "8px 16px",
              border: "1.5px solid rgba(14,14,14,0.15)",
              borderRadius: 2,
              background: "white",
              color: "var(--ink)",
              cursor: "pointer",
              textDecoration: "none",
            }}
          >
            ↩ New Assessment
          </Link>
        </div>
      </main>
    </div>
  );
}

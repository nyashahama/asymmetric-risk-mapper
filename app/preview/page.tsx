"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Answers,
  computeRisks,
  ComputedRisk,
  TIER_CONFIG,
  cellColor,
  toGridCell,
  toImpactRow,
} from "@/lib/risks";
import Link from "next/link";

// ─── BLURRED HEAT MAP ─────────────────────────────────────────────────────────

const IMPACT_LABELS = ["Very High", "High", "Medium", "Low", "Very Low"];
const PROB_LABELS = ["Very Low", "Low", "Medium", "High", "Very High"];

function PreviewHeatMap({ risks }: { risks: ComputedRisk[] }) {
  return (
    <div
      style={{
        background: "white",
        border: "2px solid var(--ink)",
        boxShadow: "5px 5px 0 var(--ink)",
        padding: 8,
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
      {/* Axis labels */}
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
      {/* Legend */}
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
            string,
            (typeof TIER_CONFIG)[keyof typeof TIER_CONFIG],
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
    </div>
  );
}

// ─── BLURRED RISK ROW (teaser) ────────────────────────────────────────────────

function BlurredRiskRow({ risk, idx }: { risk: ComputedRisk; idx: number }) {
  const cfg = TIER_CONFIG[risk.tier];
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "28px 1fr auto",
        gap: 12,
        alignItems: "start",
        padding: "16px",
        border: "1.5px solid rgba(14,14,14,0.08)",
        borderRadius: 2,
        background: cfg.bgDim,
        marginBottom: 8,
        position: "relative",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          color: "rgba(14,14,14,0.3)",
          paddingTop: 3,
        }}
      >
        #{risk.idx}
      </div>
      <div
        style={{
          filter: idx > 1 ? "blur(5px)" : "none",
          userSelect: idx > 1 ? "none" : "auto",
          transition: "filter 0.3s",
        }}
      >
        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 3 }}>
          {risk.name}
        </div>
        <div
          style={{ fontSize: 12, color: "rgba(14,14,14,0.5)", lineHeight: 1.5 }}
        >
          {risk.desc}
        </div>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            color: "var(--green)",
            marginTop: 6,
          }}
        >
          ▶ {risk.hedge}
        </div>
      </div>
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 9,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          padding: "3px 8px",
          borderRadius: 2,
          background: cfg.pillBg,
          color: cfg.pillColor,
          whiteSpace: "nowrap",
          alignSelf: "start",
        }}
      >
        {cfg.label.split(" — ")[0]}
      </div>
    </div>
  );
}

// ─── PAYWALL OVERLAY ──────────────────────────────────────────────────────────

function PaywallOverlay({
  onUnlock,
  criticalCount,
  topRiskName,
}: {
  onUnlock: () => void;
  criticalCount: number;
  topRiskName: string;
}) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    if (!email || !email.includes("@")) return;
    setLoading(true);
    // In production: call your Go backend → create Stripe session
    // For now, simulate and go to report
    await new Promise((r) => setTimeout(r, 1200));
    sessionStorage.setItem("rm_email", email);
    sessionStorage.setItem("rm_paid", "true");
    window.location.href = "/report";
  };

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background:
          "linear-gradient(to bottom, rgba(244,240,232,0) 0%, rgba(244,240,232,0.97) 30%, rgba(244,240,232,1) 50%)",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        paddingBottom: 0,
        zIndex: 10,
      }}
    >
      <div
        style={{
          width: "100%",
          background: "var(--ink)",
          color: "var(--paper)",
          padding: "40px 40px 44px",
          boxShadow: "0 -4px 40px rgba(14,14,14,0.15)",
        }}
      >
        {/* Alarm line */}
        {criticalCount > 0 && (
          <div
            style={{
              background: "var(--red)",
              color: "white",
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              padding: "8px 14px",
              borderRadius: 2,
              marginBottom: 20,
              display: "inline-block",
            }}
          >
            ⚠ {criticalCount} existential risk{criticalCount > 1 ? "s" : ""}{" "}
            identified — including: {topRiskName}
          </div>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: 40,
            alignItems: "start",
          }}
        >
          <div>
            <h3
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(1.4rem, 2.5vw, 2rem)",
                fontWeight: 400,
                marginBottom: 12,
                lineHeight: 1.2,
              }}
            >
              Your heat map is ready.
              <br />
              <em style={{ color: "rgba(244,240,232,0.55)" }}>
                Unlock the full report.
              </em>
            </h3>
            <p
              style={{
                fontSize: 13,
                lineHeight: 1.7,
                color: "rgba(244,240,232,0.55)",
                maxWidth: 440,
                marginBottom: 24,
              }}
            >
              You've identified your risks. The full report tells you exactly
              what to do about the ones that matter — with specific hedge
              actions and a 30-day plan.
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                marginBottom: 0,
              }}
            >
              {[
                "Full risk register with specific hedge actions",
                "Executive summary written in plain language",
                "30-day action plan for your top risks",
                "PDF download emailed to you",
              ].map((item) => (
                <div
                  key={item}
                  style={{
                    display: "flex",
                    gap: 8,
                    alignItems: "center",
                    fontSize: 13,
                    color: "rgba(244,240,232,0.7)",
                  }}
                >
                  <span
                    style={{ color: "rgba(244,240,232,0.35)", fontSize: 12 }}
                  >
                    ✓
                  </span>{" "}
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Payment form */}
          <div
            style={{
              background: "rgba(244,240,232,0.08)",
              border: "1.5px solid rgba(244,240,232,0.12)",
              borderRadius: 2,
              padding: "28px 24px",
              minWidth: 300,
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 9,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "rgba(244,240,232,0.35)",
                marginBottom: 4,
              }}
            >
              One-time payment
            </div>
            <div
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "2.5rem",
                lineHeight: 1,
                marginBottom: 20,
              }}
            >
              $59
            </div>

            <div style={{ marginBottom: 12 }}>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 9,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "rgba(244,240,232,0.35)",
                  marginBottom: 6,
                }}
              >
                Email (we'll send your report here)
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  background: "rgba(244,240,232,0.08)",
                  border: "1.5px solid rgba(244,240,232,0.15)",
                  borderRadius: 2,
                  color: "var(--paper)",
                  fontFamily: "var(--font-sans)",
                  fontSize: 14,
                  outline: "none",
                  boxSizing: "border-box",
                }}
                onFocus={(e) =>
                  (e.target.style.borderColor = "rgba(244,240,232,0.4)")
                }
                onBlur={(e) =>
                  (e.target.style.borderColor = "rgba(244,240,232,0.15)")
                }
                onKeyDown={(e) => e.key === "Enter" && handlePay()}
              />
            </div>

            <button
              onClick={handlePay}
              disabled={loading || !email.includes("@")}
              style={{
                width: "100%",
                padding: "13px",
                background: loading ? "rgba(244,240,232,0.15)" : "var(--paper)",
                color: loading ? "rgba(244,240,232,0.4)" : "var(--ink)",
                border: "none",
                borderRadius: 2,
                cursor: loading ? "wait" : "pointer",
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                transition: "all 0.15s",
                marginBottom: 10,
              }}
            >
              {loading ? "Processing..." : "Unlock Full Report →"}
            </button>

            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 9,
                color: "rgba(244,240,232,0.25)",
                textAlign: "center",
                lineHeight: 1.5,
              }}
            >
              Powered by Stripe · Secure · Account created automatically
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function PreviewPage() {
  const router = useRouter();
  const [risks, setRisks] = useState<ComputedRisk[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("rm_answers");
    if (!raw) {
      router.push("/assessment");
      return;
    }
    const answers = JSON.parse(raw) as Answers;
    const computed = computeRisks(answers);
    setRisks(computed);
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
        Analysing your risks...
      </div>
    );

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

        {/* Heat map — fully visible, no blur */}
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

        {/* Risk list — first 2 visible, rest blurred */}
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

            {/* Paywall overlay */}
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

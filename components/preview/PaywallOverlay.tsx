import { useState } from "react";

const FEATURES = [
  "Full risk register with specific hedge actions",
  "Executive summary written in plain language",
  "30-day action plan for your top risks",
  "PDF download emailed to you",
];

interface Props {
  criticalCount: number;
  topRiskName: string;
  onUnlock: () => void;
}

export function PaywallOverlay({
  criticalCount,
  topRiskName,
  onUnlock,
}: Props) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    if (!email || !email.includes("@")) return;
    setLoading(true);
    // In production: call your Go backend → create Stripe session
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
        {/* Alarm badge */}
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
          {/* Left: copy */}
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
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {FEATURES.map((item) => (
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

          {/* Right: payment form */}
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

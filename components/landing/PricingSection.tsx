import { WHAT_YOU_GET } from "@/lib/landingData";
import { StartButton } from "@/components/landing/StartButton";

export function PricingSection() {
  return (
    <section style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 32px" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 48,
          alignItems: "start",
        }}
      >
        {/* Left: pitch */}
        <div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(14,14,14,0.4)",
              marginBottom: 12,
            }}
          >
            Pricing
          </div>
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(1.8rem, 3.5vw, 2.75rem)",
              fontWeight: 400,
              marginBottom: 16,
            }}
          >
            $59. One report.
            <br />
            No subscription.
          </h2>
          <p
            style={{
              fontSize: 14,
              lineHeight: 1.7,
              color: "rgba(14,14,14,0.55)",
              marginBottom: 32,
            }}
          >
            You do the assessment for free. You only pay if you want the full
            report — after you&apos;ve already seen the heat map preview and
            decided it&apos;s worth it.
          </p>
          <StartButton
            label="Start the Assessment — Free →"
            style={{
              display: "inline-flex",
              fontSize: 11,
              padding: "13px 28px",
            }}
          />
        </div>

        {/* Right: feature list */}
        <div
          style={{
            background: "white",
            border: "2px solid var(--ink)",
            padding: 32,
            boxShadow: "5px 5px 0 var(--ink)",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "rgba(14,14,14,0.4)",
              marginBottom: 16,
            }}
          >
            What you get
          </div>
          {WHAT_YOU_GET.map((item) => (
            <div
              key={item}
              style={{
                display: "flex",
                gap: 10,
                marginBottom: 12,
                alignItems: "flex-start",
              }}
            >
              <span
                style={{
                  color: "var(--green)",
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  flexShrink: 0,
                  marginTop: 1,
                }}
              >
                ✓
              </span>
              <span style={{ fontSize: 13, lineHeight: 1.5 }}>{item}</span>
            </div>
          ))}
          <div
            style={{
              marginTop: 24,
              paddingTop: 20,
              borderTop: "1.5px solid rgba(14,14,14,0.08)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                color: "rgba(14,14,14,0.4)",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              One-time
            </span>
            <span
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "2.2rem",
                fontWeight: 400,
              }}
            >
              $59
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

import { RISK_EXAMPLES } from "@/lib/landingData";

export function FourBucketsSection() {
  return (
    <section style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 32px" }}>
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
        The Framework
      </div>
      <h2
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
          fontWeight: 400,
          marginBottom: 16,
          maxWidth: 600,
        }}
      >
        Four buckets. Most people have never sorted their risks into them.
      </h2>
      <p
        style={{
          fontSize: 14,
          color: "rgba(14,14,14,0.55)",
          marginBottom: 48,
          maxWidth: 560,
          lineHeight: 1.7,
        }}
      >
        We don&apos;t ask you to rate your own risks — you&apos;ll
        systematically underestimate what&apos;s existential and overestimate
        what&apos;s merely annoying. The model does the scoring.
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 16,
        }}
      >
        {RISK_EXAMPLES.map((ex) => (
          <div
            key={ex.tier}
            style={{
              padding: "24px 20px",
              background: "white",
              border: "1.5px solid rgba(14,14,14,0.1)",
              borderLeft: `4px solid ${ex.color}`,
              borderRadius: "0 2px 2px 0",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 9,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: ex.color,
                marginBottom: 10,
              }}
            >
              {ex.tier}
            </div>
            <p
              style={{
                fontSize: 13,
                lineHeight: 1.55,
                color: "rgba(14,14,14,0.7)",
                marginBottom: 12,
              }}
            >
              {ex.desc}
            </p>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                color: "rgba(14,14,14,0.35)",
                paddingTop: 12,
                borderTop: "1px solid rgba(14,14,14,0.08)",
              }}
            >
              e.g. {ex.example}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

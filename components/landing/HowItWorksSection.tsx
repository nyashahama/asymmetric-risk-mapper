import { HOW_IT_WORKS } from "@/lib/landingData";

export function HowItWorksSection() {
  return (
    <section
      style={{
        background: "var(--ink)",
        color: "var(--paper)",
        padding: "80px 32px",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "rgba(244,240,232,0.4)",
            marginBottom: 12,
          }}
        >
          How It Works
        </div>
        <h2
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(1.8rem, 3.5vw, 2.75rem)",
            fontWeight: 400,
            marginBottom: 60,
          }}
        >
          Built for operators who are tired of generic advice.
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 40,
          }}
        >
          {HOW_IT_WORKS.map((item) => (
            <div key={item.step}>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 28,
                  fontWeight: 700,
                  color: "rgba(244,240,232,0.12)",
                  marginBottom: 12,
                  lineHeight: 1,
                }}
              >
                {item.step}
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "1.3rem",
                  fontWeight: 400,
                  marginBottom: 10,
                }}
              >
                {item.title}
              </h3>
              <p
                style={{
                  fontSize: 13,
                  lineHeight: 1.7,
                  color: "rgba(244,240,232,0.55)",
                }}
              >
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

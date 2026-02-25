// components/landing/HowItWorks.tsx

const STEPS = [
  {
    n: "01",
    title: "Answer the weird questions",
    body: "We ask 20–25 questions most advisors won't. About dependencies, single points of failure, your actual cash position, what would happen if key people left.",
    accent: "#ef4444",
  },
  {
    n: "02",
    title: "See your risk landscape",
    body: "A heat map plots every identified risk by probability vs. impact. The ones in the top-left corner are your existential risks — low chance, but company-ending.",
    accent: "#f59e0b",
  },
  {
    n: "03",
    title: "Get a prioritised action list",
    body: "Not a list of everything to worry about. A ranked list of what to hedge first, with specific mitigation tactics for each existential-tier risk.",
    accent: "#22c55e",
  },
];

export function HowItWorks() {
  return (
    <section
      style={{
        padding: "120px 60px",
        maxWidth: 1200,
        margin: "0 auto",
      }}
    >
      <p
        style={{
          fontSize: 10,
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          color: "#475569",
          marginBottom: 16,
        }}
      >
        The process
      </p>

      <h2
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: "clamp(36px, 4vw, 56px)",
          lineHeight: 1.1,
          fontWeight: 700,
          marginBottom: 60,
          color: "#f1f5f9",
          maxWidth: 480,
        }}
      >
        Three steps.
        <br />
        <em style={{ fontWeight: 400, color: "#94a3b8" }}>Brutally simple.</em>
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 2,
        }}
      >
        {STEPS.map(({ n, title, body, accent }) => (
          <div
            key={n}
            style={{
              padding: "48px 40px",
              borderTop: `3px solid ${accent}`,
              background: "#0f1419",
            }}
          >
            <div
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 64,
                color: "#1e293b",
                lineHeight: 1,
                marginBottom: 24,
                fontWeight: 700,
                fontStyle: "italic",
              }}
            >
              {n}
            </div>
            <h3
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 16,
                color: "#e2e8f0",
                marginBottom: 16,
                fontWeight: 500,
              }}
            >
              {title}
            </h3>
            <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.8 }}>
              {body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

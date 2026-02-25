// components/landing/PricingSection.tsx

const INCLUDES = [
  "Full probability × impact heat map (interactive)",
  "6–12 risks identified and scored by AI",
  "Specific hedge action for every risk",
  '"What To Do This Week" priority checklist',
  "Downloadable PDF report",
  "Calibrated to your specific industry and size",
];

export function PricingSection() {
  return (
    <section
      style={{
        padding: "120px 60px",
        maxWidth: 1200,
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 80,
        alignItems: "center",
      }}
    >
      {/* Left: copy */}
      <div>
        <p
          style={{
            fontSize: 10,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "#475569",
            marginBottom: 16,
          }}
        >
          Pricing
        </p>

        <h2
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "clamp(36px, 4vw, 52px)",
            lineHeight: 1.1,
            fontWeight: 700,
            marginBottom: 24,
            color: "#f1f5f9",
          }}
        >
          Pay after you
          <br />
          <em style={{ fontWeight: 400, color: "#94a3b8" }}>
            see the preview.
          </em>
        </h2>

        <p
          style={{
            fontSize: 14,
            color: "#64748b",
            lineHeight: 1.85,
            maxWidth: 440,
            marginBottom: 40,
          }}
        >
          You answer the questions first. After 8–10 minutes, you see a blurred
          preview of your heat map — enough to know whether the risks we found
          are worth $49 to understand. Then you decide.
        </p>

        <p
          style={{
            fontSize: 12,
            color: "#334155",
            lineHeight: 1.7,
            maxWidth: 400,
            fontStyle: "italic",
          }}
        >
          Most people have never separated what could kill their business from
          what&apos;s just annoying. That&apos;s what this does.
        </p>
      </div>

      {/* Right: price card */}
      <div
        style={{
          background: "#0f1419",
          border: "1px solid #1e293b",
          borderRadius: 12,
          padding: "48px 40px",
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
          <span
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 72,
              fontWeight: 900,
              color: "#f1f5f9",
              lineHeight: 1,
            }}
          >
            $49
          </span>
          <div>
            <div style={{ fontSize: 13, color: "#94a3b8" }}>one-time</div>
            <div style={{ fontSize: 11, color: "#334155" }}>
              no subscription
            </div>
          </div>
        </div>

        <div
          style={{
            borderTop: "1px solid #1e293b",
            paddingTop: 24,
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          {INCLUDES.map((item) => (
            <div
              key={item}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 10,
                fontSize: 13,
                color: "#94a3b8",
                lineHeight: 1.5,
              }}
            >
              <span style={{ color: "#22c55e", fontSize: 11, marginTop: 1 }}>
                ✓
              </span>
              {item}
            </div>
          ))}
        </div>

        <a
          href="/assessment"
          style={{
            display: "block",
            background: "#ef4444",
            color: "#fff",
            padding: "15px",
            borderRadius: 6,
            fontFamily: "'DM Mono', monospace",
            fontSize: 14,
            textAlign: "center",
            textDecoration: "none",
            transition: "background 0.15s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#dc2626";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#ef4444";
          }}
        >
          Start free — pay to unlock →
        </a>

        <p
          style={{
            fontSize: 11,
            color: "#1e293b",
            textAlign: "center",
          }}
        >
          Secure checkout via Stripe
        </p>
      </div>
    </section>
  );
}

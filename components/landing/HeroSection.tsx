import { TOTAL_QUESTIONS, ESTIMATED_MINUTES } from "@/lib/risks";
import { RISK_EXAMPLES } from "@/lib/landingData";
import { StartButton } from "@/components/landing/StartButton";

export function HeroSection() {
  return (
    <section
      style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 32px 96px" }}
    >
      <div style={{ maxWidth: 760 }}>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--red)",
            marginBottom: 20,
          }}
        >
          Risk Intelligence for Small Business
        </div>
        <h1
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
            lineHeight: 1.02,
            fontWeight: 400,
            marginBottom: 28,
          }}
        >
          Most businesses stress about the wrong risks.
          <br />
          <em style={{ color: "var(--red)" }}>
            This one finds the right ones.
          </em>
        </h1>
        <p
          style={{
            fontSize: 17,
            lineHeight: 1.7,
            color: "rgba(14,14,14,0.65)",
            maxWidth: 580,
            marginBottom: 40,
          }}
        >
          Answer {TOTAL_QUESTIONS} questions. Get a risk heat map that separates
          what could actually end your business from the things that are merely
          annoying. Then hedge only what matters.
        </p>
        <div
          style={{
            display: "flex",
            gap: 14,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <StartButton label="Start the Assessment — Free →" />
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              color: "rgba(14,14,14,0.4)",
            }}
          >
            ~{ESTIMATED_MINUTES} min · No account needed · $59 to unlock report
          </span>
        </div>
      </div>

      {/* Risk tier preview cards */}
      <div
        style={{
          marginTop: 72,
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr",
          gap: 8,
          maxWidth: 600,
        }}
      >
        {RISK_EXAMPLES.map((ex) => (
          <div
            key={ex.tier}
            style={{
              background: "white",
              border: "1.5px solid rgba(14,14,14,0.1)",
              borderRadius: 2,
              padding: "14px 12px",
              borderTop: `3px solid ${ex.color}`,
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 8,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: ex.color,
                marginBottom: 6,
              }}
            >
              {ex.tier}
            </div>
            <div
              style={{
                fontSize: 11,
                lineHeight: 1.4,
                color: "rgba(14,14,14,0.6)",
                marginBottom: 8,
              }}
            >
              {ex.desc}
            </div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 9,
                color: "rgba(14,14,14,0.35)",
                fontStyle: "italic",
              }}
            >
              {ex.example}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

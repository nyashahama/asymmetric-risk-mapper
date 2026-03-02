import { TESTIMONIALS } from "@/lib/landingData";

export function TestimonialsSection() {
  return (
    <section
      style={{
        background: "var(--paper-dark)",
        padding: "72px 32px",
        borderTop: "1px solid rgba(14,14,14,0.08)",
        borderBottom: "1px solid rgba(14,14,14,0.08)",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 24,
          }}
        >
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              style={{
                background: "white",
                padding: "24px",
                border: "1.5px solid rgba(14,14,14,0.1)",
                borderRadius: 2,
              }}
            >
              <p
                style={{
                  fontSize: 14,
                  lineHeight: 1.65,
                  fontStyle: "italic",
                  marginBottom: 16,
                  color: "rgba(14,14,14,0.75)",
                }}
              >
                &quot;{t.quote}&quot;
              </p>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  color: "rgba(14,14,14,0.4)",
                }}
              >
                <span style={{ fontWeight: 700, color: "var(--ink)" }}>
                  {t.name}
                </span>{" "}
                · {t.role}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

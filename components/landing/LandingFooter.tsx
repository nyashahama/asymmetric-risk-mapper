export function LandingFooter() {
  return (
    <footer
      style={{
        borderTop: "1.5px solid rgba(14,14,14,0.1)",
        padding: "32px 32px",
        maxWidth: 1100,
        margin: "0 auto",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            color: "rgba(14,14,14,0.35)",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          <span style={{ color: "var(--red)" }}>▲</span> Risk Mapper · Built for
          operators
        </div>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            color: "rgba(14,14,14,0.35)",
          }}
        >
          Questions? hello@riskmapper.co
        </div>
      </div>
    </footer>
  );
}

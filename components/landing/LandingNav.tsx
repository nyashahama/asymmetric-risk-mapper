import Link from "next/link";

export function LandingNav() {
  return (
    <nav
      style={{
        maxWidth: 1100,
        margin: "0 auto",
        padding: "24px 32px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "var(--ink)",
        }}
      >
        <span style={{ color: "var(--red)" }}>▲</span> Risk Mapper
      </div>
      <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            color: "rgba(14,14,14,0.4)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          $59 · One-time
        </span>
        <Link
          href="/assessment"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            padding: "9px 20px",
            background: "var(--ink)",
            color: "var(--paper)",
            textDecoration: "none",
            borderRadius: 2,
          }}
        >
          Start Free →
        </Link>
      </div>
    </nav>
  );
}

// components/landing/FooterSection.tsx

export function FooterSection() {
  return (
    <footer
      style={{
        borderTop: "1px solid #1e293b",
        padding: "40px 60px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontFamily: "'DM Mono', monospace",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "#ef4444",
          }}
        />
        <span
          style={{
            fontSize: 11,
            color: "#334155",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          Asymmetric Risk Mapper
        </span>
      </div>

      <div
        style={{
          display: "flex",
          gap: 32,
          alignItems: "center",
        }}
      >
        <a
          href="/assessment"
          style={{
            fontSize: 12,
            color: "#334155",
            textDecoration: "none",
            transition: "color 0.15s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#94a3b8")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#334155")}
        >
          Start assessment
        </a>
        <span style={{ fontSize: 11, color: "#1e293b" }}>
          © {new Date().getFullYear()} · Built for founders who think
          asymmetrically
        </span>
      </div>
    </footer>
  );
}

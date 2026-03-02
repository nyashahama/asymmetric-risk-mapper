interface Props {
  email: string;
  date: string;
  totalRisks: number;
  overallScore: number;
  scoreColor: string;
  criticalCount: number;
}

export function ReportCover({
  email,
  date,
  totalRisks,
  overallScore,
  scoreColor,
  criticalCount,
}: Props) {
  return (
    <div
      className="fade-up"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        marginBottom: 48,
        paddingBottom: 32,
        borderBottom: "2px solid var(--ink)",
      }}
    >
      <div>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 9,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--red)",
            marginBottom: 10,
          }}
        >
          Risk Intelligence Report
        </div>
        <h1
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            fontWeight: 400,
            lineHeight: 1.05,
            marginBottom: 16,
          }}
        >
          Asymmetric <em style={{ color: "var(--red)" }}>Risk</em> Report
        </h1>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            color: "rgba(14,14,14,0.4)",
            lineHeight: 1.8,
          }}
        >
          {email && <div>{email}</div>}
          <div>{date}</div>
          <div>{totalRisks} risks assessed across 5 dimensions</div>
        </div>
      </div>

      <div style={{ textAlign: "right" }}>
        <div
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "3.5rem",
            lineHeight: 1,
            color: scoreColor,
          }}
        >
          {overallScore}
        </div>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 9,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "rgba(14,14,14,0.35)",
          }}
        >
          Risk Score / 100
        </div>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            color: scoreColor,
            marginTop: 4,
          }}
        >
          {criticalCount} risk{criticalCount !== 1 ? "s" : ""} needing attention
        </div>
      </div>
    </div>
  );
}

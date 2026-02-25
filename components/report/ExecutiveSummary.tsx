// components/report/ExecutiveSummary.tsx

interface ExecutiveSummaryProps {
  summary: string;
  existentialCount: number;
}

export function ExecutiveSummary({
  summary,
  existentialCount,
}: ExecutiveSummaryProps) {
  return (
    <section>
      <p
        style={{
          fontSize: 10,
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          color: "#334155",
          marginBottom: 16,
        }}
      >
        What We Found
      </p>

      <div
        style={{
          background: "#0f1419",
          border: "1px solid #1e293b",
          borderLeft: "3px solid #ef4444",
          borderRadius: 8,
          padding: "32px 36px",
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <div
          style={{
            alignSelf: "flex-start",
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.25)",
            borderRadius: 4,
            color: "#ef4444",
            fontSize: 10,
            letterSpacing: "0.12em",
            padding: "5px 10px",
            textTransform: "uppercase",
          }}
        >
          {existentialCount} existential-tier{" "}
          {existentialCount === 1 ? "risk" : "risks"} identified
        </div>

        <p
          style={{
            fontSize: 15,
            lineHeight: 1.85,
            color: "#cbd5e1",
          }}
        >
          {summary}
        </p>
      </div>
    </section>
  );
}

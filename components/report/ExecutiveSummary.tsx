import { ComputedRisk } from "@/lib/risks";

interface Props {
  risks: ComputedRisk[];
  criticalRisks: ComputedRisk[];
}

export function ExecutiveSummary({ risks, criticalRisks }: Props) {
  const hasRedZone = risks.some((r) => r.tier === "red");

  const summaryText =
    criticalRisks.length > 0
      ? `Your assessment reveals ${criticalRisks.length} risk${criticalRisks.length > 1 ? "s" : ""} that require immediate attention — specifically ${criticalRisks
          .slice(0, 2)
          .map((r) => r.name)
          .join(" and ")}. ${
          hasRedZone
            ? "Your Red Zone risks are particularly concerning: low probability but company-ending if they materialise, which means they're easy to ignore until it's too late."
            : "Your Watch List risks are active threats that are likely to occur and will hurt badly when they do."
        } The good news is that most of these risks are hedgeable with specific, concrete actions — and identifying them clearly is the first step.`
      : `Your risk profile is relatively manageable. No existential threats were identified that require immediate action. Your primary focus areas are: ${risks
          .slice(0, 3)
          .map((r) => r.name)
          .join(
            ", ",
          )}. These are worth addressing but none represent company-ending scenarios in the near term.`;

  return (
    <div className="fade-up-1" style={{ marginBottom: 48 }}>
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 9,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "rgba(14,14,14,0.35)",
          marginBottom: 10,
        }}
      >
        What We Found
      </div>
      <div
        style={{
          background:
            criticalRisks.length > 0
              ? "rgba(193,40,30,0.06)"
              : "rgba(42,110,63,0.06)",
          borderLeft: `4px solid ${criticalRisks.length > 0 ? "var(--red)" : "var(--green)"}`,
          padding: "20px 24px",
          borderRadius: "0 2px 2px 0",
        }}
      >
        <p
          style={{
            fontSize: 15,
            lineHeight: 1.75,
            color: "rgba(14,14,14,0.8)",
          }}
        >
          {summaryText}
        </p>
      </div>
    </div>
  );
}

import { ComputedRisk } from "@/lib/risks";

interface Props {
  topActions: ComputedRisk[];
}

export function ActionPlan({ topActions }: Props) {
  if (!topActions.length) return null;

  return (
    <div
      style={{
        background: "var(--ink)",
        color: "var(--paper)",
        padding: "36px 36px 40px",
        borderRadius: 2,
        marginBottom: 40,
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 9,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "rgba(244,240,232,0.35)",
          marginBottom: 12,
        }}
      >
        Action Plan
      </div>
      <h2
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: "1.6rem",
          fontWeight: 400,
          marginBottom: 28,
        }}
      >
        What To Do This Week
      </h2>
      {topActions.map((risk, i) => (
        <div
          key={risk.id}
          style={{
            display: "flex",
            gap: 16,
            marginBottom: 20,
            paddingBottom: 20,
            borderBottom:
              i < topActions.length - 1
                ? "1px solid rgba(244,240,232,0.08)"
                : "none",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 28,
              fontWeight: 700,
              color: "rgba(244,240,232,0.1)",
              lineHeight: 1,
              flexShrink: 0,
              marginTop: -4,
            }}
          >
            {String(i + 1).padStart(2, "0")}
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>
              {risk.name}
            </div>
            <div
              style={{
                fontSize: 13,
                color: "rgba(244,240,232,0.55)",
                lineHeight: 1.6,
              }}
            >
              {risk.hedge}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

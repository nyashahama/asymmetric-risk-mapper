interface Props {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: Props) {
  const pct = Math.round((current / total) * 100);
  return (
    <div style={{ marginBottom: 40 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 6,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 9,
            color: "rgba(14,14,14,0.35)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          Question {current} of {total}
        </span>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 9,
            color: "rgba(14,14,14,0.35)",
          }}
        >
          {pct}%
        </span>
      </div>
      <div style={{ height: 2, background: "rgba(14,14,14,0.08)" }}>
        <div
          style={{
            height: "100%",
            background: "var(--ink)",
            width: `${pct}%`,
            transition: "width 0.4s cubic-bezier(.16,1,.3,1)",
          }}
        />
      </div>
    </div>
  );
}

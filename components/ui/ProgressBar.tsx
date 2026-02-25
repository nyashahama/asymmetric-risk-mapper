// components/ui/ProgressBar.tsx

interface ProgressBarProps {
  value: number; // 0–100
  color?: string;
  label?: string;
}

export function ProgressBar({
  value,
  color = "#ef4444",
  label,
}: ProgressBarProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div
        style={{
          height: 2,
          background: "#1e293b",
          borderRadius: 1,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${Math.min(100, Math.max(0, value))}%`,
            background: color,
            borderRadius: 1,
            transition: "width 0.4s ease",
          }}
        />
      </div>
      {label && (
        <span
          style={{
            fontSize: 11,
            color: "#334155",
            fontFamily: "'DM Mono', monospace",
          }}
        >
          {label}
        </span>
      )}
    </div>
  );
}

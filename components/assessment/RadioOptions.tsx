// ─── RadioOptions.tsx ─────────────────────────────────────────────────────────
// Updated to use the API's QuestionOption shape instead of string[].

import { QuestionOption } from "@/api/services/questionsService";

interface RadioOptionsProps {
  options: QuestionOption[];
  value: string;
  onChange: (v: string) => void;
}

export function RadioOptions({ options, value, onChange }: RadioOptionsProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {options.map((opt) => {
        const sel = value === opt.label;
        return (
          <button
            key={opt.label}
            onClick={() => onChange(opt.label)}
            style={{
              textAlign: "left",
              padding: "13px 16px",
              border: `1.5px solid ${sel ? "var(--ink)" : "rgba(14,14,14,0.14)"}`,
              borderRadius: 2,
              background: sel ? "var(--ink)" : "white",
              color: sel ? "var(--paper)" : "var(--ink)",
              fontSize: 14,
              cursor: "pointer",
              transition: "all 0.12s",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <span
              style={{
                width: 16,
                height: 16,
                borderRadius: "50%",
                flexShrink: 0,
                border: `1.5px solid ${sel ? "var(--paper)" : "rgba(14,14,14,0.25)"}`,
                background: sel ? "var(--paper)" : "transparent",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.12s",
              }}
            >
              {sel && (
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: "var(--ink)",
                    display: "block",
                  }}
                />
              )}
            </span>
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

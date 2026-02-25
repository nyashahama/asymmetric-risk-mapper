// components/report/ActionChecklist.tsx

import { URGENCY_CONFIG } from "@/lib/utils";
import type { TopAction } from "@/types/report";

interface ActionChecklistProps {
  actions: TopAction[];
}

export function ActionChecklist({ actions }: ActionChecklistProps) {
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
        What To Do This Week
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {actions.map((action, i) => {
          const cfg = URGENCY_CONFIG[action.urgency];
          return (
            <div
              key={action.riskId}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 18,
                padding: "18px 22px",
                background: "#0f1419",
                border: "1px solid #1e293b",
                borderRadius: 6,
              }}
            >
              {/* Number badge */}
              <div
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 18,
                  fontStyle: "italic",
                  fontWeight: 700,
                  border: `1px solid ${cfg.color}40`,
                  borderRadius: 4,
                  width: 38,
                  height: 38,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: cfg.color,
                  flexShrink: 0,
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </div>

              {/* Content */}
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: 11,
                    color: "#475569",
                    marginBottom: 4,
                  }}
                >
                  {action.riskName}
                </div>
                <p style={{ fontSize: 14, color: "#e2e8f0", lineHeight: 1.65 }}>
                  {action.action}
                </p>
              </div>

              {/* Urgency badge */}
              <div
                style={{
                  padding: "4px 10px",
                  borderRadius: 4,
                  fontSize: 10,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  background: cfg.color + "15",
                  color: cfg.color,
                  flexShrink: 0,
                  alignSelf: "center",
                }}
              >
                {cfg.label}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

"use client";

import { STEPS } from "@/lib/risks";

interface StepTrackProps {
  currentStep: number; // 0-indexed
}

export function StepTrack({ currentStep }: StepTrackProps) {
  return (
    <div className="flex items-center mb-12">
      {STEPS.map((label, i) => {
        const isDone = currentStep > i;
        const isActive = currentStep === i;

        return (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            {/* Step item */}
            <div
              className="flex items-center gap-2"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: isDone
                  ? "var(--green)"
                  : isActive
                    ? "var(--ink)"
                    : "rgba(14,14,14,0.35)",
                transition: "color 0.2s",
              }}
            >
              {/* Number bubble */}
              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  border: "1.5px solid currentColor",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 9,
                  flexShrink: 0,
                  background: isDone
                    ? "var(--green)"
                    : isActive
                      ? "var(--ink)"
                      : "transparent",
                  color: isDone || isActive ? "var(--paper)" : "currentColor",
                  borderColor: isDone
                    ? "var(--green)"
                    : isActive
                      ? "var(--ink)"
                      : "currentColor",
                }}
              >
                {isDone ? "✓" : i + 1}
              </div>
              <span className="hidden sm:inline">{label}</span>
            </div>

            {/* Connector line */}
            {i < STEPS.length - 1 && (
              <div
                className="flex-1 mx-2"
                style={{
                  height: 1.5,
                  background: isDone ? "var(--green)" : "rgba(14,14,14,0.12)",
                  transition: "background 0.3s",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

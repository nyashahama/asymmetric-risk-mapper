// components/assessment/AnswerInputs.tsx
"use client";

import type { Question } from "@/types/assessment";

interface AnswerInputsProps {
  question: Question;
  value: string | undefined;
  onChange: (value: string) => void;
  onSelectAnswer: (value: string) => void;
}

export function AnswerInputs({
  question,
  value,
  onChange,
  onSelectAnswer,
}: AnswerInputsProps) {
  if (question.type === "select") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {question.options?.map((opt) => {
          const isSelected = value === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => onSelectAnswer(opt.value)}
              style={{
                background: isSelected
                  ? "rgba(239,68,68,0.06)"
                  : "rgba(255,255,255,0.02)",
                border: isSelected ? "1px solid #ef4444" : "1px solid #1e293b",
                borderRadius: 6,
                color: isSelected ? "#e2e8f0" : "#64748b",
                cursor: "pointer",
                fontFamily: "'DM Mono', monospace",
                fontSize: 13,
                lineHeight: 1.5,
                padding: "13px 18px",
                textAlign: "left",
                transition: "all 0.15s ease",
              }}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <textarea
      autoFocus
      rows={question.type === "textarea" ? 4 : 2}
      placeholder={question.placeholder}
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid #1e293b",
        borderRadius: 6,
        color: "#e2e8f0",
        fontFamily: "'DM Mono', monospace",
        fontSize: 14,
        lineHeight: 1.75,
        outline: "none",
        padding: "16px 18px",
        resize: "vertical",
        width: "100%",
        transition: "border-color 0.15s ease",
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = "#334155";
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = "#1e293b";
      }}
    />
  );
}

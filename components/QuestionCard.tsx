"use client";

import { QuestionCompat as Question } from "@/lib/risks";

// ─── SLIDER ───────────────────────────────────────────────────────────────────

interface SliderQuestionProps {
  question: Question;
  value: number;
  onChange: (v: number) => void;
}

export function SliderQuestion({
  question,
  value,
  onChange,
}: SliderQuestionProps) {
  const min = question.min ?? 0;
  const max = question.max ?? 10;
  const pct = (((value - min) / (max - min)) * 100).toFixed(0);

  return (
    <div className="pb-8 relative">
      {/* Labels */}
      <div
        className="flex justify-between mb-3"
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          color: "rgba(14,14,14,0.4)",
        }}
      >
        <span>{question.minLabel}</span>
        <span>{question.maxLabel}</span>
      </div>

      {/* Slider */}
      <input
        type="range"
        className="risk-slider"
        min={min}
        max={max}
        value={value}
        style={{ "--slider-pct": `${pct}%` } as React.CSSProperties}
        onChange={(e) => onChange(parseInt(e.target.value))}
      />

      {/* Current value */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2"
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          fontWeight: 700,
          color: "var(--ink)",
          whiteSpace: "nowrap",
        }}
      >
        {value} / {max}
      </div>
    </div>
  );
}

// ─── RADIO ────────────────────────────────────────────────────────────────────

interface RadioQuestionProps {
  question: Question;
  value: string | undefined;
  onChange: (v: string) => void;
}

export function RadioQuestion({
  question,
  value,
  onChange,
}: RadioQuestionProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {(question.opts ?? []).map((opt) => {
        const selected = value === opt;
        return (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: "0.05em",
              padding: "7px 14px",
              border: "1.5px solid",
              borderColor: selected ? "var(--ink)" : "rgba(14,14,14,0.18)",
              borderRadius: 2,
              background: selected ? "var(--ink)" : "transparent",
              color: selected ? "var(--paper)" : "var(--ink)",
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

// ─── QUESTION CARD WRAPPER ────────────────────────────────────────────────────

interface QuestionCardProps {
  question: Question;
  value: number | string | undefined;
  onChange: (v: number | string) => void;
  animationDelay?: string;
}

export function QuestionCard({
  question,
  value,
  onChange,
  animationDelay = "0s",
}: QuestionCardProps) {
  return (
    <div className="fade-up" style={{ animationDelay }}>
      <div
        style={{
          background: "white",
          border: "1.5px solid rgba(14,14,14,0.12)",
          borderRadius: 2,
          padding: 24,
          marginBottom: 16,
          transition: "border-color 0.2s, box-shadow 0.2s",
        }}
        onFocus={(e) => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.borderColor = "var(--ink)";
          el.style.boxShadow = "3px 3px 0 var(--ink)";
        }}
        onBlur={(e) => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.borderColor = "rgba(14,14,14,0.12)";
          el.style.boxShadow = "none";
        }}
      >
        {/* Category tag */}
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 9,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "rgba(14,14,14,0.35)",
            marginBottom: 8,
          }}
        >
          {question.category} Risk
        </div>

        {/* Question text */}
        <p
          style={{
            fontSize: 15,
            fontWeight: 500,
            lineHeight: 1.5,
            marginBottom: 4,
          }}
        >
          {question.text}
        </p>

        {/* Hint */}
        <p
          style={{
            fontSize: 12,
            color: "rgba(14,14,14,0.5)",
            fontStyle: "italic",
            marginBottom: 20,
            lineHeight: 1.55,
          }}
        >
          {question.hint}
        </p>

        {/* Input */}
        {question.type === "slider" ? (
          <SliderQuestion
            question={question}
            value={typeof value === "number" ? value : 5}
            onChange={(v) => onChange(v)}
          />
        ) : (
          <RadioQuestion
            question={question}
            value={typeof value === "string" ? value : undefined}
            onChange={(v) => onChange(v)}
          />
        )}
      </div>
    </div>
  );
}

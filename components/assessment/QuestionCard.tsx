// components/assessment/QuestionCard.tsx
"use client";

import { AnswerInputs } from "./AnswerInputs";
import type { Question } from "@/types/assessment";

interface QuestionCardProps {
  question: Question;
  questionIndex: number;
  totalInSection: number;
  sectionTitle: string;
  sectionIndex: number;
  totalSections: number;
  value: string | undefined;
  onChange: (value: string) => void;
  onSelectAnswer: (value: string) => void;
  canAdvance: boolean;
  isLastQuestion: boolean;
  isLastSection: boolean;
  onNext: () => void;
  onBack: () => void;
  showBack: boolean;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export function QuestionCard({
  question,
  questionIndex,
  totalInSection,
  sectionTitle,
  sectionIndex,
  totalSections,
  value,
  onChange,
  onSelectAnswer,
  canAdvance,
  isLastQuestion,
  isLastSection,
  onNext,
  onBack,
  showBack,
  onSubmit,
  isSubmitting,
}: QuestionCardProps) {
  const isFinalStep = isLastSection && isLastQuestion;

  return (
    <main
      style={{
        flex: 1,
        padding: "80px 80px 48px",
        maxWidth: 700,
        display: "flex",
        flexDirection: "column",
        gap: 36,
      }}
    >
      {/* Section badge */}
      <p
        style={{
          fontSize: 10,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "#475569",
        }}
      >
        {sectionTitle} · {sectionIndex + 1} of {totalSections}
      </p>

      {/* Question */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <span
          style={{
            fontSize: 11,
            color: "#1e293b",
            fontStyle: "italic",
          }}
        >
          {String(questionIndex + 1).padStart(2, "0")} / {totalInSection}
        </span>

        <h2
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "clamp(22px, 2.8vw, 34px)",
            lineHeight: 1.25,
            fontWeight: 700,
            color: "#f1f5f9",
          }}
        >
          {question.text}
        </h2>

        {question.subtext && (
          <p
            style={{
              fontSize: 13,
              color: "#475569",
              lineHeight: 1.75,
              maxWidth: 500,
            }}
          >
            {question.subtext}
          </p>
        )}
      </div>

      {/* Answer inputs */}
      <AnswerInputs
        question={question}
        value={value}
        onChange={onChange}
        onSelectAnswer={onSelectAnswer}
      />

      {/* Navigation */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          borderTop: "1px solid #1e293b",
          paddingTop: 20,
          gap: 12,
          marginTop: "auto",
        }}
      >
        {showBack && (
          <button
            onClick={onBack}
            style={{
              background: "none",
              border: "none",
              color: "#334155",
              cursor: "pointer",
              fontFamily: "'DM Mono', monospace",
              fontSize: 12,
            }}
          >
            ← Back
          </button>
        )}

        <div style={{ flex: 1 }} />

        {/* Only show Next/Submit for non-select questions */}
        {question.type !== "select" && (
          <button
            disabled={!canAdvance || isSubmitting}
            onClick={isFinalStep ? onSubmit : onNext}
            style={{
              background: "#ef4444",
              border: "none",
              borderRadius: 4,
              color: "#fff",
              cursor: canAdvance ? "pointer" : "not-allowed",
              fontFamily: "'DM Mono', monospace",
              fontSize: 13,
              padding: "12px 24px",
              opacity: canAdvance && !isSubmitting ? 1 : 0.35,
              transition: "all 0.15s ease",
            }}
          >
            {isSubmitting
              ? "Submitting..."
              : isFinalStep
                ? "See my risks →"
                : "Next →"}
          </button>
        )}
      </div>
    </main>
  );
}

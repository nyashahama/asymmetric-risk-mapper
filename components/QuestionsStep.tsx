"use client";

import { QUESTIONS, Answers } from "@/lib/risks";
import { QuestionCard } from "./QuestionCard";

interface QuestionsStepProps {
  answers: Answers;
  onAnswer: (id: string, value: string | number) => void;
  qIdx: number;
  onNext: () => void;
  onPrev: () => void;
}

export function QuestionsStep({
  answers,
  onAnswer,
  qIdx,
  onNext,
  onPrev,
}: QuestionsStepProps) {
  const question = QUESTIONS[qIdx];
  const total = QUESTIONS.length;
  const progressPct = ((Object.keys(answers).length / total) * 100).toFixed(0);
  const currentValue = answers[question.id];
  const canNext = currentValue !== undefined;

  return (
    <div>
      {/* Progress header */}
      <div className="mb-2">
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 9,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "rgba(14,14,14,0.4)",
            marginBottom: 2,
          }}
        >
          Question {qIdx + 1} of {total}
        </div>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            color: "rgba(14,14,14,0.4)",
          }}
        >
          {progressPct}% complete · Category: {question.category}
        </div>
      </div>

      {/* Progress bar */}
      <div
        style={{
          height: 2,
          background: "rgba(14,14,14,0.08)",
          marginBottom: 32,
        }}
      >
        <div
          style={{
            height: "100%",
            background: "var(--ink)",
            width: `${progressPct}%`,
            transition: "width 0.4s cubic-bezier(.16,1,.3,1)",
          }}
        />
      </div>

      {/* Question card */}
      <QuestionCard
        key={question.id}
        question={question}
        value={currentValue ?? (question.type === "slider" ? 5 : undefined)}
        onChange={(v) => onAnswer(question.id, v)}
      />

      {/* Navigation */}
      <div className="flex items-center gap-3 mt-8">
        <button
          onClick={onPrev}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "rgba(14,14,14,0.4)",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.color = "var(--ink)")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.color =
              "rgba(14,14,14,0.4)")
          }
        >
          ← Back
        </button>

        <button
          onClick={onNext}
          disabled={!canNext}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            padding: "12px 28px",
            border: "1.5px solid var(--ink)",
            borderRadius: 2,
            background: "var(--ink)",
            color: "var(--paper)",
            cursor: canNext ? "pointer" : "not-allowed",
            opacity: canNext ? 1 : 0.4,
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => {
            if (!canNext) return;
            (e.currentTarget as HTMLButtonElement).style.background =
              "var(--red)";
            (e.currentTarget as HTMLButtonElement).style.borderColor =
              "var(--red)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              "var(--ink)";
            (e.currentTarget as HTMLButtonElement).style.borderColor =
              "var(--ink)";
          }}
        >
          {qIdx < total - 1 ? "Next Question →" : "Build My Risk Map →"}
        </button>
      </div>
    </div>
  );
}

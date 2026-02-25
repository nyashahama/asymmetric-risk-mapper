// app/assessment/page.tsx
"use client";

import { useAssessment } from "@/hooks/useAssessment";
import { SECTIONS } from "@/config/questions";
import { AssessmentShell } from "@/components/assessment/AssessmentShell";
import { SectionSidebar } from "@/components/assessment/SectionSidebar";
import { QuestionCard } from "@/components/assessment/QuestionCard";

export default function AssessmentPage() {
  const {
    state,
    currentSection,
    currentQuestion,
    currentAnswer,
    isLastSection,
    isLastQuestion,
    isComplete,
    progressPercent,
    canAdvance,
    setAnswer,
    goNext,
    goBack,
    handleSelectAnswer,
    submit,
  } = useAssessment();

  const sidebar = (
    <SectionSidebar
      sections={SECTIONS}
      currentSectionIndex={state.currentSectionIndex}
      progressPercent={progressPercent}
    />
  );

  if (isComplete) {
    return (
      <AssessmentShell sidebar={sidebar}>
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 20,
              textAlign: "center",
              maxWidth: 380,
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                border: "1px solid #22c55e",
                background: "rgba(34,197,94,0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                color: "#22c55e",
              }}
            >
              ✓
            </div>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 30,
                fontWeight: 700,
                color: "#f1f5f9",
              }}
            >
              Assessment complete.
            </h2>
            <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.75 }}>
              Analysing your answers and building your risk map.
            </p>
            {state.error && (
              <p style={{ fontSize: 12, color: "#ef4444" }}>{state.error}</p>
            )}
            <button
              disabled={state.isSubmitting}
              onClick={submit}
              style={{
                background: "#ef4444",
                border: "none",
                borderRadius: 4,
                color: "#fff",
                cursor: "pointer",
                fontFamily: "'DM Mono', monospace",
                fontSize: 13,
                padding: "12px 24px",
                opacity: state.isSubmitting ? 0.5 : 1,
              }}
            >
              {state.isSubmitting ? "Submitting..." : "See my risk report →"}
            </button>
          </div>
        </div>
      </AssessmentShell>
    );
  }

  if (!currentSection || !currentQuestion) return null;

  return (
    <AssessmentShell sidebar={sidebar}>
      <QuestionCard
        question={currentQuestion}
        questionIndex={state.currentQuestionIndex}
        totalInSection={currentSection.questions.length}
        sectionTitle={currentSection.title}
        sectionIndex={state.currentSectionIndex}
        totalSections={SECTIONS.length}
        value={currentAnswer}
        onChange={(val) => setAnswer(currentQuestion.id, val)}
        onSelectAnswer={handleSelectAnswer}
        canAdvance={canAdvance}
        isLastQuestion={isLastQuestion}
        isLastSection={isLastSection}
        onNext={goNext}
        onBack={goBack}
        showBack={
          state.currentSectionIndex > 0 || state.currentQuestionIndex > 0
        }
        onSubmit={submit}
        isSubmitting={state.isSubmitting}
      />
    </AssessmentShell>
  );
}

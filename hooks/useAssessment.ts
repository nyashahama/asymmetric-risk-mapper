// hooks/useAssessment.ts
"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { SECTIONS, TOTAL_QUESTIONS } from "@/config/questions";
import { createSession } from "@/lib/api";
import type { AssessmentState } from "@/types/assessment";

export function useAssessment() {
  const router = useRouter();

  const [state, setState] = useState<AssessmentState>({
    currentSectionIndex: 0,
    currentQuestionIndex: 0,
    answers: {},
    isSubmitting: false,
    error: null,
  });

  // ── Derived ───────────────────────────────────────────────────────────────

  const currentSection = useMemo(
    () => SECTIONS[state.currentSectionIndex],
    [state.currentSectionIndex],
  );

  const currentQuestion = useMemo(
    () => currentSection?.questions[state.currentQuestionIndex],
    [currentSection, state.currentQuestionIndex],
  );

  const isLastSection = state.currentSectionIndex === SECTIONS.length - 1;
  const isLastQuestion =
    state.currentQuestionIndex === (currentSection?.questions.length ?? 1) - 1;
  const isComplete = state.currentSectionIndex >= SECTIONS.length;

  const progressPercent = Math.round(
    (Object.keys(state.answers).length / TOTAL_QUESTIONS) * 100,
  );

  const currentAnswer = currentQuestion
    ? state.answers[currentQuestion.id]
    : undefined;

  const canAdvance =
    !currentQuestion ||
    !currentQuestion.required ||
    (currentAnswer !== undefined && currentAnswer !== "");

  // ── Actions ───────────────────────────────────────────────────────────────

  const setAnswer = useCallback((questionId: string, value: string) => {
    setState((prev) => ({
      ...prev,
      answers: { ...prev.answers, [questionId]: value },
    }));
  }, []);

  const goNext = useCallback(() => {
    setState((prev) => {
      const section = SECTIONS[prev.currentSectionIndex];
      const isLastQ =
        prev.currentQuestionIndex === section.questions.length - 1;
      if (isLastQ) {
        return {
          ...prev,
          currentSectionIndex: prev.currentSectionIndex + 1,
          currentQuestionIndex: 0,
        };
      }
      return { ...prev, currentQuestionIndex: prev.currentQuestionIndex + 1 };
    });
  }, []);

  const goBack = useCallback(() => {
    setState((prev) => {
      if (prev.currentQuestionIndex > 0) {
        return { ...prev, currentQuestionIndex: prev.currentQuestionIndex - 1 };
      }
      if (prev.currentSectionIndex > 0) {
        const prevSection = SECTIONS[prev.currentSectionIndex - 1];
        return {
          ...prev,
          currentSectionIndex: prev.currentSectionIndex - 1,
          currentQuestionIndex: prevSection.questions.length - 1,
        };
      }
      return prev;
    });
  }, []);

  // Auto-advance after select answer with brief visual feedback
  const handleSelectAnswer = useCallback(
    (value: string) => {
      if (!currentQuestion) return;
      setAnswer(currentQuestion.id, value);
      setTimeout(goNext, 180);
    },
    [currentQuestion, setAnswer, goNext],
  );

  const submit = useCallback(async () => {
    setState((prev) => ({ ...prev, isSubmitting: true, error: null }));
    try {
      const { sessionId } = await createSession(state.answers);
      router.push(`/report/${sessionId}/preview`);
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isSubmitting: false,
        error: err instanceof Error ? err.message : "Something went wrong",
      }));
    }
  }, [state.answers, router]);

  return {
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
  };
}

import { useState, useEffect, useCallback } from "react";
import {
  questionsService,
  Question,
  QuestionSection,
  GetQuestionsResponse,
} from "@/api/services/questionsService";

interface UseGetQuestionsState {
  data: GetQuestionsResponse | null;
  sections: QuestionSection[];
  // Flat map of questionID → current answer. Initialised from saved_answer
  // fields and updated locally as the user answers — so the heat map preview
  // stays reactive without a round-trip.
  answers: Record<string, string>;
  totalAnswered: number;
  loading: boolean;
  error: string | null;
}

export function useGetQuestions(sessionID: string | null) {
  const [state, setState] = useState<UseGetQuestionsState>({
    data: null,
    sections: [],
    answers: {},
    totalAnswered: 0,
    loading: false,
    error: null,
  });

  const fetchQuestions = useCallback(async () => {
    if (!sessionID) return;
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const data = await questionsService.getQuestions(sessionID);

      // Hydrate local answer map from saved_answer fields.
      const answers: Record<string, string> = {};
      for (const q of data.questions) {
        answers[q.id] = q.saved_answer ?? "";
      }

      setState({
        data,
        sections: questionsService.groupBySections(data.questions),
        answers,
        totalAnswered: data.total_answered,
        loading: false,
        error: null,
      });
    } catch (err: any) {
      const msg =
        err?.response?.data?.error ??
        err?.message ??
        "Failed to load questions";
      setState((prev) => ({ ...prev, loading: false, error: msg }));
    }
  }, [sessionID]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  /**
   * setAnswer updates the local answer state immediately (optimistic UI).
   * Call upsertAnswers separately to persist — typically on debounce or
   * section navigation. This keeps the heat map preview snappy.
   */
  const setAnswer = useCallback((questionID: string, value: string) => {
    setState((prev) => {
      const wasEmpty = !prev.answers[questionID];
      const isEmpty = !value;
      const delta = wasEmpty && !isEmpty ? 1 : !wasEmpty && isEmpty ? -1 : 0;
      return {
        ...prev,
        answers: { ...prev.answers, [questionID]: value },
        totalAnswered: prev.totalAnswered + delta,
      };
    });
  }, []);

  /**
   * Returns all current answers as AnswerInput[] ready to pass to
   * upsertAnswers. Pass a question list to include client_p/client_i
   * scores derived from the selected option.
   */
  const buildAnswerPayload = useCallback(
    (questions: Question[]) => {
      return questions
        .filter((q) => q.is_scoring)
        .map((q) => {
          const answer = state.answers[q.id] ?? "";
          const opt = q.options?.find((o) => o.label === answer);
          return {
            question_id: q.id,
            answer_text: answer,
            ...(opt ? { client_p: opt.p_score, client_i: opt.i_score } : {}),
          };
        });
    },
    [state.answers],
  );

  return {
    ...state,
    refetch: fetchQuestions,
    setAnswer,
    buildAnswerPayload,
  };
}

import { useState, useCallback } from "react";
import {
  answersService,
  UpsertAnswersRequest,
  UpsertAnswersResponse,
} from "@/api/services/answersService";

interface UseUpsertAnswersState {
  data: UpsertAnswersResponse | null;
  loading: boolean;
  error: string | null;
}

export function useUpsertAnswers(sessionID: string) {
  const [state, setState] = useState<UseUpsertAnswersState>({
    data: null,
    loading: false,
    error: null,
  });

  const upsertAnswers = useCallback(
    async (req: UpsertAnswersRequest) => {
      setState({ data: null, loading: true, error: null });
      try {
        const data = await answersService.upsertAnswers(sessionID, req);
        setState({ data, loading: false, error: null });
        return data;
      } catch (err: any) {
        const msg =
          err?.response?.data?.error ??
          err?.message ??
          "Failed to upsert answers";
        setState({ data: null, loading: false, error: msg });
        throw err;
      }
    },
    [sessionID],
  );

  return { ...state, upsertAnswers };
}

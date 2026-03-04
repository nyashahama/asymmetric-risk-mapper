import { useState, useCallback } from "react";
import {
  sessionsService,
  CreateSessionRequest,
  CreateSessionResponse,
} from "@/api/services/sessionsService";

interface UseCreateSessionState {
  data: CreateSessionResponse | null;
  loading: boolean;
  error: string | null;
}

export function useCreateSession() {
  const [state, setState] = useState<UseCreateSessionState>({
    data: null,
    loading: false,
    error: null,
  });

  const createSession = useCallback(async (req: CreateSessionRequest = {}) => {
    setState({ data: null, loading: true, error: null });
    try {
      const data = await sessionsService.createSession(req);
      // Store both — apiClient interceptor uses anon_token for every request,
      // assessment page uses session_id to build the /questions URL.
      localStorage.setItem("anon_token", data.anon_token);
      localStorage.setItem("session_id", data.session_id);
      setState({ data, loading: false, error: null });
      return data;
    } catch (err: any) {
      const msg =
        err?.response?.data?.error ??
        err?.message ??
        "Failed to create session";
      setState({ data: null, loading: false, error: msg });
      throw err;
    }
  }, []);

  return { ...state, createSession };
}

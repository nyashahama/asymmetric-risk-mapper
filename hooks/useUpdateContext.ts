import { useState, useCallback } from "react";
import {
  sessionsService,
  UpdateContextRequest,
  UpdateContextResponse,
} from "@/api/services/sessionsService";

interface UseUpdateContextState {
  data: UpdateContextResponse | null;
  loading: boolean;
  error: string | null;
}

export function useUpdateContext() {
  const [state, setState] = useState<UseUpdateContextState>({
    data: null,
    loading: false,
    error: null,
  });

  const updateContext = useCallback(
    async (sessionID: string, anonToken: string, req: UpdateContextRequest) => {
      setState({ data: null, loading: true, error: null });
      try {
        const data = await sessionsService.updateContext(
          sessionID,
          anonToken,
          req,
        );
        setState({ data, loading: false, error: null });
        return data;
      } catch (err: any) {
        const msg =
          err?.response?.data?.error ??
          err?.message ??
          "Failed to update context";
        setState({ data: null, loading: false, error: msg });
        throw err;
      }
    },
    [],
  );

  return { ...state, updateContext };
}

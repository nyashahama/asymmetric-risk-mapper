import { useState, useCallback } from "react";
import {
  checkoutService,
  CreateCheckoutRequest,
  CreateCheckoutResponse,
} from "@/api/services/checkoutService";

interface UseCreateCheckoutState {
  data: CreateCheckoutResponse | null;
  loading: boolean;
  error: string | null;
}

export function useCreateCheckout(sessionID: string) {
  const [state, setState] = useState<UseCreateCheckoutState>({
    data: null,
    loading: false,
    error: null,
  });

  const createCheckout = useCallback(
    async (req: CreateCheckoutRequest) => {
      setState({ data: null, loading: true, error: null });
      try {
        const data = await checkoutService.createCheckout(sessionID, req);
        setState({ data, loading: false, error: null });
        return data;
      } catch (err: any) {
        const msg =
          err?.response?.data?.error ??
          err?.message ??
          "Failed to create checkout";
        setState({ data: null, loading: false, error: msg });
        throw err;
      }
    },
    [sessionID],
  );

  return { ...state, createCheckout };
}

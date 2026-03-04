import { useState, useEffect, useCallback, useRef } from "react";
import {
  reportsService,
  GetReportResponse,
  ReportResponse,
  ReportPendingResponse,
} from "@/api/services/reportsService";

const POLL_INTERVAL_MS = 4000;

// Type guard to distinguish a ready report from a pending one
export function isReportReady(r: GetReportResponse): r is ReportResponse {
  return (r as ReportResponse).status === "ready";
}

interface UseGetReportState {
  data: GetReportResponse | null;
  loading: boolean;
  error: string | null;
  isReady: boolean;
  isPending: boolean;
}

// Automatically polls every 4s while the report status is not "ready".
// Polling stops when the report is ready, an error occurs, or the component unmounts.
export function useGetReport(accessToken: string | null) {
  const [state, setState] = useState<UseGetReportState>({
    data: null,
    loading: false,
    error: null,
    isReady: false,
    isPending: false,
  });

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPolling = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const fetchReport = useCallback(async () => {
    if (!accessToken) return;
    try {
      const data = await reportsService.getReport(accessToken);
      const ready = isReportReady(data);
      setState({
        data,
        loading: false,
        error: null,
        isReady: ready,
        isPending: !ready,
      });
      // Stop polling once the report is ready
      if (ready) stopPolling();
    } catch (err: any) {
      const msg =
        err?.response?.data?.error ?? err?.message ?? "Failed to fetch report";
      setState({
        data: null,
        loading: false,
        error: msg,
        isReady: false,
        isPending: false,
      });
      stopPolling();
    }
  }, [accessToken, stopPolling]);

  useEffect(() => {
    if (!accessToken) return;

    setState((prev) => ({ ...prev, loading: true, error: null }));

    // Fetch immediately, then start polling
    fetchReport();
    intervalRef.current = setInterval(fetchReport, POLL_INTERVAL_MS);

    return () => stopPolling();
  }, [accessToken, fetchReport, stopPolling]);

  return { ...state };
}

import apiClient from "../apiClient";

// ─── GET /api/report/:accessToken ─────────────────────────────────────────

export interface ReportRisk {
  rank: number;
  question_id: string;
  risk_name: string;
  risk_desc: string;
  probability: number;
  impact: number;
  score: number;
  tier: string;
  section: string;
  hedge: string;
}

export interface ReportResponse {
  report_id: string;
  status: "ready";
  biz_name?: string;
  industry?: string;
  stage?: string;
  overall_score: number;
  critical_count: number;
  executive_summary?: string;
  top_priority_html?: string;
  risks: ReportRisk[];
  generated_at?: string; // ISO 8601 UTC
}

export interface ReportPendingResponse {
  status: string; // e.g. "pending", "processing"
  message: string;
}

export type GetReportResponse = ReportResponse | ReportPendingResponse;

class ReportsService {
  // NOTE: apiClient already has /api as its baseURL, so do NOT repeat it here.
  private readonly baseUrl = "/report";

  /**
   * Fetches a report using its public access token.
   * The token is part of the URL (no authentication required).
   * @param accessToken - opaque token from the emailed link
   */
  async getReport(accessToken: string): Promise<GetReportResponse> {
    const url = `${this.baseUrl}/${accessToken}`;
    const response = await apiClient.get<GetReportResponse>(url);
    return response.data;
  }
}

export const reportsService = new ReportsService();

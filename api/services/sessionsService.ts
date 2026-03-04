import apiClient from "../apiClient";

// ─── POST /api/session ─────────────────────────────────────────────────────

export interface CreateSessionRequest {
  biz_name?: string;
  industry?: string;
  stage?: string;
}

export interface CreateSessionResponse {
  session_id: string;
  anon_token: string;
}

// ─── PATCH /api/session/:sessionID/context ─────────────────────────────────

export interface UpdateContextRequest {
  biz_name?: string;
  industry?: string;
  stage?: string;
}

export interface UpdateContextResponse {
  session_id: string;
  biz_name: string;
  industry: string;
  stage: string;
}

class SessionsService {
  private readonly baseUrl = "/session";

  /**
   * Creates a new anonymous session.
   * Called once when the assessment page loads.
   */
  async createSession(
    req: CreateSessionRequest = {},
  ): Promise<CreateSessionResponse> {
    const response = await apiClient.post<CreateSessionResponse>(
      this.baseUrl,
      req,
    );
    return response.data;
  }

  /**
   * Updates the business context (Step 1) for an existing session.
   * Requires the X-Anon-Token header.
   * @param sessionID - UUID of the session
   * @param anonToken - the anonymous token returned by createSession
   * @param req - context fields to update
   */
  async updateContext(
    sessionID: string,
    anonToken: string,
    req: UpdateContextRequest,
  ): Promise<UpdateContextResponse> {
    const url = `${this.baseUrl}/${sessionID}/context`;
    const response = await apiClient.patch<UpdateContextResponse>(url, req, {
      headers: {
        "X-Anon-Token": anonToken,
      },
    });
    return response.data;
  }
}

export const sessionsService = new SessionsService();

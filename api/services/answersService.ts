import apiClient from "../apiClient";

// Matches the Go `answerInput` struct:
// - question_id (required)
// - answer_text (required)
// - client_p, client_i (optional numbers, omitted if not provided)
export interface AnswerInput {
  question_id: string;
  answer_text: string;
  client_p?: number; // will be omitted if undefined (matches omitempty)
  client_i?: number;
}

// Matches the Go `upsertAnswersRequest` struct
export interface UpsertAnswersRequest {
  answers: AnswerInput[];
}

// Matches the Go `upsertAnswersResponse` struct (json:"upserted")
export interface UpsertAnswersResponse {
  upserted: number;
}

class AnswersService {
  // Adjust the base path if your apiClient already prefixes /api
  private readonly baseUrl = "/session/:sessionID/answers";

  /**
   * Batch upsert answers for a session.
   * @param sessionID - UUID of the session
   * @param upsertAnswersRequest - contains the array of answers
   * @returns Promise with the number of upserted answers
   */
  async upsertAnswers(
    sessionID: string,
    upsertAnswersRequest: UpsertAnswersRequest,
  ): Promise<UpsertAnswersResponse> {
    // Replace the placeholder with the actual session ID
    const url = this.baseUrl.replace(":sessionID", sessionID);

    const response = await apiClient.put<UpsertAnswersResponse>(
      url,
      upsertAnswersRequest,
    );

    return response.data;
  }
}

export const answersService = new AnswersService();

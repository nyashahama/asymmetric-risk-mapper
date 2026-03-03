import apiClient from "../apiClient";

export interface AnswerInput {
  QuestionID: string;
  AnswerText: string;
  ClientP?: number;
  ClientI?: number;
}

export interface UpsertAnswersRequest {
  Answers: number[];
}

export interface UpsertAnswersResponse {
  Upserted: number;
}

class AnswersService {
  private readonly baseUrl = "/session/:sessionID/answers";

  async upsertAnswers(
    id: string,
    upsertAnswersRequest: UpsertAnswersRequest,
  ): Promise<UpsertAnswersResponse> {
    const response = await apiClient.put<UpsertAnswersResponse>(
      `${this.baseUrl}/${id}`,
      upsertAnswersRequest,
    );
    return response.data;
  }
}

export const answersService = new AnswersService();

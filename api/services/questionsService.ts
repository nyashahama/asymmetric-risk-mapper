import apiClient from "../apiClient";

export interface QuestionOption {
  label: string;
  p_score: number;
  i_score: number;
}

export interface Question {
  id: string;
  section_id: string;
  section_title: string;
  display_order: number;
  text: string;
  subtext?: string;
  type: "radio" | "text" | "select";
  options?: QuestionOption[]; // present for radio/select only
  placeholder?: string;
  required: boolean;
  is_scoring: boolean;
  risk_name: string;
  risk_desc: string;
  // Populated from the session's saved answers — "" if unanswered.
  saved_answer: string;
}

export interface GetQuestionsResponse {
  questions: Question[];
  total_answered: number;
}

// Convenience type: questions grouped by section for rendering.
export interface QuestionSection {
  id: string;
  title: string;
  questions: Question[];
}

class QuestionsService {
  private readonly baseUrl = "/session";

  async getQuestions(sessionID: string): Promise<GetQuestionsResponse> {
    const res = await apiClient.get<GetQuestionsResponse>(
      `${this.baseUrl}/${sessionID}/questions`,
    );
    return res.data;
  }

  /** Groups a flat question list into sections, preserving display_order. */
  groupBySections(questions: Question[]): QuestionSection[] {
    const map = new Map<string, QuestionSection>();
    for (const q of questions) {
      if (!map.has(q.section_id)) {
        map.set(q.section_id, {
          id: q.section_id,
          title: q.section_title,
          questions: [],
        });
      }
      map.get(q.section_id)!.questions.push(q);
    }
    return Array.from(map.values());
  }
}

export const questionsService = new QuestionsService();

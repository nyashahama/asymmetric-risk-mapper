// types/assessment.ts

export type QuestionType = "text" | "textarea" | "number" | "select";

export interface QuestionOption {
  value: string;
  label: string;
}

export interface Question {
  id: string;
  sectionId: SectionId;
  text: string;
  subtext?: string;
  type: QuestionType;
  options?: QuestionOption[];
  placeholder?: string;
  required: boolean;
}

export type SectionId =
  | "snapshot"
  | "dependency"
  | "market"
  | "operational"
  | "blindspot";

export interface Section {
  id: SectionId;
  index: number; // 1-based
  title: string;
  subtitle: string;
  label: string;
  scored: boolean;
  questions: Question[];
}

export type AnswersMap = Record<string, string>;

export interface AssessmentState {
  currentSectionIndex: number;
  currentQuestionIndex: number;
  answers: AnswersMap;
  isSubmitting: boolean;
  error: string | null;
}

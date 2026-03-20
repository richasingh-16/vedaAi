export interface QuestionTypeRow {
  id: string;
  type: string;
  numberOfQuestions: number;
  marksPerQuestion: number;
}

export type Difficulty = "easy" | "moderate" | "challenging";
export type AssignmentStatus = "pending" | "processing" | "completed" | "failed";

export interface Question {
  id: string;
  text: string;
  type: string;
  difficulty: Difficulty;
  marks: number;
  options?: string[];
  answer?: string;
}

export interface Section {
  title: string;
  instruction: string;
  questions: Question[];
}

export interface AssignmentResult {
  schoolName: string;
  subject: string;
  className: string;
  timeAllowed: string;
  maxMarks: number;
  generalInstruction: string;
  sections: Section[];
  answerKey: { questionId: string; answer: string }[];
}

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  className: string;
  chapter: string;
  dueDate: string;
  assignedOn: string;
  questionTypes: QuestionTypeRow[];
  instructions: string;
  fileUrl?: string;
  status: AssignmentStatus;
  result?: AssignmentResult;
}

export interface FormStep1 {
  title: string;
  subject: string;
  className: string;
  chapter: string;
  dueDate: string;
  file: File | null;
}

export interface FormStep2 {
  questionTypes: QuestionTypeRow[];
  instructions: string;
}

export interface CreateFormData extends FormStep1, FormStep2 {}

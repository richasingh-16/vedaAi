export type Difficulty = "easy" | "moderate" | "challenging";
export type AssignmentStatus = "pending" | "processing" | "completed" | "failed";

export interface QuestionTypeInput {
  type: string;
  numberOfQuestions: number;
  marksPerQuestion: number;
}

export interface CreateAssignmentInput {
  title: string;
  subject: string;
  className: string;
  chapter: string;
  dueDate: string;
  questionTypes: QuestionTypeInput[];
  instructions?: string;
  fileContent?: string;
}

export interface Question {
  id: string;
  text: string;
  type: string;
  difficulty: Difficulty;
  marks: number;
  options?: string[];
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

// WebSocket event payloads
export interface WsEvent {
  type:
    | "assignment:queued"
    | "assignment:processing"
    | "assignment:completed"
    | "assignment:failed";
  assignmentId: string;
  payload?: AssignmentResult | { error: string };
}

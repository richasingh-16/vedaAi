import { create } from "zustand";
import { Assignment, CreateFormData, QuestionTypeRow } from "@/types";
import { mockAssignments } from "@/lib/mockData";

const DEFAULT_QUESTION_TYPES: QuestionTypeRow[] = [
  { id: "qt-default-1", type: "Multiple Choice Questions", numberOfQuestions: 4, marksPerQuestion: 1 },
  { id: "qt-default-2", type: "Short Questions", numberOfQuestions: 3, marksPerQuestion: 2 },
];

const DEFAULT_FORM: CreateFormData = {
  title: "",
  subject: "",
  className: "",
  chapter: "",
  dueDate: "",
  file: null,
  questionTypes: DEFAULT_QUESTION_TYPES,
  instructions: "",
};

interface AssignmentStore {
  // Data
  assignments: Assignment[];
  formData: CreateFormData;
  formStep: 1 | 2;
  generationStatus: "idle" | "generating" | "completed" | "failed";
  wsConnected: boolean;

  // Form actions
  setFormField: <K extends keyof CreateFormData>(key: K, value: CreateFormData[K]) => void;
  setFormStep: (step: 1 | 2) => void;
  addQuestionType: () => void;
  updateQuestionType: (id: string, updates: Partial<QuestionTypeRow>) => void;
  removeQuestionType: (id: string) => void;
  resetForm: () => void;
  setAssignments: (assignments: Assignment[]) => void;

  // Assignment actions
  addAssignment: (assignment: Assignment) => void;
  updateAssignment: (id: string, updates: Partial<Assignment>) => void;
  setGenerationStatus: (status: AssignmentStore["generationStatus"]) => void;
  setWsConnected: (connected: boolean) => void;

  // Computed
  getTotalQuestions: () => number;
  getTotalMarks: () => number;
}

let questionTypeCounter = 100;

export const useAssignmentStore = create<AssignmentStore>((set, get) => ({
  assignments: mockAssignments,
  formData: { ...DEFAULT_FORM, questionTypes: DEFAULT_QUESTION_TYPES.map((qt) => ({ ...qt })) },
  formStep: 1,
  generationStatus: "idle",
  wsConnected: false,

  setFormField: (key, value) =>
    set((state) => ({ formData: { ...state.formData, [key]: value } })),

  setFormStep: (step) => set({ formStep: step }),

  addQuestionType: () =>
    set((state) => ({
      formData: {
        ...state.formData,
        questionTypes: [
          ...state.formData.questionTypes,
          {
            id: `qt-new-${++questionTypeCounter}`,
            type: "Short Questions",
            numberOfQuestions: 2,
            marksPerQuestion: 2,
          },
        ],
      },
    })),

  updateQuestionType: (id, updates) =>
    set((state) => ({
      formData: {
        ...state.formData,
        questionTypes: state.formData.questionTypes.map((qt) =>
          qt.id === id ? { ...qt, ...updates } : qt
        ),
      },
    })),

  removeQuestionType: (id) =>
    set((state) => ({
      formData: {
        ...state.formData,
        questionTypes: state.formData.questionTypes.filter((qt) => qt.id !== id),
      },
    })),

  resetForm: () =>
    set({
      formData: {
        ...DEFAULT_FORM,
        questionTypes: DEFAULT_QUESTION_TYPES.map((qt) => ({ ...qt })),
      },
      formStep: 1,
      generationStatus: "idle",
    }),
  
  setAssignments: (assignments) => set({ assignments }),

  addAssignment: (assignment) =>
    set((state) => ({ assignments: [assignment, ...state.assignments] })),

  updateAssignment: (id, updates) =>
    set((state) => ({
      assignments: state.assignments.map((a) => (a.id === id ? { ...a, ...updates } : a)),
    })),

  setGenerationStatus: (status) => set({ generationStatus: status }),

  setWsConnected: (connected) => set({ wsConnected: connected }),

  getTotalQuestions: () =>
    get().formData.questionTypes.reduce((sum, qt) => sum + qt.numberOfQuestions, 0),

  getTotalMarks: () =>
    get().formData.questionTypes.reduce(
      (sum, qt) => sum + qt.numberOfQuestions * qt.marksPerQuestion,
      0
    ),
}));

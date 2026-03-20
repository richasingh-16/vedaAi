import { Assignment, AssignmentResult } from "@/types";

export const mockResult: AssignmentResult = {
  schoolName: "Delhi Public School, Sector-4, Bokaro",
  subject: "Science",
  className: "8th",
  timeAllowed: "45 minutes",
  maxMarks: 30,
  generalInstruction: "All questions are compulsory unless stated otherwise.",
  sections: [
    {
      title: "Section A",
      instruction: "Short Answer Questions — Attempt all questions. Each question carries 2 marks.",
      questions: [
        { id: "q1", text: "Define electroplating. Explain its purpose.", type: "Short Questions", difficulty: "easy", marks: 2 },
        { id: "q2", text: "What is the role of a conductor in the process of electrolysis?", type: "Short Questions", difficulty: "moderate", marks: 2 },
        { id: "q3", text: "Why does a solution of copper sulfate conduct electricity?", type: "Short Questions", difficulty: "easy", marks: 2 },
        { id: "q4", text: "Describe one example of the chemical effect of electric current in daily life.", type: "Short Questions", difficulty: "moderate", marks: 2 },
        { id: "q5", text: "Explain why electric current is said to have chemical effects.", type: "Short Questions", difficulty: "moderate", marks: 2 },
      ],
    },
    {
      title: "Section B",
      instruction: "Long Answer Questions — Attempt any 3 questions. Each question carries 5 marks.",
      questions: [
        { id: "q6", text: "How is sodium hydroxide prepared during the electrolysis of brine? Write the chemical reaction involved.", type: "Long Questions", difficulty: "challenging", marks: 5 },
        { id: "q7", text: "What happens at the cathode and anode during the electrolysis of water? Name the gases evolved.", type: "Long Questions", difficulty: "moderate", marks: 5 },
        { id: "q8", text: "Explain the process of electroplating with a neat diagram. Why is it done?", type: "Long Questions", difficulty: "challenging", marks: 5 },
      ],
    },
    {
      title: "Section C",
      instruction: "Multiple Choice Questions — Each question carries 1 mark. Choose the correct option.",
      questions: [
        {
          id: "q9", text: "Which of the following is the best conductor of electricity?", type: "MCQ", difficulty: "easy", marks: 1,
          options: ["A. Distilled water", "B. Salt solution", "C. Sugar solution", "D. Pure alcohol"],
          answer: "B",
        },
        {
          id: "q10", text: "During electrolysis of water, which gas is collected at the anode?", type: "MCQ", difficulty: "easy", marks: 1,
          options: ["A. Hydrogen", "B. Nitrogen", "C. Oxygen", "D. Carbon dioxide"],
          answer: "C",
        },
        {
          id: "q11", text: "The process of depositing a layer of metal over another metal is called:", type: "MCQ", difficulty: "easy", marks: 1,
          options: ["A. Galvanisation", "B. Electroplating", "C. Reduction", "D. Oxidation"],
          answer: "B",
        },
      ],
    },
  ],
  answerKey: [
    { questionId: "q1", answer: "Electroplating is the process of depositing a thin layer of metal on another metal using electric current. Its purpose is to prevent corrosion, improve appearance, or increase thickness." },
    { questionId: "q2", answer: "A conductor allows the flow of electric current, causing ions in the electrolyte to move and enabling chemical changes at electrodes." },
    { questionId: "q3", answer: "Copper sulfate solution contains free copper and sulfate ions which carry electric charge, thus conducting electricity." },
  ],
};

export const mockAssignments: Assignment[] = [
  {
    id: "asgn-001",
    title: "Quiz on Electricity",
    subject: "Science",
    className: "8th",
    dueDate: "2025-06-21",
    assignedOn: "2025-06-20",
    questionTypes: [
      { id: "qt1", type: "Multiple Choice Questions", numberOfQuestions: 4, marksPerQuestion: 1 },
      { id: "qt2", type: "Short Questions", numberOfQuestions: 5, marksPerQuestion: 2 },
    ],
    instructions: "Generate a question paper for a 45-minute exam.",
    status: "completed",
    result: mockResult,
  },
  {
    id: "asgn-002",
    title: "Quiz on Electricity",
    subject: "Science",
    className: "9th",
    dueDate: "2025-06-21",
    assignedOn: "2025-06-20",
    questionTypes: [
      { id: "qt3", type: "Short Questions", numberOfQuestions: 3, marksPerQuestion: 2 },
    ],
    instructions: "",
    status: "completed",
  },
  {
    id: "asgn-003",
    title: "Quiz on Electricity",
    subject: "Mathematics",
    className: "7th",
    dueDate: "2025-06-21",
    assignedOn: "2025-06-20",
    questionTypes: [
      { id: "qt4", type: "Numerical Problems", numberOfQuestions: 5, marksPerQuestion: 3 },
    ],
    instructions: "",
    status: "processing",
  },
  {
    id: "asgn-004",
    title: "Quiz on Electricity",
    subject: "English",
    className: "6th",
    dueDate: "2025-06-21",
    assignedOn: "2025-06-20",
    questionTypes: [],
    instructions: "",
    status: "pending",
  },
  {
    id: "asgn-005",
    title: "Quiz on Electricity",
    subject: "History",
    className: "10th",
    dueDate: "2025-06-21",
    assignedOn: "2025-06-20",
    questionTypes: [],
    instructions: "",
    status: "completed",
  },
  {
    id: "asgn-006",
    title: "Quiz on Electricity",
    subject: "Geography",
    className: "8th",
    dueDate: "2025-06-21",
    assignedOn: "2025-06-20",
    questionTypes: [],
    instructions: "",
    status: "completed",
  },
];

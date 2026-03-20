import { Schema, model, Document } from "mongoose";
import { AssignmentStatus, AssignmentResult, QuestionTypeInput } from "../types";

export interface IAssignment extends Document {
  _id: string;
  title: string;
  subject: string;
  className: string;
  chapter: string;
  dueDate: string;
  assignedOn: Date;
  questionTypes: QuestionTypeInput[];
  instructions: string;
  fileContent?: string;
  status: AssignmentStatus;
  result?: AssignmentResult;
  jobId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const QuestionTypeSchema = new Schema<QuestionTypeInput>(
  {
    type: { type: String, required: true },
    numberOfQuestions: { type: Number, required: true, min: 1 },
    marksPerQuestion: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const QuestionSchema = new Schema(
  {
    id: { type: String, required: true },
    text: { type: String, required: true },
    type: { type: String, required: true },
    difficulty: {
      type: String,
      enum: ["easy", "moderate", "challenging"],
      required: true,
    },
    marks: { type: Number, required: true },
    options: [String],
  },
  { _id: false }
);

const SectionSchema = new Schema(
  {
    title: { type: String, required: true },
    instruction: { type: String, required: true },
    questions: [QuestionSchema],
  },
  { _id: false }
);

const ResultSchema = new Schema(
  {
    schoolName: String,
    subject: String,
    className: String,
    timeAllowed: String,
    maxMarks: Number,
    generalInstruction: String,
    sections: [SectionSchema],
    answerKey: [
      {
        questionId: String,
        answer: String,
        _id: false,
      },
    ],
  },
  { _id: false }
);

const AssignmentSchema = new Schema<IAssignment>(
  {
    title: { type: String, required: true, trim: true },
    subject: { type: String, required: true, trim: true },
    className: { type: String, required: true, trim: true },
    chapter: { type: String, required: true, trim: true },
    dueDate: { type: String, required: false, trim: true },
    assignedOn: { type: Date, default: Date.now },
    questionTypes: {
      type: [QuestionTypeSchema],
      required: true,
      validate: {
        validator: (v: QuestionTypeInput[]) => v.length > 0,
        message: "At least one question type is required",
      },
    },
    instructions: { type: String, default: "" },
    fileContent: { type: String },
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      default: "pending",
    },
    result: { type: ResultSchema },
    jobId: { type: String },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const Assignment = model<IAssignment>("Assignment", AssignmentSchema);

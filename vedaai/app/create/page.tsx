"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAssignmentStore } from "@/store/useAssignmentStore";
import FileUpload from "@/components/create/FileUpload";
import QuestionTypeRowComponent from "@/components/create/QuestionTypeRow";
import { Plus, Mic, ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { Assignment } from "@/types";
import { format } from "date-fns";
import clsx from "clsx";

interface ValidationErrors {
  subject?: string;
  className?: string;
  chapter?: string;
  dueDate?: string;
  questionTypes?: string;
}

export default function CreateAssignmentPage() {
  const router = useRouter();
  const {
    formData,
    formStep,
    setFormField,
    setFormStep,
    addQuestionType,
    updateQuestionType,
    removeQuestionType,
    addAssignment,
    updateAssignment,
    setGenerationStatus,
    getTotalQuestions,
    getTotalMarks,
    resetForm,
  } = useAssignmentStore();

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [submitting, setSubmitting] = useState(false);

  // ── Validation ──────────────────────────────────────────────
  const validateForm = () => {
    const e: ValidationErrors = {};
    if (!formData.subject) e.subject = "Subject is required";
    if (!formData.className) e.className = "Class is required";
    if (!formData.chapter) e.chapter = "Enter a chapter or topic";
    if (formData.questionTypes.length === 0)
      e.questionTypes = "Add at least one question type";
    else if (formData.questionTypes.some((qt) => qt.numberOfQuestions < 1))
      e.questionTypes = "Each question type must have at least 1 question";
    else if (formData.questionTypes.some((qt) => qt.marksPerQuestion < 1))
      e.questionTypes = "Marks per question must be at least 1";
      
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Submit ───────────────────────────────────────────────────
  const handleGenerate = async () => {
    if (!validateForm()) return;
    setSubmitting(true);
    setGenerationStatus("generating");

    try {
      const { createAssignment } = await import("@/lib/api");
      const submitData = {
        ...formData,
        title: formData.title || `${formData.className} ${formData.subject} Assignment`,
      };
      const assignment = await createAssignment(submitData);
      addAssignment(assignment);
      resetForm();
      router.push(`/assignment/${assignment.id}`);
    } catch (err) {
      console.error("Failed:", err);
      setGenerationStatus("failed");
      alert("Failed to create. Is the backend running?");
    } finally {
      setSubmitting(false);
    }
  };

  const totalQuestions = getTotalQuestions();
  const totalMarks = getTotalMarks();

  return (
    <div className="w-full h-full pb-20">
      <div className="max-w-[746px] mx-auto pt-8">
        
        {/* Header */}
        <div className="mb-6 animate-fade-up opacity-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-[10px] h-[10px] rounded-full bg-[#4ADE80] shadow-[0_0_8px_rgba(74,222,128,0.4)]" />
            <h1 className="text-[18px] font-bold text-gray-900">Create Assignment</h1>
          </div>
          <p className="text-[13px] text-gray-400">Set up a new assignment for your students</p>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-[3px] bg-gray-200 mb-8 flex animate-fade-up opacity-0 stagger-1 overflow-hidden">
          <div className="h-full bg-gray-800 w-1/2"></div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 p-8 pt-10 animate-fade-up opacity-0 stagger-2">
          
          <div className="space-y-6">
            <div>
              <h2 className="text-[15px] font-bold text-gray-900 mb-0.5">Assignment Details</h2>
              <p className="text-[13px] text-gray-400">Basic information about your assignment</p>
            </div>

            {/* File Upload Component */}
            <FileUpload
              value={formData.file}
              onChange={(f) => setFormField("file", f)}
            />

            {/* Subject and Class Row */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-[14px] font-semibold text-gray-900 mb-2">
                  Subject
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="e.g. Science"
                    value={formData.subject}
                    onChange={(e) => setFormField("subject", e.target.value)}
                    className={clsx(
                      "w-full border rounded-xl px-4 py-[14px] text-[14px] focus:outline-none focus:border-gray-400 transition-colors bg-white text-gray-700",
                      errors.subject ? "border-red-300 focus:border-red-400" : "border-gray-200"
                    )}
                  />
                </div>
                {errors.subject && <p className="text-xs text-red-500 mt-1">{errors.subject}</p>}
              </div>

              <div>
                <label className="block text-[14px] font-semibold text-gray-900 mb-2">
                  Class
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="e.g. Class 8"
                    value={formData.className}
                    onChange={(e) => setFormField("className", e.target.value)}
                    className={clsx(
                      "w-full border rounded-xl px-4 py-[14px] text-[14px] focus:outline-none focus:border-gray-400 transition-colors bg-white text-gray-700",
                      errors.className ? "border-red-300 focus:border-red-400" : "border-gray-200"
                    )}
                  />
                </div>
                {errors.className && <p className="text-xs text-red-500 mt-1">{errors.className}</p>}
              </div>
            </div>

            {/* Chapter / Topic Input */}
            <div className="pt-2">
              <label className="block text-[14px] font-semibold text-gray-900 mb-2">
                Chapter / Topic
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Chapter 5 – Chemical Effects of Current"
                  value={formData.chapter}
                  onChange={(e) => setFormField("chapter", e.target.value)}
                  className={clsx(
                    "w-full border rounded-xl px-4 py-[14px] text-[14px] focus:outline-none focus:border-gray-400 transition-colors bg-white text-gray-700",
                    errors.chapter ? "border-red-300 focus:border-red-400" : "border-gray-200"
                  )}
                />
              </div>
              {errors.chapter && <p className="text-xs text-red-500 mt-1">{errors.chapter}</p>}
            </div>

            {/* Due Date Input */}
            <div className="pt-2">
              <label className="block text-[14px] font-semibold text-gray-900 mb-2">
                Due Date <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormField("dueDate", e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-[14px] text-[14px] focus:outline-none focus:border-gray-400 transition-colors bg-white text-gray-700"
                />
              </div>
            </div>


            {/* Question Setup list */}
            <div className="pt-2">
              <div className="grid grid-cols-[1fr_auto_auto_auto] gap-3 items-center mb-4">
                <span className="text-[13px] font-bold text-gray-900">Question Type</span>
                <span className="text-[13px] font-base text-gray-700 w-[96px] text-center">No. of Questions</span>
                <span className="text-[13px] font-base text-gray-700 w-[96px] text-center">Marks</span>
                <span className="w-7"></span>
              </div>

              <div className="space-y-[14px]">
                {formData.questionTypes.map((qt) => (
                  <QuestionTypeRowComponent
                    key={qt.id}
                    row={qt}
                    onUpdate={(updates) => updateQuestionType(qt.id, updates)}
                    onRemove={() => removeQuestionType(qt.id)}
                    showHeader={false}
                  />
                ))}

                <button
                  type="button"
                  onClick={addQuestionType}
                  className="flex items-center gap-2 text-[14px] text-gray-900 font-bold hover:text-black transition-colors py-2 mt-1"
                >
                  <div className="w-6 h-6 rounded-full bg-[#333333] text-white flex items-center justify-center">
                    <Plus size={14} strokeWidth={2.5} />
                  </div>
                  Add Question Type
                </button>
              </div>

              {/* Totals */}
              {formData.questionTypes.length > 0 && (
                <div className="mt-8 text-right flex flex-col items-end gap-1">
                  <p className="text-[13px] text-gray-800">Total Questions : {totalQuestions}</p>
                  <p className="text-[13px] text-gray-800">Total Marks : {totalMarks}</p>
                </div>
              )}
            </div>

            {/* Additional Info */}
            <div className="pt-4">
              <label className="block text-[14px] font-bold text-gray-900 mb-2">
                Additional Information <span className="text-gray-900 font-normal">(For better output)</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g Generate a question paper for a 3-hour exam duration..."
                  value={formData.instructions}
                  onChange={(e) => setFormField("instructions", e.target.value)}
                  className="w-full border border-[1.5px] border-[#92B1FF] rounded-[8px] px-4 py-[14px] text-[14px] focus:outline-none focus:border-blue-500 transition-colors bg-white text-gray-700 pr-12"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-600 transition-colors w-7 h-7 bg-purple-100 rounded-[6px] flex items-center justify-center p-1"
                >
                  <Mic size={15} strokeWidth={2} />
                </button>
              </div>
            </div>
            
          </div>
        </div>

        {/* Navigation buttons (Outside card) */}
        <div className="flex items-center justify-between mt-8 animate-fade-up opacity-0 stagger-3">
          <button
            type="button"
            onClick={() => router.push("/assignments")}
            className="flex items-center gap-2 text-[14px] font-medium text-gray-800 bg-white rounded-full px-6 py-2.5 hover:bg-gray-50 transition-all"
          >
            <ArrowLeft size={16} />
            Previous
          </button>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={submitting}
            className="flex items-center gap-2 text-[14px] font-medium bg-[#1a1a1a] text-white rounded-full px-8 py-2.5 hover:bg-[#000] disabled:opacity-60 disabled:cursor-not-allowed transition-all"
          >
            {submitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Next...
              </>
            ) : (
              <>
                Next
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>
        
      </div>
    </div>
  );
}

// ── Mock question text generator ─────────────────────────────
function getMockQuestion(type: string, index: number): string {
  const mcq = [
    "Which of the following is the best conductor of electricity?",
    "During electrolysis of water, which gas is collected at the anode?",
    "The process of depositing a layer of metal over another metal is called:",
    "What is the SI unit of electric current?",
    "Which device converts electrical energy into light energy?",
  ];
  const short = [
    "Define electroplating and explain its purpose.",
    "What is the role of a conductor in the process of electrolysis?",
    "Why does a solution of copper sulfate conduct electricity?",
    "Describe one example of the chemical effect of electric current in daily life.",
    "Explain why electric current is said to have chemical effects.",
  ];
  const long = [
    "How is sodium hydroxide prepared during the electrolysis of brine? Write the chemical reaction involved.",
    "What happens at the cathode and anode during the electrolysis of water? Name the gases evolved.",
    "Explain the process of electroplating with a neat diagram. Why is it commercially important?",
  ];
  const numerical = [
    "A current of 2A flows through a conductor for 5 minutes. Calculate the charge transferred.",
    "The resistance of a conductor is 12Ω and a current of 3A flows through it. Find the voltage.",
    "Calculate the power consumed by a device with resistance 50Ω when a current of 2A flows through it.",
  ];

  const map: Record<string, string[]> = {
    "Multiple Choice Questions": mcq,
    "Short Questions": short,
    "Long Questions": long,
    "Numerical Problems": numerical,
    "Diagram/Graph-Based Questions": long,
  };
  const arr = map[type] ?? short;
  return arr[index % arr.length];
}

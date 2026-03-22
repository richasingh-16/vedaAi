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

        {/* Header - Mobile */}
        <div className="md:hidden flex items-center justify-center relative mb-8 mt-2 w-full animate-fade-up opacity-0">
          <button type="button" onClick={() => router.push("/assignments")} className="absolute left-2 w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
             <ArrowLeft size={18} className="text-gray-800" />
          </button>
          <h1 className="text-[16px] font-bold text-gray-900 absolute left-1/2 -translate-x-1/2 tracking-wide">Create Assignment</h1>
        </div>

        {/* Header - Desktop */}
        <div className="hidden md:block mb-6 animate-fade-up opacity-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-[10px] h-[10px] rounded-full bg-[#4ADE80] shadow-[0_0_8px_rgba(74,222,128,0.4)]" />
            <h1 className="text-[18px] font-bold text-gray-900">Create Assignment</h1>
          </div>
          <p className="text-[13px] text-gray-400">Set up a new assignment for your students</p>
        </div>

        {/* Progress Bar */}
        {/* On mobile: Two disjoint segments. On desktop: Single continuous bar. */}
        <div className="w-full flex md:bg-gray-200 items-center justify-center gap-2 md:gap-0 h-[3px] mb-8 animate-fade-up opacity-0 stagger-1 overflow-hidden px-1 md:px-0">
          <div className="h-full bg-gray-800 w-1/2 rounded-full md:rounded-none"></div>
          <div className="h-full bg-gray-300 md:bg-transparent w-1/2 rounded-full md:rounded-none"></div>
        </div>

        {/* Card with Gradient Border */}
        <div className="md:bg-[linear-gradient(145deg,#f0f0f4_0%,#ffffff_50%,#f0f0f4_100%)] rounded-[24px] md:rounded-[32px] md:p-[1.5px] animate-fade-up opacity-0 stagger-2 shadow-sm md:shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
          <div className="bg-white md:bg-[#f2f2f4] rounded-[24px] md:rounded-[30.5px] px-5 py-6 md:p-8 md:pt-10 w-full h-full border border-gray-100 md:border-none">

            <div className="space-y-4 md:space-y-6">
              <div>
                <h2 className="text-[18px] font-bold text-gray-900 mb-0.5">Assignment Details</h2>
                <p className="text-[14px] text-gray-500">Basic information about your assignment</p>
              </div>

              {/* File Upload Component */}
              <FileUpload
                value={formData.file}
                onChange={(f) => setFormField("file", f)}
              />

              {/* Subject and Class Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-4 pt-2 md:pt-4">
                <div>
                  <label className="block text-[14px] md:text-[15px] font-bold text-gray-900 mb-2">
                    Subject
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g. Science"
                      value={formData.subject}
                      onChange={(e) => setFormField("subject", e.target.value)}
                      className={clsx(
                        "w-full rounded-[16px] md:rounded-full px-5 py-[14px] text-[14px] font-medium focus:outline-none transition-colors shadow-sm",
                        "bg-[#fcfcfc] md:bg-white border-none md:border md:border-gray-200 text-gray-700 md:focus:border-gray-400",
                        errors.subject ? "md:border-red-300 ring-1 ring-red-300 md:ring-0" : ""
                      )}
                    />
                  </div>
                  {errors.subject && <p className="text-xs text-red-500 mt-1">{errors.subject}</p>}
                </div>

                <div>
                  <label className="block text-[14px] md:text-[15px] font-bold text-gray-900 mb-2">
                    Class
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g. Class 8"
                      value={formData.className}
                      onChange={(e) => setFormField("className", e.target.value)}
                      className={clsx(
                        "w-full rounded-[16px] md:rounded-full px-5 py-[14px] text-[14px] font-medium focus:outline-none transition-colors shadow-sm",
                        "bg-[#fcfcfc] md:bg-white border-none md:border md:border-gray-200 text-gray-700 md:focus:border-gray-400",
                        errors.className ? "md:border-red-300 ring-1 ring-red-300 md:ring-0" : ""
                      )}
                    />
                  </div>
                  {errors.className && <p className="text-xs text-red-500 mt-1">{errors.className}</p>}
                </div>
              </div>

              {/* Chapter / Topic Input */}
              <div className="pt-2">
                <label className="block text-[14px] md:text-[15px] font-bold text-gray-900 mb-2">
                  Chapter / Topic
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="e.g. Chapter 5 – Chemical Effects of Current"
                    value={formData.chapter}
                    onChange={(e) => setFormField("chapter", e.target.value)}
                    className={clsx(
                      "w-full rounded-[16px] md:rounded-full px-5 py-[14px] text-[14px] font-medium focus:outline-none transition-colors shadow-sm",
                      "bg-[#fcfcfc] md:bg-white border-none md:border md:border-gray-200 text-gray-700 md:focus:border-gray-400",
                      errors.chapter ? "md:border-red-300 ring-1 ring-red-300 md:ring-0" : ""
                    )}
                  />
                </div>
                {errors.chapter && <p className="text-xs text-red-500 mt-1">{errors.chapter}</p>}
              </div>

              {/* Due Date Input */}
              <div className="pt-2">
                <label className="block text-[14px] md:text-[15px] font-bold text-gray-900 mb-2">
                  Due Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormField("dueDate", e.target.value)}
                    className="w-full rounded-[16px] md:rounded-full px-5 py-[14px] text-[14px] font-medium focus:outline-none transition-colors bg-[#fcfcfc] md:bg-transparent border-none md:border md:border-gray-200 text-gray-700 md:focus:border-gray-400"
                  />
                </div>
              </div>


              {/* Question Setup list */}
              <div className="pt-4">
                <div className="hidden md:grid grid-cols-[1fr_auto_auto_auto] gap-3 items-center mb-4">
                  <span className="text-[15px] font-bold text-gray-900">Question Type</span>
                  <span className="text-[14px] text-gray-800 w-[96px] text-center">No. of Questions</span>
                  <span className="text-[14px] text-gray-800 w-[96px] text-center">Marks</span>
                  <span className="w-7"></span>
                </div>
                
                <label className="block md:hidden text-[14px] md:text-[15px] font-bold text-gray-900 mb-2">
                  Question Type
                </label>

                <div className="space-y-4">
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
                    className="flex items-center gap-2 text-[14px] text-gray-900 font-bold hover:text-black transition-colors py-2 mt-2"
                  >
                    <div className="w-6 h-6 rounded-full bg-[#1a1a1a] text-white flex items-center justify-center shadow-md">
                      <Plus size={14} strokeWidth={2.5} />
                    </div>
                    Add Question Type
                  </button>
                </div>

                {/* Totals */}
                {formData.questionTypes.length > 0 && (
                  <div className="mt-8 flex flex-col items-end gap-1.5">
                    <p className="text-[14px] text-gray-800 font-medium">Total Questions : {totalQuestions}</p>
                    <p className="text-[14px] text-gray-800 font-medium">Total Marks : {totalMarks}</p>
                  </div>
                )}
              </div>

              {/* Additional Info */}
              <div className="pt-6">
                <label className="block text-[15px] font-bold text-gray-900 mb-2">
                  Additional Information <span className="text-gray-900 font-medium">(For better output)</span>
                </label>
                <div className="relative">
                  <textarea
                    placeholder="e.g Generate a question paper for 3-hour exam duration..."
                    value={formData.instructions || ""}
                    onChange={(e) => setFormField("instructions", e.target.value)}
                    className="w-full min-h-[140px] resize-none border-[1.75px] border-dashed border-gray-300 rounded-[24px] px-6 py-5 text-[14px] focus:outline-none focus:border-gray-400 transition-colors bg-transparent text-gray-700"
                  />
                  <button
                    type="button"
                    className="absolute right-6 bottom-5 text-gray-600 transition-colors w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center p-1 shadow-sm hover:bg-gray-200"
                  >
                    <Mic size={15} strokeWidth={2} />
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Navigation buttons (Outside card) */}
        <div className="flex items-center justify-between mt-8 mb-16 animate-fade-up opacity-0 stagger-3 px-1 md:px-0">
          <button
            type="button"
            onClick={() => router.push("/assignments")}
            className="flex items-center gap-2 text-[14px] font-medium text-gray-800 bg-white rounded-full px-6 py-[14px] md:py-2.5 hover:bg-gray-50 transition-all border border-gray-100 shadow-sm"
          >
            <ArrowLeft size={16} />
            Previous
          </button>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={submitting}
            className="flex items-center gap-2 text-[14px] font-medium bg-[#1a1a1a] text-white rounded-full px-8 py-[14px] md:py-2.5 hover:bg-[#000] disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-md"
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

        {/* Dedicated explicit spacer to ensure bottom padding */}
        <div className="h-12 w-full shrink-0" />

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

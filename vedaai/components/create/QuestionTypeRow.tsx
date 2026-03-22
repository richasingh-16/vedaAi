"use client";

import { X } from "lucide-react";
import { QuestionTypeRow } from "@/types";

const QUESTION_TYPES = [
  "Multiple Choice Questions",
  "Short Questions",
  "Long Questions",
  "Diagram/Graph-Based Questions",
  "Numerical Problems",
  "Fill in the Blanks",
  "True or False",
  "Match the Following",
];

interface QuestionTypeRowProps {
  row: QuestionTypeRow;
  onUpdate: (updates: Partial<QuestionTypeRow>) => void;
  onRemove: () => void;
  showHeader?: boolean;
}

function Counter({
  value,
  onChange,
  min = 1,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
}) {
  return (
    <div className="flex items-center justify-between w-[96px] h-[40px] px-3 rounded-full border border-gray-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        className="text-gray-300 hover:text-gray-600 transition-colors text-[20px] leading-none flex items-center justify-center font-light pb-[2px]"
      >
        −
      </button>
      <span className="text-[14px] font-semibold text-gray-800">{value}</span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        className="text-gray-300 hover:text-gray-600 transition-colors text-[20px] leading-none flex items-center justify-center font-light pb-[2px]"
      >
        +
      </button>
    </div>
  );
}

export default function QuestionTypeRowComponent({
  row,
  onUpdate,
  onRemove,
  showHeader,
}: QuestionTypeRowProps) {
  return (
    <div className="space-y-4 md:space-y-2">
      {showHeader && (
        <div className="hidden md:grid grid-cols-[1fr_auto_auto_auto] gap-3 items-center">
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Question Type</span>
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wide w-28 text-center">No. of Questions</span>
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wide w-20 text-center">Marks</span>
          <span className="w-7" />
        </div>
      )}

      {/* Mobile Layout */}
      <div className="md:hidden border border-gray-100 bg-white rounded-[24px] p-5 relative shadow-sm">
        {/* Dropdown & X */}
        <div className="flex items-center justify-between gap-3 mb-5">
          <div className="relative flex-1">
            <select
              value={row.type}
              onChange={(e) => onUpdate({ type: e.target.value })}
              className="w-full appearance-none bg-[#fcfcfc] md:bg-white border-none md:border border-gray-200 rounded-[16px] md:rounded-full px-5 py-[12px] text-[13px] font-medium text-gray-700 focus:outline-none focus:border-gray-400 transition-colors pr-10 shadow-sm"
            >
              {QUESTION_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24">
              <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <button type="button" onClick={onRemove} className="text-gray-400 hover:text-red-400 p-1">
            <X size={18} />
          </button>
        </div>

        {/* Counters */}
        <div className="flex items-center justify-around gap-4 pt-1">
          <div className="flex flex-col items-center gap-2.5">
            <span className="text-[12px] font-bold text-gray-800">No. of Questions</span>
            <Counter value={row.numberOfQuestions} onChange={(v) => onUpdate({ numberOfQuestions: v })} />
          </div>
          <div className="flex flex-col items-center gap-2.5">
            <span className="text-[12px] font-bold text-gray-800">Marks</span>
            <Counter value={row.marksPerQuestion} onChange={(v) => onUpdate({ marksPerQuestion: v })} />
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:grid grid-cols-[1fr_auto_auto_auto] gap-3 items-center">
        {/* Type dropdown */}
        <div className="relative">
          <select
            value={row.type}
            onChange={(e) => onUpdate({ type: e.target.value })}
            className="w-full appearance-none bg-white border border-gray-200 rounded-full px-5 py-[10px] text-[14px] font-medium text-gray-700 focus:outline-none focus:border-gray-400 transition-colors pr-10 shadow-sm"
          >
            {QUESTION_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" fill="none" viewBox="0 0 24 24">
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        {/* No. of questions */}
        <div className="w-28 flex justify-center">
          <Counter value={row.numberOfQuestions} onChange={(v) => onUpdate({ numberOfQuestions: v })} />
        </div>

        {/* Marks */}
        <div className="w-20 flex justify-center">
          <Counter value={row.marksPerQuestion} onChange={(v) => onUpdate({ marksPerQuestion: v })} />
        </div>

        {/* Remove */}
        <button
          type="button"
          onClick={onRemove}
          className="w-7 h-7 flex items-center justify-center rounded-md text-gray-300 hover:text-red-400 hover:bg-red-50 transition-colors"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}

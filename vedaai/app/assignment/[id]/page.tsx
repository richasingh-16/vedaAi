"use client";

import { useEffect, useRef, useState } from "react";
import { useAssignmentStore } from "@/store/useAssignmentStore";
import { useRouter } from "next/navigation";
import DifficultyBadge from "@/components/output/DifficultyBadge";
import GeneratingState from "@/components/output/GeneratingState";
import { useAssignmentSocket } from "@/hooks/useAssignmentSocket";
import { fetchAssignment, regenerateAssignment } from "@/lib/api";
import {
  Download,
  RefreshCw,
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import clsx from "clsx";

export default function AssignmentOutputPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  useAssignmentSocket(id);
  
  const router = useRouter();
  const { assignments, updateAssignment, setGenerationStatus, addAssignment } = useAssignmentStore();
  const assignment = assignments.find((a) => a.id === id);
  const paperRef = useRef<HTMLDivElement>(null);
  const [showAnswerKey, setShowAnswerKey] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [loading, setLoading] = useState(true); // always fetch on mount — list API omits `result`

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const a = await fetchAssignment(id);
        if (mounted) {
          addAssignment(a);
          updateAssignment(id, a);
        }
      } catch {
        if (mounted) router.push("/assignments");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [id]); // only re-run if ID changes

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (assignment && (assignment.status === "pending" || assignment.status === "processing")) {
      interval = setInterval(async () => {
        try {
          const updated = await fetchAssignment(id);
          updateAssignment(id, updated);
          if (updated.status === "completed" || updated.status === "failed") {
            setGenerationStatus(updated.status);
            clearInterval(interval);
          } else if (updated.status === "processing") {
            setGenerationStatus("generating");
          }
        } catch {
          clearInterval(interval);
        }
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [id, assignment?.status, updateAssignment, setGenerationStatus]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto text-center py-20 text-gray-500 flex flex-col items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-brand-dark border-t-transparent animate-spin mb-4" />
        <p>Loading assignment...</p>
      </div>
    );
  }

  if (!assignment) return null;

  // ── Loading/processing states ────────────────────────────────
  if (assignment.status === "pending" || assignment.status === "processing") {
    return (
      <div className="max-w-3xl mx-auto">
        <GeneratingState />
      </div>
    );
  }

  if (assignment.status === "failed") {
    return (
      <div className="max-w-3xl mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-4">
          <span className="text-2xl">⚠️</span>
        </div>
        <h2 className="text-xl font-semibold text-brand-dark mb-2">Generation Failed</h2>
        <p className="text-sm text-gray-400 mb-6">Something went wrong while generating your paper.</p>
        <Link
          href="/create"
          className="bg-brand-dark text-white rounded-full px-6 py-2.5 text-sm font-medium hover:bg-black transition-all"
        >
          Try Again
        </Link>
      </div>
    );
  }

  const result = assignment.result;
  if (!result) return null;

  // ── Regenerate ───────────────────────────────────────────────
  const handleRegenerate = async () => {
    setRegenerating(true);
    try {
      const updated = await regenerateAssignment(id);
      updateAssignment(id, updated);
      setGenerationStatus("generating");
    } catch (err) {
      alert("Failed to regenerate. Is the backend running?");
    } finally {
      setRegenerating(false);
    }
  };

  // ── Print / PDF ──────────────────────────────────────────────

  const handleDownload = async () => {
    if (!paperRef.current) return;
    setDownloading(true);
    try {
      // Dynamically import html2pdf so it only loads on the client side when needed
      const html2pdf = (await import("html2pdf.js")).default;
      const element = paperRef.current;
      const opt = {
        margin:       [0.5, 0.5, 0.5, 0.5] as [number, number, number, number], // top, left, bottom, right
        filename:     `${assignment?.title?.replace(/\s+/g, '_') || 'assignment'}.pdf`,
        image:        { type: 'jpeg' as const, quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true, windowWidth: 1024 },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' as const }
      };

      await html2pdf().set(opt).from(element).save();
    } catch (err) {
      console.error("Failed to generate PDF, falling back to print:", err);
      window.print();
    } finally {
      setDownloading(false);
    }
  };

  const totalMarks = result.sections.reduce(
    (sum, s) => sum + s.questions.reduce((qs, q) => qs + q.marks, 0),
    0
  );

  return (
    <div className="max-w-4xl mx-auto">
      {/* ── Top action banner ── */}
      <div className="bg-brand-dark text-white rounded-2xl p-4 mb-6 flex flex-col sm:flex-row sm:items-center gap-3 no-print animate-fade-up opacity-0">
        <div className="flex items-start gap-3 flex-1">
          <CheckCircle2 size={18} className="text-green-400 shrink-0 mt-0.5" />
          <p className="text-sm leading-relaxed">
            <span className="font-medium">Your question paper is ready!</span>{" "}
            <span className="text-gray-400">
              {result.subject} · Class {result.className} ·{" "}
              {result.sections.reduce((s, sec) => s + sec.questions.length, 0)} questions ·{" "}
              {totalMarks} marks
            </span>
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleRegenerate}
            disabled={regenerating || downloading}
            className="flex items-center gap-2 text-sm font-medium bg-white/10 hover:bg-white/20 text-white rounded-full px-4 py-2 transition-all disabled:opacity-50"
          >
            <RefreshCw size={14} className={regenerating ? "animate-spin" : ""} />
            Regenerate
          </button>
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center gap-3 text-[14px] leading-snug font-semibold bg-white text-[#1a1a1a] rounded-[24px] px-6 py-2.5 hover:bg-gray-100 transition-all shadow-sm disabled:opacity-50"
          >
            {downloading ? (
              <RefreshCw size={16} strokeWidth={2.5} className="mt-0.5 animate-spin" />
            ) : (
              <Download size={16} strokeWidth={2.5} className="mt-0.5" />
            )}
            <span className="text-left font-bold tracking-wide">
              {downloading ? "Generating..." : <><span className="hidden sm:inline">Download<br/>as PDF</span><span className="sm:hidden">Download</span></>}
            </span>
          </button>
        </div>
      </div>

      {/* ── Back link ── */}
      <div className="mb-4 no-print">
        <Link
          href="/assignments"
          className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Assignments
        </Link>
      </div>

      {/* ── Exam paper ── */}
      <div
        ref={paperRef}
        className={clsx(
          "bg-white rounded-2xl shadow-paper border border-surface-border overflow-hidden exam-paper",
          "animate-fade-up opacity-0 stagger-1"
        )}
      >
        {/* Paper header */}
        <div className="text-center py-8 px-8 border-b border-gray-100">
          <h1 className="font-serif text-lg font-semibold text-brand-dark leading-snug">
            {result.schoolName}
          </h1>
          <p className="text-sm text-gray-600 mt-1 font-medium">Subject: {result.subject}</p>
          <p className="text-sm text-gray-600">Class: {result.className}</p>
        </div>

        <div className="px-8 py-6">
          {/* Time + Marks row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-0 mb-4 text-[13px] md:text-sm">
            <span className="text-gray-800 md:text-gray-600 font-medium">
              Time Allowed: <span className="font-normal">{result.timeAllowed}</span>
            </span>
            <span className="text-gray-800 md:text-gray-600 font-medium">
              Maximum Marks: <span className="font-normal">{result.maxMarks}</span>
            </span>
          </div>

          {/* General instruction */}
          <p className="text-[13px] md:text-sm text-gray-800 md:text-gray-600 italic mb-6 border-b border-gray-100 pb-5">
            {result.generalInstruction || "All questions are compulsory unless stated otherwise."}
          </p>

          {/* Student info */}
          <div className="flex flex-col md:grid md:grid-cols-3 gap-3 md:gap-6 mb-8 mt-2">
            <div className="flex items-end gap-2">
              <span className="text-[13px] md:text-sm text-gray-800 md:text-gray-600 font-medium shrink-0">Name:</span>
              <div className="border-b border-gray-800 md:border-gray-400 flex-1 md:w-32" />
            </div>
            <div className="flex items-end gap-2">
              <span className="text-[13px] md:text-sm text-gray-800 md:text-gray-600 font-medium shrink-0">Roll Number:</span>
              <div className="border-b border-gray-800 md:border-gray-400 flex-1 md:w-24" />
            </div>
            <div className="flex items-end gap-2">
              <span className="text-[13px] md:text-sm text-gray-800 md:text-gray-600 font-medium shrink-0">Class: {result.className} Section:</span>
              <div className="border-b border-gray-800 md:border-gray-400 flex-1 md:w-20" />
            </div>
          </div>

          {/* Sections */}
          <div className="space-y-8">
            {result.sections.map((section) => (
              <div key={section.title}>
                {/* Section title */}
                <div className="text-center mb-3">
                  <h2 className="font-serif text-base font-semibold text-brand-dark underline underline-offset-4 decoration-1">
                    {section.title}
                  </h2>
                </div>

                {/* Section label + instruction */}
                <div className="mb-3">
                  <p className="text-sm font-semibold text-gray-700">
                    {section.questions[0]?.type ?? "Questions"}
                  </p>
                  <p className="text-xs text-gray-500 italic">{section.instruction}</p>
                </div>

                {/* Questions */}
                <ol className="space-y-3">
                  {section.questions.map((q, qi) => (
                    <li key={q.id} className="flex gap-3">
                      <span className="text-sm font-medium text-gray-600 shrink-0 w-6 text-right">
                        {qi + 1}.
                      </span>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-start gap-2">
                          <p className="text-sm text-gray-800 flex-1 leading-relaxed">{q.text}</p>
                          <div className="flex items-center gap-2 shrink-0 mt-0.5">
                            <DifficultyBadge difficulty={q.difficulty} />
                            <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                              [{q.marks} {q.marks === 1 ? "Mark" : "Marks"}]
                            </span>
                          </div>
                        </div>

                        {/* MCQ options */}
                        {q.options && q.options.length > 0 && (
                          <div className="grid grid-cols-2 gap-1 mt-2">
                            {q.options.map((opt) => (
                              <p key={opt} className="text-xs text-gray-600 pl-2">
                                {opt}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>

          {/* End of paper */}
          <div className="mt-8 pt-4 border-t border-gray-100 text-center">
            <p className="text-sm font-semibold text-gray-500">— End of Question Paper —</p>
          </div>

          {/* Answer key (collapsible) */}
          {result.answerKey && result.answerKey.length > 0 && (
            <div className="mt-6 border-t border-gray-100 pt-6 no-print">
              <button
                onClick={() => setShowAnswerKey(!showAnswerKey)}
                className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-brand-dark transition-colors"
              >
                <ChevronDown
                  size={16}
                  className={clsx("transition-transform", showAnswerKey && "rotate-180")}
                />
                Answer Key
              </button>
              {showAnswerKey && (
                <div className="mt-4 space-y-3 animate-fade-in opacity-0">
                  {result.answerKey.map((ak, i) => {
                    const q = result.sections
                      .flatMap((s) => s.questions)
                      .find((q) => q.id === ak.questionId);
                    return (
                      <div key={ak.questionId} className="flex gap-3">
                        <span className="text-xs font-medium text-gray-500 shrink-0">{i + 1}.</span>
                        <p className="text-xs text-gray-600 leading-relaxed">{ak.answer}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bottom spacer for mobile */}
      <div className="h-8" />
    </div>
  );
}

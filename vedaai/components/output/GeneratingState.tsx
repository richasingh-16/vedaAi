"use client";

import { useEffect, useState } from "react";

const messages = [
  "Analysing your assignment details…",
  "Structuring question sections…",
  "Generating questions with AI…",
  "Applying difficulty levels…",
  "Formatting your paper…",
];

export default function GeneratingState() {
  const [msgIndex, setMsgIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const msgTimer = setInterval(() => {
      setMsgIndex((i) => Math.min(i + 1, messages.length - 1));
    }, 600);
    const progressTimer = setInterval(() => {
      setProgress((p) => Math.min(p + 2, 95));
    }, 60);
    return () => { clearInterval(msgTimer); clearInterval(progressTimer); };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in opacity-0">
      {/* Animated icon */}
      <div className="relative mb-8">
        <div className="w-20 h-20 rounded-2xl bg-white shadow-paper flex items-center justify-center">
          <div className="w-10 h-10 rounded-full border-2 border-brand-orange border-t-transparent animate-spin" />
        </div>
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-brand-orange rounded-full flex items-center justify-center animate-pulse">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2 5h6M5 2v6" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
      </div>

      <h2 className="text-xl font-semibold text-brand-dark mb-2">Generating your paper…</h2>
      <p className="text-sm text-gray-400 mb-8 transition-all duration-500">{messages[msgIndex]}</p>

      {/* Progress bar */}
      <div className="w-64 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-brand-orange rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-xs text-gray-300 mt-2">{progress}%</p>
    </div>
  );
}

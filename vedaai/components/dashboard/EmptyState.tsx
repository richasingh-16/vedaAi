import Link from "next/link";
import { Plus } from "lucide-react";

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 py-24 animate-fade-up opacity-0">
      {/* Illustration */}
      <div className="relative mb-8">
        <div className="w-28 h-28 bg-white rounded-2xl shadow-card flex items-center justify-center">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
            <rect x="8" y="4" width="40" height="52" rx="4" fill="#F3F4F6" stroke="#E5E7EB" strokeWidth="1.5"/>
            <rect x="14" y="14" width="28" height="3" rx="1.5" fill="#D1D5DB"/>
            <rect x="14" y="22" width="20" height="3" rx="1.5" fill="#E5E7EB"/>
            <rect x="14" y="30" width="24" height="3" rx="1.5" fill="#E5E7EB"/>
            <circle cx="44" cy="44" r="12" fill="#FEE2E2" stroke="#FECACA" strokeWidth="1.5"/>
            <path d="M40 44h8M44 40v8" stroke="#F87171" strokeWidth="2" strokeLinecap="round"/>
            <path d="M41.5 41.5l5 5M46.5 41.5l-5 5" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-brand-orange rounded-full opacity-20 animate-pulse" />
        <div className="absolute -bottom-1 -left-3 w-4 h-4 bg-blue-400 rounded-full opacity-20 animate-pulse" style={{ animationDelay: "0.5s" }} />
      </div>

      <h2 className="text-xl font-semibold text-brand-dark mb-2">No assignments yet</h2>
      <p className="text-sm text-gray-400 text-center max-w-xs mb-8 leading-relaxed">
        Create your first assignment to start collecting and grading student submissions. You can set up rubrics, define marking criteria, and let AI assist with grading.
      </p>

      <Link
        href="/create"
        className="flex items-center gap-2 bg-brand-dark text-white rounded-full px-6 py-2.5 text-sm font-medium hover:bg-black transition-all hover:shadow-md"
      >
        <Plus size={15} strokeWidth={2.5} />
        Create Your First Assignment
      </Link>
    </div>
  );
}

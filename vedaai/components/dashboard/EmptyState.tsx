import Link from "next/link";
import { Plus } from "lucide-react";

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center animate-fade-up opacity-0 px-4">
      {/* SVG Illustration */}
      <div className="relative mb-2 md:mb-6 flex items-center justify-center pointer-events-none">
        <svg viewBox="0 0 220 220" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[100px] h-[100px] md:w-[220px] md:h-[220px]">
          {/* Circle BG */}
          <circle cx="110" cy="110" r="80" fill="#EAECEF" />
          
          {/* Squiggle left */}
          <path d="M50 100 C 65 85, 80 85, 75 105 C 70 125, 50 120, 50 100 C 50 85, 65 75, 75 70" stroke="#1F2937" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.9" />
          <path d="M50 105 C 60 95, 75 90, 75 105 C 75 120, 60 120, 50 110 C 45 105, 45 95, 55 90 C 65 85, 75 95, 80 100" stroke="#1F2937" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.9" />
          
          <path d="M55 95 C 65 85, 75 90, 70 105 C 65 115, 55 110, 50 100 C 45 90, 60 85, 65 80" stroke="#2c3a50" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.9" />
          
          {/* Document */}
          <rect x="75" y="70" width="60" height="75" rx="8" fill="white" />
          <rect x="85" y="80" width="22" height="4" rx="2" fill="#102542" />
          <rect x="85" y="92" width="40" height="4" rx="2" fill="#E5E7EB" />
          <rect x="85" y="104" width="30" height="4" rx="2" fill="#E5E7EB" />
          <rect x="85" y="116" width="35" height="4" rx="2" fill="#E5E7EB" />
          <rect x="85" y="128" width="25" height="4" rx="2" fill="#E5E7EB" />
          
          {/* Floating Card top right */}
          <rect x="133" y="65" width="28" height="18" rx="4" fill="white" />
          <circle cx="140" cy="74" r="3" fill="#A78BFA" />
          <rect x="146" y="72" width="9" height="4" rx="2" fill="#E5E7EB" />
          
          {/* Blue Star bottom left */}
          <path d="M65 120L67 125L72 127L67 129L65 134L63 129L58 127L63 125Z" fill="#3B82F6" />
          
          {/* Blue Dot solid right */}
          <circle cx="155" cy="115" r="3" fill="#3B82F6" opacity="0.8" />

          {/* Magnifying Glass */}
          <g transform="translate(100, 95)">
            {/* Handle */}
            <rect x="34" y="34" width="26" height="12" rx="6" transform="rotate(45 35 35)" fill="#DDD6FE" />
            
            {/* Glass shadow & ring */}
            <circle cx="20" cy="20" r="26" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="3" />
            
            {/* Glass body border inner */}
            <circle cx="20" cy="20" r="23" fill="white" stroke="#F1F5F9" strokeWidth="4" />
            
            {/* Red X inside */}
            <path d="M12 12L28 28M28 12L12 28" stroke="#FF4D4D" strokeWidth="5.5" strokeLinecap="round" />
          </g>
        </svg>
      </div>

      <h2 className="text-[15px] md:text-[20px] font-bold text-gray-900 mb-1 md:mb-3 tracking-wide">No assignments yet</h2>
      <p className="text-[11px] md:text-[14px] text-gray-500 font-medium text-center max-w-[220px] md:max-w-[340px] mb-4 md:mb-8 leading-relaxed">
        Create your first assignment to start collecting and grading student submissions.<br />
        You can set up rubrics, define marking criteria, and let AI assist with grading.
      </p>

      <Link
        href="/create"
        className="flex items-center gap-1.5 md:gap-2 bg-[#1A1A1A] text-white rounded-full px-5 md:px-7 py-2 md:py-3 text-[12px] md:text-[15px] font-medium hover:bg-black transition-all hover:scale-105"
      >
        <Plus size={14} strokeWidth={2.5} className="md:hidden" />
        <Plus size={18} strokeWidth={2.5} className="hidden md:block" />
        Create Your First Assignment
      </Link>
    </div>
  );
}

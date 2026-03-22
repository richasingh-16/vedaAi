"use client";

import { useState, useRef, useEffect } from "react";
import { MoreVertical } from "lucide-react";
import { Assignment } from "@/types";
import { format } from "date-fns";
import Link from "next/link";
import clsx from "clsx";

interface AssignmentCardProps {
  assignment: Assignment;
  index: number;
  onDelete?: (id: string) => void;
}

export default function AssignmentCard({ assignment, index, onDelete }: AssignmentCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "dd-MM-yyyy");
    } catch {
      return dateStr;
    }
  };

  return (
    <div
      className={clsx(
        "bg-white rounded-[24px] p-5 md:p-6 shadow-sm text-left flex flex-col justify-between h-[120px] md:h-[162px]",
        "animate-fade-up relative w-full",
        menuOpen ? "z-50" : "z-10",
        `stagger-${Math.min(index + 1, 6)}`
      )}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 pr-2 pt-1">
          <h3 className="font-bold text-[15px] md:font-extrabold md:text-[20px] tracking-tight leading-none text-[#303030] md:text-[#1A1A1A]">
            {assignment.title.replace(/^(class\s+\d+\s+)|(^\d+\s+)/i, '')}
          </h3>
        </div>
        <div className="relative shrink-0" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-8 h-8 flex items-center justify-center -mr-2 -mt-1 rounded-full text-gray-600 md:text-gray-400 hover:text-gray-800 hover:bg-gray-50 transition-colors"
          >
            <MoreVertical size={20} strokeWidth={2.5} />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-10 z-[100] bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-2 min-w-[160px] animate-fade-in border border-gray-50/50">
              {/* Note: we show View Assignment even if not completed so it matches the design. Or keep logic but ensure it looks right */}
              <Link
                href={`/assignment/${assignment.id}`}
                className="block whitespace-nowrap px-4 py-2.5 text-[14px] font-medium text-gray-800 hover:bg-gray-50 rounded-xl transition-colors mb-1"
                onClick={() => setMenuOpen(false)}
              >
                View Assignment
              </Link>
              <button
                className="w-full text-left whitespace-nowrap px-4 py-2.5 text-[14px] font-medium text-[#D32F2F] bg-[#F8F8F8] hover:bg-[#F0F0F0] rounded-xl transition-colors"
                onClick={() => { onDelete?.(assignment.id); setMenuOpen(false); }}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Dates row pushed to bottom */}
      <div className="flex items-center gap-3 md:gap-4 md:justify-between text-[11.5px] md:text-[13px] text-gray-400 md:text-gray-500 mt-auto pt-4 whitespace-nowrap overflow-hidden">
        <div>
          <span className="font-extrabold text-gray-800 md:text-[#1A1A1A]">Assigned on</span> <span className="font-medium">: {formatDate(assignment.assignedOn)}</span>
        </div>
        <div>
          <span className="font-extrabold text-gray-800 md:text-[#1A1A1A]">Due</span> <span className="font-medium">: {formatDate(assignment.dueDate)}</span>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { MoreHorizontal, Eye, Trash2, Clock, Calendar } from "lucide-react";
import { Assignment } from "@/types";
import { format } from "date-fns";
import Link from "next/link";
import clsx from "clsx";

const statusColors: Record<Assignment["status"], string> = {
  completed: "bg-green-100 text-green-700",
  processing: "bg-amber-100 text-amber-700",
  pending: "bg-gray-100 text-gray-500",
  failed: "bg-red-100 text-red-600",
};

interface AssignmentCardProps {
  assignment: Assignment;
  index: number;
  onDelete?: (id: string) => void;
}

export default function AssignmentCard({ assignment, index, onDelete }: AssignmentCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);

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
        "bg-white rounded-xl p-5 shadow-card border border-surface-border",
        "hover:shadow-md hover:-translate-y-0.5 transition-all duration-200",
        "animate-fade-up opacity-0",
        `stagger-${Math.min(index + 1, 6)}`
      )}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-brand-dark text-[15px] truncate">{assignment.title}</h3>
          <p className="text-xs text-gray-400 mt-0.5">{assignment.subject} · Class {assignment.className}</p>
        </div>
        <div className="relative shrink-0">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors text-gray-400"
          >
            <MoreHorizontal size={16} />
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-8 z-20 bg-white rounded-xl shadow-paper border border-surface-border py-1.5 min-w-[150px] animate-fade-in">
                {assignment.status === "completed" && (
                  <Link
                    href={`/assignment/${assignment.id}`}
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    <Eye size={14} className="text-gray-400" />
                    View Assignment
                  </Link>
                )}
                <button
                  className="flex items-center gap-2.5 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors w-full text-left"
                  onClick={() => { onDelete?.(assignment.id); setMenuOpen(false); }}
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Status */}
      <div className="mb-4">
        <span className={clsx("text-[11px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wide", statusColors[assignment.status])}>
          {assignment.status}
        </span>
      </div>

      {/* Dates */}
      <div className="flex items-center justify-between text-xs text-gray-400 border-t border-surface-border pt-3">
        <div className="flex items-center gap-1.5">
          <Calendar size={12} />
          <span>Assigned {formatDate(assignment.assignedOn)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock size={12} />
          <span>Due {formatDate(assignment.dueDate)}</span>
        </div>
      </div>
    </div>
  );
}

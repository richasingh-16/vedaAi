"use client";

import { useEffect, useState } from "react";
import { Search, Filter, Plus, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import clsx from "clsx";
import { useAssignmentStore } from "@/store/useAssignmentStore";
import AssignmentCard from "@/components/dashboard/AssignmentCard";
import EmptyState from "@/components/dashboard/EmptyState";
import { fetchAssignments, deleteAssignment } from "@/lib/api";

export default function AssignmentsPage() {
  const { assignments, setAssignments, removeAssignment } = useAssignmentStore();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchAssignments()
      .then((data) => {
        setAssignments(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  }, [setAssignments]);

  const filtered = assignments.filter((a) =>
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    a.subject.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    try {
      await deleteAssignment(id);
      removeAssignment(id);
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete assignment. Please try again.");
    }
  };

  return (
    <div className="w-full relative pb-24 flex flex-col mt-[1px] min-h-[calc(100vh-90px)]">
      {/* Page header (only show if not empty) */}
      {assignments.length > 0 && (
        <div className="hidden md:block mb-[14px] animate-fade-up opacity-0 pl-1">
          <div className="flex items-center gap-2 mb-0.5">
            <div className="flex items-center justify-center w-[18px] h-[18px] rounded-full bg-[#E5F5ED]">
              <span className="w-[8px] h-[8px] rounded-full bg-[#2ECA6A] shadow-[0_0_0_2px_rgba(46,202,106,0.2)]" />
            </div>
            <h1 className="text-[20px] font-bold text-gray-900 tracking-tight">Assignments</h1>
          </div>
          <p className="text-[12px] text-[#A3A3A3] font-medium ml-6">Manage and create assignments for your classes.</p>
        </div>
      )}

      {/* Toolbar */}
      {assignments.length > 0 && (
        <div className="w-full bg-white rounded-full md:rounded-[16px] px-2 md:px-4 py-[6px] md:py-0 md:h-[56px] flex items-center justify-between mb-[13px] shadow-sm md:shadow-[0_8px_40px_rgba(0,0,0,0.12)] border border-gray-100 animate-fade-up opacity-0 stagger-1">
          <button className="flex items-center gap-2 text-[13px] text-gray-400 font-medium bg-transparent px-3 md:px-2 py-1.5 md:py-1 rounded-md shrink-0 border-r border-gray-100 pr-4">
            <Filter size={16} strokeWidth={2} className="text-gray-400" />
            Filter
          </button>
          
          <div className="relative flex-1 w-full md:max-w-[300px] ml-2">
            <Search size={16} strokeWidth={2} className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-gray-300" />
            <input
              type="text"
              placeholder="Search Name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 md:pl-11 pr-4 py-1.5 md:py-2 text-[13px] font-medium bg-transparent md:border md:border-gray-200 md:bg-white rounded-full focus:outline-none transition-all placeholder:text-gray-300"
            />
          </div>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={30} className="text-gray-300 animate-spin" />
        </div>
      ) : assignments.length === 0 ? (
        <div className="flex flex-1 items-start md:items-center justify-center pt-8 md:pt-0" style={{ minHeight: "calc(100vh - 180px)" }}>
          <EmptyState />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400 text-sm">
          No assignments match your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[13px]">
          {filtered.map((assignment, i) => (
            <AssignmentCard
              key={assignment.id}
              assignment={assignment}
              index={i}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Floating create button */}
      <div className={clsx(
        "fixed bottom-24 right-4 md:bottom-4 md:right-0 md:left-[273px] flex justify-end md:justify-center z-30 no-print pointer-events-none",
        assignments.length === 0 ? "md:hidden" : "block"
      )}>
        <Link
          href="/create"
          className="flex items-center gap-2 bg-white md:bg-[#1A1A1A] text-[#FF5722] md:text-white rounded-full p-3.5 md:px-5 md:py-3 text-[14px] font-medium shadow-[0_8px_24px_rgba(0,0,0,0.15)] hover:bg-gray-50 md:hover:bg-black hover:scale-105 transition-all duration-300 pointer-events-auto border border-gray-100 md:border-none"
        >
          <Plus size={24} strokeWidth={2} className="block md:hidden" />
          <span className="hidden md:flex items-center gap-2"><Plus size={18} strokeWidth={2} />Create Assignment</span>
        </Link>
      </div>
    </div>
  );
}

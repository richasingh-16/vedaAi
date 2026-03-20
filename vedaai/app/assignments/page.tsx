"use client";

import { useEffect, useState } from "react";
import { Search, SlidersHorizontal, Plus, Loader2 } from "lucide-react";
import Link from "next/link";
import { useAssignmentStore } from "@/store/useAssignmentStore";
import AssignmentCard from "@/components/dashboard/AssignmentCard";
import EmptyState from "@/components/dashboard/EmptyState";
import { fetchAssignments } from "@/lib/api";

export default function AssignmentsPage() {
  const { assignments, setAssignments } = useAssignmentStore();
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

  const handleDelete = (id: string) => {
    // In a real app: call DELETE API then remove from store
    // For mock: just a visual placeholder
    console.log("Delete", id);
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Page header */}
      <div className="mb-6 animate-fade-up opacity-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <h1 className="text-xl font-semibold text-brand-dark">Assignments</h1>
        </div>
        <p className="text-sm text-gray-400">Manage and create assignments for your classes.</p>
      </div>

      {/* Toolbar */}
      {assignments.length > 0 && (
        <div className="flex items-center gap-3 mb-6 animate-fade-up opacity-0 stagger-1">
          <button className="flex items-center gap-2 text-sm text-gray-500 bg-white border border-surface-border rounded-lg px-3 py-2 hover:bg-gray-50 transition-colors">
            <SlidersHorizontal size={14} />
            Filter By
          </button>
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search Assignment"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-4 py-2 text-sm bg-white border border-surface-border rounded-lg focus:outline-none focus:border-gray-400 transition-colors"
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
        <div className="flex flex-col" style={{ minHeight: "60vh" }}>
          <EmptyState />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400 text-sm">
          No assignments match your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
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

      {/* Floating create button (mobile / filled state) */}
      {assignments.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 md:left-auto md:right-8 md:translate-x-0 z-30 no-print">
          <Link
            href="/create"
            className="flex items-center gap-2 bg-brand-dark text-white rounded-full px-5 py-3 text-sm font-medium shadow-lg hover:bg-black hover:shadow-xl transition-all"
          >
            <Plus size={15} strokeWidth={2.5} />
            Create Assignment
          </Link>
        </div>
      )}
    </div>
  );
}

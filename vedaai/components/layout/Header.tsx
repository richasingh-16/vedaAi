"use client";

import { usePathname } from "next/navigation";
import { Bell, ChevronDown, FileText } from "lucide-react";
import Link from "next/link";

function getBreadcrumb(pathname: string) {
  if (pathname.startsWith("/assignment/")) return [{ label: "Assignment", href: "/assignments" }, { label: "View Output" }];
  if (pathname === "/create") return [{ label: "Assignment", href: "/assignments" }, { label: "Create New" }];
  if (pathname === "/assignments") return [{ label: "Assignments" }];
  return [{ label: "Home" }];
}

export default function Header() {
  const pathname = usePathname();
  const crumbs = getBreadcrumb(pathname);

  return (
    <header className="h-14 bg-white border-b border-surface-border flex items-center justify-between px-6 shrink-0 z-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm">
        <FileText size={15} className="text-gray-400" />
        {crumbs.map((crumb, i) => (
          <span key={i} className="flex items-center gap-1.5">
            {i > 0 && <span className="text-gray-300">/</span>}
            {crumb.href ? (
              <Link href={crumb.href} className="text-gray-400 hover:text-gray-700 transition-colors">
                {crumb.label}
              </Link>
            ) : (
              <span className="text-gray-700 font-medium">{crumb.label}</span>
            )}
          </span>
        ))}
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        <button className="relative w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
          <Bell size={17} className="text-gray-500" />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-brand-orange rounded-full" />
        </button>
        <button className="flex items-center gap-2 hover:bg-gray-50 rounded-lg px-2 py-1.5 transition-colors">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
            <span className="text-white text-xs font-bold">J</span>
          </div>
          <span className="text-sm font-medium text-gray-700 hidden sm:block">John Doe</span>
          <ChevronDown size={14} className="text-gray-400 hidden sm:block" />
        </button>
      </div>
    </header>
  );
}

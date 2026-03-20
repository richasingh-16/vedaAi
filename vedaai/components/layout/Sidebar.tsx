"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Users,
  FileText,
  Wand2,
  Library,
  Settings,
  Plus,
} from "lucide-react";
import clsx from "clsx";

const navItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Users, label: "My Groups", href: "/groups" },
  { icon: FileText, label: "Assignments", href: "/assignments", badge: 3 },
  { icon: Wand2, label: "AI Teacher's Toolkit", href: "/toolkit" },
  { icon: Library, label: "My Library", href: "/library" },
];

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/assignments") return pathname.startsWith("/assignment") || pathname === "/create";
    return pathname === href;
  };

  return (
    <aside className="hidden md:flex flex-col w-[260px] shrink-0 bg-white shadow-sidebar h-screen z-20">
      {/* Logo */}
      <div className="p-6 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-brand-orange flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-sm">V</span>
          </div>
          <span className="font-semibold text-[17px] tracking-tight text-brand-dark">VedaAI</span>
        </div>
      </div>

      {/* Create Assignment */}
      <div className="px-4 mb-2">
        <Link
          href="/create"
          className="flex items-center gap-2 w-full bg-brand-dark text-white rounded-full px-4 py-2.5 text-sm font-medium hover:bg-black transition-colors"
        >
          <Plus size={15} strokeWidth={2.5} />
          Create Assignment
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
        {navItems.map(({ icon: Icon, label, href, badge }) => (
          <Link
            key={href}
            href={href}
            className={clsx(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all group",
              isActive(href)
                ? "bg-surface-muted text-brand-dark font-medium"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
            )}
          >
            <Icon
              size={17}
              className={clsx(
                "shrink-0 transition-colors",
                isActive(href) ? "text-brand-dark" : "text-gray-400 group-hover:text-gray-600"
              )}
            />
            <span className="flex-1">{label}</span>
            {badge && (
              <span className="bg-brand-orange text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center leading-tight">
                {badge}
              </span>
            )}
          </Link>
        ))}
      </nav>

      {/* Bottom */}
      <div className="border-t border-surface-border p-4 space-y-2">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-all"
        >
          <Settings size={17} className="text-gray-400" />
          Settings
        </Link>
        {/* User profile */}
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-200 to-orange-400 flex items-center justify-center shrink-0">
            <span className="text-white text-xs font-bold">D</span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-brand-dark truncate">Delhi Public School</p>
            <p className="text-xs text-gray-400 truncate">Bokaro Steel City</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

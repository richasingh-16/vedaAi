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
    <div className="hidden md:flex flex-col py-[13px] pl-[13px] h-screen shrink-0 relative z-30 bg-transparent">
      <aside className="relative flex flex-col w-[260px] h-full bg-white rounded-[24px] shadow-[0_8px_40px_rgba(0,0,0,0.12)] border border-gray-100 overflow-hidden">
      {/* Logo */}
      <div className="px-6 pt-6 pb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-[10px] bg-[#ff5722] flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-sm">V</span>
          </div>
          <span className="font-bold text-[18px] tracking-tight text-[#303030]">VedaAI</span>
        </div>
      </div>

      {/* Create Assignment */}
      <div className="px-4 pb-6">
        <Link
          href="/create"
          className="flex items-center justify-center gap-2 w-full bg-[#2A2A2A] border-[3px] border-[#E76F51] text-white rounded-full py-2.5 text-[14px] font-semibold hover:bg-black transition-colors"
        >
          <Plus size={16} strokeWidth={3} className="text-white" />
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
      <div className="px-5 pb-6">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-3 py-3 rounded-[12px] text-[15px] font-medium text-[#666666] hover:bg-[#F4F4F5] hover:text-[#1A1A1A] transition-all mb-1"
        >
          <Settings size={20} className="text-[#A3A3A3]" />
          Settings
        </Link>
        {/* User profile */}
        <div className="flex items-center gap-3 p-3 bg-[#F4F4F5] rounded-[16px] w-full">
          <div className="w-[42px] h-[42px] rounded-full overflow-hidden bg-gray-200 shrink-0">
             <img 
               src="/images/2e5a797574651e700037a00834fc192cdff92aad.jpg" 
               alt="Avatar" 
               className="w-full h-full object-cover shrink-0"
             />
          </div>
          <div className="min-w-0 pr-1">
            <p className="text-[14px] font-bold text-[#1A1A1A] truncate leading-tight">Delhi Public School</p>
            <p className="text-[13px] text-[#888888] font-medium truncate mt-[2px] leading-tight">Bokaro Steel City</p>
          </div>
        </div>
      </div>
    </aside>
    </div>
  );
}

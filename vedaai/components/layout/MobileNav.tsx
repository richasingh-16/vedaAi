"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getRouteMatcher } from "next/dist/shared/lib/router/utils/route-matcher";
import { LayoutGrid, CalendarCheck, Library, Sparkles } from "lucide-react";
import clsx from "clsx";

const items = [
  { icon: LayoutGrid, label: "Home", href: "/" },
  { icon: CalendarCheck, label: "Assignments", href: "/assignments" },
  { icon: Library, label: "Library", href: "/library" },
  { icon: Sparkles, label: "AI Toolkit", href: "/toolkit" },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-4 left-4 right-4 bg-[#1A1A1A] rounded-[24px] z-40 no-print flex shadow-lg">
      <div className="flex w-full items-center justify-between px-6 py-3">
        {items.map(({ icon: Icon, label, href }) => {
          const isActive = (pathname.startsWith(href) && href !== "/") || pathname === href || (href === "/assignments" && pathname === "/create");
          return (
          <Link
            key={href}
            href={href}
            className={clsx(
              "flex flex-col items-center gap-1 font-medium transition-all group",
              isActive ? "text-white" : "text-[#888888]"
            )}
          >
            <div className={clsx("flex items-center justify-center rounded-xl p-1 transition-all", isActive ? "" : "")}>
               <Icon size={20} className={isActive ? "text-white" : "text-[#888888]"} strokeWidth={isActive ? 2.5 : 2} />
            </div>
            <span className="text-[10px] tracking-wide">{label}</span>
          </Link>
          );
        })}
      </div>
    </nav>
  );
}

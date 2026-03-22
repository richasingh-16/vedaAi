"use client";

import { Bell, ChevronDown, LayoutGrid, ArrowLeft, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

function getBreadcrumb(pathname: string) {
  if (pathname.startsWith("/assignment/")) return [{ label: "Assignment", href: "/assignments" }, { label: "View Output" }];
  if (pathname === "/create") return [{ label: "Assignment", href: "/assignments" }, { label: "Create New" }];
  if (pathname === "/assignments") return [{ label: "Assignment" }];
  return [{ label: "Home" }];
}

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const crumbs = getBreadcrumb(pathname);

  return (
    <div className="w-full px-0 md:px-[13px] pt-[13px] relative z-20">
      <header className="relative h-[56px] bg-white flex items-center justify-between px-4 shrink-0 w-full md:rounded-[16px] rounded-full shadow-sm md:shadow-[0_8px_40px_rgba(0,0,0,0.12)] border border-gray-100 mx-auto max-w-[calc(100%-26px)] md:max-w-none">
        
        {/* Mobile Left: Logo */}
        <div className="md:hidden flex items-center gap-2">
          <div className="w-7 h-7 rounded-[8px] bg-[#2A2A2A] flex items-center justify-center">
            <span className="text-white font-bold text-[14px]">V</span>
          </div>
          <span className="font-bold text-[16px] text-[#303030] tracking-tight">VedaAI</span>
        </div>

        {/* Desktop Left: Breadcrumbs */}
        <div className="hidden md:flex items-center gap-3 text-sm">
          <div className="flex items-center gap-2">
            <LayoutGrid size={18} strokeWidth={2.5} className="text-[#A3A3A3]" />
            {crumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <span className="text-[#A3A3A3]">/</span>}
                {crumb.href ? (
                  <Link href={crumb.href} className="text-[#A3A3A3] font-semibold hover:text-gray-800 transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-[#A3A3A3] font-semibold">{crumb.label}</span>
                )}
              </span>
            ))}
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-1 md:gap-2">
          <button className="relative flex items-center justify-center hover:bg-gray-100 w-[36px] h-[36px] rounded-full transition-colors mr-1 md:mr-0">
            <Bell size={20} className="text-gray-700 md:w-[22px] md:w-[22px] md:h-[22px]" strokeWidth={2} />
            <span className="absolute top-1.5 right-1.5 md:right-1.5 w-[8px] h-[8px] bg-[#ff5722] rounded-full border-[1.5px] border-white" />
          </button>
          
          <div className="flex items-center gap-2 bg-transparent rounded-full pl-0 py-1 cursor-pointer">
            <div className="w-[30px] h-[30px] md:w-[36px] md:h-[36px] rounded-full overflow-hidden bg-gray-200">
              <img
                src="/images/2e5a797574651e700037a00834fc192cdff92aad.jpg"
                alt="Profile"
                className="object-cover w-full h-full"
              />
            </div>
            <span className="text-[14px] font-semibold text-gray-800 hidden md:block pr-1 ml-1">John Doe</span>
            <ChevronDown size={16} className="text-gray-600 hidden md:block" />
          </div>

          <button className="md:hidden flex items-center justify-center w-[36px] h-[36px] ml-1">
            <Menu size={22} className="text-gray-800" strokeWidth={2} />
          </button>
        </div>
      </header>
    </div>
  );
}

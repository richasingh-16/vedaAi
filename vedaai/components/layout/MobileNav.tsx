"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, Library, Wand2 } from "lucide-react";
import clsx from "clsx";

const items = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Users, label: "My Groups", href: "/groups" },
  { icon: Library, label: "Library", href: "/library" },
  { icon: Wand2, label: "AI Toolkit", href: "/toolkit" },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-brand-dark border-t border-white/10 z-40 no-print">
      <div className="flex items-center justify-around px-2 py-2">
        {items.map(({ icon: Icon, label, href }) => (
          <Link
            key={href}
            href={href}
            className={clsx(
              "flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl transition-all",
              pathname === href ? "text-white" : "text-gray-500"
            )}
          >
            <Icon size={20} />
            <span className="text-[10px] font-medium">{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}

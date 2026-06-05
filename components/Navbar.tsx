"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";

const links = [
  { href: "/gift", label: "선물추천", shortLabel: "선물" },
  { href: "/decide", label: "살까말까", shortLabel: "살까" },
  { href: "/budget", label: "가성비레이더", shortLabel: "가성비" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-[#E9ECEF] shadow-sm">
      <div className="max-w-[480px] mx-auto px-4 h-14 flex items-center justify-between">
        <Logo size="sm" />
        <div className="flex gap-1 sm:gap-4">
          {links.map(({ href, label, shortLabel }) => (
            <Link
              key={href}
              href={href}
              className={`text-xs sm:text-sm font-medium whitespace-nowrap px-2 py-1 rounded-lg transition-colors ${
                pathname === href
                  ? "text-[#C00037] bg-red-50"
                  : "text-[#666666] hover:text-[#1A1A1A] hover:bg-[#F8F9FA]"
              }`}
            >
              <span className="sm:hidden">{shortLabel}</span>
              <span className="hidden sm:inline">{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

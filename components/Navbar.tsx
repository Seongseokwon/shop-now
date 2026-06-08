"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";

const links = [
  { href: "/gift", label: "상품추천", shortLabel: "🛍️ 상품" },
  { href: "/decide", label: "살까말까", shortLabel: "🤔 살까?" },
  { href: "/budget", label: "가성비레이더", shortLabel: "💸 가성비" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-[#E9ECEF] shadow-sm">
      <div className="max-w-[480px] mx-auto px-4 h-14 flex items-center justify-between gap-3">
        <Logo size="sm" />
        <div className="flex gap-1 bg-[#F8F9FA] rounded-xl p-1">
          {links.map(({ href, shortLabel }) => (
            <Link
              key={href}
              href={href}
              className={`text-xs font-semibold whitespace-nowrap px-3 py-1.5 rounded-lg transition-all duration-150 ${
                pathname === href
                  ? "bg-white text-[#C00037] shadow-sm border border-[#F0E0E4]"
                  : "text-[#888888] hover:text-[#1A1A1A]"
              }`}
            >
              {shortLabel}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

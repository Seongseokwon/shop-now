"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "홈", shortLabel: "홈" },
  { href: "/gift", label: "선물추천", shortLabel: "선물" },
  { href: "/decide", label: "살까말까", shortLabel: "살까" },
  { href: "/budget", label: "가성비레이더", shortLabel: "가성비" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-[#E9ECEF]">
      <div className="max-w-[480px] mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="text-[#C00037] font-bold text-lg">
          쇼핑GPT
        </Link>
        <div className="flex gap-1 sm:gap-4 overflow-x-auto">
          {links.map(({ href, label, shortLabel }) => (
            <Link
              key={href}
              href={href}
              className={`text-xs sm:text-sm font-medium whitespace-nowrap ${
                pathname === href
                  ? "text-[#C00037]"
                  : "text-[#666666] hover:text-[#1A1A1A]"
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

import Link from "next/link";
import Logo from "@/components/Logo";
import DecideHistory from "@/components/DecideHistory";

const features = [
  {
    href: "/decide",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="9" stroke="#0066FF" strokeWidth="1.5" fill="#0066FF" opacity="0.08" />
        <path d="M12 7v6l4 2" stroke="#0066FF" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    title: "살까말까",
    emoji: "🤔",
    tagline: "구매 고민 AI 판단",
    desc: "상품명만 입력하면 AI가 냉정하게 사야 할지 분석",
    color: "from-blue-50 to-white",
    borderHover: "hover:border-[#0066FF]",
    ctaLabel: "AI에게 물어보기",
  },
  {
    href: "/gift",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3" y="8" width="18" height="13" rx="2" fill="#C00037" opacity="0.12" stroke="#C00037" strokeWidth="1.5" />
        <path d="M3 12h18" stroke="#C00037" strokeWidth="1.5" />
        <path d="M12 8V21" stroke="#C00037" strokeWidth="1.5" />
        <path d="M12 8C12 8 9 5 7 6C5 7 6 10 8 9C10 8 12 8 12 8Z" fill="#C00037" />
        <path d="M12 8C12 8 15 5 17 6C19 7 18 10 16 9C14 8 12 8 12 8Z" fill="#C00037" />
      </svg>
    ),
    title: "상품 추천기",
    emoji: "🛍️",
    tagline: "조건별 맞춤 상품 추천",
    desc: "카테고리·예산·목적 선택하면 AI가 딱 맞는 상품 TOP 3",
    color: "from-red-50 to-white",
    borderHover: "hover:border-[#C00037]",
    ctaLabel: "상품 추천받기",
  },
  {
    href: "/budget",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="9" stroke="#28A745" strokeWidth="1.5" fill="#28A745" opacity="0.08" />
        <path d="M12 3L12 5M12 19L12 21M3 12L5 12M19 12L21 12" stroke="#28A745" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="12" cy="12" r="4" fill="#28A745" opacity="0.3" />
        <circle cx="12" cy="12" r="2" fill="#28A745" />
      </svg>
    ),
    title: "가성비 레이더",
    emoji: "💸",
    tagline: "예산별 가성비 분석",
    desc: "카테고리·예산 선택하면 이 가격대 진짜 최고 상품 발굴",
    color: "from-green-50 to-white",
    borderHover: "hover:border-[#28A745]",
    ctaLabel: "가성비 분석하기",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col items-center gap-6 py-4">
      {/* Hero */}
      <div className="w-full rounded-3xl bg-gradient-to-br from-[#fff0f3] via-white to-[#f0f4ff] px-6 py-8 flex flex-col items-center gap-5 border border-[#F0E0E4]">
        <Logo size="lg" />

        <div className="text-center flex flex-col gap-2">
          <h1 className="text-2xl font-black text-[#1A1A1A] leading-tight tracking-tight">
            쇼핑 고민, <span className="text-[#C00037]">AI가 30초</span>에 해결
          </h1>
          <p className="text-[#555555] text-sm leading-relaxed">
            광고 말고 진짜 괜찮은 상품만 추천해드립니다
          </p>
        </div>

        {/* Trust signals */}
        <div className="flex gap-4 text-xs text-[#555555]">
          <span className="flex items-center gap-1">
            <span className="text-[#C00037]">✓</span> 쿠팡 후기 분석
          </span>
          <span className="flex items-center gap-1">
            <span className="text-[#C00037]">✓</span> 광고 없는 추천
          </span>
          <span className="flex items-center gap-1">
            <span className="text-[#C00037]">✓</span> 무료 이용
          </span>
        </div>

        {/* Primary CTA → 살까말까 */}
        <Link
          href="/decide"
          className="w-full bg-[#C00037] hover:bg-[#A0002D] active:scale-[0.98] text-white font-bold py-4 rounded-2xl text-center text-base transition-all shadow-md shadow-[#C00037]/20"
        >
          살까말까 AI에게 물어보기 →
        </Link>
      </div>

      {/* Feature cards */}
      <div className="w-full flex flex-col gap-3">
        {features.map(({ href, icon, title, emoji, tagline, desc, color, borderHover, ctaLabel }) => (
          <Link
            key={href}
            href={href}
            className={`group bg-gradient-to-r ${color} border border-[#E9ECEF] rounded-2xl p-5 flex items-start gap-4 ${borderHover} transition-all duration-200 hover:-translate-y-1 hover:shadow-lg active:scale-[0.98] cursor-pointer`}
          >
            <div className="mt-0.5 shrink-0 w-11 h-11 rounded-xl bg-white shadow-sm flex items-center justify-center border border-[#E9ECEF] group-hover:shadow-md transition-shadow">
              {icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-bold text-[#1A1A1A] text-base">{title}</p>
                <span className="text-[11px] text-[#666666] bg-white border border-[#E9ECEF] rounded-full px-2 py-0.5">
                  {emoji} {tagline}
                </span>
              </div>
              <p className="text-[#555555] text-sm leading-relaxed">{desc}</p>
              <p className="text-xs font-semibold mt-2 text-[#C00037] group-hover:underline">
                {ctaLabel} →
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* 최근 판정 기록 (localStorage, client-only) */}
      <DecideHistory />

      <p className="text-[#BBBBBB] text-[11px] text-center">
        파트너스 활동을 통해 수수료를 제공받을 수 있습니다
      </p>
    </div>
  );
}

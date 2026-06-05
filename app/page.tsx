import Link from "next/link";
import Logo from "@/components/Logo";

const features = [
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
    title: "선물 추천기",
    badge: "Gift",
    desc: "관계, 나이, 예산만 입력하면\nAI가 딱 맞는 선물을 추천해드려요",
    color: "from-red-50 to-white",
    borderHover: "hover:border-[#C00037]",
  },
  {
    href: "/decide",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="9" stroke="#0066FF" strokeWidth="1.5" fill="#0066FF" opacity="0.08" />
        <path d="M12 7v6l4 2" stroke="#0066FF" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    title: "살까말까 결정기",
    badge: "Decide",
    desc: "고민되는 상품명만 입력하세요.\nAI가 사야 할 이유를 분석해드립니다",
    color: "from-blue-50 to-white",
    borderHover: "hover:border-[#0066FF]",
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
    badge: "Budget",
    desc: "카테고리와 예산을 선택하면\n이 가격대 최고의 상품을 찾아드립니다",
    color: "from-green-50 to-white",
    borderHover: "hover:border-[#28A745]",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col items-center gap-8 py-6">
      {/* Hero */}
      <div className="w-full rounded-3xl bg-gradient-to-br from-[#fff0f3] via-white to-[#f0f4ff] p-6 flex flex-col items-center gap-4 border border-[#F0E0E4]">
        <Logo size="lg" />
        <p className="text-[#666666] text-sm text-center leading-relaxed">
          AI가 해결하는 쇼핑 고민<br />
          <span className="text-[#C00037] font-medium">추천 상품은 쿠팡에서 바로 확인</span>
        </p>
        <div className="flex gap-2 mt-1">
          <span className="text-[10px] bg-[#C00037] text-white rounded-full px-2.5 py-0.5 font-medium">AI 추천</span>
          <span className="text-[10px] bg-[#1A1A1A] text-white rounded-full px-2.5 py-0.5 font-medium">쿠팡 연동</span>
          <span className="text-[10px] bg-[#0066FF] text-white rounded-full px-2.5 py-0.5 font-medium">무료 이용</span>
        </div>
      </div>

      {/* Feature cards */}
      <div className="w-full flex flex-col gap-3">
        {features.map(({ href, icon, title, badge, desc, color, borderHover }) => (
          <Link
            key={href}
            href={href}
            className={`bg-gradient-to-r ${color} border border-[#E9ECEF] rounded-2xl p-5 flex items-start gap-4 ${borderHover} transition-all hover:shadow-md active:scale-[0.98]`}
          >
            <div className="mt-0.5 shrink-0 w-11 h-11 rounded-xl bg-white shadow-sm flex items-center justify-center border border-[#E9ECEF]">
              {icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-semibold text-[#1A1A1A]">{title}</p>
                <span className="text-[10px] text-[#999999] bg-[#F8F9FA] border border-[#E9ECEF] rounded px-1.5 py-0.5 font-mono">{badge}</span>
              </div>
              <p className="text-[#666666] text-sm whitespace-pre-line leading-relaxed">{desc}</p>
            </div>
            <svg className="shrink-0 mt-1 text-[#C0C0C0]" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        ))}
      </div>

      <p className="text-[#BBBBBB] text-[11px] text-center">
        파트너스 활동을 통해 수수료를 제공받을 수 있습니다
      </p>
    </div>
  );
}

import Link from "next/link";

const features = [
  {
    href: "/gift",
    icon: "🎁",
    title: "선물 추천기",
    desc: "관계, 나이, 예산만 입력하면\nAI가 딱 맞는 선물을 추천해드려요",
  },
  {
    href: "/decide",
    icon: "🤔",
    title: "살까말까 결정기",
    desc: "고민되는 상품명만 입력하세요.\nAI가 사야 할 이유를 분석해드립니다",
  },
  {
    href: "/budget",
    icon: "📡",
    title: "가성비 레이더",
    desc: "카테고리와 예산을 선택하면\n이 가격대 최고의 상품을 찾아드립니다",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col items-center gap-8 py-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-[#C00037] mb-2">쇼핑GPT</h1>
        <p className="text-[#666666] text-sm leading-relaxed">
          AI가 해결하는 쇼핑 고민<br />추천 상품은 쿠팡에서 바로 확인
        </p>
      </div>

      <div className="w-full flex flex-col gap-4">
        {features.map(({ href, icon, title, desc }) => (
          <Link
            key={href}
            href={href}
            className="bg-[#F8F9FA] border border-[#E9ECEF] rounded-2xl p-5 flex items-start gap-4 hover:border-[#C00037] transition-colors"
          >
            <span className="text-3xl">{icon}</span>
            <div>
              <p className="font-semibold text-[#1A1A1A] mb-1">{title}</p>
              <p className="text-[#666666] text-sm whitespace-pre-line">{desc}</p>
            </div>
          </Link>
        ))}
      </div>

      <p className="text-[#999999] text-xs text-center">
        파트너스 활동을 통해 수수료를 제공받을 수 있습니다
      </p>
    </div>
  );
}

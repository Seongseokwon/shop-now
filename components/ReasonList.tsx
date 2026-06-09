"use client";

interface ReasonListProps {
  items: string[];
  type: "buy" | "skip";
}

// 키워드 → 이모지 매핑 (buy)
const BUY_EMOJI_MAP: [RegExp, string][] = [
  [/음질|사운드|소리|오디오/, "🎵"],
  [/착용|착감|편안|편함|편리|착용감/, "😌"],
  [/생태계|호환|연동|애플|갤럭시|안드로이드/, "🔗"],
  [/배터리|충전|오래/, "🔋"],
  [/노이즈|소음|방음|차음/, "🤫"],
  [/디자인|예쁘|스타일|외관|색상/, "✨"],
  [/가격|저렴|합리적|가성비|싸/, "💰"],
  [/성능|빠르|속도|처리/, "⚡"],
  [/내구|튼튼|견고|품질/, "🛡️"],
  [/카메라|사진|촬영|렌즈/, "📷"],
  [/화면|디스플레이|해상도|선명/, "🖥️"],
  [/무게|가볍|경량/, "🪶"],
  [/방수|방진|IP/, "💧"],
  [/기능|편의|유용|스마트/, "🧩"],
  [/브랜드|신뢰|인지도|유명/, "🏅"],
  [/오래|수명|지속|장기/, "⏳"],
  [/선물|증정|기념/, "🎁"],
];

// 키워드 → 이모지 매핑 (skip)
const SKIP_EMOJI_MAP: [RegExp, string][] = [
  [/가격|비싸|고가|부담|돈/, "💸"],
  [/배터리|방전|충전/, "🪫"],
  [/호환|연동|지원 안|미지원/, "🔌"],
  [/노이즈|소음|차음|방음/, "📢"],
  [/무겁|무게|크기|부피/, "🏋️"],
  [/디자인|구식|촌스|오래된/, "😐"],
  [/성능|느리|버벅|끊김/, "🐢"],
  [/내구|약하|깨지|망가/, "💔"],
  [/구형|구버전|이전|단종/, "📦"],
  [/대안|더 나은|대체|비교/, "🔄"],
  [/충동|필요 없|없어도/, "🛑"],
  [/과소비|낭비|지출/, "🚨"],
  [/비슷|같은|이미 있|중복/, "♻️"],
  [/업그레이드|신형|출시 예정/, "🔮"],
  [/수리|AS|고장|품질/, "🔧"],
];

function getEmoji(text: string, type: "buy" | "skip"): string {
  const map = type === "buy" ? BUY_EMOJI_MAP : SKIP_EMOJI_MAP;
  for (const [pattern, emoji] of map) {
    if (pattern.test(text)) return emoji;
  }
  // 기본 폴백
  return type === "buy" ? "👍" : "👎";
}

export default function ReasonList({ items, type }: ReasonListProps) {
  return (
    <ul className="flex flex-col gap-1.5">
      {items.map((r, i) => {
        const emoji = getEmoji(r, type);
        return (
          <li
            key={i}
            className="flex items-start gap-1.5 text-xs text-[#1A1A1A] leading-relaxed opacity-0"
            style={{
              animation: `fadeInUp 0.35s ease-out forwards`,
              animationDelay: `${i * 0.12}s`,
            }}
          >
            <span className="flex-shrink-0 text-sm leading-none mt-px">{emoji}</span>
            <span>{r}</span>
          </li>
        );
      })}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </ul>
  );
}

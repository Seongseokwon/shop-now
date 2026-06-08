"use client";

interface ReasonListProps {
  items: string[];
  type: "buy" | "skip";
}

export default function ReasonList({ items, type }: ReasonListProps) {
  const isBuy = type === "buy";

  return (
    <ul className="flex flex-col gap-1">
      {items.map((r, i) => (
        <li
          key={i}
          className="text-xs text-[#1A1A1A] leading-relaxed opacity-0"
          style={{
            animation: `fadeInUp 0.35s ease-out forwards`,
            animationDelay: `${i * 0.1}s`,
          }}
        >
          {isBuy ? "✓" : "✗"} {r}
        </li>
      ))}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </ul>
  );
}

"use client";

import { useEffect, useState } from "react";

interface VerdictBadgeProps {
  verdict: string;
}

export default function VerdictBadge({ verdict }: VerdictBadgeProps) {
  const isBuy = verdict === "사세요";
  const [scale, setScale] = useState(0.8);

  useEffect(() => {
    setScale(0.8);
    // bounce: 0.8 → 1.05 → 1.0 over 600ms
    const t1 = setTimeout(() => setScale(1.05), 10);
    const t2 = setTimeout(() => setScale(1.0), 350);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [verdict]);

  return (
    <div
      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl font-black text-2xl border-2"
      style={{
        background: isBuy ? "#dcfce7" : "#fee2e2",
        borderColor: isBuy ? "#16a34a" : "#dc2626",
        color: isBuy ? "#15803d" : "#b91c1c",
        transform: `scale(${scale})`,
        transition: "transform 0.25s cubic-bezier(0.34,1.56,0.64,1)",
      }}
    >
      <span>{isBuy ? "✅" : "🚫"}</span>
      <span>{verdict}</span>
    </div>
  );
}

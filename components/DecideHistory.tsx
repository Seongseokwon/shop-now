"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { encodeResult, type ResultPayload } from "@/lib/resultUrl";

export const HISTORY_KEY = "decide_history";

export function saveToHistory(payload: ResultPayload) {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    const existing: ResultPayload[] = raw ? JSON.parse(raw) : [];
    // 같은 상품명 중복 제거 후 앞에 추가, 최대 5개
    const deduped = existing.filter((e) => e.p !== payload.p);
    const next = [payload, ...deduped].slice(0, 5);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
  } catch {
    // localStorage 접근 불가 환경 무시
  }
}

function getCopy(item: ResultPayload): string {
  if (item.v === "참으세요") {
    return `지난번에 참으라고 했던 ${item.p}, 아직도 고민 중?`;
  }
  return `${item.p} 다시 사고 싶어졌다면?`;
}

export default function DecideHistory() {
  const [history, setHistory] = useState<ResultPayload[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      if (raw) setHistory(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, []);

  if (history.length === 0) return null;

  return (
    <div className="w-full flex flex-col gap-3">
      <p className="text-sm font-bold text-[#1A1A1A]">🕑 최근 판정 기록</p>
      <div className="flex flex-col gap-2">
        {history.map((item, i) => {
          const isBuy = item.v === "사세요";
          let encoded = "";
          try {
            encoded = encodeResult(item);
          } catch {
            return null;
          }
          return (
            <Link
              key={i}
              href={`/result?d=${encoded}`}
              className="flex items-center justify-between gap-3 bg-white border border-[#E9ECEF] rounded-xl px-4 py-3 hover:border-[#C00037] hover:shadow-sm transition-all group"
            >
              <div className="flex flex-col gap-0.5 min-w-0">
                <p className="text-xs text-[#888888]">{getCopy(item)}</p>
                <p className="text-sm font-semibold text-[#1A1A1A] truncate">{item.p}</p>
              </div>
              <span
                className="shrink-0 text-xs font-bold px-2.5 py-1 rounded-full border"
                style={{
                  background: isBuy ? "#dcfce7" : "#fee2e2",
                  borderColor: isBuy ? "#16a34a" : "#dc2626",
                  color: isBuy ? "#15803d" : "#b91c1c",
                }}
              >
                {item.v}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

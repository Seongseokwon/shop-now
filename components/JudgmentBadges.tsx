"use client";

import { useEffect, useState } from "react";
import { loadStats, getEarnedBadges, type Badge } from "@/lib/badges";

interface NewBadgeToastProps {
  badge: Badge;
  onClose: () => void;
}

function NewBadgeToast({ badge, onClose }: NewBadgeToastProps) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-4 fade-in duration-300">
      <div className="flex items-center gap-3 bg-[#1A1A1A] text-white px-5 py-3 rounded-2xl shadow-xl">
        <span className="text-2xl">{badge.emoji}</span>
        <div>
          <p className="text-xs text-[#AAAAAA]">새 배지 획득!</p>
          <p className="text-sm font-bold">{badge.label}</p>
        </div>
      </div>
    </div>
  );
}

interface JudgmentBadgesProps {
  /** 방금 판정 후 새로 획득한 배지 목록 (토스트 표시용) */
  newBadges?: Badge[];
}

export default function JudgmentBadges({ newBadges = [] }: JudgmentBadgesProps) {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [toastQueue, setToastQueue] = useState<Badge[]>([]);

  useEffect(() => {
    setBadges(getEarnedBadges(loadStats()));
  }, []);

  useEffect(() => {
    if (newBadges.length > 0) {
      setToastQueue((q) => [...q, ...newBadges]);
    }
  }, [newBadges]);

  const earned = badges.filter((b) => b.earned);
  const locked = badges.filter((b) => !b.earned);

  const dismissToast = () => setToastQueue((q) => q.slice(1));

  if (badges.length === 0) return null;

  return (
    <>
      {/* 토스트 */}
      {toastQueue[0] && (
        <NewBadgeToast badge={toastQueue[0]} onClose={dismissToast} />
      )}

      {/* 배지 섹션 */}
      <div className="flex flex-col gap-3">
        <p className="text-sm font-bold text-[#1A1A1A]">🏅 나의 배지</p>
        <div className="grid grid-cols-3 gap-2">
          {/* 획득한 배지 */}
          {earned.map((b) => (
            <div
              key={b.id}
              title={b.description}
              className="flex flex-col items-center gap-1 bg-white border border-[#E9ECEF] rounded-xl px-2 py-3 shadow-sm"
            >
              <span className="text-2xl">{b.emoji}</span>
              <p className="text-[10px] font-semibold text-[#1A1A1A] text-center leading-tight">
                {b.label}
              </p>
            </div>
          ))}
          {/* 잠긴 배지 */}
          {locked.map((b) => (
            <div
              key={b.id}
              title={b.description}
              className="flex flex-col items-center gap-1 bg-[#F8F9FA] border border-[#E9ECEF] rounded-xl px-2 py-3 opacity-40 grayscale"
            >
              <span className="text-2xl">{b.emoji}</span>
              <p className="text-[10px] font-semibold text-[#888] text-center leading-tight">
                {b.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

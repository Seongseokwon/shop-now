"use client";

import { useEffect, useRef, useState } from "react";
import { loadStats, getEarnedBadges, type Badge } from "@/lib/badges";

interface NewBadgeModalProps {
  badge: Badge;
  onClose: () => void;
}

function NewBadgeModal({ badge, onClose }: NewBadgeModalProps) {
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const autoCloseRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 1.5s 딜레이 후 등장
  useEffect(() => {
    const showTimer = setTimeout(() => {
      setVisible(true);
      // 등장 후 4s 자동 소멸
      autoCloseRef.current = setTimeout(() => {
        handleClose();
      }, 4000);
    }, 1500);

    return () => {
      clearTimeout(showTimer);
      if (autoCloseRef.current) clearTimeout(autoCloseRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ESC 키로 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClose = () => {
    setVisible(false);
    // 애니메이션 후 실제 제거
    setTimeout(onClose, 300);
  };

  const handleShare = async () => {
    const shareData = {
      title: "배지 획득!",
      text: `${badge.emoji} ${badge.label} 배지를 획득했어요!`,
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        throw new Error("share not supported");
      }
    } catch {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // 클립보드도 실패하면 조용히 무시
      }
    }
  };

  if (!visible && !autoCloseRef.current) return null;

  return (
    <div
      className={`fixed inset-0 bg-black/40 z-50 flex items-center justify-center transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onClick={handleClose}
    >
      <div
        className={`relative bg-white rounded-2xl shadow-xl max-w-[320px] w-[90vw] p-6 flex flex-col items-center gap-4 transition-all duration-300 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 닫기(X) 버튼 */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-[#AAAAAA] hover:text-[#555] text-lg leading-none"
          aria-label="닫기"
        >
          ✕
        </button>

        {/* 축하 텍스트 */}
        <p className="text-base font-bold text-[#1A1A1A]">🎉 새 배지 획득!</p>

        {/* 배지 이모지 */}
        <span className="text-5xl">{badge.emoji}</span>

        {/* 배지 이름 + 설명 */}
        <div className="text-center">
          <p className="text-lg font-bold text-[#1A1A1A]">{badge.label}</p>
          <p className="text-sm text-[#888] mt-1">{badge.description}</p>
        </div>

        {/* CTA 버튼 */}
        <button
          onClick={handleShare}
          className="w-full bg-[#E8344E] hover:bg-[#c92a3e] active:bg-[#b02438] text-white font-bold py-3 rounded-xl transition-colors duration-150"
        >
          {copied ? "링크 복사됨! ✓" : "친구에게 자랑하기"}
        </button>

        {/* 닫기 텍스트 버튼 */}
        <button
          onClick={handleClose}
          className="text-sm text-[#AAAAAA] hover:text-[#555] transition-colors duration-150"
        >
          닫기
        </button>
      </div>
    </div>
  );
}

interface JudgmentBadgesProps {
  /** 방금 판정 후 새로 획득한 배지 목록 (모달 표시용) */
  newBadges?: Badge[];
}

export default function JudgmentBadges({ newBadges = [] }: JudgmentBadgesProps) {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [modalQueue, setModalQueue] = useState<Badge[]>([]);

  useEffect(() => {
    setBadges(getEarnedBadges(loadStats()));
  }, []);

  useEffect(() => {
    if (newBadges.length > 0) {
      setModalQueue((q) => [...q, ...newBadges]);
    }
  }, [newBadges]);

  const earned = badges.filter((b) => b.earned);
  const locked = badges.filter((b) => !b.earned);

  const dismissModal = () => setModalQueue((q) => q.slice(1));

  if (badges.length === 0) return null;

  return (
    <>
      {/* 배지 획득 모달 */}
      {modalQueue[0] && (
        <NewBadgeModal badge={modalQueue[0]} onClose={dismissModal} />
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

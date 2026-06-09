"use client";

import { useEffect, useState } from "react";

type Mode = "decide" | "gift" | "budget" | "default";

interface LoadingSpinnerProps {
  productName?: string;
  mode?: Mode;
}

const SEQUENCES: Record<Mode, (productName?: string) => { emoji: string; text: string }[]> = {
  decide: (productName) => [
    { emoji: "🔍", text: productName ? `"${productName}" 분석 시작...` : "상품 분석 시작..." },
    { emoji: "🧠", text: "AI가 당신 대신 냉정하게 고민 중..." },
    { emoji: "💸", text: productName ? `${productName}, 정말 써도 될까요?` : "가격 대비 가치 계산 중..." },
    { emoji: "🕵️", text: "인터넷 최저가 추적 중..." },
    { emoji: "⚖️", text: "사야 할 이유 vs 참아야 할 이유 정리 중..." },
    { emoji: "😤", text: "냉정하게 판단할게요..." },
    { emoji: "✍️", text: "판정 결과 작성 중..." },
  ],
  gift: (productName) => [
    { emoji: "🎁", text: productName ? `"${productName}" 선물 분석 중...` : "선물 조건 분석 중..." },
    { emoji: "🧠", text: "AI가 딱 맞는 선물 고르는 중..." },
    { emoji: "🔍", text: "카테고리 베스트 상품 탐색 중..." },
    { emoji: "💡", text: "예산에 맞는 TOP3 추리는 중..." },
    { emoji: "🛍️", text: "최저가 가격 정보 가져오는 중..." },
    { emoji: "✍️", text: "추천 리스트 작성 중..." },
  ],
  budget: () => [
    { emoji: "📦", text: "가성비 분석 시작..." },
    { emoji: "🧠", text: "AI가 가격대별 상품 비교 중..." },
    { emoji: "💸", text: "가성비 최고 / 무난 / 프리미엄 분류 중..." },
    { emoji: "🔍", text: "실시간 최저가 검색 중..." },
    { emoji: "📊", text: "가성비 레이더 계산 중..." },
    { emoji: "✍️", text: "결과 정리 중..." },
  ],
  default: () => [
    { emoji: "🧠", text: "AI가 분석 중입니다..." },
    { emoji: "🔍", text: "정보를 가져오는 중..." },
    { emoji: "✍️", text: "결과를 정리하는 중..." },
  ],
};

export default function LoadingSpinner({ productName, mode = "default" }: LoadingSpinnerProps) {
  const steps = SEQUENCES[mode](productName);
  const [stepIndex, setStepIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setStepIndex(0);
    setVisible(true);
  }, []);

  useEffect(() => {
    if (stepIndex >= steps.length - 1) return;

    // fade out → update → fade in
    const fadeOutTimer = setTimeout(() => {
      setVisible(false);
    }, 1800);

    const changeTimer = setTimeout(() => {
      setStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
      setVisible(true);
    }, 2100);

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(changeTimer);
    };
  }, [stepIndex, steps.length]);

  const current = steps[stepIndex];

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="AI 분석 중"
      className="flex flex-col items-center gap-5 py-12"
    >
      {/* 이모지 bounce */}
      <div
        key={stepIndex}
        className="text-5xl animate-bounce"
        aria-hidden="true"
        style={{ animationDuration: "0.8s" }}
      >
        {current.emoji}
      </div>

      {/* 진행 텍스트 fade */}
      <p
        key={`text-${stepIndex}`}
        className="text-[#1A1A1A] text-sm font-semibold text-center px-4 transition-opacity duration-300"
        style={{ opacity: visible ? 1 : 0 }}
      >
        {current.text}
      </p>

      {/* 점 세 개 애니메이션 바 */}
      <div className="flex gap-1.5" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-2 h-2 rounded-full bg-[#C00037]"
            style={{
              animation: `dotPulse 1.2s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>

      {/* 단계 표시 */}
      <div className="flex gap-1.5" aria-hidden="true">
        {steps.map((_, i) => (
          <span
            key={i}
            className="rounded-full transition-all duration-500"
            style={{
              width: i === stepIndex ? "20px" : "6px",
              height: "6px",
              backgroundColor: i <= stepIndex ? "#C00037" : "#E9ECEF",
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes dotPulse {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

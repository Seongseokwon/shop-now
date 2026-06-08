"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface NudgeCTAProps {
  isSharedLanding: boolean;
  onReset?: () => void;
}

export default function NudgeCTA({ isSharedLanding, onReset }: NudgeCTAProps) {
  const [product, setProduct] = useState("");
  const router = useRouter();

  if (isSharedLanding) {
    function handleSubmit(e: React.FormEvent) {
      e.preventDefault();
      const q = product.trim();
      if (q) {
        sessionStorage.setItem("decide_prefill", q);
      }
      router.push("/decide");
    }

    return (
      <div className="flex flex-col gap-2 bg-[#FFF8F9] border border-[#F0D0D8] rounded-2xl p-4">
        <p className="text-sm font-bold text-[#1A1A1A] text-center">
          🤔 내 고민도 AI에게 물어보기
        </p>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            placeholder="고민 중인 상품명 입력..."
            className="flex-1 border border-[#E9ECEF] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#C00037] focus:ring-2 focus:ring-[#C00037]/20 bg-white"
          />
          <button
            type="submit"
            className="bg-[#C00037] hover:bg-[#A0002D] active:scale-[0.98] text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-all whitespace-nowrap"
          >
            판정받기 →
          </button>
        </form>
      </div>
    );
  }

  if (onReset) {
    return (
      <button
        onClick={onReset}
        className="w-full border border-[#E9ECEF] text-[#666666] py-2.5 rounded-xl text-sm hover:bg-[#F8F9FA] transition-colors"
      >
        다른 상품 판정받기
      </button>
    );
  }

  return null;
}

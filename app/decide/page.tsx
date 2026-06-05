"use client";

import { useState } from "react";
import CoupangButton from "@/components/CoupangButton";
import KakaoShareButton from "@/components/KakaoShareButton";
import LoadingSpinner from "@/components/LoadingSpinner";

const REASONS = [
  "가격이 비쌈",
  "정말 필요한지 모르겠음",
  "더 좋은 게 있을 것 같음",
  "충동구매일 것 같음",
];

type Alternative = { name: string; reason: string; coupangUrl: string };

type Result = {
  verdict: string;
  score: number;
  reasons_to_buy: string[];
  reasons_to_skip: string[];
  verdict_comment: string;
  alternatives: Alternative[];
};

export default function DecidePage() {
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [reasons, setReasons] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");

  function toggleReason(r: string) {
    setReasons((prev) => prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/recommend/decide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productName, price, reasons }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "오류가 발생했습니다.");
        return;
      }
      setResult(data);
    } catch {
      setError("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setResult(null);
    setError("");
  }

  const isBuy = result?.verdict === "사세요";

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-[#1A1A1A]">살까말까 결정기</h2>
        <p className="text-[#666666] text-sm mt-1">AI가 냉정하게 구매 여부를 판단해드립니다</p>
      </div>

      {!result && !loading && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="decide-product" className="text-sm font-medium">
              고민 중인 상품명<span className="text-[#DC3545] ml-0.5" aria-label="필수">*</span>
            </label>
            <input
              id="decide-product"
              required
              aria-required="true"
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="예) 에어팟 프로 2세대, 다이슨 드라이기"
              className="border border-[#E9ECEF] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#C00037] focus:ring-2 focus:ring-[#C00037]/20"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="decide-price" className="text-sm font-medium">현재 가격 (선택)</label>
            <input
              id="decide-price"
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="예) 289,000원"
              className="border border-[#E9ECEF] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#C00037] focus:ring-2 focus:ring-[#C00037]/20"
            />
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium">고민 이유 (복수 선택)</span>
            <div className="flex flex-col gap-2">
              {REASONS.map((r) => (
                <label key={r} className="flex items-center gap-2.5 cursor-pointer p-2 -m-2 rounded active:bg-[#F8F9FA]">
                  <input
                    type="checkbox"
                    checked={reasons.includes(r)}
                    onChange={() => toggleReason(r)}
                    className="w-5 h-5 accent-[#C00037]"
                  />
                  <span className="text-sm">{r}</span>
                </label>
              ))}
            </div>
          </div>

          {error && (
            <p className="text-[#DC3545] text-sm flex items-center gap-1.5">
              <span aria-hidden="true">⚠️</span>{error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !productName.trim()}
            className="bg-[#C00037] hover:bg-[#A0002D] disabled:bg-[#CCCCCC] disabled:text-white disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors"
          >
            {loading ? "분석 중..." : "AI에게 물어보기"}
          </button>
        </form>
      )}

      {loading && <LoadingSpinner />}

      {result && (
        <div className="flex flex-col gap-4">
          {/* Verdict */}
          <div className={`rounded-2xl p-4 sm:p-6 text-center ${isBuy ? "bg-[#28A745]/10 border border-[#28A745]/20" : "bg-[#DC3545]/10 border border-[#DC3545]/20"}`}>
            <p className={`text-3xl sm:text-4xl font-black mb-1 ${isBuy ? "text-[#28A745]" : "text-[#DC3545]"}`}>
              {result.verdict}
            </p>
            <p className="text-[#666666] text-sm">{productName}</p>
          </div>

          {/* Score gauge */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-xs text-[#666666] mb-1">
              <span>구매 추천도</span>
              <span className="font-semibold">{result.score}/100점</span>
            </div>
            <div className="w-full bg-[#E9ECEF] rounded-full h-4">
              <div
                className={`h-4 rounded-full transition-all ${result.score >= 60 ? "bg-[#28A745]" : "bg-[#DC3545]"}`}
                style={{ width: `${result.score}%` }}
              />
            </div>
          </div>

          {/* Reasons 2-column */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-[#28A745]/5 border border-[#28A745]/20 rounded-xl p-3">
              <p className="text-[#28A745] text-xs font-semibold mb-2">사야 할 이유</p>
              <ul className="flex flex-col gap-1">
                {result.reasons_to_buy.map((r, i) => (
                  <li key={i} className="text-xs text-[#1A1A1A] leading-relaxed">✓ {r}</li>
                ))}
              </ul>
            </div>
            <div className="bg-[#DC3545]/5 border border-[#DC3545]/20 rounded-xl p-3">
              <p className="text-[#DC3545] text-xs font-semibold mb-2">참아야 할 이유</p>
              <ul className="flex flex-col gap-1">
                {result.reasons_to_skip.map((r, i) => (
                  <li key={i} className="text-xs text-[#1A1A1A] leading-relaxed">✗ {r}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Comment */}
          <div className="bg-[#F8F9FA] border border-[#E9ECEF] rounded-xl p-4">
            <p className="text-sm text-[#1A1A1A]">💬 {result.verdict_comment}</p>
          </div>

          {/* Alternatives */}
          <div>
            <p className="text-sm font-semibold mb-2">대안 상품</p>
            <div className="flex flex-col gap-3">
              {result.alternatives.map((alt, i) => (
                <div key={i} className="bg-[#F8F9FA] border border-[#E9ECEF] rounded-xl p-4 flex flex-col gap-2">
                  <p className="font-medium text-sm">{alt.name}</p>
                  <p className="text-[#666666] text-xs">{alt.reason}</p>
                  <CoupangButton url={alt.coupangUrl} />
                </div>
              ))}
            </div>
          </div>

          <KakaoShareButton
            title="살까말까 AI에게 물어봤어요 🤔"
            description="쇼핑GPT에서 구매 결정을 AI에게 맡겨보세요"
          />

          <button
            onClick={reset}
            className="w-full border border-[#E9ECEF] text-[#666666] py-2.5 rounded-xl text-sm hover:bg-[#F8F9FA] transition-colors"
          >
            다시 물어보기
          </button>

          <p className="text-[#999999] text-xs text-center">
            파트너스 활동을 통해 수수료를 제공받을 수 있습니다
          </p>
        </div>
      )}
    </div>
  );
}

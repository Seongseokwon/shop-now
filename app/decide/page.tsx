"use client";

import { useState } from "react";
import CoupangButton from "@/components/CoupangButton";
import LoadingSpinner from "@/components/LoadingSpinner";
import MultiPillGroup from "@/components/MultiPillGroup";
import JudgmentCard from "@/components/JudgmentCard";
import { encodeResult } from "@/lib/resultUrl";

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
  const [customReason, setCustomReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [shareUrl, setShareUrl] = useState<string>("");
  const [error, setError] = useState("");

  function toggleReason(r: string) {
    setReasons((prev) =>
      prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r]
    );
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
        body: JSON.stringify({
          productName,
          price,
          reasons: customReason.trim()
            ? [...reasons, customReason.trim()]
            : reasons,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "오류가 발생했습니다.");
        return;
      }

      setResult(data);

      try {
        const encoded = encodeResult({
          v: data.verdict,
          s: data.score,
          p: productName,
          pr: price || undefined,
          rb: data.reasons_to_buy,
          rs: data.reasons_to_skip,
          vc: data.verdict_comment,
          t: Math.floor(Date.now() / 1000),
        });
        setShareUrl(`/result?d=${encoded}`);
      } catch {
        setShareUrl("/decide");
      }
    } catch {
      setError("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setResult(null);
    setShareUrl("");
    setError("");
  }

  function addCustomReason() {
    const trimmed = customReason.trim();
    if (!trimmed || reasons.includes(trimmed)) return;
    setReasons((prev) => [...prev, trimmed]);
    setCustomReason("");
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-black text-[#1A1A1A] tracking-tight">
          🤔 살까말까 결정기
        </h2>
        <p className="text-[#555555] text-sm mt-1">
          상품명 입력 → AI가 사야 할지 냉정하게 판단
        </p>
      </div>

      {!result && !loading && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="decide-product" className="text-sm font-medium">
              고민 중인 상품명
              <span className="text-[#DC3545] ml-0.5" aria-label="필수">*</span>
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
            <label htmlFor="decide-price" className="text-sm font-medium">
              현재 가격 (선택)
            </label>
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
            <MultiPillGroup options={REASONS} values={reasons} onChange={toggleReason} />
            {/* 직접 입력한 커스텀 이유 태그 */}
            {reasons.filter((r) => !REASONS.includes(r)).length > 0 && (
              <div className="flex flex-wrap gap-2">
                {reasons
                  .filter((r) => !REASONS.includes(r))
                  .map((r) => (
                    <span
                      key={r}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium bg-[#C00037] text-white border border-[#C00037]"
                    >
                      {r}
                      <button
                        type="button"
                        onClick={() => toggleReason(r)}
                        className="ml-0.5 hover:opacity-70 transition-opacity"
                        aria-label={`${r} 삭제`}
                      >
                        ×
                      </button>
                    </span>
                  ))}
              </div>
            )}
            <div className="flex gap-2">
              <input
                type="text"
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addCustomReason();
                  }
                }}
                placeholder="직접 입력 (예: 비슷한 게 이미 있음)"
                className="flex-1 border border-[#E9ECEF] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C00037] focus:ring-2 focus:ring-[#C00037]/20"
              />
              <button
                type="button"
                onClick={addCustomReason}
                disabled={!customReason.trim()}
                className="px-3 py-2 rounded-lg border border-[#E9ECEF] text-sm text-[#C00037] font-medium hover:border-[#C00037] hover:bg-[#C00037]/5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                추가
              </button>
            </div>
          </div>

          {error && (
            <p className="text-[#DC3545] text-sm flex items-center gap-1.5">
              <span aria-hidden="true">⚠️</span>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !productName.trim()}
            className="bg-[#C00037] hover:bg-[#A0002D] disabled:bg-[#CCCCCC] disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors"
          >
            AI에게 물어보기
          </button>
        </form>
      )}

      {loading && <LoadingSpinner />}

      {result && shareUrl && (
        <>
          <JudgmentCard
            verdict={result.verdict}
            score={result.score}
            productName={productName}
            price={price || undefined}
            reasonsToBuy={result.reasons_to_buy}
            reasonsToSkip={result.reasons_to_skip}
            verdictComment={result.verdict_comment}
            shareUrl={shareUrl}
            onReset={reset}
          />

          {result.alternatives.length > 0 && (
            <div>
              <p className="text-sm font-semibold mb-2">대안 상품</p>
              <div className="flex flex-col gap-3">
                {result.alternatives.map((alt, i) => (
                  <div
                    key={i}
                    className="bg-[#F8F9FA] border border-[#E9ECEF] rounded-xl p-4 flex flex-col gap-2"
                  >
                    <p className="font-medium text-sm">{alt.name}</p>
                    <p className="text-[#666666] text-xs">{alt.reason}</p>
                    <CoupangButton url={alt.coupangUrl} productName={alt.name} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

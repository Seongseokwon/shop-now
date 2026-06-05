"use client";

import { useState } from "react";
import CoupangButton from "@/components/CoupangButton";
import LoadingSpinner from "@/components/LoadingSpinner";

const CATEGORIES = [
  "무선이어폰", "블루투스스피커", "보조배터리", "마사지기", "공기청정기",
  "청소기", "노트북", "스마트워치", "커피메이커", "운동기구",
];
const BUDGETS = ["5만원", "10만원", "20만원", "30만원", "50만원"];

const LABEL_STYLES: Record<string, string> = {
  "가성비 최고": "bg-[#C00037] text-white",
  "무난한 선택": "bg-[#0066FF] text-white",
  "프리미엄 픽": "bg-[#4A4A4A] text-white",
};

type BudgetItem = {
  rank: number;
  label: string;
  name: string;
  price: string;
  keyword: string;
  highlight: string;
  for_whom: string;
  coupangUrl: string;
};

type Result = {
  title: string;
  items: BudgetItem[];
  buying_tip: string;
};

export default function BudgetPage() {
  const [category, setCategory] = useState("");
  const [budget, setBudget] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/recommend/budget", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, budget }),
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

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold">가성비 레이더</h2>
        <p className="text-[#666666] text-sm mt-1">카테고리와 예산을 선택하면 최고의 선택을 찾아드립니다</p>
      </div>

      {!result && !loading && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="budget-category" className="text-sm font-medium">
              카테고리<span className="text-[#DC3545] ml-0.5" aria-label="필수">*</span>
            </label>
            <select
              id="budget-category"
              required
              aria-required="true"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border border-[#E9ECEF] rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-[#C00037] focus:ring-2 focus:ring-[#C00037]/20"
            >
              <option value="">선택하세요</option>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="budget-amount" className="text-sm font-medium">
              예산 (이하)<span className="text-[#DC3545] ml-0.5" aria-label="필수">*</span>
            </label>
            <select
              id="budget-amount"
              required
              aria-required="true"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="border border-[#E9ECEF] rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-[#C00037] focus:ring-2 focus:ring-[#C00037]/20"
            >
              <option value="">선택하세요</option>
              {BUDGETS.map((b) => <option key={b}>{b}</option>)}
            </select>
          </div>

          {error && (
            <p className="text-[#DC3545] text-sm flex items-center gap-1.5">
              <span aria-hidden="true">⚠️</span>{error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !category || !budget}
            className="bg-[#C00037] hover:bg-[#A0002D] disabled:bg-[#CCCCCC] disabled:text-white disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors"
          >
            {loading ? "분석 중..." : "가성비 레이더 돌리기"}
          </button>
        </form>
      )}

      {loading && <LoadingSpinner />}

      {result && (
        <div className="flex flex-col gap-4">
          <p className="font-semibold text-[#1A1A1A]">{result.title}</p>

          <div className="flex flex-col gap-4">
            {result.items.map((item) => (
              <div key={item.rank} className="bg-[#F8F9FA] border border-[#E9ECEF] rounded-2xl p-4 flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${LABEL_STYLES[item.label] ?? "bg-gray-200 text-gray-700"}`}>
                    {item.label}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-sm">{item.name}</p>
                  <p className="text-[#C00037] text-sm font-medium mt-0.5">예상가격 {item.price}</p>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-sm text-[#1A1A1A]">⭐ {item.highlight}</p>
                  <p className="text-xs text-[#666666]">👤 {item.for_whom}</p>
                </div>
                <CoupangButton url={item.coupangUrl} />
              </div>
            ))}
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-xl p-4 flex gap-2">
            <span className="text-yellow-800">💡</span>
            <p className="text-sm text-yellow-800">구매 팁: {result.buying_tip}</p>
          </div>

          <button
            onClick={reset}
            className="w-full border border-[#E9ECEF] text-[#666666] py-2.5 rounded-xl text-sm hover:bg-[#F8F9FA] transition-colors"
          >
            다시 검색하기
          </button>

          <p className="text-[#999999] text-xs text-center">
            파트너스 활동을 통해 수수료를 제공받을 수 있습니다
          </p>
        </div>
      )}
    </div>
  );
}

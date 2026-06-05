"use client";

import { useState } from "react";
import CoupangButton from "@/components/CoupangButton";
import KakaoShareButton from "@/components/KakaoShareButton";
import LoadingSpinner from "@/components/LoadingSpinner";

const RELATIONS = ["부모님", "연인", "친구", "직장동료", "형제자매", "선생님"];
const AGES = ["10대", "20대", "30대", "40대", "50대이상"];
const BUDGETS = ["1만원대", "3만원대", "5만원대", "10만원대", "20만원이상"];
const GENDERS = ["남성", "여성", "상관없음"];

const CATEGORY_COLORS: Record<string, string> = {
  전자기기: "bg-blue-100 text-blue-700",
  뷰티: "bg-pink-100 text-pink-700",
  생활용품: "bg-green-100 text-green-700",
  패션: "bg-purple-100 text-purple-700",
  식품: "bg-yellow-100 text-yellow-700",
  스포츠: "bg-orange-100 text-orange-700",
};

type GiftItem = {
  rank: number;
  name: string;
  reason: string;
  price: string;
  keyword: string;
  category: string;
  coupangUrl: string;
};

type Result = {
  items: GiftItem[];
  comment: string;
};

export default function GiftPage() {
  const [form, setForm] = useState({ relation: "", age: "", budget: "", gender: "" });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const missing: string[] = [];
    if (!form.relation) missing.push("관계");
    if (!form.age) missing.push("나이대");
    if (!form.budget) missing.push("예산");
    if (!form.gender) missing.push("성별");
    if (missing.length > 0) {
      setError(`다음 항목을 선택해주세요: ${missing.join(", ")}`);
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/recommend/gift", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
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
        <h2 className="text-xl font-bold text-[#1A1A1A]">선물 추천기</h2>
        <p className="text-[#666666] text-sm mt-1">조건을 입력하면 AI가 최적의 선물 3개를 추천해드립니다</p>
      </div>

      {!result && !loading && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="gift-relation" className="text-sm font-medium">
              받는 사람과의 관계<span className="text-[#DC3545] ml-0.5" aria-label="필수">*</span>
            </label>
            <select
              id="gift-relation"
              required
              aria-required="true"
              value={form.relation}
              onChange={(e) => setForm({ ...form, relation: e.target.value })}
              className="border border-[#E9ECEF] rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-[#C00037] focus:ring-2 focus:ring-[#C00037]/20"
            >
              <option value="">선택하세요</option>
              {RELATIONS.map((r) => <option key={r}>{r}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="gift-age" className="text-sm font-medium">
              나이대<span className="text-[#DC3545] ml-0.5" aria-label="필수">*</span>
            </label>
            <select
              id="gift-age"
              required
              aria-required="true"
              value={form.age}
              onChange={(e) => setForm({ ...form, age: e.target.value })}
              className="border border-[#E9ECEF] rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-[#C00037] focus:ring-2 focus:ring-[#C00037]/20"
            >
              <option value="">선택하세요</option>
              {AGES.map((a) => <option key={a}>{a}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="gift-budget" className="text-sm font-medium">
              예산<span className="text-[#DC3545] ml-0.5" aria-label="필수">*</span>
            </label>
            <select
              id="gift-budget"
              required
              aria-required="true"
              value={form.budget}
              onChange={(e) => setForm({ ...form, budget: e.target.value })}
              className="border border-[#E9ECEF] rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-[#C00037] focus:ring-2 focus:ring-[#C00037]/20"
            >
              <option value="">선택하세요</option>
              {BUDGETS.map((b) => <option key={b}>{b}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium">성별<span className="text-[#DC3545] ml-0.5" aria-label="필수">*</span></span>
            <div className="flex gap-3">
              {GENDERS.map((g) => (
                <label key={g} className="flex items-center gap-2.5 cursor-pointer p-2 -m-2 rounded active:bg-[#F8F9FA]">
                  <input
                    type="radio"
                    name="gender"
                    value={g}
                    checked={form.gender === g}
                    onChange={(e) => setForm({ ...form, gender: e.target.value })}
                    className="w-5 h-5 accent-[#C00037]"
                  />
                  <span className="text-sm">{g}</span>
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
            disabled={loading || !form.relation || !form.age || !form.budget || !form.gender}
            className="bg-[#C00037] hover:bg-[#A0002D] disabled:bg-[#CCCCCC] disabled:text-white disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors"
          >
            {loading ? "분석 중..." : "AI 추천 받기"}
          </button>
        </form>
      )}

      {loading && <LoadingSpinner />}

      {result && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4">
            {result.items.map((item) => (
              <div key={item.rank} className="bg-[#F8F9FA] border border-[#E9ECEF] rounded-2xl p-4 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-[#C00037] text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">
                      {item.rank}
                    </span>
                    <span className="font-semibold text-sm">{item.name}</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${CATEGORY_COLORS[item.category] ?? "bg-gray-100 text-gray-600"}`}>
                    {item.category}
                  </span>
                </div>
                <p className="text-[#666666] text-sm leading-relaxed">{item.reason}</p>
                <p className="text-[#C00037] text-sm font-medium">예상가격 {item.price}</p>
                <CoupangButton url={item.coupangUrl} />
              </div>
            ))}
          </div>

          <div className="bg-[#0066FF]/5 border border-[#0066FF]/20 rounded-xl p-4">
            <p className="text-[#0066FF] text-sm">💬 {result.comment}</p>
          </div>

          <KakaoShareButton
            title="AI가 추천한 선물이에요 🎁"
            description="쇼핑GPT에서 나만을 위한 쇼핑 추천 받아보세요"
          />

          <button
            onClick={reset}
            className="w-full border border-[#E9ECEF] text-[#666666] py-2.5 rounded-xl text-sm hover:bg-[#F8F9FA] transition-colors"
          >
            다시 추천받기
          </button>

          <p className="text-[#999999] text-xs text-center">
            파트너스 활동을 통해 수수료를 제공받을 수 있습니다
          </p>
        </div>
      )}
    </div>
  );
}

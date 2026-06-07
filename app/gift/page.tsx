"use client";

import { useState } from "react";
import CoupangButton from "@/components/CoupangButton";
import KakaoShareButton from "@/components/KakaoShareButton";
import LoadingSpinner from "@/components/LoadingSpinner";
import PillGroup from "@/components/PillGroup";

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
  keyword: string;
  category: string;
  coupangUrl: string;
};

type Result = {
  items: GiftItem[];
  comment: string;
};

export default function GiftPage() {
  const [form, setForm] = useState({
    relation: "",
    age: "",
    budget: "",
    gender: "",
  });
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
        <h2 className="text-2xl font-black text-[#1A1A1A] tracking-tight">
          🎁 선물 추천기
        </h2>
        <p className="text-[#555555] text-sm mt-1">
          조건 입력 → AI가 실패 없는 선물 TOP 3 추천
        </p>
      </div>

      {!result && !loading && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium">
              받는 사람과의 관계
              <span className="text-[#DC3545] ml-0.5" aria-label="필수">
                *
              </span>
            </span>
            <PillGroup
              options={RELATIONS}
              value={form.relation}
              onChange={(v) => setForm({ ...form, relation: v })}
            />
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium">
              나이대
              <span className="text-[#DC3545] ml-0.5" aria-label="필수">
                *
              </span>
            </span>
            <PillGroup
              options={AGES}
              value={form.age}
              onChange={(v) => setForm({ ...form, age: v })}
            />
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium">
              예산
              <span className="text-[#DC3545] ml-0.5" aria-label="필수">
                *
              </span>
            </span>
            <PillGroup
              options={BUDGETS}
              value={form.budget}
              onChange={(v) => setForm({ ...form, budget: v })}
            />
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium">
              성별
              <span className="text-[#DC3545] ml-0.5" aria-label="필수">
                *
              </span>
            </span>
            <PillGroup
              options={GENDERS}
              value={form.gender}
              onChange={(v) => setForm({ ...form, gender: v })}
            />
          </div>

          {error && (
            <p className="text-[#DC3545] text-sm flex items-center gap-1.5">
              <span aria-hidden="true">⚠️</span>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={
              loading ||
              !form.relation ||
              !form.age ||
              !form.budget ||
              !form.gender
            }
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
              <div
                key={item.rank}
                className="bg-[#F8F9FA] border border-[#E9ECEF] rounded-2xl p-4 flex flex-col gap-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-[#C00037] text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">
                      {item.rank}
                    </span>
                    <span className="font-semibold text-sm">{item.name}</span>
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${CATEGORY_COLORS[item.category] ?? "bg-gray-100 text-gray-600"}`}
                  >
                    {item.category}
                  </span>
                </div>
                <p className="text-[#666666] text-sm leading-relaxed">
                  {item.reason}
                </p>
                <CoupangButton url={item.coupangUrl} />
              </div>
            ))}
          </div>

          <div className="bg-[#0066FF]/5 border border-[#0066FF]/20 rounded-xl p-4">
            <p className="text-[#0066FF] text-sm">💬 {result.comment}</p>
          </div>

          <KakaoShareButton
            title={`🎁 ${form.relation}을 위한 선물 TOP3`}
            description={`1위: ${result.items[0]?.name ?? ""} · 2위: ${result.items[1]?.name ?? ""} — 쇼핑GPT에서 AI 선물 추천 받아보세요`}
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

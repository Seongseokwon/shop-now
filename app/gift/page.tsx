"use client";

import { useState } from "react";
import CoupangButton from "@/components/CoupangButton";
import KakaoShareButton from "@/components/KakaoShareButton";
import LoadingSpinner from "@/components/LoadingSpinner";
import PillGroup from "@/components/PillGroup";

const CATEGORIES = [
  "전자기기",
  "뷰티/스킨케어",
  "생활용품",
  "패션/의류",
  "스포츠/헬스",
  "식품/건강",
  "가구/인테리어",
  "도서/문구",
];
const BUDGETS = ["1만원대", "3만원대", "5만원대", "10만원대", "20만원이상"];
const PURPOSES = ["본인 사용", "선물용", "업무용", "상관없음"];
const DEMOGRAPHICS = ["남성", "여성", "20대", "30대", "40대이상", "상관없음"];

const CATEGORY_COLORS: Record<string, string> = {
  전자기기: "bg-blue-100 text-blue-700",
  "뷰티/스킨케어": "bg-pink-100 text-pink-700",
  생활용품: "bg-green-100 text-green-700",
  "패션/의류": "bg-purple-100 text-purple-700",
  "스포츠/헬스": "bg-orange-100 text-orange-700",
  "식품/건강": "bg-yellow-100 text-yellow-700",
  "가구/인테리어": "bg-teal-100 text-teal-700",
  "도서/문구": "bg-gray-100 text-gray-700",
};

type GiftItem = {
  rank: number;
  name: string;
  reason: string;
  keyword: string;
  category: string;
  coupangUrl: string;
  price: number | null;
  image: string | null;
  rating: number | null;
  reviewCount: number | null;
};

type Result = {
  items: GiftItem[];
  comment: string;
};

export default function GiftPage() {
  const [form, setForm] = useState({
    category: "",
    budget: "",
    purpose: "",
    demographic: "",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const missing: string[] = [];
    if (!form.category) missing.push("카테고리");
    if (!form.budget) missing.push("예산");
    if (!form.purpose) missing.push("사용 목적");
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
          🛍️ 상품 추천기
        </h2>
        <p className="text-[#555555] text-sm mt-1">
          원하는 조건 선택 → AI가 딱 맞는 상품 TOP 3 추천
        </p>
      </div>

      {!result && !loading && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium">
              카테고리
              <span className="text-[#DC3545] ml-0.5" aria-label="필수">
                *
              </span>
            </span>
            <PillGroup
              options={CATEGORIES}
              value={form.category}
              onChange={(v) => setForm({ ...form, category: v })}
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
              사용 목적
              <span className="text-[#DC3545] ml-0.5" aria-label="필수">
                *
              </span>
            </span>
            <PillGroup
              options={PURPOSES}
              value={form.purpose}
              onChange={(v) => setForm({ ...form, purpose: v })}
            />
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium">성별/연령대</span>
            <PillGroup
              options={DEMOGRAPHICS}
              value={form.demographic}
              onChange={(v) => setForm({ ...form, demographic: v })}
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
              loading || !form.category || !form.budget || !form.purpose
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
                <div className="flex items-start gap-3">
                  {item.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-contain rounded-lg bg-white border border-[#E9ECEF] flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 flex flex-col gap-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="bg-[#C00037] text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">
                          {item.rank}
                        </span>
                        <span className="font-semibold text-sm leading-snug">
                          {item.name}
                        </span>
                      </div>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${CATEGORY_COLORS[item.category] ?? "bg-gray-100 text-gray-600"}`}
                      >
                        {item.category}
                      </span>
                    </div>
                    {item.price !== null && (
                      <p className="text-[#C00037] font-bold text-base">
                        실시간 최저가{" "}
                        {item.price.toLocaleString("ko-KR")}원
                      </p>
                    )}
                    {item.rating !== null && item.rating > 0 && (
                      <p className="text-xs text-[#888888]">
                        ⭐ {item.rating.toFixed(1)}
                        {item.reviewCount
                          ? ` · 리뷰 ${item.reviewCount.toLocaleString("ko-KR")}개`
                          : ""}
                      </p>
                    )}
                  </div>
                </div>
                <p className="text-[#666666] text-sm leading-relaxed">
                  {item.reason}
                </p>
                <CoupangButton url={item.coupangUrl} productName={item.name} />
              </div>
            ))}
          </div>

          <div className="bg-[#0066FF]/5 border border-[#0066FF]/20 rounded-xl p-4">
            <p className="text-[#0066FF] text-sm">💬 {result.comment}</p>
          </div>

          <KakaoShareButton
            title={`🛍️ ${form.category} 상품 추천 TOP3`}
            description={`예산 ${form.budget} · 추천 1위: ${result.items[0]?.name ?? ""} — 쇼핑GPT에서 AI 상품 추천 받아보세요`}
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

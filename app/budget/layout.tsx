import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "가성비 레이더 — 쇼핑GPT",
  description: "카테고리와 예산을 선택하면 AI가 이 가격대 최고의 상품을 찾아드립니다.",
};

export default function BudgetLayout({ children }: { children: React.ReactNode }) {
  return children;
}

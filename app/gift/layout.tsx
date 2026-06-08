import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "상품 추천기 — 쇼핑GPT",
  description:
    "카테고리·예산·목적을 선택하면 AI가 딱 맞는 상품 TOP 3를 추천해드려요. 쿠팡 최저가 바로 확인.",
};

export default function GiftLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

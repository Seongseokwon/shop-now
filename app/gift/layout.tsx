import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "선물 추천 AI — 쇼핑GPT",
  description:
    "관계, 나이, 예산만 입력하면 AI가 딱 맞는 선물을 추천해드려요. 쿠팡 최저가 바로 확인.",
};

export default function GiftLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

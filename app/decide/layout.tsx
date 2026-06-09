import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "살까말까 — 쇼핑GPT",
  description:
    "고민되는 상품명만 입력하세요. AI가 사야 할 이유, 참아야 할 이유를 분석해드립니다.",
};

export default function DecideLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

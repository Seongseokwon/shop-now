import { Suspense } from "react";
import ResultClient from "./ResultClient";
import LoadingSpinner from "@/components/LoadingSpinner";

export const metadata = {
  title: "살까말까 판정 결과 — 쇼핑GPT",
  description: "AI가 분석한 구매 판정 결과를 확인하세요.",
};

export default function ResultPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ResultClient />
    </Suspense>
  );
}

import { Suspense } from "react";
import type { Metadata } from "next";
import ResultClient from "./ResultClient";
import LoadingSpinner from "@/components/LoadingSpinner";

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ?? "https://shop-now-ebon.vercel.app";

interface Props {
  searchParams: Promise<{ d?: string }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { d } = await searchParams;

  if (!d) {
    return {
      title: "살까말까 판정 결과 — 쇼핑GPT",
      description: "AI가 분석한 구매 판정 결과를 확인하세요.",
    };
  }

  // URL 파라미터에서 간단히 추출 (decode 없이 OG API에 그대로 전달)
  const ogUrl = `${BASE_URL}/api/og?d=${encodeURIComponent(d)}`;

  return {
    title: "살까말까 판정 결과 — 쇼핑GPT",
    description: "AI가 분석한 구매 판정 결과를 확인하세요.",
    openGraph: {
      title: "살까말까 판정 결과 — 쇼핑GPT",
      description: "AI가 분석한 구매 판정 결과를 확인하세요.",
      images: [{ url: ogUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: "살까말까 판정 결과 — 쇼핑GPT",
      images: [ogUrl],
    },
  };
}

export default function ResultPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ResultClient />
    </Suspense>
  );
}

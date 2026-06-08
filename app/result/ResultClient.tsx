"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { decodeResult, type ResultPayload } from "@/lib/resultUrl";
import JudgmentCard from "@/components/JudgmentCard";

export default function ResultClient() {
  const params = useSearchParams();
  const router = useRouter();
  const [payload, setPayload] = useState<ResultPayload | null>(null);
  const [error, setError] = useState(false);

  const encoded = params.get("d");

  useEffect(() => {
    if (!encoded) {
      router.replace("/decide");
      return;
    }
    try {
      setPayload(decodeResult(encoded));
    } catch {
      setError(true);
    }
  }, [encoded, router]);

  if (error) {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <p className="text-2xl">😢</p>
        <p className="text-[#1A1A1A] font-semibold">잘못된 결과 링크입니다</p>
        <a href="/decide" className="text-[#C00037] text-sm underline">
          새로 판정받기 →
        </a>
      </div>
    );
  }

  if (!payload) return null;

  const shareUrl = `/result?d=${encoded}`;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-black text-[#1A1A1A] tracking-tight">
          🤔 살까말까 판정 결과
        </h2>
        <p className="text-[#555555] text-sm mt-1">공유받은 AI 판정 결과입니다</p>
      </div>
      <JudgmentCard
        verdict={payload.v}
        score={payload.s}
        productName={payload.p}
        price={payload.pr}
        reasonsToBuy={payload.rb}
        reasonsToSkip={payload.rs}
        verdictComment={payload.vc}
        shareUrl={shareUrl}
        isSharedLanding
      />
    </div>
  );
}

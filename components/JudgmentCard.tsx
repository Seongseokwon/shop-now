import ScoreGauge from "@/components/ScoreGauge";
import VerdictBadge from "@/components/VerdictBadge";
import ShareActions from "@/components/ShareActions";
import ReasonList from "@/components/ReasonList";
import NudgeCTA from "@/components/NudgeCTA";

interface JudgmentCardProps {
  verdict: string;
  score: number;
  productName: string;
  price?: string;
  reasonsToBuy: string[];
  reasonsToSkip: string[];
  verdictComment: string;
  shareUrl: string;
  isSharedLanding?: boolean;
  onReset?: () => void;
}

function getTagline(score: number): string {
  if (score >= 90) return "완전 사야 해요 🔥";
  if (score >= 70) return "사는 게 맞아요 👍";
  if (score >= 50) return "솔직히 애매해요 🤔";
  if (score >= 30) return "한 번 더 생각해봐요 🛑";
  return "지금은 참아요 ❌";
}

export default function JudgmentCard({
  verdict,
  score,
  productName,
  price,
  reasonsToBuy,
  reasonsToSkip,
  verdictComment,
  shareUrl,
  isSharedLanding = false,
  onReset,
}: JudgmentCardProps) {
  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col items-center gap-3 py-2">
        <p className="text-sm text-[#888888] font-medium">
          {productName}{price ? ` · ${price}` : ""}
        </p>
        <VerdictBadge verdict={verdict} />
        <p className="text-base font-semibold text-[#1A1A1A]">{getTagline(score)}</p>
      </div>

      {/* Circular score gauge */}
      <div className="flex justify-center">
        <ScoreGauge score={score} />
      </div>

      {/* Verdict comment */}
      <div className="bg-[#F8F9FA] border border-[#E9ECEF] rounded-xl p-4">
        <p className="text-sm text-[#1A1A1A] leading-relaxed">💬 {verdictComment}</p>
      </div>

      {/* Reasons 2-column with staggered animation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-[#22c55e]/5 border border-[#22c55e]/20 rounded-xl p-3">
          <p className="text-[#15803d] text-xs font-semibold mb-2">사야 할 이유</p>
          <ReasonList items={reasonsToBuy} type="buy" />
        </div>
        <div className="bg-[#ef4444]/5 border border-[#ef4444]/20 rounded-xl p-3">
          <p className="text-[#b91c1c] text-xs font-semibold mb-2">참아야 할 이유</p>
          <ReasonList items={reasonsToSkip} type="skip" />
        </div>
      </div>

      {/* Share */}
      <ShareActions
        productName={productName}
        verdict={verdict}
        score={score}
        shareUrl={shareUrl}
      />

      <NudgeCTA isSharedLanding={isSharedLanding} onReset={onReset} />

      <p className="text-[#999999] text-xs text-center">
        파트너스 활동을 통해 수수료를 제공받을 수 있습니다
      </p>
    </div>
  );
}

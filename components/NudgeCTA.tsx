import Link from "next/link";

interface NudgeCTAProps {
  isSharedLanding: boolean;
  onReset?: () => void;
}

export default function NudgeCTA({ isSharedLanding, onReset }: NudgeCTAProps) {
  if (isSharedLanding) {
    return (
      <Link
        href="/decide"
        className="block w-full text-center bg-[#C00037] hover:bg-[#A0002D] text-white font-bold py-3 rounded-xl transition-colors text-sm"
      >
        나도 살까말까 판정받기 →
      </Link>
    );
  }

  if (onReset) {
    return (
      <button
        onClick={onReset}
        className="w-full border border-[#E9ECEF] text-[#666666] py-2.5 rounded-xl text-sm hover:bg-[#F8F9FA] transition-colors"
      >
        다른 상품 판정받기
      </button>
    );
  }

  return null;
}

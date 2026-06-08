"use client";

import { track } from "@vercel/analytics";

interface CoupangButtonProps {
  url: string;
  productName?: string;
}

export default function CoupangButton({ url, productName }: CoupangButtonProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer nofollow"
      className="block w-full text-center bg-[#C00037] hover:bg-[#A0002D] text-white font-medium py-2.5 px-4 rounded-lg transition-colors text-sm"
      onClick={() =>
        track("coupang_click", { product: productName ?? "unknown", url })
      }
    >
      최저가 확인하기 →
    </a>
  );
}

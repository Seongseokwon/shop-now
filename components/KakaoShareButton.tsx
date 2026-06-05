"use client";

import { useEffect, useState } from "react";

declare global {
  interface Window {
    Kakao: {
      init: (key: string) => void;
      isInitialized: () => boolean;
      Share: {
        sendDefault: (options: Record<string, unknown>) => void;
      };
    };
  }
}

interface KakaoShareButtonProps {
  title: string;
  description: string;
}

/** 카카오 공식 말풍선 로고 SVG */
function KakaoIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3C6.477 3 2 6.582 2 11c0 2.834 1.708 5.32 4.29 6.865l-1.09 4.022a.25.25 0 0 0 .378.278L10.13 19.6A11.7 11.7 0 0 0 12 19.75c5.523 0 10-3.582 10-8.75S17.523 3 12 3z"
        fill="#3C1E1E"
      />
    </svg>
  );
}

/** 링크 복사 아이콘 */
function LinkIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

export default function KakaoShareButton({ title, description }: KakaoShareButtonProps) {
  const [sdkReady, setSdkReady] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_KAKAO_APP_KEY;
    if (!key) return;

    if (window.Kakao) {
      if (!window.Kakao.isInitialized()) window.Kakao.init(key);
      setSdkReady(true);
      return;
    }

    let attempts = 0;
    const MAX_ATTEMPTS = 50;
    const interval = setInterval(() => {
      attempts += 1;
      if (window.Kakao) {
        if (!window.Kakao.isInitialized()) window.Kakao.init(key);
        setSdkReady(true);
        clearInterval(interval);
      } else if (attempts >= MAX_ATTEMPTS) {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  function handleKakaoShare() {
    if (!window.Kakao?.Share) {
      alert("카카오 공유 기능을 사용할 수 없습니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://shop-now-ebon.vercel.app";
    const imageUrl = `${baseUrl}/opengraph-image`;

    window.Kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title,
        description,
        imageUrl,
        link: {
          mobileWebUrl: window.location.href,
          webUrl: window.location.href,
        },
      },
      buttons: [
        {
          title: "나도 추천받기",
          link: {
            mobileWebUrl: window.location.href,
            webUrl: window.location.href,
          },
        },
      ],
    });
  }

  async function handleCopyLink() {
    const url = window.location.href;

    // Web Share API 지원 시 네이티브 공유 시트 사용
    if (navigator.share) {
      try {
        await navigator.share({ title, text: description, url });
        return;
      } catch {
        // 사용자가 취소한 경우 등 → 클립보드 복사로 폴백
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert("링크 복사에 실패했습니다. 주소창에서 직접 복사해주세요.");
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {/* 공유 레이블 */}
      <p className="text-xs text-[#666666] font-medium text-center">결과 공유하기</p>

      <div className="flex gap-2">
        {/* 카카오톡 공유 */}
        <button
          onClick={handleKakaoShare}
          disabled={!sdkReady}
          title={sdkReady ? "카카오톡으로 공유" : "카카오 SDK가 초기화되지 않았습니다"}
          className="flex-1 flex items-center justify-center gap-2 bg-[#FEE500] hover:bg-[#E6CF00] active:bg-[#D4B800] disabled:bg-[#E9ECEF] disabled:text-[#999999] disabled:cursor-not-allowed text-[#3C1E1E] font-semibold py-3 px-4 rounded-xl transition-colors text-sm shadow-sm"
        >
          <KakaoIcon />
          카카오톡
        </button>

        {/* 링크 복사 / 네이티브 공유 */}
        <button
          onClick={handleCopyLink}
          className="flex items-center justify-center gap-1.5 border border-[#E9ECEF] bg-white hover:bg-[#F8F9FA] active:bg-[#E9ECEF] text-[#666666] font-medium py-3 px-4 rounded-xl transition-colors text-sm shadow-sm min-w-[88px]"
          aria-label={copied ? "링크가 복사되었습니다" : "링크 복사"}
        >
          <LinkIcon />
          <span>{copied ? "복사됨!" : "링크 복사"}</span>
        </button>
      </div>
    </div>
  );
}

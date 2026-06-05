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

export default function KakaoShareButton({ title, description }: KakaoShareButtonProps) {
  const [sdkReady, setSdkReady] = useState(false);

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_KAKAO_APP_KEY;
    if (!key) return;

    // SDK가 이미 로드된 경우 즉시 초기화
    if (window.Kakao) {
      if (!window.Kakao.isInitialized()) {
        window.Kakao.init(key);
      }
      setSdkReady(true);
      return;
    }

    // SDK가 아직 로드되지 않은 경우 최대 5초간 폴링
    let attempts = 0;
    const MAX_ATTEMPTS = 50;
    const interval = setInterval(() => {
      attempts += 1;
      if (window.Kakao) {
        if (!window.Kakao.isInitialized()) {
          window.Kakao.init(key);
        }
        setSdkReady(true);
        clearInterval(interval);
      } else if (attempts >= MAX_ATTEMPTS) {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  function handleShare() {
    if (!window.Kakao?.Share) {
      alert("카카오 공유 기능을 사용할 수 없습니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "";
    // og-image.png가 없을 경우 next.svg를 fallback으로 사용
    const imageUrl = `${baseUrl}/og-image.png`;

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

  return (
    <button
      onClick={handleShare}
      disabled={!sdkReady}
      title={sdkReady ? undefined : "카카오 SDK가 초기화되지 않았습니다"}
      className="w-full bg-[#FEE500] hover:bg-[#E6CF00] disabled:bg-[#E9ECEF] disabled:text-[#999999] disabled:cursor-not-allowed text-[#3C1E1E] font-medium py-2.5 px-4 rounded-lg transition-colors text-sm"
    >
      카카오톡으로 공유
    </button>
  );
}

import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Shop Now — AI 쇼핑 도우미";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          background: "#ffffff",
          display: "flex",
          flexDirection: "column",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* 상단 빨간 바 */}
        <div style={{ width: "100%", height: "8px", background: "#C00037", flexShrink: 0 }} />

        {/* 본문 */}
        <div style={{ display: "flex", flex: 1, padding: "48px 72px", gap: "64px" }}>
          {/* 왼쪽: 브랜드 + 헤드라인 */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: "24px",
              width: "340px",
              flexShrink: 0,
            }}
          >
            {/* 로고 */}
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <svg width="64" height="64" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="6" y="13" width="24" height="18" rx="3" fill="#C00037" />
                <path d="M13 13V10C13 7.239 15.239 5 18 5C20.761 5 23 7.239 23 10V13" stroke="#C00037" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                <path d="M20 17L16.5 22H19.5L16 29L21.5 22.5H18.5L20 17Z" fill="white" />
              </svg>
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <span style={{ fontSize: "32px", fontWeight: 900, color: "#C00037", letterSpacing: "-1px", lineHeight: 1 }}>
                  Shop Now
                </span>
                <span style={{ fontSize: "15px", color: "#888888" }}>AI 쇼핑 도우미</span>
              </div>
            </div>

            {/* 헤드라인 */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "0px" }}>
                <span style={{ fontSize: "40px", fontWeight: 900, color: "#1A1A1A", lineHeight: 1.2, letterSpacing: "-1px" }}>
                  쇼핑 고민,
                </span>
                <div style={{ display: "flex", gap: "0px" }}>
                  <span style={{ fontSize: "40px", fontWeight: 900, color: "#C00037", lineHeight: 1.2, letterSpacing: "-1px" }}>AI가 30초</span>
                  <span style={{ fontSize: "40px", fontWeight: 900, color: "#1A1A1A", lineHeight: 1.2, letterSpacing: "-1px" }}>에 해결</span>
                </div>
              </div>
              <span style={{ fontSize: "18px", color: "#555555", lineHeight: 1.5 }}>
                광고 말고 진짜 괜찮은 상품만 추천
              </span>
            </div>

            {/* Trust signals */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {["쿠팡 후기 기반 분석", "광고 없는 추천", "무료 이용"].map((t) => (
                <div key={t} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ width: "18px", height: "18px", borderRadius: "9px", background: "#C00037", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: "11px", color: "white", fontWeight: 900, lineHeight: 1 }}>v</span>
                  </div>
                  <span style={{ fontSize: "15px", color: "#333333", fontWeight: 600 }}>{t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 구분선 */}
          <div style={{ width: "2px", background: "#F0F0F0", borderRadius: "2px", flexShrink: 0 }} />

          {/* 오른쪽: 기능 카드 3개 */}
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: "16px", flex: 1 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "20px",
                background: "#FFF5F8",
                border: "2px solid #FFD6E0",
                borderRadius: "20px",
                padding: "20px 28px",
              }}
            >
              <span style={{ fontSize: "44px" }}>🎁</span>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <span style={{ fontSize: "24px", fontWeight: 800, color: "#1A1A1A" }}>선물 추천기</span>
                <span style={{ fontSize: "16px", color: "#666666" }}>관계 · 나이 · 예산 → 실패 없는 선물 TOP 3</span>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "20px",
                background: "#F0F5FF",
                border: "2px solid #C8D8FF",
                borderRadius: "20px",
                padding: "20px 28px",
              }}
            >
              <span style={{ fontSize: "44px" }}>🤔</span>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <span style={{ fontSize: "24px", fontWeight: 800, color: "#1A1A1A" }}>살까말까 결정기</span>
                <span style={{ fontSize: "16px", color: "#666666" }}>AI가 구매 추천도를 100점 만점으로 냉정 판단</span>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "20px",
                background: "#F0FFF4",
                border: "2px solid #B8EFC8",
                borderRadius: "20px",
                padding: "20px 28px",
              }}
            >
              <span style={{ fontSize: "44px" }}>💸</span>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <span style={{ fontSize: "24px", fontWeight: 800, color: "#1A1A1A" }}>가성비 레이더</span>
                <span style={{ fontSize: "16px", color: "#666666" }}>예산 내 가성비 최고 · 무난 · 프리미엄 3종 발굴</span>
              </div>
            </div>
          </div>
        </div>

        {/* 하단 배너 */}
        <div
          style={{
            background: "#1A1A1A",
            padding: "16px 72px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: "18px", color: "#999999", letterSpacing: "0.5px" }}>
            쇼핑 고민, AI에게 맡기세요 &nbsp;·&nbsp; shop-now-ebon.vercel.app
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}

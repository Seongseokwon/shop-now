import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";
import { inflate } from "pako";

export const runtime = "edge";

function decodePayload(d: string) {
  const base64 = d.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(base64);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  const json = inflate(bytes, { to: "string" });
  return JSON.parse(json) as {
    v: string;
    s: number;
    p: string;
    pr?: string;
  };
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  let verdict = searchParams.get("v") ?? "판정중";
  let score = Number(searchParams.get("s") ?? 0);
  let productName = searchParams.get("p") ?? "상품";
  let price = searchParams.get("pr") ?? "";

  const d = searchParams.get("d");
  if (d) {
    try {
      const payload = decodePayload(d);
      verdict = payload.v;
      score = payload.s;
      productName = payload.p;
      price = payload.pr ?? "";
    } catch {
      // fallback to individual query params
    }
  }

  const isBuy = verdict === "사세요";

  const bgGradient = isBuy
    ? "linear-gradient(135deg, #C00037 0%, #FF4D6D 100%)"
    : "linear-gradient(135deg, #1C1C2E 0%, #3A3A6E 100%)";

  const badgeLabel = isBuy ? "사세요! 🛒" : "참으세요! 🛑";
  const badgeTextColor = isBuy ? "#C00037" : "#1C1C2E";

  const fontSize = productName.length > 20 ? "48px" : "64px";

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          backgroundImage: bgGradient,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          padding: "60px 80px",
          gap: "28px",
          position: "relative",
        }}
      >
        {/* 브랜드 */}
        <div
          style={{
            fontSize: "22px",
            color: "rgba(255,255,255,0.65)",
            fontWeight: 600,
            letterSpacing: "0.05em",
            display: "flex",
          }}
        >
          쇼핑GPT 살까말까
        </div>

        {/* 상품명 */}
        <div
          style={{
            fontSize,
            fontWeight: 900,
            color: "white",
            textAlign: "center",
            lineHeight: 1.2,
            maxWidth: "1000px",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {productName}
          {price ? (
            <span
              style={{
                fontSize: "32px",
                fontWeight: 500,
                color: "rgba(255,255,255,0.65)",
                marginLeft: "16px",
                alignSelf: "flex-end",
                display: "flex",
              }}
            >
              {price}
            </span>
          ) : null}
        </div>

        {/* 판정 배지 + 점수 */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "40px",
            marginTop: "8px",
          }}
        >
          <div
            style={{
              background: "white",
              color: badgeTextColor,
              fontSize: "52px",
              fontWeight: 900,
              padding: "16px 52px",
              borderRadius: "24px",
              display: "flex",
            }}
          >
            {badgeLabel}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <div
              style={{
                fontSize: "88px",
                fontWeight: 900,
                color: "white",
                lineHeight: 1,
                display: "flex",
              }}
            >
              {score}
            </div>
            <div
              style={{
                fontSize: "22px",
                color: "rgba(255,255,255,0.55)",
                fontWeight: 500,
                display: "flex",
              }}
            >
              / 100점
            </div>
          </div>
        </div>

        {/* CTA */}
        <div
          style={{
            marginTop: "16px",
            background: "rgba(255,255,255,0.15)",
            color: "white",
            fontSize: "24px",
            fontWeight: 700,
            padding: "14px 44px",
            borderRadius: "40px",
            border: "2px solid rgba(255,255,255,0.3)",
            display: "flex",
            letterSpacing: "0.02em",
          }}
        >
          나도 AI에게 물어보기 →
        </div>

        {/* 워터마크 */}
        <div
          style={{
            position: "absolute",
            bottom: "32px",
            right: "60px",
            fontSize: "18px",
            color: "rgba(255,255,255,0.35)",
            fontWeight: 600,
            display: "flex",
          }}
        >
          쇼핑GPT
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}

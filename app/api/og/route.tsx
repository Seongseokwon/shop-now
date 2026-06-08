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
  const badgeColor = isBuy ? "#C00037" : "#555555";
  const badgeBg = isBuy ? "#FFF0F3" : "#F5F5F5";
  const scoreColor = isBuy ? "#C00037" : "#444444";
  const badgeLabel = isBuy ? "사세요!" : "참으세요!";

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          background: "white",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          padding: "60px",
          gap: "24px",
        }}
      >
        {/* 브랜드 */}
        <div
          style={{
            fontSize: "22px",
            color: "#AAAAAA",
            letterSpacing: "0.05em",
            fontWeight: 600,
            display: "flex",
          }}
        >
          쇼핑GPT 살까말까
        </div>

        {/* 상품명 + 가격 (flex row) */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "baseline",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "12px",
            maxWidth: "900px",
          }}
        >
          <div
            style={{
              fontSize: productName.length > 20 ? "36px" : "44px",
              fontWeight: 900,
              color: "#1A1A1A",
              textAlign: "center",
              lineHeight: 1.25,
              display: "flex",
            }}
          >
            {productName}
          </div>
          {price ? (
            <div
              style={{
                color: "#888888",
                fontWeight: 500,
                fontSize: "28px",
                display: "flex",
              }}
            >
              {price}
            </div>
          ) : null}
        </div>

        {/* 판정 배지 + 점수 */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "32px",
            marginTop: "8px",
          }}
        >
          <div
            style={{
              background: badgeBg,
              color: badgeColor,
              fontSize: "52px",
              fontWeight: 900,
              padding: "16px 48px",
              borderRadius: "20px",
              border: `3px solid ${badgeColor}`,
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
                fontSize: "72px",
                fontWeight: 900,
                color: scoreColor,
                lineHeight: 1,
                display: "flex",
              }}
            >
              {score}
            </div>
            <div
              style={{
                fontSize: "20px",
                color: "#AAAAAA",
                fontWeight: 500,
                display: "flex",
              }}
            >
              / 100점
            </div>
          </div>
        </div>

        {/* 워터마크 */}
        <div
          style={{
            position: "absolute",
            bottom: "36px",
            right: "60px",
            fontSize: "18px",
            color: "#DDDDDD",
            fontWeight: 600,
            display: "flex",
          }}
        >
          shop-now-ebon.vercel.app
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}

import crypto from "crypto";

const API_BASE = "https://api-gateway.coupang.com";

export type CoupangProduct = {
  price: number;
  image: string;
  link: string;
  rating: number;
  reviewCount: number;
};

function hmacSignature(
  method: string,
  path: string,
  datetime: string,
  secretKey: string
): string {
  const message = method + path + datetime;
  return crypto.createHmac("sha256", secretKey).update(message).digest("hex");
}

export async function searchCoupang(
  keyword: string
): Promise<CoupangProduct | null> {
  const accessKey = process.env.COUPANG_ACCESS_KEY;
  const secretKey = process.env.COUPANG_SECRET_KEY;

  if (!accessKey || !secretKey) return null;

  const path =
    "/v2/providers/affiliate_open_api/apis/openapi/v1/products/search";
  const query = `keyword=${encodeURIComponent(keyword)}&limit=1`;
  const urlWithQuery = `${path}?${query}`;

  // yyMMddHHmmss 형식
  const now = new Date();
  const datetime = now
    .toISOString()
    .replace(/[-:T]/g, "")
    .slice(2, 14);

  const signature = hmacSignature("GET", urlWithQuery, datetime, secretKey);

  try {
    const res = await fetch(`${API_BASE}${urlWithQuery}`, {
      headers: {
        Authorization: `CEA algorithm=HmacSHA256, access-key=${accessKey}, signed-date=${datetime}, signature=${signature}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    const json = await res.json();
    console.log("[coupang] status:", res.status, "body:", JSON.stringify(json).slice(0, 300));

    if (!res.ok) return null;

    const item = json?.data?.productData?.[0];
    if (!item) return null;

    return {
      price: item.productPrice,
      image: item.productImage,
      link: item.productUrl,
      rating: item.productRating ?? 0,
      reviewCount: item.productReviewCount ?? 0,
    };
  } catch (e) {
    console.error("[coupang] fetch error:", e);
    return null;
  }
}

export function generateCoupangLink(keyword: string): string {
  const partnerId = process.env.NEXT_PUBLIC_COUPANG_PARTNER_ID ?? "";
  const safeKeyword = keyword || "";
  return `https://www.coupang.com/np/search?q=${encodeURIComponent(safeKeyword)}&ref=s2s_${partnerId}`;
}

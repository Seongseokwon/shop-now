import crypto from "crypto";

const API_BASE = "https://api-gateway.coupang.com";

export type CoupangProduct = {
  name: string;
  price: number;
  image: string;
  link: string;
  rating: number;
  reviewCount: number;
};

function generateHmac(
  method: string,
  urlPath: string,
  secretKey: string,
  accessKey: string
): string {
  const [path, query = ""] = urlPath.split("?");

  // 공식 문서 포맷: YYMMDDTHHmmssZ
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  const yy = String(now.getUTCFullYear()).slice(2);
  const MM = pad(now.getUTCMonth() + 1);
  const dd = pad(now.getUTCDate());
  const HH = pad(now.getUTCHours());
  const mm = pad(now.getUTCMinutes());
  const ss = pad(now.getUTCSeconds());
  const datetime = `${yy}${MM}${dd}T${HH}${mm}${ss}Z`;

  // 공식 문서 순서: datetime + method + path + query
  const message = datetime + method + path + query;
  const signature = crypto
    .createHmac("sha256", secretKey)
    .update(message)
    .digest("hex");

  return `CEA algorithm=HmacSHA256, access-key=${accessKey}, signed-date=${datetime}, signature=${signature}`;
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

  try {
    const authorization = generateHmac("GET", urlWithQuery, secretKey, accessKey);

    const res = await fetch(`${API_BASE}${urlWithQuery}`, {
      headers: {
        Authorization: authorization,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    const json = await res.json();
    if (!res.ok) return null;

    const item = json?.data?.productData?.[0];
    if (!item) return null;

    return {
      name: item.productName ?? "",
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

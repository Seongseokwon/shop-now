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

// 악세서리/부속품 판별 키워드 (상품명에 포함 시 제외)
const ACCESSORY_KEYWORDS = [
  "케이스", "커버", "스킨", "파우치", "파우치", "홀더",
  "스트랩", "거치대", "충전기", "충전케이블", "케이블",
  "이어팁", "이어캡", "윙팁", "교체",
  "case", "cover", "skin", "pouch", "holder", "strap",
  "charger", "cable", "tip", "eartip", "accessory",
];

function isAccessory(productName: string): boolean {
  const lower = productName.toLowerCase();
  return ACCESSORY_KEYWORDS.some((kw) => lower.includes(kw.toLowerCase()));
}

async function convertToDeeplink(productUrl: string): Promise<string> {
  const accessKey = process.env.COUPANG_ACCESS_KEY;
  const secretKey = process.env.COUPANG_SECRET_KEY;
  if (!accessKey || !secretKey) return productUrl;

  const path = "/v2/providers/affiliate_open_api/apis/openapi/v1/deeplink";
  const authorization = generateHmac("POST", path, secretKey, accessKey);

  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: {
        Authorization: authorization,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ coupangUrls: [productUrl] }),
      cache: "no-store",
    });

    if (!res.ok) return productUrl;

    const json = await res.json();
    const item = json?.data?.[0];
    return item?.shortenUrl ?? item?.landingUrl ?? productUrl;
  } catch {
    return productUrl;
  }
}

export async function searchCoupang(
  keyword: string,
  options: { filterAccessories?: boolean } = {}
): Promise<CoupangProduct | null> {
  const { filterAccessories = false } = options;
  const accessKey = process.env.COUPANG_ACCESS_KEY;
  const secretKey = process.env.COUPANG_SECRET_KEY;

  if (!accessKey || !secretKey) return null;

  const path =
    "/v2/providers/affiliate_open_api/apis/openapi/v1/products/search";
  // filterAccessories 모드에서는 후보를 더 많이 가져와 필터링
  const limit = filterAccessories ? 5 : 1;
  const query = `keyword=${encodeURIComponent(keyword)}&limit=${limit}`;
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

    const products: Array<Record<string, unknown>> = json?.data?.productData ?? [];
    if (products.length === 0) return null;

    // filterAccessories 모드: 악세서리가 아닌 첫 번째 상품 선택
    const item = filterAccessories
      ? products.find((p) => !isAccessory(String(p.productName ?? ""))) ?? products[0]
      : products[0];

    if (!item) return null;

    const deeplink = await convertToDeeplink(item.productUrl as string);

    return {
      name: String(item.productName ?? ""),
      price: item.productPrice as number,
      image: item.productImage as string,
      link: deeplink,
      rating: (item.productRating as number) ?? 0,
      reviewCount: (item.productReviewCount as number) ?? 0,
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

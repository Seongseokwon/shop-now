import { NextRequest, NextResponse } from "next/server";
import getOpenAI from "@/lib/openai";
import { searchCoupang, generateCoupangLink } from "@/lib/coupang";

async function callOpenAI(
  productName: string,
  price: string,
  reasons: string[]
) {
  const prompt = `당신은 냉철한 소비 컨설턴트입니다. 사용자의 구매 고민을 분석하고 명확한 결론을 내려주세요.

상품: ${productName}
가격: ${price || "미입력"}
고민 이유: ${reasons.join(", ") || "없음"}

다음 JSON 형식으로만 응답하세요:

{
  "verdict": "사세요",
  "score": 75,
  "reasons_to_buy": ["구매해야 할 이유 1", "구매해야 할 이유 2", "구매해야 할 이유 3"],
  "reasons_to_skip": ["구매하지 말아야 할 이유 1", "구매하지 말아야 할 이유 2"],
  "verdict_comment": "최종 결론 한 줄 (솔직하고 친근하게)",
  "alternatives": [
    { "name": "대안 상품명 (구체적으로)", "reason": "이게 더 나은 이유 한 줄", "keyword": "쿠팡 검색 키워드" },
    { "name": "대안 상품명 2", "reason": "이게 더 나은 이유 한 줄", "keyword": "쿠팡 검색 키워드" }
  ]
}

규칙:
- score는 0~100 (구매 추천 점수)
- verdict는 반드시 "사세요" 또는 "참으세요" 중 하나
- alternatives는 반드시 2개 (더 저렴한 것 1개, 더 좋은 것 1개)
- 솔직하고 명확하게, 중립적인 척 하지 말 것`;

  const response = await getOpenAI().chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
  });

  return response.choices[0].message.content!;
}

export async function POST(req: NextRequest) {
  const { productName, price, reasons } = await req.json();

  if (typeof productName !== "string" || !productName.trim()) {
    return NextResponse.json(
      { error: "상품명을 입력해주세요." },
      { status: 400 }
    );
  }

  let raw: string;
  try {
    raw = await callOpenAI(
      productName,
      typeof price === "string" ? price : "",
      Array.isArray(reasons) ? reasons : []
    );
  } catch {
    return NextResponse.json(
      { error: "AI 호출 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }

  let parsed: {
    verdict: string;
    score: number;
    reasons_to_buy: string[];
    reasons_to_skip: string[];
    verdict_comment: string;
    alternatives: { name: string; reason: string; keyword: string }[];
  };
  try {
    parsed = JSON.parse(raw);
  } catch {
    return NextResponse.json(
      { error: "잠시 후 다시 시도해주세요." },
      { status: 500 }
    );
  }

  const alternatives = await Promise.all(
    parsed.alternatives.map(async (alt) => {
      const coupang = await searchCoupang(alt.keyword);
      return {
        ...alt,
        coupangUrl: coupang?.link ?? generateCoupangLink(alt.keyword),
        coupangName: coupang?.name ?? null,
        coupangImage: coupang?.image ?? null,
        coupangPrice: coupang?.price ?? null,
        coupangRating: coupang?.rating ?? null,
      };
    })
  );

  return NextResponse.json({ ...parsed, alternatives });
}

import { NextRequest, NextResponse } from "next/server";
import getOpenAI from "@/lib/openai";
import { generateCoupangLink, searchCoupang } from "@/lib/coupang";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

async function callOpenAI(category: string, budget: string) {
  const prompt = `당신은 가성비 전문 리뷰어입니다. 주어진 카테고리와 예산에서 최고의 선택을 추천해주세요.

카테고리: ${category}
예산: ${budget} 이하

다음 JSON 형식으로만 응답하세요:

{
  "title": "이 예산에서 최고의 ${category}",
  "items": [
    {
      "rank": 1,
      "label": "가성비 최고",
      "name": "상품명 (브랜드 + 모델명 구체적으로)",
      "keyword": "쿠팡 검색 시 상위 노출될 만큼 구체적인 키워드",
      "category": "${category}",
      "highlight": "이 상품의 핵심 장점 한 줄",
      "for_whom": "이런 분께 추천 (한 줄)"
    },
    { "rank": 2, "label": "무난한 선택" },
    { "rank": 3, "label": "프리미엄 픽" }
  ],
  "buying_tip": "이 카테고리 구매 시 반드시 확인할 것 (한 줄 팁)"
}

규칙:
- 실제 판매 중인 완제품만 추천 (액세서리/소모품 제외)
- 브랜드명 + 모델명이 포함된 구체적인 상품명 사용
- 단종 상품 추천 금지
- keyword는 쿠팡에서 검색했을 때 해당 상품이 상위 노출될 만큼 구체적으로
- 가격 정보는 절대 생성하지 말 것
- 모든 항목(가성비 최고/무난한 선택/프리미엄 픽)은 반드시 ${budget} 이하 가격대 상품이어야 함 (예산 초과 절대 금지)`;

  const response = await getOpenAI().chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
  });

  return response.choices[0].message.content!;
}

export async function POST(req: NextRequest) {
  if (!checkRateLimit(getClientIp(req))) {
    return NextResponse.json(
      { error: "요청이 너무 많습니다. 1분 후 다시 시도해주세요." },
      { status: 429 }
    );
  }

  const { category, budget } = await req.json();

  if (
    typeof category !== "string" ||
    !category ||
    typeof budget !== "string" ||
    !budget
  ) {
    return NextResponse.json(
      { error: "카테고리와 예산을 선택해주세요." },
      { status: 400 }
    );
  }

  let raw: string;
  try {
    raw = await callOpenAI(category, budget);
  } catch {
    return NextResponse.json(
      { error: "AI 호출 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }

  let parsed: {
    title: string;
    items: {
      rank: number;
      label: string;
      name: string;
      keyword: string;
      category: string;
      highlight: string;
      for_whom: string;
    }[];
    buying_tip: string;
  };
  try {
    parsed = JSON.parse(raw);
  } catch {
    return NextResponse.json(
      { error: "잠시 후 다시 시도해주세요." },
      { status: 500 }
    );
  }

  const coupangResults = await Promise.allSettled(
    parsed.items.map((item) => searchCoupang(item.keyword))
  );

  const items = parsed.items.map((item, i) => {
    const coupang =
      coupangResults[i].status === "fulfilled"
        ? coupangResults[i].value
        : null;
    return {
      ...item,
      coupangUrl: coupang?.link ?? generateCoupangLink(item.keyword),
      price: coupang?.price ?? null,
      image: coupang?.image ?? null,
      rating: coupang?.rating ?? null,
      reviewCount: coupang?.reviewCount ?? null,
    };
  });

  return NextResponse.json({ ...parsed, items });
}

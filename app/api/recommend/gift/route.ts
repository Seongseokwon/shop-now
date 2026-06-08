import { NextRequest, NextResponse } from "next/server";
import getOpenAI from "@/lib/openai";
import { generateCoupangLink, searchCoupang } from "@/lib/coupang";

async function callOpenAI(
  category: string,
  budget: string,
  purpose: string,
  demographic: string
) {
  const prompt = `당신은 쇼핑 전문가입니다. 사용자의 조건에 맞는 상품을 추천해주세요.

조건:
- 카테고리: ${category}
- 예산: ${budget}
- 사용 목적: ${purpose}
- 성별/연령대: ${demographic || "상관없음"}

다음 JSON 형식으로만 응답하세요. 다른 텍스트는 절대 포함하지 마세요:

{
  "items": [
    {
      "rank": 1,
      "name": "상품명 (브랜드명 + 모델명 구체적으로)",
      "reason": "이 조건에 이 상품이 좋은 이유 2줄",
      "keyword": "쿠팡 검색 시 상위 노출될 만큼 구체적인 키워드",
      "category": "카테고리명"
    },
    { "rank": 2 },
    { "rank": 3 }
  ],
  "comment": "전체 추천에 대한 한 줄 코멘트 (친근한 말투)"
}

규칙:
- 반드시 3개 추천
- 예산 범위 내 상품만 추천
- 실제 판매 중인 완제품만 추천 (액세서리/케이스/충전기/소모품 제외)
- 브랜드명 + 모델명이 포함된 구체적인 상품명 사용
- 단종 상품 추천 금지
- keyword는 쿠팡에서 검색했을 때 해당 상품이 상위 노출될 만큼 구체적으로
- 가격 정보는 절대 생성하지 말 것`;

  const response = await getOpenAI().chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
  });

  return response.choices[0].message.content!;
}

export async function POST(req: NextRequest) {
  const { category, budget, purpose, demographic } = await req.json();

  if (
    typeof category !== "string" ||
    !category ||
    typeof budget !== "string" ||
    !budget ||
    typeof purpose !== "string" ||
    !purpose
  ) {
    return NextResponse.json(
      { error: "필수 항목이 누락되었습니다." },
      { status: 400 }
    );
  }

  let raw: string;
  try {
    raw = await callOpenAI(
      category,
      budget,
      purpose,
      typeof demographic === "string" ? demographic : ""
    );
  } catch {
    return NextResponse.json(
      { error: "AI 호출 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }

  let parsed: {
    items: {
      rank: number;
      name: string;
      reason: string;
      keyword: string;
      category: string;
    }[];
    comment: string;
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

  return NextResponse.json({ items, comment: parsed.comment });
}

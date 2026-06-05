import { NextRequest, NextResponse } from "next/server";
import openai from "@/lib/openai";
import { generateCoupangLink } from "@/lib/coupang";

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
      "price": "예상가격",
      "keyword": "쿠팡 검색 키워드",
      "highlight": "이 상품의 핵심 장점 한 줄",
      "for_whom": "이런 분께 추천 (한 줄)"
    },
    { "rank": 2, "label": "무난한 선택" },
    { "rank": 3, "label": "프리미엄 픽" }
  ],
  "buying_tip": "이 카테고리 구매 시 반드시 확인할 것 (한 줄 팁)"
}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
  });

  return response.choices[0].message.content!;
}

export async function POST(req: NextRequest) {
  const { category, budget } = await req.json();

  if (typeof category !== "string" || !category || typeof budget !== "string" || !budget) {
    return NextResponse.json({ error: "카테고리와 예산을 선택해주세요." }, { status: 400 });
  }

  let raw: string;
  try {
    raw = await callOpenAI(category, budget);
  } catch {
    return NextResponse.json({ error: "AI 호출 중 오류가 발생했습니다." }, { status: 500 });
  }

  let parsed: {
    title: string;
    items: { rank: number; label: string; name: string; price: string; keyword: string; highlight: string; for_whom: string }[];
    buying_tip: string;
  };
  try {
    parsed = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "잠시 후 다시 시도해주세요." }, { status: 500 });
  }

  const items = parsed.items.map((item) => ({
    ...item,
    coupangUrl: generateCoupangLink(item.keyword),
  }));

  return NextResponse.json({ ...parsed, items });
}

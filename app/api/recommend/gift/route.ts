import { NextRequest, NextResponse } from "next/server";
import getOpenAI from "@/lib/openai";
import { generateCoupangLink } from "@/lib/coupang";

async function callOpenAI(
  relation: string,
  age: string,
  budget: string,
  gender: string
) {
  const prompt = `당신은 쇼핑 전문가입니다. 사용자의 선물 조건에 맞는 상품을 추천해주세요.

조건:
- 관계: ${relation}
- 나이대: ${age}
- 예산: ${budget}
- 성별: ${gender}

다음 JSON 형식으로만 응답하세요. 다른 텍스트는 절대 포함하지 마세요:

{
  "items": [
    {
      "rank": 1,
      "name": "상품명 (구체적으로, 브랜드명 포함)",
      "reason": "이 사람에게 이 선물이 좋은 이유 2줄",
      "price": "가격대 (예: 32,000원~38,000원)",
      "keyword": "쿠팡 검색용 키워드 (짧고 정확하게)",
      "category": "카테고리 (전자기기/뷰티/생활용품/패션/식품/스포츠 중 하나)"
    },
    { "rank": 2 },
    { "rank": 3 }
  ],
  "comment": "전체 추천에 대한 한 줄 코멘트 (친근한 말투)"
}

규칙:
- 반드시 3개 추천
- 예산 범위 내 상품만 추천
- 가능하면 전자기기, 뷰티, 패션 카테고리 포함 (수수료가 높음)
- 너무 일반적이지 않고 구체적인 상품명 사용
- keyword는 쿠팡에서 바로 검색했을 때 나올 만한 키워드로`;

  const response = await getOpenAI().chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
  });

  return response.choices[0].message.content!;
}

export async function POST(req: NextRequest) {
  const { relation, age, budget, gender } = await req.json();

  if (
    typeof relation !== "string" ||
    !relation ||
    typeof age !== "string" ||
    !age ||
    typeof budget !== "string" ||
    !budget ||
    typeof gender !== "string" ||
    !gender
  ) {
    return NextResponse.json(
      { error: "필수 항목이 누락되었습니다." },
      { status: 400 }
    );
  }

  let raw: string;
  try {
    raw = await callOpenAI(relation, age, budget, gender);
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
      price: string;
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

  const items = parsed.items.map((item) => ({
    ...item,
    coupangUrl: generateCoupangLink(item.keyword),
  }));

  return NextResponse.json({ items, comment: parsed.comment });
}

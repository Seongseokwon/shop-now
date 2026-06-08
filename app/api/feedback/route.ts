import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { message, page } = await req.json();

  if (!message?.trim()) {
    return NextResponse.json({ error: "내용을 입력해주세요." }, { status: 400 });
  }

  const webhookUrl = process.env.SLACK_FEEDBACK_WEBHOOK_URL;
  if (!webhookUrl) {
    return NextResponse.json({ error: "webhook not configured" }, { status: 500 });
  }

  await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text: `*[쇼핑GPT 피드백]*\n>${message.trim()}\n\n페이지: ${page ?? "알 수 없음"}`,
    }),
  });

  return NextResponse.json({ ok: true });
}

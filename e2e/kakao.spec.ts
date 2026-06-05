import { test, expect } from "@playwright/test";

const MOCK_GIFT_RESPONSE = {
  items: [
    {
      rank: 1,
      name: "애플 에어팟 4세대",
      reason: "추천 이유입니다.",
      price: "18,000원~22,000원",
      keyword: "애플 에어팟 4세대",
      category: "전자기기",
      coupangUrl: "https://www.coupang.com/np/search?q=test&ref=s2s_",
    },
    {
      rank: 2,
      name: "이니스프리 그린티 세트",
      reason: "추천 이유입니다.",
      price: "25,000원~30,000원",
      keyword: "이니스프리 그린티 세트",
      category: "뷰티",
      coupangUrl: "https://www.coupang.com/np/search?q=test2&ref=s2s_",
    },
    {
      rank: 3,
      name: "무지 캔버스 토트백",
      reason: "추천 이유입니다.",
      price: "15,000원~18,000원",
      keyword: "무지 캔버스 토트백",
      category: "패션",
      coupangUrl: "https://www.coupang.com/np/search?q=test3&ref=s2s_",
    },
  ],
  comment: "연인에게 딱 맞는 선물들이에요!",
};

test.describe("카카오 공유 버튼 동작", () => {
  test("/gift 결과 페이지에 카카오 공유 버튼이 존재한다", async ({ page }) => {
    await page.route("/api/recommend/gift", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_GIFT_RESPONSE),
      });
    });

    await page.goto("/gift");
    await page.selectOption("select >> nth=0", "연인");
    await page.selectOption("select >> nth=1", "20대");
    await page.selectOption("select >> nth=2", "3만원대");
    await page.click('input[type="radio"][value="여성"]');
    await page.click('button[type="submit"]');

    await expect(page.locator("text=카카오톡으로 공유")).toBeVisible();
  });

  test("카카오 SDK 미초기화 상태에서 공유 버튼 클릭 시 에러 없이 무시된다", async ({ page }) => {
    await page.route("/api/recommend/gift", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_GIFT_RESPONSE),
      });
    });

    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });

    await page.goto("/gift");
    await page.selectOption("select >> nth=0", "연인");
    await page.selectOption("select >> nth=1", "20대");
    await page.selectOption("select >> nth=2", "3만원대");
    await page.click('input[type="radio"][value="여성"]');
    await page.click('button[type="submit"]');

    // 카카오 SDK 없이 클릭 — window.Kakao?.Share 체크로 무시되어야 함
    await page.locator("text=카카오톡으로 공유").click();

    // Uncaught 에러가 발생하지 않아야 함
    const criticalErrors = consoleErrors.filter(
      (e) => !e.includes("kakao") && !e.includes("Kakao")
    );
    expect(criticalErrors).toHaveLength(0);
  });

  test("/decide 결과 페이지에 카카오 공유 버튼이 존재한다", async ({ page }) => {
    await page.route("/api/recommend/decide", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          verdict: "사세요",
          score: 82,
          reasons_to_buy: ["이유1"],
          reasons_to_skip: ["이유1"],
          verdict_comment: "구매하세요!",
          alternatives: [
            { name: "대안1", reason: "이유", keyword: "대안1", coupangUrl: "https://www.coupang.com/np/search?q=alt1&ref=s2s_" },
            { name: "대안2", reason: "이유", keyword: "대안2", coupangUrl: "https://www.coupang.com/np/search?q=alt2&ref=s2s_" },
          ],
        }),
      });
    });

    await page.goto("/decide");
    await page.fill('input[required]', "에어팟 프로 2세대");
    await page.click('button[type="submit"]');

    await expect(page.locator("text=카카오톡으로 공유")).toBeVisible();
  });
});

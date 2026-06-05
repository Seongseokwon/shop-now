import { test, expect } from "@playwright/test";

/**
 * 모바일 뷰포트 레이아웃 테스트
 * 이 파일의 테스트는 playwright.config.ts의 mobile-small (320px), mobile-medium (390px) 프로젝트에서도 실행됩니다.
 */

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

test.describe("모바일 레이아웃 검증", () => {
  test("홈 페이지 - 320px에서 가로 스크롤이 발생하지 않아야 한다", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto("/");

    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth);
  });

  test("/gift 페이지 - 320px에서 가로 스크롤이 발생하지 않아야 한다", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto("/gift");

    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth);
  });

  test("/decide 결과 - 320px에서 2열 레이아웃이 깨지지 않아야 한다", async ({ page }) => {
    await page.route("/api/recommend/decide", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          verdict: "사세요",
          score: 82,
          reasons_to_buy: ["이유1", "이유2"],
          reasons_to_skip: ["이유1"],
          verdict_comment: "구매하세요!",
          alternatives: [
            { name: "대안1", reason: "이유", keyword: "대안1", coupangUrl: "https://www.coupang.com/np/search?q=alt1&ref=s2s_" },
            { name: "대안2", reason: "이유", keyword: "대안2", coupangUrl: "https://www.coupang.com/np/search?q=alt2&ref=s2s_" },
          ],
        }),
      });
    });

    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto("/decide");
    await page.fill('input[required]', "테스트 상품");
    await page.click('button[type="submit"]');

    // 2열 grid가 320px에서 overflow를 일으키는지 확인
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth);
  });

  test("Navbar가 480px 이하에서 텍스트 잘림 없이 표시된다", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    const nav = page.locator("nav");
    await expect(nav).toBeVisible();

    // Navbar 링크들이 뷰포트 내에 있는지 확인
    const navLinks = page.locator("nav a");
    for (const link of await navLinks.all()) {
      const box = await link.boundingBox();
      if (box) {
        expect(box.x).toBeGreaterThanOrEqual(0);
        expect(box.x + box.width).toBeLessThanOrEqual(375 + 1); // 1px tolerance
      }
    }
  });

  test("/gift 결과 카드 - 320px에서 쿠팡 버튼이 카드 밖으로 넘치지 않아야 한다", async ({ page }) => {
    await page.route("/api/recommend/gift", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_GIFT_RESPONSE),
      });
    });

    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto("/gift");
    await page.selectOption("select >> nth=0", "연인");
    await page.selectOption("select >> nth=1", "20대");
    await page.selectOption("select >> nth=2", "3만원대");
    await page.click('input[type="radio"][value="여성"]');
    await page.click('button[type="submit"]');

    const coupangBtns = page.locator('a[target="_blank"]');
    for (const btn of await coupangBtns.all()) {
      const box = await btn.boundingBox();
      if (box) {
        expect(box.x + box.width).toBeLessThanOrEqual(320 + 1);
      }
    }
  });
});

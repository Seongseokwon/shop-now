import { test, expect } from "@playwright/test";

// ─── Mock API helper ───────────────────────────────────────────────────────────
const MOCK_GIFT_RESPONSE = {
  items: [
    {
      rank: 1,
      name: "애플 에어팟 4세대",
      reason: "20대 여성에게 인기 있는 프리미엄 무선이어폰입니다. 음질과 착용감이 우수합니다.",
      price: "18,000원~22,000원",
      keyword: "애플 에어팟 4세대",
      category: "전자기기",
      coupangUrl: "https://www.coupang.com/np/search?q=%EC%95%A0%ED%94%8C+%EC%97%90%EC%96%B4%ED%8C%9F+4&ref=s2s_",
    },
    {
      rank: 2,
      name: "이니스프리 그린티 세트",
      reason: "피부 관리에 관심 많은 연인에게 좋습니다. 브랜드 신뢰도가 높습니다.",
      price: "25,000원~30,000원",
      keyword: "이니스프리 그린티 세트",
      category: "뷰티",
      coupangUrl: "https://www.coupang.com/np/search?q=%EC%9D%B4%EB%8B%88%EC%8A%A4%ED%94%84%EB%A6%AC&ref=s2s_",
    },
    {
      rank: 3,
      name: "무지 캔버스 토트백",
      reason: "실용적이면서도 세련된 디자인입니다. 일상에서 자주 사용할 수 있습니다.",
      price: "15,000원~18,000원",
      keyword: "무지 캔버스 토트백",
      category: "패션",
      coupangUrl: "https://www.coupang.com/np/search?q=%EB%AC%B4%EC%A7%80+%ED%86%A0%ED%8A%B8%EB%B0%B1&ref=s2s_",
    },
  ],
  comment: "연인에게 딱 맞는 선물들이에요!",
};

const MOCK_ERROR_RESPONSE = {
  error: "AI 호출 중 오류가 발생했습니다.",
};

test.describe("/gift 페이지 — 선물 추천기", () => {
  test("폼 요소들이 올바르게 렌더된다", async ({ page }) => {
    await page.goto("/gift");

    await expect(page.locator("select").nth(0)).toBeVisible(); // 관계
    await expect(page.locator("select").nth(1)).toBeVisible(); // 나이대
    await expect(page.locator("select").nth(2)).toBeVisible(); // 예산
    await expect(page.locator('input[type="radio"]').first()).toBeVisible(); // 성별

    // 제출 버튼은 성별 미선택 시 비활성화
    const submitBtn = page.locator('button[type="submit"]');
    await expect(submitBtn).toBeDisabled();
  });

  test("성별 선택 전 버튼이 비활성화된다", async ({ page }) => {
    await page.goto("/gift");
    const submitBtn = page.locator('button[type="submit"]');
    // gender radio 미선택 상태
    await expect(submitBtn).toBeDisabled();
  });

  test("성별 선택 후 버튼이 활성화된다", async ({ page }) => {
    await page.goto("/gift");
    await page.click('input[type="radio"][value="여성"]');
    const submitBtn = page.locator('button[type="submit"]');
    await expect(submitBtn).toBeEnabled();
  });

  test("폼 제출 후 로딩 상태 — API 성공 시 결과 3개 표시", async ({ page }) => {
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

    const submitBtn = page.locator('button[type="submit"]');
    await submitBtn.click();

    // 결과 3개 확인
    const resultCards = page.locator('[class*="rounded-2xl"]').filter({ hasText: "쿠팡에서 최저가 확인" });
    await expect(resultCards).toHaveCount(3);
  });

  test("결과 카드에 쿠팡 버튼이 각각 존재하고 새 탭 속성을 가진다", async ({ page }) => {
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

    const coupangLinks = page.locator('a[target="_blank"]');
    await expect(coupangLinks).toHaveCount(3);

    // 각 링크의 rel 속성 확인
    for (const link of await coupangLinks.all()) {
      const rel = await link.getAttribute("rel");
      expect(rel).toContain("noopener");
      expect(rel).toContain("noreferrer");
      expect(rel).toContain("nofollow");
    }
  });

  test("쿠팡 버튼 클릭 시 새 탭이 열린다", async ({ page, context }) => {
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

    const [newPage] = await Promise.all([
      context.waitForEvent("page"),
      page.locator('a[target="_blank"]').first().click(),
    ]);
    expect(newPage.url()).toContain("coupang.com");
    await newPage.close();
  });

  test("API 오류 시 에러 메시지가 표시된다", async ({ page }) => {
    await page.route("/api/recommend/gift", async (route) => {
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify(MOCK_ERROR_RESPONSE),
      });
    });

    await page.goto("/gift");
    await page.selectOption("select >> nth=0", "연인");
    await page.selectOption("select >> nth=1", "20대");
    await page.selectOption("select >> nth=2", "3만원대");
    await page.click('input[type="radio"][value="여성"]');
    await page.click('button[type="submit"]');

    await expect(page.locator("text=AI 호출 중 오류가 발생했습니다.")).toBeVisible();
  });

  test("로딩 중 제출 버튼이 비활성화된다", async ({ page }) => {
    let resolveRoute: () => void;
    const routePromise = new Promise<void>((resolve) => {
      resolveRoute = resolve;
    });

    await page.route("/api/recommend/gift", async (route) => {
      await routePromise;
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

    // 로딩 중 버튼 비활성화 확인
    await expect(page.locator('button[type="submit"]')).toBeHidden(); // 폼이 사라짐
    await expect(page.locator("text=AI가 분석 중입니다")).toBeVisible();

    resolveRoute!();
  });

  test("다시 추천받기 버튼 클릭 시 폼으로 돌아간다", async ({ page }) => {
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

    await page.locator("text=다시 추천받기").click();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });
});

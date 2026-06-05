import { test, expect } from "@playwright/test";

const MOCK_DECIDE_BUY = {
  verdict: "사세요",
  score: 82,
  reasons_to_buy: ["음질이 훌륭합니다", "노이즈 캔슬링 성능이 최고입니다", "애플 기기와 완벽 호환됩니다"],
  reasons_to_skip: ["가격이 비쌉니다", "안드로이드 사용자에게는 불필요한 기능이 많습니다"],
  verdict_comment: "애플 유저라면 고민할 필요 없이 구매하세요!",
  alternatives: [
    {
      name: "삼성 갤럭시 버즈 FE",
      reason: "더 저렴하면서 안드로이드 호환성이 뛰어납니다",
      keyword: "삼성 갤럭시 버즈 FE",
      coupangUrl: "https://www.coupang.com/np/search?q=%EC%82%BC%EC%84%B1+%EA%B0%A4%EB%9F%AD%EC%8B%9C+%EB%B2%84%EC%A6%88&ref=s2s_",
    },
    {
      name: "소니 WF-1000XM5",
      reason: "노이즈 캔슬링이 더 강력하고 음질이 최상급입니다",
      keyword: "소니 WF-1000XM5",
      coupangUrl: "https://www.coupang.com/np/search?q=%EC%86%8C%EB%8B%88+WF-1000XM5&ref=s2s_",
    },
  ],
};

const MOCK_DECIDE_SKIP = {
  ...MOCK_DECIDE_BUY,
  verdict: "참으세요",
  score: 35,
  verdict_comment: "지금은 더 좋은 대안이 있습니다.",
};

const MOCK_ERROR_RESPONSE = {
  error: "상품명을 입력해주세요.",
};

test.describe("/decide 페이지 — 살까말까 결정기", () => {
  test("폼 요소들이 올바르게 렌더된다", async ({ page }) => {
    await page.goto("/decide");

    await expect(page.locator('input[type="text"]').first()).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test("상품명 미입력 시 제출 버튼이 비활성화된다", async ({ page }) => {
    await page.goto("/decide");
    await expect(page.locator('button[type="submit"]')).toBeDisabled();
  });

  test("상품명 입력 시 제출 버튼이 활성화된다", async ({ page }) => {
    await page.goto("/decide");
    await page.fill('input[required]', "에어팟 프로 2세대");
    await expect(page.locator('button[type="submit"]')).toBeEnabled();
  });

  test("공백만 입력 시 버튼이 비활성화 상태여야 한다 [엣지케이스]", async ({ page }) => {
    await page.goto("/decide");
    await page.fill('input[required]', "   ");
    // productName.trim()이 falsy이므로 disabled여야 함
    await expect(page.locator('button[type="submit"]')).toBeDisabled();
  });

  test("사세요 verdict 표시 및 게이지바 렌더", async ({ page }) => {
    await page.route("/api/recommend/decide", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_DECIDE_BUY),
      });
    });

    await page.goto("/decide");
    await page.fill('input[required]', "에어팟 프로 2세대");
    await page.click('button[type="submit"]');

    await expect(page.locator("text=사세요")).toBeVisible();
    await expect(page.locator("text=82점")).toBeVisible();

    // 게이지바 width 확인
    const gauge = page.locator('[style*="width: 82%"]');
    await expect(gauge).toBeVisible();
  });

  test("참으세요 verdict 표시", async ({ page }) => {
    await page.route("/api/recommend/decide", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_DECIDE_SKIP),
      });
    });

    await page.goto("/decide");
    await page.fill('input[required]', "에어팟 프로 2세대");
    await page.click('button[type="submit"]');

    await expect(page.locator("text=참으세요")).toBeVisible();
    await expect(page.locator("text=35점")).toBeVisible();
  });

  test("대안 상품 2개가 쿠팡 버튼과 함께 표시된다", async ({ page }) => {
    await page.route("/api/recommend/decide", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_DECIDE_BUY),
      });
    });

    await page.goto("/decide");
    await page.fill('input[required]', "에어팟 프로 2세대");
    await page.click('button[type="submit"]');

    await expect(page.locator("text=대안 상품")).toBeVisible();
    const coupangLinks = page.locator('a[target="_blank"]');
    await expect(coupangLinks).toHaveCount(2);
  });

  test("대안 상품 쿠팡 링크의 rel 속성 확인", async ({ page }) => {
    await page.route("/api/recommend/decide", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_DECIDE_BUY),
      });
    });

    await page.goto("/decide");
    await page.fill('input[required]', "에어팟 프로 2세대");
    await page.click('button[type="submit"]');

    for (const link of await page.locator('a[target="_blank"]').all()) {
      const rel = await link.getAttribute("rel");
      expect(rel).toContain("noopener");
      expect(rel).toContain("noreferrer");
      expect(rel).toContain("nofollow");
    }
  });

  test("API 오류 시 에러 메시지가 표시된다", async ({ page }) => {
    await page.route("/api/recommend/decide", async (route) => {
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ error: "AI 호출 중 오류가 발생했습니다." }),
      });
    });

    await page.goto("/decide");
    await page.fill('input[required]', "에어팟 프로 2세대");
    await page.click('button[type="submit"]');

    await expect(page.locator("text=AI 호출 중 오류가 발생했습니다.")).toBeVisible();
  });

  test("고민 이유 체크박스 복수 선택이 가능하다", async ({ page }) => {
    await page.goto("/decide");
    const checkboxes = page.locator('input[type="checkbox"]');
    await checkboxes.nth(0).check();
    await checkboxes.nth(1).check();

    await expect(checkboxes.nth(0)).toBeChecked();
    await expect(checkboxes.nth(1)).toBeChecked();
  });

  test("매우 긴 상품명 입력 처리 [엣지케이스]", async ({ page }) => {
    await page.route("/api/recommend/decide", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_DECIDE_BUY),
      });
    });

    await page.goto("/decide");
    const longName = "A".repeat(500);
    await page.fill('input[required]', longName);
    await expect(page.locator('button[type="submit"]')).toBeEnabled();
  });

  test("다시 물어보기 버튼 클릭 시 폼으로 돌아간다", async ({ page }) => {
    await page.route("/api/recommend/decide", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_DECIDE_BUY),
      });
    });

    await page.goto("/decide");
    await page.fill('input[required]', "에어팟 프로 2세대");
    await page.click('button[type="submit"]');

    await page.locator("text=다시 물어보기").click();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });
});

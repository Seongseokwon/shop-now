import { test, expect } from "@playwright/test";

const MOCK_BUDGET_RESPONSE = {
  title: "이 예산에서 최고의 무선이어폰",
  items: [
    {
      rank: 1,
      label: "가성비 최고",
      name: "QCY T13 ANC",
      price: "22,000원",
      keyword: "QCY T13 ANC",
      highlight: "2만원대에 ANC가 탑재된 경이로운 가성비",
      for_whom: "예산을 최우선으로 생각하시는 분",
      coupangUrl: "https://www.coupang.com/np/search?q=QCY+T13&ref=s2s_",
    },
    {
      rank: 2,
      label: "무난한 선택",
      name: "삼성 갤럭시 버즈 FE",
      price: "59,000원",
      keyword: "삼성 갤럭시 버즈 FE",
      highlight: "안정적인 품질과 삼성 생태계 호환",
      for_whom: "삼성 스마트폰 사용자",
      coupangUrl: "https://www.coupang.com/np/search?q=%EC%82%BC%EC%84%B1+%EB%B2%84%EC%A6%88FE&ref=s2s_",
    },
    {
      rank: 3,
      label: "프리미엄 픽",
      name: "애플 에어팟 4세대 ANC",
      price: "239,000원",
      keyword: "애플 에어팟 4세대 ANC",
      highlight: "애플 생태계 최고의 무선이어폰",
      for_whom: "아이폰 사용자이면서 최고를 원하는 분",
      coupangUrl: "https://www.coupang.com/np/search?q=%EC%97%90%EC%96%B4%ED%8C%9F+4&ref=s2s_",
    },
  ],
  buying_tip: "무선이어폰 구매 시 코덱(AAC/aptX), 드라이버 크기, 배터리 지속 시간을 확인하세요",
};

test.describe("/budget 페이지 — 가성비 레이더", () => {
  test("카테고리와 예산 셀렉트가 렌더된다", async ({ page }) => {
    await page.goto("/budget");
    const selects = page.locator("select");
    await expect(selects).toHaveCount(2);
  });

  test("제출 버튼이 기본 활성화 상태이다 (HTML required 의존)", async ({ page }) => {
    // budget page의 submit 버튼은 disabled={loading} 만 체크 → 초기에는 enabled
    await page.goto("/budget");
    const submitBtn = page.locator('button[type="submit"]');
    await expect(submitBtn).toBeEnabled();
  });

  test("카테고리/예산 미선택 후 제출 시 브라우저 native validation 동작", async ({ page }) => {
    await page.goto("/budget");
    await page.click('button[type="submit"]');
    // select에 required가 있으므로 브라우저 validation이 막아야 하지만
    // 실제로는 value=""인 option이 select되어 required 통과 여부 확인
    // 페이지 이동이 없어야 한다 (폼 제출 막힘)
    await expect(page).toHaveURL("/budget");
  });

  test("카테고리/예산 선택 후 결과 3종 카드 표시", async ({ page }) => {
    await page.route("/api/recommend/budget", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_BUDGET_RESPONSE),
      });
    });

    await page.goto("/budget");
    await page.selectOption("select >> nth=0", "무선이어폰");
    await page.selectOption("select >> nth=1", "10만원");
    await page.click('button[type="submit"]');

    // 3종 카드 확인
    await expect(page.locator("text=가성비 최고")).toBeVisible();
    await expect(page.locator("text=무난한 선택")).toBeVisible();
    await expect(page.locator("text=프리미엄 픽")).toBeVisible();
  });

  test("각 카드에 쿠팡 버튼이 존재하고 rel 속성을 가진다", async ({ page }) => {
    await page.route("/api/recommend/budget", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_BUDGET_RESPONSE),
      });
    });

    await page.goto("/budget");
    await page.selectOption("select >> nth=0", "무선이어폰");
    await page.selectOption("select >> nth=1", "10만원");
    await page.click('button[type="submit"]');

    const coupangLinks = page.locator('a[target="_blank"]');
    await expect(coupangLinks).toHaveCount(3);

    for (const link of await coupangLinks.all()) {
      const rel = await link.getAttribute("rel");
      expect(rel).toContain("noopener");
      expect(rel).toContain("noreferrer");
      expect(rel).toContain("nofollow");
    }
  });

  test("구매 팁이 표시된다", async ({ page }) => {
    await page.route("/api/recommend/budget", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_BUDGET_RESPONSE),
      });
    });

    await page.goto("/budget");
    await page.selectOption("select >> nth=0", "무선이어폰");
    await page.selectOption("select >> nth=1", "10만원");
    await page.click('button[type="submit"]');

    await expect(page.locator("text=구매 팁:")).toBeVisible();
  });

  test("API 오류 시 에러 메시지 표시", async ({ page }) => {
    await page.route("/api/recommend/budget", async (route) => {
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ error: "AI 호출 중 오류가 발생했습니다." }),
      });
    });

    await page.goto("/budget");
    await page.selectOption("select >> nth=0", "무선이어폰");
    await page.selectOption("select >> nth=1", "10만원");
    await page.click('button[type="submit"]');

    await expect(page.locator("text=AI 호출 중 오류가 발생했습니다.")).toBeVisible();
  });

  test("다시 검색하기 버튼으로 폼으로 돌아간다", async ({ page }) => {
    await page.route("/api/recommend/budget", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_BUDGET_RESPONSE),
      });
    });

    await page.goto("/budget");
    await page.selectOption("select >> nth=0", "무선이어폰");
    await page.selectOption("select >> nth=1", "10만원");
    await page.click('button[type="submit"]');

    await page.locator("text=다시 검색하기").click();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });
});

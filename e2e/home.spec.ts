import { test, expect } from "@playwright/test";

test.describe("홈 페이지", () => {
  test("3개 기능 카드가 올바른 링크와 함께 렌더된다", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toContainText("쇼핑GPT");

    const links = ["/gift", "/decide", "/budget"];
    for (const href of links) {
      await expect(page.locator(`a[href="${href}"]`)).toBeVisible();
    }
  });

  test("각 기능 카드 클릭 시 해당 페이지로 이동한다", async ({ page }) => {
    await page.goto("/");
    await page.click('a[href="/gift"]');
    await expect(page).toHaveURL("/gift");
  });

  test("Navbar가 렌더되고 홈 로고 링크가 존재한다", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("nav")).toBeVisible();
    await expect(page.locator('nav a[href="/"]')).toBeVisible();
  });
});

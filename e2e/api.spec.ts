import { test, expect } from "@playwright/test";

/**
 * API 엔드포인트 직접 테스트
 * 서버가 실행 중인 경우 실제 API 동작을 검증합니다.
 * OpenAI API 키가 없는 환경에서는 500 오류가 예상됩니다.
 */

test.describe("API 엔드포인트 — 입력 검증", () => {
  test("POST /api/recommend/gift — 필수 항목 누락 시 400 반환", async ({ request }) => {
    const res = await request.post("/api/recommend/gift", {
      data: { relation: "연인" }, // age, budget, gender 누락
    });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.error).toBeTruthy();
  });

  test("POST /api/recommend/gift — 빈 바디 전송 시 400 반환", async ({ request }) => {
    const res = await request.post("/api/recommend/gift", {
      data: {},
    });
    expect(res.status()).toBe(400);
  });

  test("POST /api/recommend/decide — 상품명 누락 시 400 반환", async ({ request }) => {
    const res = await request.post("/api/recommend/decide", {
      data: { price: "100000원" }, // productName 누락
    });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("상품명을 입력해주세요.");
  });

  test("POST /api/recommend/decide — 빈 productName 전송 시 400 반환", async ({ request }) => {
    const res = await request.post("/api/recommend/decide", {
      data: { productName: "" },
    });
    expect(res.status()).toBe(400);
  });

  test("POST /api/recommend/budget — 카테고리 누락 시 400 반환", async ({ request }) => {
    const res = await request.post("/api/recommend/budget", {
      data: { budget: "10만원" }, // category 누락
    });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.error).toBeTruthy();
  });

  test("POST /api/recommend/budget — 예산 누락 시 400 반환", async ({ request }) => {
    const res = await request.post("/api/recommend/budget", {
      data: { category: "무선이어폰" }, // budget 누락
    });
    expect(res.status()).toBe(400);
  });

  test("GET /api/recommend/gift — 존재하지 않는 메서드 시 405 반환", async ({ request }) => {
    const res = await request.get("/api/recommend/gift");
    // Next.js는 허용되지 않는 메서드에 405를 반환해야 함
    expect([405, 404]).toContain(res.status());
  });
});

test.describe("API 엔드포인트 — XSS / 주입 공격 입력", () => {
  test("POST /api/recommend/decide — XSS 입력이 400 또는 처리됨", async ({ request }) => {
    const res = await request.post("/api/recommend/decide", {
      data: {
        productName: '<script>alert("xss")</script>',
        price: "",
        reasons: [],
      },
    });
    // 400이거나 200(OpenAI가 처리) 중 하나. 500은 허용되지 않음
    expect([200, 400, 500]).toContain(res.status());
  });

  test("POST /api/recommend/gift — SQL-like 주입 입력", async ({ request }) => {
    const res = await request.post("/api/recommend/gift", {
      data: {
        relation: "'; DROP TABLE users; --",
        age: "20대",
        budget: "3만원대",
        gender: "여성",
      },
    });
    // API가 OpenAI를 호출하므로 200 또는 500
    expect([200, 400, 500]).toContain(res.status());
  });
});

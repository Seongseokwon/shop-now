# Project Hand-off: shopping-gpt (Shop Now)

**Last updated:** 2026-06-08  
**Branch:** master  
**Last commit:** `a29aa11` — chore: update OG image and metadata for 상품 추천기 rename  
**Production URL:** https://shop-now-ebon.vercel.app

---

## What This Project Is

**Shop Now** — 한국어 AI 쇼핑 어시스턴트 (Next.js 16 + OpenAI + 쿠팡 Partners API). 모바일 퍼스트, SPA 느낌의 단일 앱.

| Route | 기능 | 설명 |
|-------|------|------|
| `/gift` | 상품 추천기 | 카테고리/예산/목적/성별-연령대 선택 → GPT가 상품 3개 추천 + 쿠팡 실시간 가격/이미지 |
| `/decide` | 살까말까 결정기 | 상품명 입력 → GPT가 구매 추천도(0~100점) + 사야/참아야 이유 + 대안 상품 |
| `/budget` | 가성비 레이더 | 카테고리/예산 선택 → GPT가 가성비 최고/무난/프리미엄 3종 추천 + 쿠팡 실시간 가격/이미지 |

---

## Tech Stack

- **Framework:** Next.js 16.2.7 (App Router, Turbopack)
- **UI:** Tailwind CSS v4 (PostCSS, 설정 파일 없음)
- **AI:** OpenAI SDK v6 (`gpt-4o-mini`, 서버 사이드)
- **쇼핑:** 쿠팡 Partners API (HMAC-SHA256 서명, 실시간 상품 검색)
- **Testing:** Playwright (e2e, `e2e/`)
- **Linting:** ESLint 9 flat config (`eslint.config.mjs`) + Prettier 3
- **Deploy:** Vercel (`npm run deploy` → `vercel --prod`)

---

## Project Structure

```
app/
  layout.tsx          — 루트 레이아웃, Navbar, OG/Twitter 메타
  page.tsx            — 홈 (Hero + 기능 카드 3개)
  gift/page.tsx       — 상품 추천기 폼 + 결과
  decide/page.tsx     — 살까말까 결정기 폼 + 결과
  budget/page.tsx     — 가성비 레이더 폼 + 결과
  opengraph-image.tsx — OG 이미지 (SVG 기반, edge runtime)
  api/recommend/
    gift/route.ts     — OpenAI 호출 → 쿠팡 검색 병렬 처리 → 응답
    decide/route.ts   — OpenAI 호출 → 응답
    budget/route.ts   — OpenAI 호출 → 쿠팡 검색 병렬 처리 → 응답

components/
  Logo.tsx
  Navbar.tsx          — 세그먼트 컨트롤 스타일, 활성 상태
  LoadingSpinner.tsx
  CoupangButton.tsx
  KakaoShareButton.tsx
  PillGroup.tsx       — 단일 선택 필 버튼 그룹
  MultiPillGroup.tsx  — 다중 선택 필 버튼 그룹

lib/
  openai.ts           — OpenAI 클라이언트 lazy init
  coupang.ts          — HMAC 서명 + searchCoupang() + generateCoupangLink()
```

---

## 오늘 작업 내역 (2026-06-08)

### 1. GPT 프롬프트 개선 (커밋 `13a3afd`)
- gift/budget 프롬프트에서 `price` 필드 제거 (GPT가 가격 생성하던 것 제거)
- 상품 품질 규칙 추가: 완제품만, 브랜드+모델명 필수, 단종 금지, keyword 구체화
- budget 프롬프트에 `category` 필드 추가

### 2. Frontend 가격 영역 임시 제거 (커밋 `3b9d773`)
- gift/budget 페이지에서 "예상가격" 텍스트 제거
- GiftItem, BudgetItem 타입에서 `price` 제거

### 3. 쿠팡 API 환경변수 추가 (커밋 `87da9af`)
- `.env.sample`에 `COUPANG_ACCESS_KEY`, `COUPANG_SECRET_KEY` 추가

### 4. 쿠팡 Partners API 연동 (커밋 `48eed4d`)
- `lib/coupang.ts`에 `searchCoupang(keyword)` 구현
- **HMAC 서명 정확한 포맷**: datetime=`YYMMDDTHHmmssZ`, message=`datetime+method+path+query`
- gift/budget API 라우트에서 GPT 결과 후 쿠팡 API 병렬 호출 (`Promise.allSettled`)
- 실제 price/image/rating/reviewCount/coupangUrl 데이터 주입
- API 실패 시 기존 검색 URL로 폴백
- gift/budget 페이지에 실시간 최저가, 상품 이미지, 평점/리뷰수 표시

### 5. OG 이미지 + 메타데이터 업데이트 (커밋 `a29aa11`)
- OG 이미지: "선물 추천기" 🎁 → "상품 추천기" 🛍️
- layout.tsx 메타 description 동기화

### 6. Vercel 배포
- 빌드 성공, 에러 0
- https://shop-now-ebon.vercel.app 배포 완료

---

## 현재 상태

| 항목 | 상태 |
|------|------|
| GPT 프롬프트 (price 제거, 규칙 강화) | ✅ 완료 |
| Frontend 가격 영역 정리 | ✅ 완료 |
| 쿠팡 Partners API 연동 | ✅ 완료 |
| 실시간 가격/이미지/평점 표시 | ✅ 완료 |
| OG 이미지 업데이트 | ✅ 완료 |
| Vercel 배포 | ✅ 완료 |
| lint: 0 errors (warning 1개 — e2e unused var) | ✅ |

---

## 쿠팡 API 핵심 정보

```typescript
// lib/coupang.ts — generateHmac()
// 공식 문서 기준 서명 포맷
const datetime = `${yy}${MM}${dd}T${HH}${mm}${ss}Z`; // e.g. 260608T120000Z
const [path, query = ""] = url.split("?");
const message = datetime + method + path + query;      // ? 제외한 query
const signature = HmacSHA256(secretKey, message).hex;
// Authorization: CEA algorithm=HmacSHA256, access-key=..., signed-date=..., signature=...

// 검색 엔드포인트
GET /v2/providers/affiliate_open_api/apis/openapi/v1/products/search?keyword=...&limit=1
// 응답: data.productData[0].{productPrice, productImage, productUrl, productRating, productReviewCount}
```

---

## Environment / Config

| 변수 | 설명 | 위치 |
|------|------|------|
| `OPENAI_API_KEY` | OpenAI API 키 | Vercel env + `.env.local` |
| `NEXT_PUBLIC_KAKAO_APP_KEY` | 카카오 JS 앱 키 | Vercel env + `.env.local` |
| `NEXT_PUBLIC_COUPANG_PARTNER_ID` | 쿠팡 파트너 ID (`AF2316808`) | Vercel env + `.env.local` |
| `COUPANG_ACCESS_KEY` | 쿠팡 API Access Key (UUID) | Vercel env + `.env.local` ⚠️ |
| `COUPANG_SECRET_KEY` | 쿠팡 API Secret Key (hex 40자) | Vercel env + `.env.local` ⚠️ |
| `NEXT_PUBLIC_BASE_URL` | 배포 도메인 | Vercel env + `.env.local` |

> ⚠️ `COUPANG_ACCESS_KEY`, `COUPANG_SECRET_KEY`는 Vercel 대시보드 환경변수에 아직 추가 필요

---

## How to Pick Up

```bash
git pull origin master
cp .env.sample .env.local  # 실제 키 값 채우기
npm install
npm run dev  # http://localhost:3000
```

**명령어**
- `npm run lint` — ESLint 검사
- `npm run format` — Prettier 적용
- `npm run deploy` — Vercel 프로덕션 배포

**다음 가능한 작업**
- Vercel 환경변수에 `COUPANG_ACCESS_KEY` / `COUPANG_SECRET_KEY` 추가 (현재 프로덕션에서 쿠팡 가격 미표시)
- `/decide` 대안 상품에도 쿠팡 API 연동 (현재 키워드 검색 URL만 사용)
- e2e 테스트 업데이트 (gift 페이지 폼 변경 반영)
- 테스트 스크립트 정리 (`scripts/test-coupang.mjs`, `COUPANG_API_DEBUG.md` 삭제 가능)

# Project Hand-off: shopping-gpt (Shop Now)

**Last updated:** 2026-06-08  
**Branch:** master  
**Last commit:** `0dc651c` — docs(task): Trust Expansion Strategy 반영 8차 재정렬  
**Production URL:** https://shop-now-ebon.vercel.app

---

## What This Project Is

**Shop Now** — 한국어 AI 쇼핑 어시스턴트 (Next.js 16 + OpenAI + 쿠팡 Partners API). 모바일 퍼스트, SPA 느낌의 단일 앱.

| Route | 기능 | 설명 |
|-------|------|------|
| `/gift` | 상품 추천기 | 카테고리/예산/목적/성별-연령대 선택 → GPT가 상품 3개 추천 + 쿠팡 실시간 가격/이미지 |
| `/decide` | 살까말까 결정기 | 상품명 입력 → GPT가 구매 추천도(0~100점) + 사야/참아야 이유 + 대안 상품 + 직링 카드 |
| `/budget` | 가성비 레이더 | 카테고리/예산 선택 → GPT가 가성비 최고/무난/프리미엄 3종 추천 + 쿠팡 실시간 가격/이미지 |
| `/result` | 공유 랜딩 | URL 파라미터로 판정 결과 복원, NudgeCTA 인라인 폼 |

---

## Tech Stack

- **Framework:** Next.js 16.2.7 (App Router, Turbopack)
- **UI:** Tailwind CSS v4 (PostCSS, 설정 파일 없음)
- **AI:** OpenAI SDK v6 (`gpt-4o-mini`, 서버 사이드)
- **쇼핑:** 쿠팡 Partners API (HMAC-SHA256 서명, 실시간 상품 검색 + deeplink 트래킹)
- **Rate Limiting:** Upstash Redis (sliding window, IP 기반, 분당 10회)
- **Analytics:** Vercel Analytics
- **Deploy:** Vercel (`npm run deploy` → `vercel --prod`)

---

## Project Structure

```
app/
  layout.tsx              — 루트 레이아웃, Navbar, OG/Twitter 메타
  page.tsx                — 홈 (Hero + 기능 카드 3개)
  gift/page.tsx           — 상품 추천기 폼 + 결과
  decide/page.tsx         — 살까말까 결정기 폼 + 결과 + 직링 카드
  budget/page.tsx         — 가성비 레이더 폼 + 결과
  result/page.tsx         — 공유 랜딩 (URL 파라미터 복원 + NudgeCTA)
  opengraph-image.tsx     — 루트 OG 이미지 (SVG, edge runtime)
  api/
    og/route.tsx          — 동적 OG 이미지 (판정/상품명/점수 파라미터)
    feedback/route.ts     — 피드백 수신 (이메일 발송)
    recommend/
      gift/route.ts       — OpenAI → 쿠팡 병렬 검색 → 응답
      decide/route.ts     — OpenAI → 사세요 판정 시 쿠팡 직링 검색 → 응답
      budget/route.ts     — OpenAI → 쿠팡 병렬 검색 → 응답

components/
  Logo.tsx
  Navbar.tsx              — 세그먼트 컨트롤 스타일, 활성 상태
  LoadingSpinner.tsx
  CoupangButton.tsx       — "최저가 확인하기 →" (쿠팡 브랜딩 제거됨)
  KakaoShareButton.tsx
  PillGroup.tsx           — 단일 선택 필 버튼 그룹
  MultiPillGroup.tsx      — 다중 선택 필 버튼 그룹
  JudgmentCard.tsx        — 판정 결과 카드 (점수/이유/공유)
  VerdictBadge.tsx        — 사세요/참으세요 배지
  ScoreGauge.tsx          — 구매 추천도 게이지
  ReasonList.tsx          — 사야/참아야 이유 목록
  ShareActions.tsx        — 카카오/링크복사 공유 버튼
  NudgeCTA.tsx            — 공유 랜딩 인라인 폼
  DecideHistory.tsx       — 판정 히스토리 (localStorage)
  JudgmentBadges.tsx      — 배지 시스템 (5종, 신규 획득 모달)
  FeedbackButton.tsx      — 우측 하단 플로팅 피드백 버튼

lib/
  openai.ts               — OpenAI 클라이언트 lazy init
  coupang.ts              — HMAC 서명 + searchCoupang() + generateCoupangLink()
  rateLimit.ts            — Upstash Redis sliding window rate limiter
  resultUrl.ts            — 판정 결과 URL 인코딩/디코딩
  badges.ts               — 배지 조건 정의 및 localStorage 관리
```

---

## 현재 완성된 기능 목록

| 기능 | 상태 |
|------|------|
| 상품 추천기 (gift) | ✅ |
| 살까말까 결정기 (decide) | ✅ |
| 가성비 레이더 (budget) | ✅ |
| 쿠팡 Partners API 실시간 가격/이미지/평점 | ✅ |
| 쿠팡 deeplink (파트너스 트래킹 코드 포함) | ✅ |
| 사세요 판정 시 직링 카드 | ✅ |
| 대안 상품 쿠팡 실시간 조회 | ✅ |
| 결과 공유 URL + 동적 OG 이미지 | ✅ |
| 카카오톡 공유 | ✅ |
| 판정 히스토리 (localStorage) | ✅ |
| 배지 시스템 5종 | ✅ |
| NudgeCTA 공유 랜딩 인라인 폼 | ✅ |
| IP 기반 Rate Limiting (Upstash Redis) | ✅ |
| 플로팅 피드백 버튼 | ✅ |
| CTA 중립화 ("최저가 확인하기") | ✅ |
| 네이버쇼핑 비교 링크 (deeplink) | ✅ |
| 쿠팡 파트너스 수수료 안내 문구 | ✅ |

---

## 오늘 작업 내역 (2026-06-08) — Trust Strategy

### 배경

Marketplace Dependency & Trust Expansion 전략 토론 결과, 핵심 판단:  
**"사용자가 원하는 건 플랫폼 다양성이 아니라 신뢰할 수 있는 추천 경험"**  
→ 다중 플랫폼 직접 연동 없이 투명성 레이어 추가로 신뢰도 확보.

### 1. CTA 문구 쿠팡 브랜딩 제거 (커밋 `67fb9a6`)

- `CoupangButton.tsx`: `"쿠팡에서 최저가 확인 →"` → `"최저가 확인하기 →"`
- `decide/page.tsx`: `"🛒 쿠팡에서 바로 구매하기"` → `"🛒 최저가로 구매하기"`
- 쿠팡 반복 노출로 인한 "광고 채널" 인식 차단

### 2. 네이버쇼핑 비교 링크 + 파트너스 안내 (커밋 `fdd0da6`)

- 직링 카드·대안 상품 카드 각각에 `"네이버쇼핑에서도 검색하기"` deeplink 추가
  - URL: `https://search.shopping.naver.com/search/all?query={상품명}`
  - 크롤링/가격 동기화 없음. 버튼 존재만으로 "쿠팡 광고 아님" 객관성 신호
- 결과 영역 하단에 쿠팡 파트너스 수수료 안내 한 줄 추가
  - `"이 서비스는 쿠팡 파트너스 활동의 일환으로, 구매 시 일정 수수료를 제공받을 수 있습니다."`

### 3. TASK.md 8차 재정렬 (커밋 `0dc651c`)

- Critical Problems 업데이트: rate limit(완료) → 쿠팡 깔때기 인식 위험
- P0 신규 3개 태스크 정의
- Features To Delay: 11번가/G마켓/SSG 직접 연동 명시적 차단
- Fast Validation Experiments 신규 3개 추가

---

## 이전 주요 작업 이력

| 커밋 | 내용 |
|------|------|
| `85f5a25` | 쿠팡 deeplink API — 파트너스 트래킹 코드 포함 URL 변환 |
| `2522339` | 공유 OG 이미지 전면 개선 (동적 생성) |
| `eea34e3` | 우측 하단 플로팅 피드백 버튼 |
| `ab9044e` | Rate Limit: in-memory Map → Upstash Redis sliding window |
| `95aee3c` | 사세요 판정 시 쿠팡 직링 카드 표시 |
| `33d610a` | IP 기반 Rate Limiting 전체 API 적용 |
| `9153054` | 공유 루프 완성 (NudgeCTA + 판정별 공유 문구) |

---

## 쿠팡 API 핵심 정보

```typescript
// lib/coupang.ts — generateHmac()
const datetime = `${yy}${MM}${dd}T${HH}${mm}${ss}Z`; // e.g. 260608T120000Z
const [path, query = ""] = url.split("?");
const message = datetime + method + path + query;      // ? 제외한 query
const signature = HmacSHA256(secretKey, message).hex;
// Authorization: CEA algorithm=HmacSHA256, access-key=..., signed-date=..., signature=...

// 검색 엔드포인트
GET /v2/providers/affiliate_open_api/apis/openapi/v1/products/search?keyword=...&limit=1
// 응답: data.productData[0].{productPrice, productImage, productUrl, productRating, productReviewCount}

// deeplink 변환 (generateCoupangLink)
POST /v2/providers/affiliate_open_api/apis/openapi/v1/deeplink
// body: { coupangUrls: [url] }
// 응답: data[0].shortenUrl — 파트너스 트래킹 포함 단축 URL
```

---

## Environment / Config

| 변수 | 설명 |
|------|------|
| `OPENAI_API_KEY` | OpenAI API 키 |
| `NEXT_PUBLIC_KAKAO_APP_KEY` | 카카오 JS 앱 키 |
| `NEXT_PUBLIC_COUPANG_PARTNER_ID` | 쿠팡 파트너 ID (`AF2316808`) |
| `COUPANG_ACCESS_KEY` | 쿠팡 API Access Key (UUID) |
| `COUPANG_SECRET_KEY` | 쿠팡 API Secret Key (hex 40자) |
| `NEXT_PUBLIC_BASE_URL` | 배포 도메인 |
| `KV_REST_API_URL` | Upstash Redis REST URL (Rate Limiting) |
| `KV_REST_API_TOKEN` | Upstash Redis REST Token |

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

---

## 다음 작업 (TASK.md 기준)

| 우선순위 | 작업 | 담당 |
|----------|------|------|
| P0-1 | 커뮤니티 배포 실행 (클리앙/뽐뿌/오카) | 운영 |
| P0-5 | 쿠팡 파트너스 대시보드 주 2회 체크 루틴 수립 | 운영 |
| P0-6 | result 페이지 모바일 fold 확인 (NudgeCTA 노출) | Dev |

**보류/차단된 작업 (재평가 조건: 유입 200명 달성 후)**
- 11번가/G마켓/SSG 직접 연동
- 실시간 크롤링 가격 비교 테이블
- 카카오채널 개설 / 이메일 캡처

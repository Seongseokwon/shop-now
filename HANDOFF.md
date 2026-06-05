# Project Hand-off: shopping-gpt

**Last updated:** 2026-06-05  
**Branch:** master  
**Last commit:** `70389c5` — chore: add ESLint and Prettier configuration

---

## What This Project Is

**Shopping GPT** — a Korean-language AI shopping assistant built with Next.js 16 + OpenAI. Mobile-first, single-page-app feel. Three core features:

| Route | Feature | Description |
|-------|---------|-------------|
| `/gift` | 선물 추천기 | Gift recommendation: enter relationship, age, budget → GPT returns top 3 gifts |
| `/decide` | 살까말까 결정기 | Buy-or-not analyzer: enter product name → GPT gives cold analysis |
| `/budget` | 가성비 레이더 | Best-value finder: enter category + budget → GPT finds top value picks |

All three pages call Coupang partner links via a helper in `lib/coupang.ts`.

---

## Tech Stack

- **Framework:** Next.js 16.2.7 (App Router) — note this is a newer version with breaking changes; see `node_modules/next/dist/docs/` for current API docs
- **UI:** Tailwind CSS v4 (PostCSS plugin approach, no config file)
- **AI:** OpenAI SDK v6 (`openai` package) — client lazy-initialized to avoid build-time crash
- **Testing:** Playwright (e2e tests in `e2e/`)
- **Linting:** ESLint 9 + `eslint-config-next` flat config (`eslint.config.mjs`)
- **Formatting:** Prettier 3 (`.prettierrc`)
- **Deploy:** Vercel (`npm run deploy` → `vercel --prod`)

---

## Project Structure

```
app/
  layout.tsx          — root layout, Navbar, forced light color-scheme
  page.tsx            — landing/home page with Hero + feature cards
  gift/
    layout.tsx
    page.tsx          — gift recommendation form + results
  decide/
    layout.tsx
    page.tsx          — buy-or-not form + results
  budget/
    layout.tsx
    page.tsx          — budget/value form + results
  opengraph-image.tsx — OG image (SVG-based, recently fixed)

components/
  Logo.tsx
  Navbar.tsx          — segmented control style, active state
  LoadingSpinner.tsx
  CoupangButton.tsx
  KakaoShareButton.tsx
  PillGroup.tsx       — single-select pill button group
  MultiPillGroup.tsx  — multi-select pill button group

lib/
  openai.ts           — lazy OpenAI client init
  coupang.ts          — Coupang partner link helper
```

---

## Recent Work (last session, 2026-06-05)

### UX overhaul (commit `7334593`)
- Replaced all `<select>` dropdowns with pill button groups (`PillGroup`, `MultiPillGroup`)
- Redesigned Hero section: strong headline, single primary CTA, trust signals
- Navbar upgraded to segmented control with clear active state
- Fixed dark mode forcing light `color-scheme`
- Improved typography: `font-black`, `tracking-tight`
- Hover lift + shadow on feature cards

### OG image fixes (commits `a5c0adb`, `a7ca21e`, `815c316`)
- Replaced emoji in OG image with SVG icon
- Fixed text overlap in OG image layout
- Fixed broken checkmark icons (was using emoji `✓`, switched to styled spans)

### Dev tooling (commits `68306bd`, `70389c5`)
- Added `.env.sample` — all required env vars documented with placeholder values
- Added ESLint + Prettier: `eslint.config.mjs` (Next.js 16 flat config, TypeScript, prettier rules)
- `npm run lint` → `eslint .` (Next.js 16에서 `next lint` 제거됨)
- `npm run format` → `prettier --write .`
- Prettier applied to all source files (17 files formatted)

---

## Known State / Pending Work

**핵심 미완료 작업:** GPT 생성 가격 → 쿠팡 API 실시간 가격으로 교체 (자세한 내용은 `TASK.md`, 배경은 `TODO.md`)

### 작업 순서 (TASK.md 기준)

| 순서 | 작업 | 상태 |
|------|------|------|
| 1 | GPT 프롬프트에서 `price` 제거, `keyword`/`category` 추가 | 미완료 |
| 2 | Frontend 가격 영역 임시 제거 (API 연동 전 신뢰도 확보) | 미완료 |
| 3 | 쿠팡 Partners API 연동 (`searchCoupang` 함수 구현) | 미완료 — API Key 필요 |
| 4 | Frontend 실제 가격/이미지/평점 표시 | 미완료 — 3번 완료 후 |

- OG image is functional and deployed
- Codebase is clean (lint: 0 errors, 1 warning in e2e test unused var)

---

## Environment / Config

- `.env.sample` — 필요한 모든 환경변수 키와 설명 포함
- **OPENAI_API_KEY** — Vercel env vars + `.env.local`에 설정 필요
- **NEXT_PUBLIC_KAKAO_APP_KEY** — Kakao Developers에서 발급
- **NEXT_PUBLIC_COUPANG_PARTNER_ID** — Coupang Partners에서 발급
- **NEXT_PUBLIC_BASE_URL** — 배포 도메인 (예: `https://your-domain.vercel.app`)
- Local dev: `npm run dev` → `http://localhost:3000`
- Production: deployed on Vercel

---

## How to Pick Up

1. `git pull origin master`
2. `cp .env.sample .env.local` 후 실제 키 값 채우기
3. `npm install`
4. `npm run dev` → `http://localhost:3000`
5. Core pages to test: `/`, `/gift`, `/decide`, `/budget`
6. `npm run lint` — ESLint 검사
7. `npm run format` — Prettier 포맷 적용

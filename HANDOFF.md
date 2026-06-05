# Project Hand-off: shopping-gpt

**Last updated:** 2026-06-05  
**Branch:** master  
**Last commit:** `815c316` — fix OG image text overlap and broken checkmark icons

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
- **Testing:** Playwright (e2e tests in `tests/` or similar)
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

---

## Known State / Pending Work

- **No open TODOs** found in last session — all requested changes were completed and committed
- OG image is functional and deployed
- Codebase is clean (`git status` was clean at handoff)

---

## Environment / Config

- **OPENAI_API_KEY** — must be set in Vercel env vars (and `.env.local` for local dev)
- **Coupang partner ID** — embedded in `lib/coupang.ts`
- Local dev: `npm run dev` → `http://localhost:3000`
- Production: deployed on Vercel

---

## How to Pick Up

1. `git pull origin master`
2. `cp .env.local.example .env.local` (if exists) or set `OPENAI_API_KEY` manually
3. `npm run dev`
4. Core pages to test: `/`, `/gift`, `/decide`, `/budget`

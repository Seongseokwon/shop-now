# TASK.md

> 마지막 업데이트: 2026-06-08
> Multi-Agent Service Validation 결과 반영 (7차 재정렬)
> 핵심 발견: 유입이 0이다. 개발은 충분하다. 지금은 배포와 측정이 일이다.
> Rate limit in-memory 구조 — Vercel serverless 환경에서 실질적 보호 없음 (긴급 수정 필요)

---

## Critical Problems

현재 서비스의 가장 위험한 문제 TOP 3

1. **유입이 0이다.** P0~P3 개발을 모두 완료했지만 실제 사용자가 없다. 공유 루프, 직링 카드, 배지 시스템 — 모두 데이터 없는 최적화다. 커뮤니티 배포가 단 한 번도 실행되지 않았다.
2. **Rate limit이 in-memory `Map`이라 Vercel serverless에서 무의미하다.** 인스턴스 복수 환경에서 각각 별도 Map을 가지므로 바이럴 발생 시 비용 보호가 없다. 배포 전에 반드시 수정해야 한다.
3. **파트너스 전환율이 0인지, 클릭이라도 있는지 모른다.** 대시보드 확인 루틴이 수립되지 않았다. 수익 구조가 작동하는지 아직 모른다.

---

## One Sharp Hook

사용자가 친구에게 공유하고 싶어질 핵심 포인트 1개

- **Hook:** "나 AI한테 [에어팟 프로 2세대] 사지 말라고 혼났다 — 289,000원 절약 🎉"
- **Why People Share:** 절약 자랑 + AI에게 혼남이라는 웃긴 상황 = 공감 + 유머. "참으세요" 결과에 절약 금액이 붙으면 SNS 포스팅/카톡 전송 동기가 생긴다.
- **Expected Emotion:** 웃김 + 공감 ("나도 저런 고민 있는데") + 자기 절제 자랑
- **Risk:** 가격 입력을 안 하면 절약 금액이 없어 훅이 약해진다. 가격 입력을 필수로 유도하거나 기본값 제안이 필요할 수 있다.

---

## ✅ 완료된 작업

- [x] GPT 응답에서 `price` 필드 제거, `keyword` / `category` 필드 추가
- [x] 쿠팡 Partners API 연동 (HMAC 서명, 실시간 가격/이미지/평점/리뷰 수)
- [x] Frontend 실시간 최저가 표시 교체
- [x] 상품 이미지, 평점, 리뷰 수 표시
- [x] KakaoShare 버튼 구현
- [x] OG 이미지 / 메타데이터 설정
- [x] 살까말까 결정기 구현
- [x] 가성비 레이더 구현
- [x] Analytics 설치 (Vercel Analytics)
- [x] 동적 OG 이미지 생성 API (`app/api/og/route.tsx`)
- [x] 결과 공유 URL 시스템 (`lib/resultUrl.ts`, `app/result/page.tsx`)
- [x] JudgmentCard / ScoreGauge / VerdictBadge / ShareActions 컴포넌트
- [x] 대안 상품 쿠팡 실시간 조회 연동
- [x] 판정 히스토리 (localStorage)
- [x] 배지 시스템 5종 (localStorage, 신규 획득 모달 팝업)
- [x] NudgeCTA 컴포넌트 — 공유 랜딩 인라인 폼 (스크롤 없이 입력란 노출)
- [x] 판정별 공유 문구 — "참으세요" 결과 시 절약 금액 포함
- [x] API Route Rate Limiting — IP 기반, 분당 10회 (구현됨, in-memory 구조 문제 있음)
- [x] "사세요" 판정 시 해당 상품 쿠팡 직링 카드

---

## Immediate P0 Tasks

| Priority | Task | Why It Matters | ICE (I/C/E) | Viral Multiplier | Owner | Status |
|---|---|---|---|---|---|---|
| P0-1 | **Rate Limit → Upstash Redis 교체** (`lib/rateLimit.ts`) | in-memory Map은 서버리스 멀티 인스턴스에서 무의미. 바이럴 시 비용 폭발. | 9/9/9 | — | Dev | ✅ 완료 (2026-06-08) |
| P0-2 | **커뮤니티 배포 실행** (클리앙/뽐뿌/오카) | 유입이 0이다. 개발은 멈추고 이것 하나를 해야 한다. 오늘 실행 가능. | 10/8/10 | 높음 (자발적 공유 결과글) | 운영 | 미실행 |
| P0-3 | **쿠팡 파트너스 대시보드 주 2회 체크 루틴** | 클릭/구매 데이터 없으면 수익 구조가 작동하는지 모른다. | 8/10/10 | — | 운영 | 미수립 |
| P0-4 | **result 페이지 fold 검증** — NudgeCTA가 스크롤 없이 보이는지 실기기 확인 | 공유 루프 완성 기준이 "한 화면에 결과+입력란"인데 실제로 그런지 모른다. | 7/10/9 | 직결 | Dev | 미확인 |

---

## Fast Validation Experiments

| Experiment | Success Metric | Failure Signal | Max Time Budget |
|---|---|---|---|
| 클리앙/뽐뿌 결과 공유글 1개 | 클릭 50회 이상, 댓글 반응 | 클릭 10 미만, 무반응 | 오늘 |
| "참으세요" 공유 문구 실전 테스트 | 카카오 공유 후 링크 클릭 발생 | 공유 링크 클릭 0 | 3일 |
| 쿠팡 파트너스 클릭 측정 | 배포 후 3일 내 클릭 10건 | 방문은 있는데 클릭 0 | 1주일 |
| 가격 입력 유도 문구 테스트 | 가격 입력률 증가 | 입력률 변화 없음 | 1주일 |

---

## Next 7 Days Action Items

- [ ] **오늘:** `lib/rateLimit.ts` → Vercel KV (`@vercel/kv`) 기반으로 교체
- [ ] **오늘:** 클리앙/뽐뿌에 "나 AI한테 [상품] 사지 말라고 혼났다" 형식 결과 공유글 게시
- [ ] **내일:** result 페이지 실기기(모바일) 확인 — NudgeCTA fold 내 노출 여부
- [ ] **3일 내:** 쿠팡 파트너스 대시보드 최초 확인 후 클릭/전환 수 기록
- [ ] **이번 주:** 인스타/틱톡 숏폼 1개 제작 — "AI가 에어팟 사지 말라고 했다" 포맷
- [ ] **이번 주:** Kill/Go 기준표 기준으로 현재 지표 평가

---

## Features To Delay

| Feature | Why Delay | Original Source |
|---|---|---|
| 카카오채널 개설 | 재참여 인프라는 유입 200명 이후 의미 있음. 지금은 유입 채널 자체가 없음. | 우선순위 4 |
| 이메일 캡처 | 카카오채널과 동일. 리스트 빌딩은 유입 증명 후. | 우선순위 4 |
| SEO 정적 페이지 | 장기 전략. 지금 당장의 생존과 무관. | 우선순위 6 |
| next/image 교체 (`<img>` → next/image) | 성능 개선이지만 바이럴 실험 전에 우선순위 낮음. 유입 증명 후. | Frontend 발견 |

---

## Features To Remove

| Feature | Why Remove | Related Agent |
|---|---|---|
| 배지 시스템 추가 확장 | 5종으로 충분. 재방문 효과 미측정 상태에서 추가 배지 개발은 낭비. | Reality Checker |
| 상품 추천기 / 가성비 레이더 신규 기능 추가 | 살까말까 대비 사용 데이터 없음. 바이럴 핵심도 살까말까에 있음. 두 기능 유지보수만 하고 신규 개발 금지. | Reality Checker |
| 가격 입력 필수 전환 (즉시) | 현재 UX 변경 없이 먼저 실험. 필수 전환은 이탈 증가 리스크. 공유 문구 효과 측정 후 결정. | UI/UX Agent |

---

## Kill / Go 기준

| 상황 | 판단 |
|------|------|
| 200 실방문 후 파트너스 클릭 0건 | 전환 경로 진단 (링크 품질, UX, 신뢰도 문제) |
| 파트너스 클릭 있고 구매 1-2건 확인 | Go — 퍼널 최적화 및 기능 확장 시작 |
| 살까말까 결과 자발적 공유 사례 발견 | 바이럴 루프 존재 확인 → 공유 루프 집중 최적화 |
| 200 방문 후 살까말까만 사용, 나머지 무시 | 상품 추천기·가성비 레이더 개발 중단 검토 |
| "참으세요" 판정 비율 70%+ | 수익화 구조 재검토 — 구독 또는 직접 링크 모델로 전환 |
| 커뮤니티 배포 후 클릭 10 미만 | 공유 문구 / 결과 화면 자체 재검토 |

---

## Assumptions & Confidence Levels

| Topic | Assumption | Confidence |
|---|---|---|
| 살까말까 공유 동기 | "참으세요" + 절약 금액이 공유 동기를 만든다 | [Low Confidence] — 실제 공유 사례 없음 |
| 커뮤니티 유입 가능성 | 클리앙/뽐뿌 결과 공유글이 클릭을 만든다 | [Low Confidence] — 포스트 품질/타이밍 의존 |
| 파트너스 전환율 | 쿠팡 직링이 클릭→구매로 이어진다 | [Low Confidence] — 데이터 없음 |
| Rate limit 효과 | in-memory 교체 후 비용 보호가 작동한다 | [High Confidence] — Vercel KV는 단일 Redis 인스턴스 |
| 3개 기능 병렬 운영 | 살까말까 외 두 기능이 유입에 기여한다 | [Low Confidence] — 사용 데이터 없음 |

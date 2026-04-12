# Model & Effort 가이드

Claude Code 세션에서 스킬 또는 패키지 작업 시 권장하는 모델과 effort 조합.

---

## TL;DR 요약

| 대상                             | 모델         | Effort   |
| -------------------------------- | ------------ | -------- |
| `/flow-start`                    | sonnet-4-6   | high     |
| `/flow-work`                     | **opus-4-6** | **high** |
| `/flow-close`                    | sonnet-4-6   | low      |
| `/flow-check` (optional)         | sonnet-4-6   | normal   |
| `packages/domain`                | **opus-4-6** | **high** |
| `packages/infra`                 | **opus-4-6** | **high** |
| `apps/cli` — TUI 패널/뷰         | **opus-4-6** | **high** |
| `packages/application`           | sonnet-4-6   | high     |
| `apps/cli` — commands/presenters | sonnet-4-6   | normal   |
| `packages/config`                | sonnet-4-6   | normal   |
| `packages/shared`                | sonnet-4-6   | normal   |

---

## 다운그레이드 기준 (opus → sonnet)

다음 조건을 모두 충족하면 `/flow-work` 배치에서도 sonnet-4-6을 써도 된다:

1. 변경 대상이 단일 파일, 단일 함수 수준으로 좁다
2. 도메인 설계 결정(엔티티 경계, VO 불변식)이 포함되지 않는다
3. 외부 시스템 연동(파싱, DB 쿼리, 파일 I/O)이 포함되지 않는다
4. 기존 패턴을 단순 반복하는 작업이다 (새로운 추론 불필요)

---

## 스킬별 상세

### `/flow-start` — sonnet-4-6 + high

작업 후보 추천(kick-off)과 세션 계획 고정(session-start)을 한 번에 처리.
목표·범위·stop line 결정이 틀리면 배치 전체가 낭비되므로 effort는 high.
복잡한 추론보다 구조화된 판단이 필요해 sonnet으로 충분.

### `/flow-work` — opus-4-6 + high

실제 구현 배치. 기본값은 opus + high.

- 도메인 설계 오류는 downstream 전체 수정으로 이어짐
- 인프라 파싱 버그는 런타임에서야 발견됨
- 예외: 순수 docs 수정·리팩터링·타입 추가처럼 범위가 명확히 좁은 배치는 sonnet-4-6도 가능

### `/flow-close` — sonnet-4-6 + low

docs-sync(필요 시)와 handoff 정리를 한 번에 처리.
코드·결정의 문서 반영은 기계적 작업, handoff는 요약·조직화 중심.
복잡한 추론 없이 빠르게 끝내는 게 목적.

### `/flow-check` (optional) — sonnet-4-6 + normal

flow-start 계획과 현재 상태 대조, 남은 작업 순서/범위 재조정 제안.
작업 3개 이상이거나 예상 밖 상황이 생겼을 때만 사용.
체크포인트 특성상 normal effort로 충분.

---

## 패키지·앱별 상세

### opus-4-6 + high effort (설계 실수 비용이 큰 모듈)

**`packages/domain`**
엔티티 경계와 VO 불변식 결정이 application·infra 전체에 전파됨.
`session-health`, `stuck-detection`, `token-aggregation` 서비스는 복잡한 도메인 로직을 담을 예정.
설계 오류는 downstream 전체 수정으로 이어지므로 extended thinking 권장.

**`packages/infra`**

- `claude-event-parser`: 비공개 Claude Code 로그 포맷 해석 필요
- SQLite 저장소: 동시성·트랜잭션 처리
- 어댑터 실패 격리: 한 어댑터 오류가 앱 전체 종료로 이어지지 않아야 함
  버그가 런타임에서야 발견되기 때문에 구현 시 신중함이 필수.

**`apps/cli` — TUI 패널 / 뷰**
상태 관리 + 렌더링 + 키 이벤트 핸들링이 얽혀 복잡.
9개 패널 + 5개 뷰의 레이아웃 계산, 리렌더링 트리거 조건 등은 오류 추적이 어렵다.

---

### sonnet-4-6 + high effort (중요하나 패턴이 일정한 모듈)

**`packages/application`**
유스케이스는 도메인을 조합하는 오케스트레이션 계층.
포트·매퍼는 패턴이 일정하지만 유스케이스 로직에는 비즈니스 플로우 판단이 있어 effort는 high.
복잡한 use case(`detect-alerts`, `build-session-summary`)는 opus-4-6로 올려도 무방.

---

### sonnet-4-6 + normal effort (패턴이 명확하고 범위가 좁은 모듈)

**`apps/cli` — commands / presenters / bootstrap**
Commander.js 바인딩, ViewModel 변환, 신호 핸들러는 패턴이 명확하고 범위가 좁다.

**`packages/config`**
타입 정의 2개 + 설정 해석 함수 1개. 논리가 단순.
단순 타입 추가라면 haiku-4-5도 가능.

**`packages/shared`**
포맷팅 유틸, 상수, 에러 타입. 순수 함수 위주, 의존성 없음.
반복적인 유틸 추가 작업은 haiku-4-5도 가능.

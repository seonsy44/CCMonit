---
id: OPS-CLAUDE-WORKFLOW
title: "Claude Code 세션 운영 워크플로우"
type: guide
status: active
owners: [operations, docs-steward]
updated: 2026-04-12 (scratch 최상위 handoff 파일 제거, devs/{slug}/ 단일화)
tags: [claude-code, workflow, practical]
links:
  - docs-operations.md
  - ../README.md
  - ../log.md
---

# Claude Code 세션 운영 워크플로우

이 문서는 **세레모니 최소화, 작업 밀도 최대화**를 목표로 한 Claude Code 세션 실행 순서서다.

이 문서가 저장소의 workflow source of truth 이다.
- 사람용 루트 진입: `README.md`
- Claude Code용 루트 진입: `CLAUDE.md`
- `.claude/WORKFLOW.md`는 짧은 포인터다.

## 1. 핵심 원칙

- 한 세션에 개발건(dev)은 1개다. 개발건 안에서 스프린트(sprint)는 2~3개를 처리한다.
- 스킬 수를 최소화한다.
- `dev-kickoff`는 optional. 어떤 개발건을 할지 불분명할 때만 쓴다. `dev-list.md`에 개발건 후보를 추가한다.
- `dev-open`이 개발건을 시작하고 이번 세션 스프린트 계획을 고정한다. **`dev-list.md`에 있는 개발건만 시작 가능.**
- `dev-sprint`이 스프린트 1개를 처음부터 끝까지 실행한다. N번 반복한다.
- `dev-close`가 문서 반영(필요 시)과 handoff 정리, dev-list 정리를 함께 처리한다.
- `dev-check`는 optional. 스프린트 3개 이상이거나 중간 재조정이 필요할 때만 쓴다.
- 개발건마다 독립된 scratch 네임스페이스를 사용한다: `.claude/scratch/devs/{slug}/`
- 프로젝트 사실과 기준의 source of truth는 항상 `docs/`다.
- 세레모니(읽기/계획/정리) 대비 실제 작업 비율이 합리적이어야 한다.

## 1-1. 세션 범위 판단 기준

세션 범위는 **불확실성**과 **패턴 반복도** 두 축으로 판단한다. 스프린트별로 개별 판단한다.

|  | 패턴 반복도 높음 | 패턴 반복도 낮음 |
|--|---|---|
| **불확실성 낮음** | **넓은 범위**: 동일 패턴 3-5개 일괄 처리 | **보통 범위**: 관련 2-3개 처리 |
| **불확실성 높음** | **보통 범위**: 패턴 수립 후 1-2개 추가 | **좁은 범위**: 1개 신중히 처리 |

- **불확실성**: 설계 결정이 남아 있으면 높음. 기존 결정을 따르기만 하면 낮음.
- **패턴 반복도**: 동일 구조의 산출물이 이미 1개 이상 완성되어 있으면 높음.
- **실용적 상한**: 스프린트 2~3개, 커밋 2~3개, 변경 파일 10개 이내.

예시 (현재 프로젝트):
- 도메인 엔티티 타입 정의 (SessionEntity → AgentEntity → ... 패턴 확립됨): 넓은 범위 — 남은 엔티티 3개를 한 세션에 일괄 처리.
- 도메인 서비스 구현 (각 서비스마다 고유 로직): 좁은 범위 — 서비스 1개씩 처리.

## 1-2. 개발건 파라미터와 scratch 네임스페이스

`dev-open`은 반드시 개발건 slug를 파라미터로 받는다. slug는 `dev-list.md`에 있어야 한다.

| 입력 | scratch 경로 |
|------|-------------|
| `/dev-open domain-services` | `.claude/scratch/devs/domain-services/` |
| `/dev-open tui-first-screen` | `.claude/scratch/devs/tui-first-screen/` |
| `/dev-open docs-health` | `.claude/scratch/devs/docs-health/` |

**규칙:**
- `dev-open`은 항상 `.claude/scratch/devs/{slug}/` 경로를 사용한다.
- 해당 경로가 없으면 신규 개발건으로 취급하고 빈 상태에서 시작한다.
- `notes.md`는 항상 `.claude/scratch/notes.md` 하나만 사용한다 (개발건 무관 공통).
- `dev-close`는 반드시 `dev-open`이 사용한 scratch 경로에만 기록한다. 혼용 금지.
- `dev-close`는 완결된 named dev의 `devs/{slug}/` 폴더를 삭제한다. 후속 스프린트가 있는 dev만 보존한다.

**dev-list.md:**
- 위치: `.claude/scratch/dev-list.md` (개발건 무관 공통, `notes.md`와 같은 레벨)
- `dev-kickoff`가 개발건 후보를 추가하고, `dev-close`가 완료된 개발건을 삭제한다.
- `dev-open`은 dev-list의 slug를 찾아 "예상 스프린트"를 스프린트 계획의 기반으로 사용한다.

**scratch 구조:**
```
.claude/scratch/
├── notes.md               # 공통 (개발건 무관)
├── dev-list.md            # 개발건 목록 (dev-kickoff 추가, dev-close 삭제)
└── devs/
    ├── {slug}/
    │   ├── worklog.md
    │   ├── next-prompt.md
    │   └── open-questions.md
    └── _adhoc/            # dev-open 없이 dev-sprint 직행 시
        ├── worklog.md
        ├── next-prompt.md
        └── open-questions.md
```

## 2. 먼저 읽는 순서

1. `CLAUDE.md`
2. `.claude/README.md`
3. `docs/index.md`
4. `docs/_system/DOCS_SCHEMA.md`
5. `docs/registry/page-index.md`
6. `docs/operations/claude-code-session-workflow.md`
7. `.claude/context/*.md`
8. 필요 시 `.claude/skills/_shared/*.md`
9. `.claude/scratch/*`

## 3. 현재 사용 스킬

### `dev-kickoff [true?]` (optional)
프로젝트 상태를 분석하여 개발건 후보를 도출하고 `.claude/scratch/dev-list.md`에 추가한다.
어떤 개발건을 할지 불분명할 때만 쓴다. `true` 파라미터 시 `.claude/scratch/user-req.md` 요구사항을 반영한다. `dev-open` 전 단계.

### `dev-open {slug}`
dev-list에 있는 개발건을 시작하고 이번 세션 스프린트 계획을 고정한다.
**반드시 파라미터 필요. dev-list에 없는 slug는 시작 불가.**

### `dev-sprint`
스프린트 1개를 처음부터 끝까지 실행하는 메인 스킬.
완료 후 커밋 메시지 한 줄을 추천한다. N번 반복 실행한다.

### `dev-close`
개발건 종료 스킬. 필요 시 docs-sync를 수행하고, dev-list에서 완료된 개발건을 삭제하며, 다음 세션용 handoff를 정리한다.

### `dev-check` (optional)
`dev-sprint` 사이 체크포인트. 스프린트 3개 이상이거나 예상 밖 상황이 생겼을 때만 쓴다.

## 4. 기본 워크플로우

### A. 표준 흐름 (dev-kickoff + 2~3개 스프린트)

```text
┌───────────────┐
│  dev-kickoff  │  개발건 후보 도출 + dev-list 추가
└──────┬────────┘
       v
사용자가 dev-list에서 개발건 선택
       v
┌──────────────┐
│  dev-open    │  스프린트 계획 고정 (dev-list 기반)
└──────┬───────┘
       v
┌──────────────┐
│  dev-sprint  │  스프린트 1 실행 + 커밋 메시지 추천
└──────┬───────┘
       v
┌──────────────┐
│  dev-sprint  │  스프린트 2 실행 + 커밋 메시지 추천
└──────┬───────┘
       v (스프린트 3이 있으면 반복)
┌──────────────┐
│  dev-close   │  docs-sync(optional) + handoff + dev-list 정리
└──────────────┘
```

### B. 체크포인트가 필요할 때 (스프린트 3개 이상)

```text
┌──────────────┐
│  dev-open    │
└──────┬───────┘
       v
┌──────────────┐
│  dev-sprint  │  스프린트 1
└──────┬───────┘
       v
┌──────────────┐
│  dev-check   │  optional: 진행 상태 점검, 계획 재조정
└──────┬───────┘
       v
┌──────────────┐
│  dev-sprint  │  스프린트 2
└──────┬───────┘
       v
┌──────────────┐
│  dev-close   │
└──────────────┘
```

### C. 스프린트가 이미 명확할 때 (빠른 실행)

> scratch 경로: `.claude/scratch/devs/_adhoc/` (dev-close가 처리 후 내용을 비운다)

```text
┌──────────────┐
│  dev-sprint  │  스프린트 1 (인자로 직접 지정)
└──────┬───────┘
       v
┌──────────────┐
│  dev-close   │
└──────────────┘
```

### D. 개발건이 불분명할 때 (전체 세레모니)

```text
┌───────────────┐
│  dev-kickoff  │  개발건 후보 도출 + dev-list 추가
└──────┬────────┘
       v
사용자가 dev-list에서 개발건 선택
       v
┌──────────────┐
│  dev-open    │  선택한 개발건 기반 스프린트 계획 고정
└──────┬───────┘
       v
┌──────────────┐
│  dev-sprint  │  × N
└──────┬───────┘
       v
┌──────────────┐
│  dev-close   │  handoff + dev-list에서 개발건 제거
└──────────────┘
```

## 5. 스킬별 의미와 산출물

### `dev-kickoff` (optional)

읽기 대상:
- `docs/operations/claude-code-session-workflow.md`
- `.claude/context/*`
- `.claude/scratch/dev-list.md`, `.claude/scratch/notes.md`
- `.claude/scratch/devs/` 하위 디렉토리 + 각 진행 중 dev의 `next-prompt.md`

산출물:
- `.claude/scratch/dev-list.md`에 개발건 후보 추가
- 채팅 응답: 프로젝트 상태 요약 + 개발건 후보 table + 추천

### `dev-open`

읽기 대상:
- `docs/operations/claude-code-session-workflow.md`
- `.claude/context/*`
- `.claude/scratch/dev-list.md` (필수)
- 결정된 scratch 경로의 기존 파일들

산출물:
- 스프린트 목록 (2~3개)
- 세션 stop line
- `dev-sprint` 실행 순서

### `dev-sprint`

역할:
- 코드 또는 문서의 실제 변경 수행
- 필요 시 범위 재조정
- 변경 파일 목록, 남은 리스크 요약
- 커밋 메시지 한 줄 추천

권장 사용:
- argument에 이번 스프린트 대상을 짧게 준다.
- 예: `domain agent entity`, `README cleanup`, `docs link repair`

### `dev-close`

역할:
- docs-sync: source of truth가 바뀌었을 때만 수행
- handoff: `worklog.md`, `next-prompt.md`, `open-questions.md` 갱신
- dev-list 정리: 완료된 개발건을 dev-list에서 삭제

기본 산출물:
- 이번 세션에서 끝낸 것
- 아직 안 끝난 것
- 다음 세션 첫 스프린트
- 열린 질문
- dev-list에서 제거한 개발건 (해당 시)

### `dev-check` (optional)

역할:
- `dev-open` 계획과 현재 상태 대조
- 남은 스프린트 순서/범위 재조정 제안

## 6. 권장 운영 규칙

### 가장 자주 쓰는 루프

```text
dev-kickoff → dev-open → dev-sprint → dev-sprint → dev-close
```

### 중간 재조정이 필요한 날

```text
dev-kickoff → dev-open → dev-sprint → dev-check → dev-sprint → dev-close
```

### 스프린트가 명확한 날

```text
dev-sprint → dev-close
```

### 무엇을 할지 모를 때

```text
dev-kickoff → (사용자 선택) → dev-open → dev-sprint × N → dev-close
```

## 7. 자주 생기는 혼동 정리

### `dev-kickoff`와 `dev-open`의 차이는?

`dev-kickoff`는 "어떤 개발건을 할까"를 탐색한다. `dev-open`은 "이 개발건에서 어떤 스프린트를 할까"를 결정한다.
`dev-kickoff`는 선택적이다. 이미 dev-list에 개발건이 있으면 바로 `dev-open`으로 간다.

### `dev-open`에 파라미터를 꼭 줘야 하나?

그렇다. `dev-open`은 반드시 개발건 slug를 파라미터로 받는다. slug가 없으면 실행되지 않는다.
slug는 `dev-list.md`에 있어야 한다. 없으면 `/dev-kickoff`로 먼저 도출한다.

### dev-list.md는 언제 정리되나?

`dev-kickoff`가 개발건을 추가하고, `dev-close`가 완료된 개발건을 삭제한다.
dev-list는 "아직 시작 안 했거나 진행 중인 개발건" 목록을 유지한다.

### named 개발건의 scratch가 없으면?

신규 개발건으로 취급하고 빈 상태에서 시작한다. `dev-close`가 새 경로에 handoff를 생성한다.

### 개발건 파라미터는 어떻게 정하나?

`dev-list.md`의 slug 컬럼에 있는 값을 그대로 쓴다.
slug는 `dev-kickoff`가 영문 kebab-case로 자동 결정한다.

### `dev-open`에서 스프린트를 몇 개 잡아야 하나?

불확실성과 패턴 반복도를 보고 판단한다. 보통 2~3개. 불확실성이 높은 스프린트가 포함되면 그 스프린트만 단독으로 처리한다.

### `dev-sprint`를 몇 번 실행하나?

`dev-open`에서 확정한 스프린트 수만큼. 각 실행마다 커밋 메시지를 추천받고 커밋 여부를 결정한다.

### `dev-close`의 docs-sync는 항상 필요한가?

아니다. 코드만 바뀌고 규칙/구조는 그대로라면 건너뛴다.

### `dev-check`는 꼭 써야 하나?

아니다. 스프린트 2개 이하면 불필요하다.

## 8. 세션 종료 체크리스트

- 이번 세션 스프린트를 모두 끝냈는가?
- 범위가 새지 않았는가?
- 완결된 dev의 scratch가 정리됐는가? 후속 스프린트가 있는 dev만 남아있는가?
- docs 또는 context로 승격해야 할 판단이 있었는가?
- 다음 세션 첫 스프린트가 한 줄로 적혀 있는가?
- 완료된 개발건이 dev-list에서 제거됐는가?

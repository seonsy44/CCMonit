---
id: OPS-CLAUDE-WORKFLOW
title: "Claude Code 세션 운영 워크플로우"
type: guide
status: active
owners: [operations, docs-steward]
updated: 2026-04-12
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

- 한 세션에 흐름(flow)은 1개다. 흐름 안에서 작업(task)은 2~3개를 처리한다.
- 스킬 수를 최소화한다.
- `flow-start`가 작업 후보를 추천하고 이번 세션 계획을 고정한다.
- `flow-work`가 작업 1개를 처음부터 끝까지 실행한다. N번 반복한다.
- `flow-close`가 문서 반영(필요 시)과 handoff 정리를 함께 처리한다.
- `flow-check`는 optional. 작업 3개 이상이거나 중간 재조정이 필요할 때만 쓴다.
- 프로젝트 사실과 기준의 source of truth는 항상 `docs/`다.
- 세레모니(읽기/계획/정리) 대비 실제 작업 비율이 합리적이어야 한다.

## 1-1. 세션 범위 판단 기준

세션 범위는 **불확실성**과 **패턴 반복도** 두 축으로 판단한다. 작업별로 개별 판단한다.

|  | 패턴 반복도 높음 | 패턴 반복도 낮음 |
|--|---|---|
| **불확실성 낮음** | **넓은 범위**: 동일 패턴 3-5개 일괄 처리 | **보통 범위**: 관련 2-3개 처리 |
| **불확실성 높음** | **보통 범위**: 패턴 수립 후 1-2개 추가 | **좁은 범위**: 1개 신중히 처리 |

- **불확실성**: 설계 결정이 남아 있으면 높음. 기존 결정을 따르기만 하면 낮음.
- **패턴 반복도**: 동일 구조의 산출물이 이미 1개 이상 완성되어 있으면 높음.
- **실용적 상한**: 작업 2~3개, 커밋 2~3개, 변경 파일 10개 이내.

예시 (현재 프로젝트):
- 도메인 엔티티 타입 정의 (SessionEntity → AgentEntity → ... 패턴 확립됨): 넓은 범위 — 남은 엔티티 3개를 한 세션에 일괄 처리.
- 도메인 서비스 구현 (각 서비스마다 고유 로직): 좁은 범위 — 서비스 1개씩 처리.

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

### `flow-start`
작업 후보를 추천하고 이번 세션 계획을 고정한다.  
kick-off(추천)와 session-start(계획 고정)를 한 번에 처리한다.

### `flow-work`
작업 1개를 처음부터 끝까지 실행하는 메인 스킬.  
완료 후 커밋 메시지 한 줄을 추천한다. N번 반복 실행한다.

### `flow-close`
세션 종료 스킬. 필요 시 docs-sync를 수행하고, 다음 세션용 handoff를 정리한다.

### `flow-check` (optional)
flow-work 사이 체크포인트. 작업 3개 이상이거나 예상 밖 상황이 생겼을 때만 쓴다.

## 4. 기본 워크플로우

### A. 기본 흐름 (2~3개 작업)

```text
┌──────────────┐
│  flow-start  │  작업 후보 추천 + 세션 계획 고정
└──────┬───────┘
       v
┌──────────────┐
│  flow-work   │  작업 1 실행 + 커밋 메시지 추천
└──────┬───────┘
       v
┌──────────────┐
│  flow-work   │  작업 2 실행 + 커밋 메시지 추천
└──────┬───────┘
       v (작업 3이 있으면 반복)
┌──────────────┐
│  flow-close  │  docs-sync(optional) + handoff
└──────────────┘
```

### B. 체크포인트가 필요할 때 (작업 3개 이상)

```text
┌──────────────┐
│  flow-start  │
└──────┬───────┘
       v
┌──────────────┐
│  flow-work   │  작업 1
└──────┬───────┘
       v
┌──────────────┐
│  flow-check  │  optional: 진행 상태 점검, 계획 재조정
└──────┬───────┘
       v
┌──────────────┐
│  flow-work   │  작업 2
└──────┬───────┘
       v
┌──────────────┐
│  flow-close  │
└──────────────┘
```

### C. 작업이 이미 명확할 때

```text
┌──────────────┐
│  flow-work   │  작업 1 (인자로 직접 지정)
└──────┬───────┘
       v
┌──────────────┐
│  flow-close  │
└──────────────┘
```

## 5. 스킬별 의미와 산출물

### `flow-start`

읽기 대상:
- `docs/operations/claude-code-session-workflow.md`
- `.claude/context/*`
- `.claude/scratch/*`
- 필요 시 `docs/index.md`, `docs/log.md`

산출물:
- 작업 후보 1~3개 (범위 크기 포함)
- 이번 세션 작업 목록 (선택 후 확정)
- 세션 stop line
- `flow-work` 실행 순서

### `flow-work`

역할:
- 코드 또는 문서의 실제 변경 수행
- 필요 시 범위 재조정
- 변경 파일 목록, 남은 리스크 요약
- 커밋 메시지 한 줄 추천

권장 사용:
- argument에 이번 작업 대상을 짧게 준다.
- 예: `domain agent entity`, `README cleanup`, `docs link repair`

### `flow-close`

역할:
- docs-sync: source of truth가 바뀌었을 때만 수행
- handoff: `worklog.md`, `next-prompt.md`, `open-questions.md` 갱신

기본 산출물:
- 이번 세션에서 끝낸 것
- 아직 안 끝난 것
- 다음 세션 첫 작업
- 열린 질문

### `flow-check` (optional)

역할:
- flow-start 계획과 현재 상태 대조
- 남은 작업 순서/범위 재조정 제안

## 6. 권장 운영 규칙

### 가장 자주 쓰는 루프

```text
flow-start → flow-work → flow-work → flow-close
```

### 중간 재조정이 필요한 날

```text
flow-start → flow-work → flow-check → flow-work → flow-close
```

### 작업이 명확한 날

```text
flow-work → flow-close
```

## 7. 자주 생기는 혼동 정리

### `flow-start`에서 작업을 몇 개 잡아야 하나?

불확실성과 패턴 반복도를 보고 판단한다. 보통 2~3개. 불확실성이 높은 작업이 포함되면 그 작업만 단독으로 처리한다.

### `flow-work`를 몇 번 실행하나?

flow-start에서 확정한 작업 수만큼. 각 실행마다 커밋 메시지를 추천받고 커밋 여부를 결정한다.

### `flow-close`의 docs-sync는 항상 필요한가?

아니다. 코드만 바뀌고 규칙/구조는 그대로라면 건너뛴다.

### `flow-check`는 꼭 써야 하나?

아니다. 작업 2개 이하면 불필요하다.

### argument는 꼭 줘야 하나?

아니다. 다만 `flow-work`에는 짧은 작업 대상 인자를 주는 편이 좋다.

## 8. 세션 종료 체크리스트

- 이번 세션 작업을 모두 끝냈는가?
- 범위가 새지 않았는가?
- scratch를 다음 세션이 읽을 수 있는 상태로 남겼는가?
- docs 또는 context로 승격해야 할 판단이 있었는가?
- 다음 세션 첫 작업이 한 줄로 적혀 있는가?

---
id: OPS-CLAUDE-WORKFLOW
title: 'Claude Code 세션 운영 워크플로우'
type: guide
status: active
owners: [operations, docs-steward]
updated: 2026-04-12 (devs/{slug}/ 폐기, dev-pause/dev-reopen 추가)
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

## 1. 핵심 원칙

- 한 세션에 개발건(dev)은 1개다. 개발건 안에서 스프린트(sprint)는 2~3개를 처리한다.
- 스킬 수를 최소화한다.
- `dev-kickoff`는 optional. 어떤 개발건을 할지 불분명할 때만 쓴다. `dev-list.md`에 개발건 후보를 추가한다.
- `dev-open`이 개발건을 시작하고 이번 세션 스프린트 계획을 고정한다. **`dev-list.md`에 있는 개발건만 시작 가능.**
- `dev-sprint`이 스프린트 1개를 처음부터 끝까지 실행한다. N번 반복한다.
- `dev-close`가 문서 반영(필요 시)과 handoff 정리, dev-list 정리를 함께 처리한다.
- `dev-check`는 optional. 스프린트 3개 이상이거나 중간 재조정이 필요할 때만 쓴다.
- `dev-pause`는 optional. 개발건 전환 시 이어받기 컨텍스트를 `pause-{slug}.md`에 기록한다.
- `dev-reopen`은 pause된 개발건을 최소 읽기로 재개한다.
- 프로젝트 사실과 기준의 source of truth는 항상 `docs/`다.
- 세레모니(읽기/계획/정리) 대비 실제 작업 비율이 합리적이어야 한다.

## 1-1. 세션 범위 판단 기준

세션 범위는 **불확실성**과 **패턴 반복도** 두 축으로 판단한다. 스프린트별로 개별 판단한다.

|                   | 패턴 반복도 높음                         | 패턴 반복도 낮음               |
| ----------------- | ---------------------------------------- | ------------------------------ |
| **불확실성 낮음** | **넓은 범위**: 동일 패턴 3-5개 일괄 처리 | **보통 범위**: 관련 2-3개 처리 |
| **불확실성 높음** | **보통 범위**: 패턴 수립 후 1-2개 추가   | **좁은 범위**: 1개 신중히 처리 |

- **불확실성**: 설계 결정이 남아 있으면 높음. 기존 결정을 따르기만 하면 낮음.
- **패턴 반복도**: 동일 구조의 산출물이 이미 1개 이상 완성되어 있으면 높음.
- **실용적 상한**: 스프린트 2~3개, 커밋 2~3개, 변경 파일 10개 이내.

예시 (현재 프로젝트):

- 도메인 엔티티 타입 정의 (SessionEntity → AgentEntity → ... 패턴 확립됨): 넓은 범위 — 남은 엔티티 3개를 한 세션에 일괄 처리.
- 도메인 서비스 구현 (각 서비스마다 고유 로직): 좁은 범위 — 서비스 1개씩 처리.

## 1-2. scratch 구조

```
.claude/scratch/
├── notes.md            # 공통 메모 (개발건 무관)
├── dev-list.md         # 개발건 목록 (dev-kickoff 추가, dev-close 삭제)
├── user-req.md         # 요구사항 입력 (dev-kickoff true 시 사용)
└── pause-{slug}.md     # (optional) dev-pause가 생성, dev-reopen이 읽고 삭제
```

**dev-list.md:**

- `dev-kickoff`가 개발건 후보를 추가하고, `dev-close`가 완료된 개발건을 삭제한다.
- `dev-open`은 dev-list의 slug를 찾아 "예상 스프린트"를 스프린트 계획의 기반으로 사용한다.

**pause-{slug}.md:**

- `dev-pause`가 개발건 전환 시 생성한다.
- `dev-reopen`이 재개 시 읽고 삭제한다.
- `dev-close`가 잔여 파일을 정리한다.

## 2. 먼저 읽는 순서

1. `CLAUDE.md`
2. `.claude/README.md`
3. `docs/index.md`
4. `docs/_system/DOCS_SCHEMA.md`
5. `docs/registry/page-index.md`
6. `docs/operations/claude-code-session-workflow.md`
7. `.claude/context/*.md`
8. `.claude/scratch/*`

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

### `dev-pause` (optional)

개발건을 일시 중단하고 `pause-{slug}.md`에 이어받기 컨텍스트를 기록한다.

### `dev-reopen {slug}` (optional)

`dev-pause`로 중단된 개발건을 재개한다. pause 파일을 읽고 최소 컨텍스트로 스프린트 계획을 수립한다.

### `dev-check` (optional)

`dev-sprint` 사이 체크포인트. 스프린트 3개 이상이거나 예상 밖 상황이 생겼을 때만 쓴다.

## 4. 스킬별 상세

각 스킬의 읽기 대상, 행동 절차, 산출물은 `.claude/skills/{name}/SKILL.md`를 참조한다.

## 5. 권장 운영 규칙

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

### 개발건 전환이 필요할 때

```text
dev-open → dev-sprint × N → dev-pause → (다른 dev) → ... → dev-reopen → dev-sprint × N → dev-close
```

## 6. 세션 종료 체크리스트

- 이번 세션 스프린트를 모두 끝냈는가?
- 범위가 새지 않았는가?
- docs 또는 context로 승격해야 할 판단이 있었는가?
- 완료된 개발건이 dev-list에서 제거됐는가?
- 미완료 개발건은 `dev-pause`로 이어받기 컨텍스트를 기록했는가?

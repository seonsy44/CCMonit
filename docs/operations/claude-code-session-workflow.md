---
id: OPS-CLAUDE-WORKFLOW
title: "Claude Code 세션 운영 워크플로우"
type: guide
status: active
owners: [operations, docs-steward]
updated: 2026-04-11
tags: [claude-code, workflow, low-budget]
links:
  - docs-operations.md
  - ../README.md
  - ../log.md
---

# Claude Code 세션 운영 워크플로우

이 문서는 **저비용 Claude Code 요금제**를 전제로 한 실제 실행 순서서다. 목표는 한 번에 많이 시키는 것이 아니라, **작게 자르고, 세션이 끊겨도 이어달리기 가능한 상태를 유지하는 것**이다.

이 문서가 저장소의 workflow source of truth 이다.
- 사람용 루트 진입: `README.md`
- Claude Code용 루트 진입: `CLAUDE.md`
- `.claude/WORKFLOW.md`는 짧은 포인터다.

## 1. 핵심 원칙
- 한 세션에 목표는 1개만 둔다.
- 구현 스킬은 한 세션에 1개만 메인으로 사용한다.
- 먼저 범위를 고정하고, 그 다음에 구현한다.
- `session-start`가 시작 시 현재 scratch와 docs를 읽는다.
- `resume-next`는 종료 시 다음 세션용 handoff를 남긴다.
- `handoff-report`는 큰 세션에서만 선택적으로 쓴다.
- 프로젝트 사실과 기준의 source of truth는 항상 `docs/`다.

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

## 3. 표준 세션 루프

```text
┌──────────────────┐
│  session-start   │  현재 docs/context/scratch를 읽고 범위를 고정
└────────┬─────────┘
         v
┌──────────────────┐
│ token-budget-plan│  optional
└────────┬─────────┘
         v
┌──────────────────┐
│    scope-map     │
└────────┬─────────┘
         v
┌──────────────────┐
│    slice-work    │
└────────┬─────────┘
         v
┌──────────────────┐
│ implement-* one  │  또는 docs-* one
└────────┬─────────┘
         v
┌──────────────────┐
│  manual-verify   │
└────────┬─────────┘
         v
┌──────────────────┐
│  update-context  │  optional
└────────┬─────────┘
         v
┌──────────────────┐
│   resume-next    │  다음 세션용 handoff
└────────┬─────────┘
         v
┌──────────────────┐
│  handoff-report  │  optional, 큰 세션만
└──────────────────┘
```

## 4. 스킬별 의미

### `session-start`
시작 단계에서 현재 문맥을 복원하고 이번 세션의 stop line을 고정한다.
- 읽기 대상: `docs/`, `.claude/context/`, `.claude/scratch/`
- 산출물: 이번 세션 목표, 허용 범위, stop line, 다음 추천 스킬

### `scope-map`
이번 세션에서 수정 가능한 경계를 못 박는다.

### `slice-work`
현재 목표를 이번 세션에 끝낼 수 있는 **작은 배치**로 줄인다.

### `implement-*` / `docs-*`
실제 구현 또는 문서 정비를 수행한다. 한 세션에 메인 스킬은 1개만 둔다.

### `manual-verify`
이번 세션 결과가 목표와 범위를 벗어나지 않았는지 점검한다.

### `update-context`
이번 판단이 장기 규칙인지 검토하고 `docs/` 또는 `.claude/context/` 승격 필요를 정리한다.

### `resume-next`
세션 종료 단계에서 다음 세션용 handoff를 남긴다.
- 완료 항목
- 미완료 항목
- 다음 세션의 가장 작은 다음 배치
- stop line
- scratch 갱신 초안

### `handoff-report`
복잡한 세션에서만 쓰는 보고서형 마감 정리다.
- 변경 파일이 많을 때
- 구조 판단이 같이 있었을 때
- 다른 사람 또는 미래의 내가 다시 읽어야 할 때

## 5. 어떤 세션에서 무엇을 생략할 수 있나

### 기본형
```text
session-start → scope-map → slice-work → implement-* → manual-verify → resume-next
```
가장 자주 쓰는 루프다.

### 문서/규칙 반영이 있는 세션
```text
session-start → scope-map → slice-work → implement-* → manual-verify → update-context → resume-next
```

### 큰 세션
```text
session-start → token-budget-plan → scope-map → slice-work → implement-* → manual-verify → update-context → resume-next → handoff-report
```

### 정말 작은 완결 세션
```text
session-start → scope-map → implement-* → manual-verify
```
아주 드물게 가능하지만, 저비용 반복 작업에서는 보통 `resume-next`까지 남기는 편이 좋다.

## 6. 세션 타입별 ASCII 다이어그램

### A. 도메인 엔티티 세션
```text
[session-start]
      |
      v
[scope-map domain/session]
      |
      v
[slice-work session + session-id]
      |
      v
[implement-domain-batch]
      |
      v
[manual-verify]
      |
      v
[resume-next]
```

권장 범위:
- `entities/session.ts`
- `value-objects/session-id.ts`
- 필요 시 보조 타입 1개

### B. 애플리케이션 유스케이스 세션
```text
[session-start]
      |
      v
[scope-map build-session-summary]
      |
      v
[slice-work usecase + dto]
      |
      v
[implement-application-batch]
      |
      v
[manual-verify]
      |
      v
[update-context]
      |
      v
[resume-next]
```

### C. 인프라 어댑터 세션
```text
[session-start]
      |
      v
[token-budget-plan]
      |
      v
[scope-map claude adapter]
      |
      v
[slice-work watcher + parser boundary]
      |
      v
[implement-infra-batch]
      |
      v
[manual-verify]
      |
      v
[resume-next]
      |
      v
[handoff-report]
```

### D. TUI 패널 세션
```text
[session-start]
      |
      v
[scope-map summary + footer panel]
      |
      v
[slice-work presenter input only]
      |
      v
[implement-cli-tui-batch]
      |
      v
[manual-verify]
      |
      v
[resume-next]
```

### E. docs 유지보수 세션
```text
[session-start]
      |
      v
[scope-map docs only]
      |
      v
[docs-lint]
      |
      v
[docs-ingest]
      |
      v
[manual-verify]
      |
      v
[update-context]
      |
      v
[resume-next]
```

## 7. 운영상 자주 생기는 혼동 정리

### `resume-next`는 언제 쓰나?
종료 단계에서 쓴다. 시작 단계에서 쓰지 않는다.
시작 시 이전 handoff를 읽는 역할은 `session-start`가 담당한다.

### `resume-next`와 `handoff-report`는 둘 다 꼭 필요한가?
아니다.
- `resume-next`: 기본 handoff
- `handoff-report`: 큰 세션에서만 선택적 사용

### 인자는 꼭 줘야 하나?
아니다. 다만 `scope-map`, `slice-work`, `implement-*`에는 짧은 범위 인자를 주는 편이 좋다.

## 8. 세션 종료 체크리스트
- 이번 세션 목표를 실제로 끝냈는가?
- 범위가 새지 않았는가?
- scratch를 다음 세션이 읽을 수 있는 상태로 남겼는가?
- docs 또는 context로 승격해야 할 판단이 있었는가?
- 큰 세션이었다면 `handoff-report`가 필요한가?

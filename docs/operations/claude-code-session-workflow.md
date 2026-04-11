---
id: OPS-CLAUDE-WORKFLOW
title: "Claude Code 세션 운영 워크플로우"
type: guide
status: active
owners: [operations, docs-steward]
updated: 2026-04-11
tags: [claude-code, workflow, practical]
links:
  - docs-operations.md
  - ../README.md
  - ../log.md
---

# Claude Code 세션 운영 워크플로우

이 문서는 **과하게 잘게 쪼갠 저비용 운영 방식**을 정리하고, 실제로 쓰기 쉬운 수준으로 간소화한 Claude Code 세션 실행 순서서다.

이 문서가 저장소의 workflow source of truth 이다.
- 사람용 루트 진입: `README.md`
- Claude Code용 루트 진입: `CLAUDE.md`
- `.claude/WORKFLOW.md`는 짧은 포인터다.

## 1. 핵심 원칙
- 한 세션에 목표는 1개만 둔다.
- 스킬 수를 최소화한다.
- 작업이 불분명하면 먼저 `kick-off`로 후보를 고른다.
- `session-start`가 시작 시 현재 scratch와 docs를 읽는다.
- `work`가 실제 작업을 담당한다.
- `docs-sync`는 문서 반영이 필요할 때만 쓴다.
- `close-session`은 종료 시 다음 세션용 handoff를 남긴다.
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

## 3. 현재 사용 스킬

### `kick-off`
지금 할 수 있는 작은 작업 후보를 1~3개 추천한다.  
역할상 **PM 성격의 시작 스킬**이다.

### `session-start`
세션 시작 시 현재 문맥을 복원하고 이번 세션의 목표, 범위, stop line을 정리한다.

### `work`
코드 또는 문서 작업을 실제로 수행하는 메인 스킬이다.  
범위 재확인, 작은 분할, 가벼운 검토를 내부에서 함께 처리한다.

### `docs-sync`
이번 세션에서 생긴 장기 규칙이나 문서 변경을 `docs/`와 `.claude/context/`에 반영한다.

### `close-session`
세션 종료 단계에서 다음 세션용 handoff를 남기고 scratch를 정리한다.

## 4. 기본 워크플로우

### A. 새 작업이 불분명할 때
```text
┌──────────────┐
│   kick-off   │  가능한 작은 작업 후보 추천
└──────┬───────┘
       v
┌──────────────┐
│ session-start│  목표 / 범위 / stop line
└──────┬───────┘
       v
┌──────────────┐
│     work     │  실제 작업
└──────┬───────┘
       v
┌──────────────┐
│  docs-sync   │  optional
└──────┬───────┘
       v
┌──────────────┐
│ close-session│  handoff / scratch 정리
└──────────────┘
```

### B. 작업이 이미 분명할 때
```text
┌──────────────┐
│ session-start│
└──────┬───────┘
       v
┌──────────────┐
│     work     │
└──────┬───────┘
       v
┌──────────────┐
│  docs-sync   │  optional
└──────┬───────┘
       v
┌──────────────┐
│ close-session│
└──────────────┘
```

### C. 문서 정비만 하는 날
```text
┌──────────────┐
│   kick-off   │  또는 생략
└──────┬───────┘
       v
┌──────────────┐
│ session-start│
└──────┬───────┘
       v
┌──────────────┐
│  docs-sync   │
└──────┬───────┘
       v
┌──────────────┐
│ close-session│
└──────────────┘
```

## 5. 스킬별 의미와 산출물

### `kick-off`
읽기 대상:
- `CLAUDE.md`
- `docs/operations/claude-code-session-workflow.md`
- `.claude/context/*`
- 필요 시 `docs/index.md`, `docs/log.md`, `.claude/scratch/*`

산출물:
- 지금 시작 가능한 작은 작업 후보 1~3개
- 가장 추천하는 작업 1개
- 다음 단계에서 읽을 파일
- 추천 시작 흐름

### `session-start`
읽기 대상:
- `docs/`
- `.claude/context/`
- `.claude/scratch/`

산출물:
- 이번 세션 목표
- 허용 범위
- stop line
- 이번 세션이 끝났다고 볼 기준

### `work`
역할:
- 코드 또는 문서의 실제 변경 수행
- 필요한 경우 범위를 더 작게 재확인
- 변경 파일과 남은 위험을 짧게 요약

권장 사용:
- argument에는 이번 배치의 대상을 짧게 준다.
- 예: `domain session entity`, `README cleanup`, `claude adapter parser stub`, `docs link repair`

### `docs-sync`
역할:
- 기준 문서 갱신
- `.claude/context/*` 요약 갱신
- `docs/index.md`, `docs/registry/page-index.md`, `docs/log.md` 같은 운영 문서 보정
- 필요 시 `.claude/scratch/*` 정리 보조

언제 쓰나:
- source of truth가 바뀌었을 때
- 구조/규칙이 달라졌을 때
- 세션 결과를 다음에도 반복 참조해야 할 때

### `close-session`
역할:
- `worklog.md`
- `next-prompt.md`
- `open-questions.md`

를 정리하고 다음 세션이 바로 이어질 수 있는 상태를 만든다.

기본 산출물:
- 이번 세션에서 끝낸 것
- 아직 안 끝난 것
- 다음 세션 첫 작업
- 열린 질문
- 필요 시 수정 파일 목록

## 6. 권장 운영 규칙

### 가장 자주 쓰는 루프
```text
kick-off → session-start → work → close-session
```

### 구조나 규칙까지 바뀐 날
```text
kick-off → session-start → work → docs-sync → close-session
```

### 작업이 이미 명확한 날
```text
session-start → work → close-session
```

## 7. 운영상 자주 생기는 혼동 정리

### `kick-off`와 `session-start`의 차이는?
- `kick-off`: 지금 무엇을 할지 추천
- `session-start`: 선택한 작업을 실제 세션 계획으로 고정

### `work` 하나로 충분한가?
현재 프로젝트 단계에서는 충분하다.  
레이어별 구현 스킬을 따로 두는 것보다 운영 오버헤드가 적다.

### `docs-sync`는 항상 필요한가?
아니다. 문서나 장기 규칙이 바뀌었을 때만 쓴다.

### `close-session`은 꼭 필요한가?
필수는 아니지만, 여러 번 끊어서 작업하는 프로젝트에서는 거의 항상 쓰는 편이 좋다.

### argument는 꼭 줘야 하나?
아니다. 다만 `session-start`, `work`, `docs-sync`에는 짧은 범위 인자를 주는 편이 좋다.

## 8. 세션 종료 체크리스트
- 이번 세션 목표를 실제로 끝냈는가?
- 범위가 새지 않았는가?
- scratch를 다음 세션이 읽을 수 있는 상태로 남겼는가?
- docs 또는 context로 승격해야 할 판단이 있었는가?
- 다음 세션 첫 작업이 한 줄로 적혀 있는가?

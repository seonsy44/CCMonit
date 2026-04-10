---
id: OPS-CLAUDE-WORKFLOW
title: "Claude Code 세션 운영 워크플로우"
type: guide
status: active
owners: [operations, docs-steward]
updated: 2026-04-10
tags: [claude-code, workflow, low-budget]
links: [[[operations/docs-operations]], [[../README]], [[../log]]]
---

# Claude Code 세션 운영 워크플로우

이 문서는 **저비용 Claude Code 요금제**를 전제로 한 실제 실행 순서서다. 목표는 한 번에 많이 시키는 것이 아니라, **작게 자르고, 세션이 끊겨도 이어달리기 가능한 상태를 유지하는 것**이다.

이 문서가 저장소의 workflow source of truth 이다. 루트 `WORKFLOW.md`와 `.claude/WORKFLOW.md`는 이 문서로 진입시키는 포인터다.

## 기준 파일
- `docs/index.md`
- `docs/_system/DOCS_SCHEMA.md`
- `docs/registry/page-index.md`
- `.claude/README.md`
- `.claude/context/*.md`
- `.claude/skills/*`
- `.claude/scratch/*`

## 1. 먼저 읽는 순서

1. `docs/index.md`
2. `docs/_system/DOCS_SCHEMA.md`
3. `docs/registry/page-index.md`
4. `docs/operations/claude-code-session-workflow.md`
5. `.claude/context/*.md`
6. `.claude/WORKFLOW.md`
7. 필요 시 `.claude/skills/_shared/*.md`
8. `.claude/scratch/*`

## 2. 공통 운영 원칙

- 한 세션에 목표는 1개만 둔다.
- 구현 스킬은 한 세션에 1개만 메인으로 사용한다.
- 변경 파일은 가능하면 3~8개에 묶는다.
- 세션 종료 전에 `.claude/scratch/*`를 반드시 갱신한다.
- 구조나 판단 기준이 바뀌면 `docs/log.md`와 관련 문서도 같이 갱신한다.
- 문서가 기준이고 채팅은 작업 메모다.

## 3. 표준 세션 루프

```text
┌──────────────────┐
│  session-start   │
└────────┬─────────┘
         v
┌──────────────────┐
│   resume-next    │
└────────┬─────────┘
         v
┌──────────────────┐
│ token-budget-plan│  (optional)
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
│ implement-* one  │
└────────┬─────────┘
         v
┌──────────────────┐
│  manual-verify   │
└────────┬─────────┘
         v
┌──────────────────┐
│  update-context  │
└────────┬─────────┘
         v
┌──────────────────┐
│  handoff-report  │
└──────────────────┘
```

## 4. 세션 타입별 실행 순서

### A. 도메인 엔티티 세션

목표:
- `packages/domain` 안의 엔티티 / 값 객체 / 도메인 서비스 중 아주 작은 묶음만 구현

```text
[session-start]
      |
      v
[resume-next]
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
[update-context]
      |
      v
[handoff-report]
```

권장 범위:
- `entities/session.ts`
- `value-objects/session-id.ts`
- 필요 시 `types/event-kind.ts` 1개 정도만 보조 수정

붙여넣기 예시:
```text
/session-start session entity 와 session-id value object 를 작은 배치로 구현
/resume-next
/scope-map packages/domain/src/entities/session.ts 와 session-id 관련 파일
/slice-work session entity + session-id
/implement-domain-batch session entity + session-id
/manual-verify session entity + session-id
/update-context session entity + session-id
/handoff-report domain session batch
```

### B. 애플리케이션 유스케이스 세션

목표:
- usecase 1~2개 + DTO 1~2개 + mapper 1개 정도만 처리

```text
[session-start]
      |
      v
[resume-next]
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
[handoff-report]
```

권장 범위:
- `build-session-summary.usecase.ts`
- `session-summary.dto.ts`
- 필요 시 `session.mapper.ts`

붙여넣기 예시:
```text
/session-start build-session-summary.usecase 와 session-summary.dto 를 연결 가능한 스텁으로 만든다
/resume-next
/scope-map packages/application/src/usecases/build-session-summary.usecase.ts
/slice-work build-session-summary usecase + dto + mapper 최소 묶음
/implement-application-batch build-session-summary usecase
/manual-verify build-session-summary usecase
/update-context build-session-summary usecase
/handoff-report application summary batch
```

### C. 인프라 어댑터 세션

목표:
- 로그 감시 / 파서 / 토큰 추출 / health 중 하나의 축만 처리

```text
[session-start]
      |
      v
[resume-next]
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
[update-context]
      |
      v
[handoff-report]
```

권장 범위:
- `claude-log-watcher.ts`
- `claude-event-parser.ts`
- `safe-json.ts` 정도의 보조 유틸

붙여넣기 예시:
```text
/session-start claude log watcher 와 parser 경계를 스텁에서 실제 골격 수준으로 강화
/resume-next
/scope-map packages/infra/src/adapters/claude-code
/slice-work watcher + parser interface boundary
/implement-infra-batch claude watcher + parser
/manual-verify claude watcher + parser
/update-context claude watcher + parser
/handoff-report infra adapter batch
```

### D. CLI / TUI 세션

목표:
- 패널 2~3개 또는 view 1~2개만 다룬다

```text
[session-start]
      |
      v
[resume-next]
      |
      v
[scope-map tui summary/header/footer]
      |
      v
[slice-work 3 panels max]
      |
      v
[implement-cli-tui-batch]
      |
      v
[manual-verify]
      |
      v
[update-context]
      |
      v
[handoff-report]
```

권장 범위:
- 세션 1: `app-screen.ts`, `root-layout.ts`, `header-layout.ts`
- 세션 2: `header.panel.ts`, `summary.panel.ts`, `footer.panel.ts`
- 세션 3: `subagent.panel.ts`, `skill.panel.ts`, `team.panel.ts`
- 세션 4: `task.panel.ts`, `file-activity.panel.ts`, `alerts.panel.ts`
- 세션 5: `session-list.view.ts`, `session-detail.view.ts`
- 세션 6: `token-breakdown.view.ts`, `event-log.view.ts`, `report-preview.view.ts`

붙여넣기 예시:
```text
/session-start summary panel 과 footer panel 을 presenter 입력 기준으로만 그리는 최소 구현
/resume-next
/scope-map apps/cli/src/tui/panels/summary.panel.ts 와 footer.panel.ts
/slice-work summary + footer + presenter contract
/implement-cli-tui-batch summary + footer panel
/manual-verify summary + footer panel
/update-context summary + footer panel
/handoff-report tui panel batch
```

### E. 문서 유지보수 세션

목표:
- 구현이 아니라 `docs/`와 `.claude/` 정합성을 갱신

```text
[session-start]
      |
      v
[resume-next]
      |
      v
[scope-map docs + .claude]
      |
      v
[docs-ingest] or [docs-lint]
      |
      v
[manual-verify]
      |
      v
[update-context]
      |
      v
[handoff-report]
```

권장 범위:
- `docs/log.md`
- `docs/index.md`
- `docs/registry/page-index.md`
- `docs/registry/source-index.md`
- `.claude/context/*.md`
- `.claude/prompts/*.md`

붙여넣기 예시:
```text
/session-start 최근 구조 변경을 docs 와 .claude 에 반영하는 유지보수 세션
/resume-next
/scope-map docs 와 .claude 사이의 source of truth 정렬
/docs-ingest 구현 변경에 따른 docs/source + index + log 반영
/manual-verify docs and claude alignment
/update-context docs maintenance batch
/handoff-report docs maintenance
```

### F. 급한 버그 수정 세션

목표:
- 큰 구조 변경 없이 한 오류만 잡는다

```text
[session-start]
      |
      v
[scope-map exact error site]
      |
      v
[slice-work single fix]
      |
      v
[implement-* one]
      |
      v
[manual-verify]
      |
      v
[update-context]
      |
      v
[handoff-report]
```

원칙:
- 리팩터링 금지
- 파일 추가 최소화
- 근본 개선 아이디어는 `docs/product/open-questions.md` 또는 `.claude/scratch/open-questions.md`에 남긴다

## 5. stop line 결정 규칙

이번 세션의 stop line 은 아래 중 하나여야 한다.

- 엔티티 1개와 관련 값 객체 1개까지
- usecase 1개와 DTO 1~2개까지
- adapter 경계 1개와 parser skeleton 까지
- 패널 2~3개까지
- docs 1회 ingest 또는 lint 까지

피해야 하는 stop line:
- “TUI 전체”
- “infra 전부”
- “남은 거 다”
- “구현 가능한 데까지”

## 6. 세션 종료 체크리스트

```text
[ ] 이번 세션 목표가 실제로 하나였는가
[ ] 변경 파일 수가 과하지 않은가
[ ] 구현 스킬을 1개만 메인으로 썼는가
[ ] manual-verify 를 수행했는가
[ ] .claude/scratch/worklog.md 를 갱신했는가
[ ] .claude/scratch/next-prompt.md 를 갱신했는가
[ ] 구조/정책 변경이 있었다면 docs/log.md 를 갱신했는가
[ ] 다음 세션의 stop line 이 명시됐는가
```

## 7. handoff 메모 최소 포맷

```md
## Batch
- name:
- layer:
- changed files:

## Done
- 

## Remaining
- 

## Risks
- 

## Next prompt
- 
```

## 8. 자주 하는 실수

- `scope-map` 없이 바로 구현에 들어가기
- 한 세션에서 domain + infra + tui 를 동시에 건드리기
- `update-context` 없이 세션을 끝내기
- 구현이 바뀌었는데 `docs/log.md`를 갱신하지 않기
- 큰 리팩터링 아이디어를 바로 실행해 토큰을 과소비하기

## 9. 최종 요약

이 프로젝트에서 저비용 플랜 운영의 핵심은 아래 한 줄이다.

```text
작게 읽고 -> 더 작게 자르고 -> 한 묶음만 구현하고 -> 기록을 남기고 -> 다음 세션으로 넘긴다
```

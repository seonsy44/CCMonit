---
id: DOCS-LOG
title: "CCMonit 문서 운영 로그"
type: log
status: active
owners: [docs-steward]
updated: 2026-04-10
tags: [log, append-only]
links:
  - index.md
  - reports/docs-health-baseline.md
---

# CCMonit 문서 운영 로그

이 파일은 append-only 로그다. 새 항목은 맨 아래에 추가한다.

## [2026-04-10] bootstrap | docs system upgrade
- 기존 `product/`, `architecture/`, `operations/`, `decisions/` 문서를 위키형 문서 시스템으로 재구성했다.
- `index.md`, `log.md`, `_system/`, `registry/`, `knowledge/`, `reports/`, `sources/`를 추가했다.
- 기존 이벤트 모델/모듈 책임/워크플로우 문서를 아키텍처와 운영 지식으로 연결했다.
- 후속 과제: `reports/queries/`에 실제 질의 결과를 적재하고, 매 주기 `LINT_WORKFLOW` 기준으로 건강 상태를 갱신한다.

## [2026-04-10] ingest | existing project docs
- 초기 기획서, 기능명세서, 화면명세서, 아키텍처 요약, 토큰 전략 가이드를 현재 위키 구조에 편입했다.
- source pages: [sources/SRC-0001-initial-product-docs](sources/SRC-0001-initial-product-docs.md), [sources/SRC-0002-event-model-spec](sources/SRC-0002-event-model-spec.md), [sources/SRC-0003-module-responsibility-spec](sources/SRC-0003-module-responsibility-spec.md), [sources/SRC-0004-workflow-playbook](sources/SRC-0004-workflow-playbook.md), [sources/SRC-0005-llm-wiki-concept](sources/SRC-0005-llm-wiki-concept.md)

## [2026-04-10] integrate | docs and .claude alignment
- 위키형 `docs/` 구조를 실제 프로젝트 통합본에 반영했다.
- `.claude/context/*`, `.claude/prompts/*`, `.claude/skills/*`가 `docs/index.md`와 `docs/registry/page-index.md`를 먼저 읽도록 정렬했다.
- 루트 `WORKFLOW_PLAYBOOK.md`를 확장해 ASCII 다이어그램과 세션 타입별 실행 예시를 추가했다.
- `operations/claude-code-session-workflow.md`와 `sources/SRC-0006-claude-skills-playbook-and-doc-alignment.md`를 추가했다.


## [2026-04-10] refine | workflow and .claude cleanup
- workflow source of truth 를 `docs/operations/claude-code-session-workflow.md`로 일원화하고, 루트 `WORKFLOW.md`와 `.claude/WORKFLOW.md`를 포인터 문서로 정리했다.
- `.claude/context/`와 `.claude/skills/_shared/` 역할 분리를 유지한 채, 스킬 전용 요약은 `_shared/`에 두고 공용 안정 요약만 `context/`에 남겼다.
- `.claude/prompts/`는 kickoff / resume-session / docs-maintenance 의 진입용 템플릿만 남기고 구현 절차형 프롬프트를 제거했다.

## [2026-04-11] maintenance | workflow semantics and root entrypoints
- `session-start`와 `resume-next`의 의미를 다시 분리했다. `session-start`는 시작 시 scratch/docs를 읽고, `resume-next`는 종료 시 다음 세션용 handoff를 남긴다.
- workflow source of truth 는 계속 `docs/operations/claude-code-session-workflow.md`로 유지하되, 루트 `CLAUDE.md`를 새 진입 가이드로 추가했다.
- 루트 `README.md`, `.claude/README.md`, `.claude/skills/*`의 순서와 설명을 새 semantics에 맞게 정렬했다.

## [2026-04-11] workflow simplification | five-skill model
- Claude Code 운영 스킬을 `kick-off`, `session-start`, `work`, `docs-sync`, `close-session` 다섯 개로 단순화했다.
- `kick-off`는 PM 역할의 후보 추천 스킬로 정의했다.
- `work`가 기존의 세분화된 구현/검토 단계를 흡수하도록 정리했다.
- `close-session`이 세션 종료 handoff를 담당하도록 정리했다.
- `README.md`, `CLAUDE.md`, `.claude/*`, `docs/operations/claude-code-session-workflow.md`를 새 구조에 맞게 갱신했다.

## [2026-04-11] optimize | .claude token reduction
- `.claude/skills/_shared/` 4개 파일의 내용을 `.claude/context/` 4개 파일로 통합하고 `_shared/` 디렉토리를 삭제했다.
- `context/product-summary.md`에 실행 규칙 4줄, `context/architecture-summary.md`에 패키지 구조 목록, `context/docs-system-summary.md`에 문서 작업 사고 순서, `context/glossary.md`에 세션 운영 용어 5개를 각각 추가했다.
- 모든 스킬에서 `CLAUDE.md` 재읽기 항목 제거 (Claude Code가 세션 시작 시 자동 로드함).
- `work`와 `docs-sync`에서 `context/*.md` 재읽기 항목 제거 (session-start에서 이미 로드된 컨텍스트).
- `.claude/WORKFLOW.md` 삭제 (README.md에 동일 내용 포함, CLAUDE.md에 포인터 추가).
- `.claude/README.md`에서 `_shared/` 관련 섹션과 참조 정리.
- 변경 동기: 스킬 호출당 중복 읽기로 낭비되던 토큰 절감, 컨텍스트 레이어를 context/ 단일 허브로 단순화.

## [2026-04-11] refactor | telemetry → metrics rename and tech stack ADR
- `packages/infra/src/telemetry/` → `packages/infra/src/metrics/`로 이름 변경. "telemetry"가 원격 전송을 암시하므로 로컬 전용임을 명확히 함.
- `module-responsibilities.md`, `architecture-summary.md`, `infra/package.json`의 관련 참조 모두 갱신.
- ADR-004 추가: TUI(ink), SQLite(better-sqlite3), 파일 감시(fs.watch), 테스트(보류) 기술 결정 기록.


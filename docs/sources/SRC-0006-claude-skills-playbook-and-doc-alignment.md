---
id: SRC-0006
title: "Claude skills / workflow / docs alignment"
type: source-summary
status: active
owners: [docs-steward]
updated: 2026-04-10
tags: [source, claude, workflow, docs]
links: [[[operations/claude-code-session-workflow]], [[../log]], [[../registry/source-index]]]
---

# SRC-0006 Claude skills / workflow / docs alignment

## source 개요
이 source 는 기존 `.claude/skills`, `.claude/context`, `.claude/prompts`, 초기 workflow 초안을 **위키형 `docs/` 구조와 정렬**하기 위해 수행한 통합 작업을 요약한다.

## 핵심 반영 내용
- Claude 작업 루틴의 기준 문서를 `docs/index.md`, `docs/_system/DOCS_SCHEMA.md`, `docs/registry/page-index.md`, `operations/claude-code-session-workflow.md` 중심으로 재정렬했다.
- `.claude/context/*.md`는 공용 안정 요약만 두고, 스킬 전용 실행 요약은 `.claude/skills/_shared/*.md`로 분리했다.
- workflow source of truth 를 `operations/claude-code-session-workflow.md`로 일원화하고, 루트 `WORKFLOW.md`와 `.claude/WORKFLOW.md`는 진입 포인터로 축소했다.
- `.claude/prompts/`는 kickoff / resume-session / docs-maintenance 의 진입 템플릿만 남기도록 정리했다.
- docs 유지보수를 위한 `/docs-ingest`, `/docs-lint` 스킬을 추가했다.

## 주요 반영 대상
- `.claude/README.md`
- `.claude/WORKFLOW.md`
- `.claude/context/*`
- `.claude/skills/_shared/*`
- `.claude/prompts/*`
- `.claude/skills/*`
- `WORKFLOW.md`
- `operations/claude-code-session-workflow.md`

## 후속 과제
- 실제 구현 진행 후 `.claude/context/*`가 얼마나 빨리 낡는지 점검
- `docs-lint` 결과를 주기적으로 `reports/`에 적재할지 검토

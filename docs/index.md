---
id: DOCS-INDEX
title: CCMonit 문서 인덱스
type: index
status: active
owners:
  - docs-steward
updated: 2026-04-10
tags:
  - index
  - navigation
links:
  - README.md
  - log.md
  - registry/page-index.md
---

# CCMonit 문서 인덱스

이 문서는 `docs/` 전체의 **콘텐츠 지향 인덱스**다. 자세한 전체 목록은 [registry/page-index](registry/page-index.md)를 본다.

## 1. 제품 정의
- [product/PRD](product/PRD.md) — 문제 정의, 목표, 사용자, 범위를 설명하는 제품 기획서
- [product/기능명세서](product/기능명세서.md) — 구현해야 할 기능 단위를 정리한 문서
- [product/화면명세서](product/화면명세서.md) — TUI 화면 구조와 상호작용 정리
- [product/roadmap](product/roadmap.md) — MVP 이후 단계별 확장 계획
- [product/open-questions](product/open-questions.md) — 아직 합의되지 않은 쟁점 목록

## 2. 아키텍처
- [architecture/system-overview](architecture/system-overview.md) — 시스템 구성 요약
- [architecture/event-flow](architecture/event-flow.md) — canonical event 중심 흐름
- [architecture/storage-model](architecture/storage-model.md) — NDJSON / SQLite / report 저장 전략
- [architecture/adapter-contract](architecture/adapter-contract.md) — adapter 계층의 계약
- [architecture/module-responsibilities](architecture/module-responsibilities.md) — 계층 및 모듈 책임
- [architecture/doc-system-architecture](architecture/doc-system-architecture.md) — 문서 시스템 자체의 구조

## 3. 운영
- [operations/token-strategy-guide](operations/token-strategy-guide.md) — 토큰 해석과 회고 가이드
- [operations/log-retention](operations/log-retention.md) — 로그 보존 정책
- [operations/troubleshooting](operations/troubleshooting.md) — 문제 해결 가이드
- [operations/docs-operations](operations/docs-operations.md) — 문서 유지보수 운영 절차
- [operations/claude-code-session-workflow](operations/claude-code-session-workflow.md) — Claude Code 세션 운영 방식
- [operations/release-readiness-checklist](operations/release-readiness-checklist.md) — 릴리스 직전 확인 목록

## 4. 의사결정
- [decisions/ADR-001-monorepo-structure](decisions/ADR-001-monorepo-structure.md) — 모노레포 구조 채택
- [decisions/ADR-002-docs-as-wiki](decisions/ADR-002-docs-as-wiki.md) — docs를 지속형 위키로 운영
- [decisions/ADR-003-frontmatter-index-log](decisions/ADR-003-frontmatter-index-log.md) — frontmatter, index, log 규칙

## 5. 지식 베이스
### 개요
- [knowledge/overview/project-map](knowledge/overview/project-map.md) — 프로젝트 개념 지형도

### 엔티티
- [knowledge/entities/session](knowledge/entities/session.md)
- [knowledge/entities/agent](knowledge/entities/agent.md)
- [knowledge/entities/task](knowledge/entities/task.md)
- [knowledge/entities/skill](knowledge/entities/skill.md)
- [knowledge/entities/tool-usage](knowledge/entities/tool-usage.md)
- [knowledge/entities/token-usage](knowledge/entities/token-usage.md)
- [knowledge/entities/alert](knowledge/entities/alert.md)

### 핵심 개념
- [knowledge/concepts/canonical-event](knowledge/concepts/canonical-event.md)
- [knowledge/concepts/read-model](knowledge/concepts/read-model.md)
- [knowledge/concepts/token-accuracy](knowledge/concepts/token-accuracy.md)
- [knowledge/concepts/stuck-detection](knowledge/concepts/stuck-detection.md)
- [knowledge/concepts/docs-as-wiki](knowledge/concepts/docs-as-wiki.md)

### 합성/가설
- [knowledge/syntheses/mvp-observability-strategy](knowledge/syntheses/mvp-observability-strategy.md)
- [knowledge/syntheses/token-optimization-hypotheses](knowledge/syntheses/token-optimization-hypotheses.md)

## 6. 문서 시스템
- [_system/DOCS_SCHEMA](_system/DOCS_SCHEMA.md)
- [_system/FRONTMATTER_GUIDE](_system/FRONTMATTER_GUIDE.md)
- [_system/INGEST_WORKFLOW](_system/INGEST_WORKFLOW.md)
- [_system/QUERY_WORKFLOW](_system/QUERY_WORKFLOW.md)
- [_system/LINT_WORKFLOW](_system/LINT_WORKFLOW.md)
- [_system/MAINTENANCE_POLICY](_system/MAINTENANCE_POLICY.md)

## 7. 출처와 리포트
- [sources/README](sources/README.md)
- [registry/source-index](registry/source-index.md)
- [reports/docs-health-baseline](reports/docs-health-baseline.md)
- [reports/queries/README](reports/queries/README.md)
- [log](log.md)
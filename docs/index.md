---
id: DOCS-INDEX
title: "CCMonit 문서 인덱스"
type: index
status: active
owners: [docs-steward]
updated: 2026-04-10
tags: [index, navigation]
links: [[[README]], [[log]], [[registry/page-index]]]
---

# CCMonit 문서 인덱스

이 문서는 `docs/` 전체의 **콘텐츠 지향 인덱스**다. 자세한 전체 목록은 [[registry/page-index]]를 본다.

## 1. 제품 정의
- [[product/PRD]] — 문제 정의, 목표, 사용자, 범위를 설명하는 제품 기획서
- [[product/기능명세서]] — 구현해야 할 기능 단위를 정리한 문서
- [[product/화면명세서]] — TUI 화면 구조와 상호작용 정리
- [[product/roadmap]] — MVP 이후 단계별 확장 계획
- [[product/open-questions]] — 아직 합의되지 않은 쟁점 목록

## 2. 아키텍처
- [[architecture/system-overview]] — 시스템 구성 요약
- [[architecture/event-flow]] — canonical event 중심 흐름
- [[architecture/storage-model]] — NDJSON / SQLite / report 저장 전략
- [[architecture/adapter-contract]] — adapter 계층의 계약
- [[architecture/module-responsibilities]] — 계층 및 모듈 책임
- [[architecture/doc-system-architecture]] — 문서 시스템 자체의 구조

## 3. 운영
- [[operations/token-strategy-guide]] — 토큰 해석과 회고 가이드
- [[operations/log-retention]] — 로그 보존 정책
- [[operations/troubleshooting]] — 문제 해결 가이드
- [[operations/docs-operations]] — 문서 유지보수 운영 절차
- [[operations/claude-code-session-workflow]] — Claude Code 세션 운영 방식
- [[operations/release-readiness-checklist]] — 릴리스 직전 확인 목록

## 4. 의사결정
- [[decisions/ADR-001-monorepo-structure]] — 모노레포 구조 채택
- [[decisions/ADR-002-docs-as-wiki]] — docs를 지속형 위키로 운영
- [[decisions/ADR-003-frontmatter-index-log]] — frontmatter, index, log 규칙

## 5. 지식 베이스
### 개요
- [[knowledge/overview/project-map]] — 프로젝트 개념 지형도

### 엔티티
- [[knowledge/entities/session]]
- [[knowledge/entities/agent]]
- [[knowledge/entities/task]]
- [[knowledge/entities/skill]]
- [[knowledge/entities/tool-usage]]
- [[knowledge/entities/token-usage]]
- [[knowledge/entities/alert]]

### 핵심 개념
- [[knowledge/concepts/canonical-event]]
- [[knowledge/concepts/read-model]]
- [[knowledge/concepts/token-accuracy]]
- [[knowledge/concepts/stuck-detection]]
- [[knowledge/concepts/docs-as-wiki]]

### 합성/가설
- [[knowledge/syntheses/mvp-observability-strategy]]
- [[knowledge/syntheses/token-optimization-hypotheses]]

## 6. 문서 시스템
- [[_system/DOCS_SCHEMA]]
- [[_system/FRONTMATTER_GUIDE]]
- [[_system/INGEST_WORKFLOW]]
- [[_system/QUERY_WORKFLOW]]
- [[_system/LINT_WORKFLOW]]
- [[_system/MAINTENANCE_POLICY]]

## 7. 출처와 리포트
- [[sources/README]]
- [[registry/source-index]]
- [[reports/docs-health-baseline]]
- [[reports/queries/README]]
- [[log]]

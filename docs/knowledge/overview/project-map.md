---
id: KNOWLEDGE-PROJECT-MAP
title: "CCMonit 프로젝트 맵"
type: synthesis
status: active
owners: [docs-steward]
updated: 2026-04-10
tags: [knowledge, overview]
links:
  - ../../product/PRD.md
  - ../../architecture/system-overview.md
---

# CCMonit 프로젝트 맵

## 한 줄 요약
CCMonit은 Claude Code 하네스 환경에서 **지금 무슨 작업이 벌어지고 있는지**와 **어디서 토큰이 많이 쓰였는지**를 동시에 보여주는 TUI 기반 관찰 도구다.

## 핵심 질문
- 지금 살아 있는 session / agent / task 는 무엇인가?
- 어떤 skill / tool 이 방금 실행되었는가?
- 최근 어떤 파일이 바뀌었는가?
- 어느 task 가 토큰을 많이 소모했는가?
- 멈춤, 과도한 재시도, 토큰 급증 같은 이상 징후가 있는가?

## 구조 지도

### 제품 관점
- [product/PRD](../../product/PRD.md)
- [product/기능명세서](../../product/기능명세서.md)
- [product/화면명세서](../../product/화면명세서.md)

### 시스템 관점
- [architecture/system-overview](../../architecture/system-overview.md)
- [architecture/event-flow](../../architecture/event-flow.md)
- [architecture/storage-model](../../architecture/storage-model.md)
- [architecture/adapter-contract](../../architecture/adapter-contract.md)
- [architecture/module-responsibilities](../../architecture/module-responsibilities.md)

### 운영 관점
- [operations/token-strategy-guide](../../operations/token-strategy-guide.md)
- [operations/log-retention](../../operations/log-retention.md)
- [operations/troubleshooting](../../operations/troubleshooting.md)

### 핵심 개념
- [knowledge/concepts/canonical-event](../concepts/canonical-event.md)
- [knowledge/concepts/read-model](../concepts/read-model.md)
- [knowledge/concepts/token-accuracy](../concepts/token-accuracy.md)
- [knowledge/concepts/stuck-detection](../concepts/stuck-detection.md)

## 문서 운영 관점
문서는 단순 명세가 아니라 지속적으로 갱신되는 위키로 유지한다.
- [architecture/doc-system-architecture](../../architecture/doc-system-architecture.md)
- [decisions/ADR-002-docs-as-wiki](../../decisions/ADR-002-docs-as-wiki.md)
- [_system/DOCS_SCHEMA](../../_system/DOCS_SCHEMA.md)
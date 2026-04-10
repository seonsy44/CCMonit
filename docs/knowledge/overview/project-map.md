---
id: KNOWLEDGE-PROJECT-MAP
title: "CCMonit 프로젝트 맵"
type: synthesis
status: active
owners: [docs-steward]
updated: 2026-04-10
tags: [knowledge, overview]
links: [[[product/PRD]], [[architecture/system-overview]]]
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
- [[product/PRD]]
- [[product/기능명세서]]
- [[product/화면명세서]]

### 시스템 관점
- [[architecture/system-overview]]
- [[architecture/event-flow]]
- [[architecture/storage-model]]
- [[architecture/adapter-contract]]
- [[architecture/module-responsibilities]]

### 운영 관점
- [[operations/token-strategy-guide]]
- [[operations/log-retention]]
- [[operations/troubleshooting]]

### 핵심 개념
- [[knowledge/concepts/canonical-event]]
- [[knowledge/concepts/read-model]]
- [[knowledge/concepts/token-accuracy]]
- [[knowledge/concepts/stuck-detection]]

## 문서 운영 관점
문서는 단순 명세가 아니라 지속적으로 갱신되는 위키로 유지한다.
- [[architecture/doc-system-architecture]]
- [[decisions/ADR-002-docs-as-wiki]]
- [[_system/DOCS_SCHEMA]]

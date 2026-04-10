---
id: CONCEPT-DOCS_AS_WIKI
title: "Docs As Wiki"
type: concept
status: active
owners: [architecture]
updated: 2026-04-10
tags: [concept, docs-as-wiki]
links: [[[knowledge/overview/project-map]]]
---


# Docs as Wiki

## 정의
문서를 정적인 보관함이 아니라, 새 source와 새 질문이 들어올 때마다 갱신되는 **지속형 지식 계층**으로 운영하는 방식이다.

## CCMonit에서 필요한 이유
- 제품/아키텍처/운영 문서가 빠르게 분화될 가능성이 크다
- 토큰 전략, 운영 노하우, 설계 결정이 계속 바뀐다
- 질문 응답을 장기 자산으로 남겨야 저비용 세션 운영에 유리하다

## 핵심 장치
- `index.md`
- `log.md`
- `_system/*`
- `registry/*`
- `sources/*`
- `knowledge/*`

## 관련 문서
- [[architecture/doc-system-architecture]]
- [[decisions/ADR-002-docs-as-wiki]]

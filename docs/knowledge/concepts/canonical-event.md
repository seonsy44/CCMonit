---
id: CONCEPT-CANONICAL_EVENT
title: "Canonical Event"
type: concept
status: active
owners: [architecture]
updated: 2026-04-10
tags: [concept, canonical-event]
links: [[[knowledge/overview/project-map]]]
---


# Canonical Event

## 정의
외부 로그, harness 출력, 파일 시스템 이벤트를 CCMonit 내부 표준 구조로 정규화한 이벤트다.

## 핵심 역할
- 저장 형식의 일관성 확보
- TUI / reporter / alerting / replay 공통 기반 제공
- 외부 로그 포맷 변화 흡수

## 중요한 메타
- event_id
- session_id
- category
- actor / target / parent_ref
- source
- accuracy
- confidence_score
- correlation / causation / trace

## 관련 문서
- [[architecture/event-flow]]
- [[knowledge/concepts/read-model]]

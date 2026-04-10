---
id: ENTITY-SESSION
title: "Session"
type: entity
status: active
owners: [architecture]
updated: 2026-04-10
tags: [entity, session]
links:
  - ../overview/project-map.md
---


# Session

## 정의
CCMonit에서 session은 한 번의 Claude Code 실행 맥락을 나타내는 최상위 추적 단위다.

## 왜 중요한가
- 모든 이벤트는 최소한 하나의 session에 귀속된다.
- 보고서, 이벤트 저장, 요약 스냅샷, 토큰 집계의 기본 단위다.

## 주요 속성
- session id
- 시작/종료 시각
- 상태(active, completed, failed 등)
- 누적 토큰
- 최근 이벤트 시각
- 관련 agent / task 수

## 관련 문서
- [architecture/event-flow](../../architecture/event-flow.md)
- [knowledge/entities/agent](agent.md)
- [knowledge/entities/token-usage](token-usage.md)
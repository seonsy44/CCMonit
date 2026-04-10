---
id: ENTITY-SKILL
title: "Skill"
type: entity
status: active
owners: [architecture]
updated: 2026-04-10
tags: [entity, skill]
links:
  - ../overview/project-map.md
---


# Skill

## 정의
Skill은 Claude Code 또는 하네스가 수행하는 재사용 가능한 작업 패턴/절차다.

## 문서 관점에서 중요한 이유
같은 목적의 task라도 어떤 skill 조합을 썼는지에 따라 토큰 비용과 성공률이 달라질 수 있다.

## 추적 포인트
- skill invocation 시작/종료
- parent task
- 내부 tool call
- input/output 토큰
- 반복 호출 여부

## 관련 문서
- [knowledge/entities/tool-usage](tool-usage.md)
- [operations/token-strategy-guide](../../operations/token-strategy-guide.md)
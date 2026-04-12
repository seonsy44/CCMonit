---
id: ENTITY-TASK
title: 'Task'
type: entity
status: active
owners: [architecture]
updated: 2026-04-10
tags: [entity, task]
links:
  - ../overview/project-map.md
---

# Task

## 정의

Task는 사용자가 실제로 이해하고 싶은 **업무 단위**다.  
예: 테스트 보강, 리팩터링, 분석, 성능 점검.

## 중요한 이유

- 보고서에서 가장 많이 회고되는 단위다.
- skill / tool / file activity / token usage를 연결해 해석하기 좋다.

## 추적 포인트

- 시작/종료
- parent agent
- 관련 skill/tool
- 관련 파일
- retry 여부
- stuck 여부

## 관련 문서

- [knowledge/entities/skill](skill.md)
- [knowledge/entities/tool-usage](tool-usage.md)
- [knowledge/concepts/stuck-detection](../concepts/stuck-detection.md)

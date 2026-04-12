---
id: CONCEPT-READ_MODEL
title: 'Read Model'
type: concept
status: active
owners: [architecture]
updated: 2026-04-10
tags: [concept, read-model]
links:
  - ../overview/project-map.md
---

# Read Model

## 정의

Append-only event stream을 projector가 해석해 만든 현재 상태 모델이다.

## 왜 분리하는가

- 저장은 이벤트 기준으로 하고
- 화면과 리포트는 읽기 쉬운 상태를 필요로 하기 때문이다

## 예시

- active task list
- token leaderboard
- recent file activity
- alert summary

## 관련 문서

- [architecture/event-flow](../../architecture/event-flow.md)
- [architecture/storage-model](../../architecture/storage-model.md)

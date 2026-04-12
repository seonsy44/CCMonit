---
id: ENTITY-TOKEN_USAGE
title: 'Token Usage'
type: entity
status: active
owners: [architecture]
updated: 2026-04-10
tags: [entity, token-usage]
links:
  - ../overview/project-map.md
---

# Token Usage

## 정의

Token Usage는 session / agent / task / skill / tool 수준에서 측정하거나 추정한 토큰 소모량이다.

## 세부 항목

- input
- output
- cache read
- cache write
- total
- accuracy

## 해석 원칙

절대량만 보지 않고 아래를 함께 본다.

- 어떤 단위가 비쌌는가
- 왜 비쌌는가
- 같은 목적 작업 대비 편차가 큰가
- retry / loop와 함께 증가했는가

## 관련 문서

- [knowledge/concepts/token-accuracy](../concepts/token-accuracy.md)
- [operations/token-strategy-guide](../../operations/token-strategy-guide.md)
- [knowledge/syntheses/token-optimization-hypotheses](../syntheses/token-optimization-hypotheses.md)

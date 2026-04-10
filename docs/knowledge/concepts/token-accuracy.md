---
id: CONCEPT-TOKEN_ACCURACY
title: "Token Accuracy"
type: concept
status: active
owners: [architecture]
updated: 2026-04-10
tags: [concept, token-accuracy]
links:
  - ../overview/project-map.md
---


# Token Accuracy

## 정의
토큰 수치가 얼마나 직접적이고 신뢰 가능한지를 나타내는 상태 모델이다.

## 상태
- `exact`: 원천에서 직접 확인
- `derived`: 다른 수치 조합으로 계산
- `estimated`: 휴리스틱 기반 추정
- `unavailable`: 알 수 없음

## 문서 운영 원칙
문서에서도 추정값을 사실처럼 쓰지 않는다.  
수치가 추정일 경우 정확도 상태를 함께 기록한다.

## 관련 문서
- [operations/token-strategy-guide](../../operations/token-strategy-guide.md)
- [knowledge/entities/token-usage](../entities/token-usage.md)
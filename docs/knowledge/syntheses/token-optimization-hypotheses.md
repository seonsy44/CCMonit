---
id: SYNTHESIS-TOKEN-HYP
title: '토큰 최적화 가설'
type: synthesis
status: active
owners: [operations]
updated: 2026-04-10
tags: [synthesis, tokens, cost]
links:
  - ../../operations/token-strategy-guide.md
  - ../../product/open-questions.md
---

# 토큰 최적화 가설

현재 문서를 바탕으로 세운 초기 가설이다. 실제 구현/운영 후 계속 수정한다.

## 가설 1

가장 큰 비용 원인은 총량 자체보다 **특정 task에서의 input 누적**일 가능성이 높다.

## 가설 2

도구별 token breakdown을 보면, 동일 목적 task 사이의 편차가 커서 **skill 사용 방식** 차이가 드러날 가능성이 있다.

## 가설 3

stuck 또는 retry loop와 token spike를 함께 관찰하면, “왜 비쌌는가”를 설명하는 데 도움이 된다.

## 가설 4

정확도 상태(`exact`, `derived`, `estimated`)를 같이 저장하지 않으면 운영자가 수치 신뢰성을 과대평가할 위험이 있다.

## 후속

- 실제 세션 로그 기반 보고서가 쌓이면 이 페이지를 갱신한다.
- 반복적으로 확인되는 패턴은 `operations/token-strategy-guide.md`로 승격한다.

---
id: OPS-TOKEN-STRATEGY
title: "CCMonit 토큰 전략 가이드"
type: guide
status: active
owners: [operations]
updated: 2026-04-10
tags: [operations, tokens]
links: [[[knowledge/entities/token-usage]], [[knowledge/syntheses/token-optimization-hypotheses]]]
---
# CCMonit 토큰 전략 가이드

## 왜 필요한가
토큰 총량만 보면 비용 원인을 이해하기 어렵다. CCMonit은 작업 단위·도구 단위·에이전트 단위로 토큰을 쪼개어 관찰하는 것을 목표로 한다.

## 먼저 볼 지표
1. 세션 총 토큰
2. input / output 비중
3. cache read / write 비중
4. 상위 토큰 소비 task
5. 상위 토큰 소비 tool / skill
6. 재시도 횟수와 토큰 급증의 동시 발생 여부

## 해석 팁
- input 과다: 컨텍스트 누적, 장문 프롬프트, 반복 재주입 가능성
- output 과다: 장문 생성, verbose 요약, 과도한 intermediate dump 가능성
- cache write 과다: 긴 컨텍스트 생성 구간 가능성
- cache read 과다: 반복 탐색 또는 큰 메모리 활용 가능성

## 운영 추천
- 세션별 예산과 경고 임계치 정의
- 정확도 상태가 estimated 인 수치는 별도 표기
- agent / team 별 토큰 편차가 큰지 확인
- 동일 목적 task 간 토큰 편차 비교
- 실패 후 재시도 루프와 토큰 급증을 함께 감시

## 회고 시 질문
- 가장 비싼 task 는 무엇이었는가
- 왜 비쌌는가: context, tool loop, output 폭증, retry 중 무엇인가
- 어떤 스킬/도구가 비용 효율이 낮았는가
- cache 활용이 비용 절감에 도움이 되었는가

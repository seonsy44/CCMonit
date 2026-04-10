---
id: SYNTHESIS-MVP-OBS
title: "MVP 관찰 전략"
type: synthesis
status: active
owners: [architecture, operations]
updated: 2026-04-10
tags: [synthesis, mvp, observability]
links: [[[product/roadmap]], [[operations/token-strategy-guide]]]
---

# MVP 관찰 전략

## 요약
MVP 단계에서 CCMonit은 **완벽한 추적**보다 **운영자가 바로 해석 가능한 관찰**을 우선해야 한다.

## 우선순위
1. active session / agent / task 파악
2. 최근 skill / tool / file activity 파악
3. token hotspot 파악
4. stuck / error / adapter health 파악
5. 세션 종료 후 회고 가능성 확보

## 일부를 나중으로 미뤄도 되는 것
- 복잡한 multi-session 비교
- 정교한 비용 모델
- 고급 검색 인프라
- 자동 문서 lint 스크립트

## 이유
저비용 플랜 환경에서는 한 번에 많은 구현을 하기 어렵다.  
따라서 운영에 직접 도움이 되는 read model과 문서 체계를 먼저 잡는 편이 전체 생산성이 높다.

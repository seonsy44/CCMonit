---
id: PRODUCT-ROADMAP
title: "CCMonit 제품 로드맵"
type: spec
status: active
owners: [product]
updated: 2026-04-10
tags: [roadmap, mvp]
links:
  - PRD.md
  - ../operations/release-readiness-checklist.md
---

# CCMonit 제품 로드맵

## Phase 1. MVP
목표: **지금 무슨 작업이 일어나는지 + 세션 종료 후 회고 가능** 상태 만들기

포함:
- 단일 세션 실시간 모니터
- session / agent / task / skill / tool / file / alert / token 기본 표시
- canonical event 저장
- markdown/json/csv 보고서
- stuck / token spike / adapter health 경고

## Phase 2. 분석 강화
목표: **토큰 전략 수립과 비교 회고 지원**

포함:
- session 간 비교
- skill / tool / task 별 비용 비교
- cache read/write 시각화
- retry loop 패턴 감지
- 쿼리 결과를 문서 자산으로 편입

## Phase 3. 유지보수/운영 강화
목표: **문서와 운영이 함께 굴러가는 개발 체계**

포함:
- docs lint 정례화
- query 결과 저장 자동화
- source ingest 템플릿 고도화
- 문서 검색 도구 또는 간단한 local search 도입 검토

## Phase 4. 확장
- multi-session
- 팀/하네스별 비교
- 원격 수집기
- 더 정교한 anomaly detection
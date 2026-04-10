---
id: REPORT-DOCS-HEALTH-BASELINE
title: "문서 건강 상태 베이스라인"
type: report
status: active
owners: [docs-steward]
updated: 2026-04-10
tags: [report, docs-health]
links: [[[_system/LINT_WORKFLOW]], [[index]]]
---

# 문서 건강 상태 베이스라인

## 목적
현재 시점의 `docs/` 구조를 기준선으로 남겨, 이후 문서가 어떻게 건강하게 유지되는지 비교하기 위함이다.

## 현재 강점
- product / architecture / operations / decisions의 상위 구분이 이미 존재한다.
- 이벤트 모델과 모듈 책임 문서가 별도 존재해 아키텍처 기반이 있다.
- 토큰 전략, 로그 보존, 트러블슈팅 같은 운영 문서가 이미 있다.

## 보완한 점
- `index.md`와 `log.md` 추가
- `_system/`에 운영 규칙과 워크플로우 추가
- `registry/`에 page/source 카탈로그 추가
- `knowledge/`에 재사용 지식 계층 추가
- `sources/`에 source summary 도입
- 질의 결과를 축적할 `reports/queries/` 경로 마련

## 현재 리스크
- 아직 query 결과가 실제로 축적되지 않았다
- source page와 spec 갱신 사이의 실제 운영 루틴은 앞으로 검증이 필요하다
- knowledge 페이지는 현재 초깃값이며, 구현 진행과 함께 더 촘촘히 갱신되어야 한다

## 권장 다음 액션
1. 앞으로의 설계 대화/질문 결과를 `sources/`와 `reports/queries/`에 실제로 반영한다.
2. 큰 결정이 나올 때마다 ADR를 작성한다.
3. 주 1회 lint 관점으로 중복/고아/최신성 점검을 수행한다.

---
id: DOCS-QUERY-WORKFLOW
title: "문서 Query 워크플로우"
type: guide
status: active
owners: [docs-steward]
updated: 2026-04-10
tags: [workflow, query]
links: [[[index]], [[reports/queries/README]]]
---

# 문서 Query 워크플로우

질문에 대한 답변을 **문서 자산**으로 되돌려 넣는 절차다.

## 1. 우선 읽을 문서
질문을 받으면 다음 순서로 훑는다.

1. `index.md`
2. 관련 spec 문서
3. 관련 `knowledge/` 페이지
4. 관련 `reports/`
5. 필요 시 `sources/`

## 2. 답변 형태 결정

- 단순 확인 → 채팅으로 답하고 종료 가능
- 여러 문서 종합 → `reports/queries/`에 남길 가치 큼
- 장기적으로 재사용될 통찰 → `knowledge/syntheses/` 또는 기존 concept/entity page 반영
- 정책/구조 변경 → `ADR` 또는 `operations/` 문서로 승격

## 3. 남겨야 하는 답변의 기준

다음 중 하나라도 만족하면 문서로 남긴다.

- 나중에 다시 물을 가능성이 높다
- 여러 문서를 종합해야 한다
- 구현 방향에 영향을 준다
- 운영 기준을 바꾼다
- 비용/토큰/품질 전략에 영향을 준다

## 4. 추천 저장 위치

- 질의 결과 기록: `reports/queries/`
- 재사용 가능한 결론: `knowledge/syntheses/`
- 기존 개념 강화: 관련 `knowledge/concepts/*`
- 제품 범위 변경: `product/*`
- 아키텍처 경계 변경: `architecture/*` 또는 `decisions/*`

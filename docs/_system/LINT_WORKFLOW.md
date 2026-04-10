---
id: DOCS-LINT-WORKFLOW
title: "문서 Lint 워크플로우"
type: guide
status: active
owners: [docs-steward]
updated: 2026-04-10
tags: [workflow, lint, health-check]
links:
  - ../reports/docs-health-baseline.md
  - ../registry/page-index.md
---

# 문서 Lint 워크플로우

문서 건강 상태를 점검하는 절차다.

## 점검 항목

### 1. 중복
- 같은 내용을 서로 다른 문서가 다르게 말하고 있는가?
- 한 문서가 다른 문서 내용을 불필요하게 반복하는가?

### 2. 최신성
- 구현이 변했는데 spec이 그대로인가?
- workflow가 바뀌었는데 operations가 뒤따르지 않았는가?

### 3. 링크 구조
- 고아 페이지가 있는가?
- 허브 페이지에 링크가 몰려 있는데 실질적 설명이 없는가?
- 새 문서를 만들고 index/page-index를 갱신하지 않았는가?

### 4. 불확실성
- 추정값을 사실처럼 쓰고 있지 않은가?
- 초안과 확정본이 섞여 있지 않은가?

### 5. 문서 역할 혼합
- spec 문서가 회고 내용을 과하게 품고 있지 않은가?
- report 문서가 장기 지식 페이지 역할을 대신하고 있지 않은가?

## 산출물

Lint 결과는 `reports/` 아래에 날짜를 넣어 기록한다.

예시:
- `reports/docs-health-baseline.md`
- `reports/docs-health-2026-04-20.md`

## 처리 원칙

- lint는 삭제보다 **재배치와 링크 수정**을 우선한다.
- 불일치가 보이면 source를 추적한 뒤, 필요한 경우 ADR 또는 synthesis로 승격한다.
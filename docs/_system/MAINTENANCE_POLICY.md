---
id: DOCS-MAINTENANCE-POLICY
title: '문서 유지보수 정책'
type: policy
status: active
owners: [docs-steward]
updated: 2026-04-10
tags: [maintenance, operations]
links:
  - ../operations/docs-operations.md
  - ../log.md
---

# 문서 유지보수 정책

## 주기

### 매 세션

- 관련 문서 1~3개 갱신
- `index.md` 또는 `registry/page-index.md` 반영 여부 확인
- `log.md` 기록

### 매 주

- `reports/docs-health-baseline.md` 기준으로 lint 항목 재검토
- `product/open-questions.md` 정리
- `operations/release-readiness-checklist.md` 갱신

### 주요 의사결정 직후

- ADR 작성 또는 기존 ADR 갱신
- 관련 knowledge/concept page 갱신
- source page 기록

## 금지 규칙

- 출처를 잃은 사실성 서술을 늘리지 않는다.
- 같은 설명을 4곳 이상 복붙하지 않는다.
- 채팅에서 나온 중요한 판단을 문서화 없이 방치하지 않는다.

## 권장 규칙

- “이 문서는 무엇을 소유하는가?”를 항상 유지한다.
- 구현 세부는 아키텍처에, 운영 노하우는 operations에, 재사용 개념은 knowledge에 둔다.

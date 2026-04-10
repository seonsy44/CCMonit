---
id: DOCS-OWNERSHIP-MATRIX
title: "문서 책임 매트릭스"
type: registry
status: active
owners: [docs-steward]
updated: 2026-04-10
tags: [ownership, governance]
links:
  - page-index.md
  - ../operations/docs-operations.md
---

# 문서 책임 매트릭스

| 영역 | 1차 책임 | 보조 책임 | 소유하는 것 | 소유하지 않는 것 |
|---|---|---|---|---|
| `product/` | product | docs-steward | 문제 정의, 목표, 범위, 기능, 화면 | 구현 상세 |
| `architecture/` | architecture | docs-steward | 경계, 이벤트, 저장, 어댑터, 모듈 책임 | 일정/우선순위 |
| `operations/` | operations | architecture | 운영 기준, 회고, 보존, 문제 해결 | 제품 비전 |
| `decisions/` | architecture | product | 왜 이 결정을 내렸는가 | 상세 구현 코드 |
| `knowledge/` | docs-steward | architecture/product | 재사용 개념, 엔티티, 종합 관찰 | 시점성 강한 회고 |
| `reports/` | operations | docs-steward | 시점이 있는 분석 결과 | 장기 기준 문서 |
| `_system/` | docs-steward | architecture | 문서 시스템 운영 방식 | 제품 기능 결정 |

## 운영 포인트
- 문서 내용이 어디로 가야 할지 모호하면 먼저 **누가 장기 책임을 져야 하는지** 본다.
- 동일 내용을 여러 폴더에 중복 저장하지 않는다.
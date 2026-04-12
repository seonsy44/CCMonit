---
id: PRODUCT-OPEN-QUESTIONS
title: 'CCMonit 오픈 질문'
type: spec
status: active
owners: [product]
updated: 2026-04-10
tags: [open-questions]
links:
  - roadmap.md
  - ../decisions/ADR-002-docs-as-wiki.md
---

# CCMonit 오픈 질문

## 제품/운영

- 토큰 비용은 단순 절대값보다 **비용 원인 설명**에 얼마나 집중할 것인가?
- 처음부터 multi-session을 넣지 않더라도, 비교 회고를 어느 시점에 넣을 것인가?
- 사용자에게 “정확한 수치”와 “추정 수치”를 어떤 화면 언어로 구분해 줄 것인가?

## 문서 시스템

- `reports/queries/` 결과 중 어떤 것은 `knowledge/syntheses/`로 승격할 것인가?
- 린트 결과를 수동으로만 유지할지, 이후 간단한 스크립트나 검색 도구를 붙일지?
- source summary의 granularity를 어느 수준까지 유지할지?

## 구현

- SQLite를 MVP에 포함할지, NDJSON-only로 시작할지?
- TUI 패널별 갱신 빈도를 어떻게 나눌지?
- 파일 활동과 task를 연결하는 규칙의 confidence threshold를 어디에 둘지?

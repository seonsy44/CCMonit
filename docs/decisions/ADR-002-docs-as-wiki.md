---
id: ADR-002
title: "ADR-002: docs를 지속형 위키로 운영한다"
type: decision
status: active
owners: [architecture, docs-steward]
updated: 2026-04-10
tags: [adr, docs-system, wiki]
links:
  - ../architecture/doc-system-architecture.md
  - ../_system/DOCS_SCHEMA.md
---

# ADR-002: docs를 지속형 위키로 운영한다

## 상태
승인 초안

## 맥락
기존의 문서 구조는 폴더별 정리에는 유리하지만, 시간이 지나면 다음 문제가 생긴다.

- 질문에 대한 좋은 답이 문서로 축적되지 않음
- 기존 문서 간 불일치가 누적됨
- 어떤 문서가 기준인지 파악하기 어려움
- 유지보수 비용이 문서 수 증가보다 더 빠르게 커짐

## 결정
`docs/`를 단순 산출물 보관소가 아니라 **지속형 프로젝트 위키**로 운영한다.

구체적으로는:
- `index.md`와 `log.md`를 둔다
- `_system/`에 문서 운영 규칙을 둔다
- `registry/`에 페이지/출처 카탈로그를 둔다
- `knowledge/`를 별도 계층으로 둔다
- `reports/`에 질의 결과/헬스체크 결과를 파일링한다
- 새 source는 `sources/` summary page를 통해 위키에 편입한다

## 결과
장점:
- 답변과 통찰이 프로젝트 자산으로 누적된다
- LLM이 문서를 유지보수하기 쉬워진다
- 중복과 모순을 관리하기 쉬워진다

단점:
- 초기 문서 구조가 더 복잡해진다
- index/log/registry를 꾸준히 갱신해야 한다

## 후속
- query 결과의 승격 기준을 더 정교하게 만든다
- 문서 건강 상태를 정기적으로 점검하는 루틴을 유지한다
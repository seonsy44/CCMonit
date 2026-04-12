---
id: SRC-0005
title: 'LLM Wiki 컨셉'
type: source
status: active
owners: [docs-steward]
updated: 2026-04-10
tags: [source, docs-system, wiki]
links:
  - ../architecture/doc-system-architecture.md
  - ../decisions/ADR-002-docs-as-wiki.md
---

# SRC-0005 LLM Wiki 컨셉

## source 정보

- 출처: 첨부된 `붙여넣은 마크다운(1).md`
- 신뢰 수준: 참조 컨셉

## 핵심 포인트

- 문서는 raw source에서 질의 때마다 다시 조합하는 방식이 아니라, **증분적으로 갱신되는 persistent wiki**여야 한다.
- 문서 시스템은 `raw sources`, `wiki`, `schema`의 세 계층으로 본다.
- ingest / query / lint가 별도 운영 루틴으로 존재해야 한다.
- `index.md`는 콘텐츠 지향, `log.md`는 시간 지향으로 역할을 분리한다.
- 답변 결과도 다시 위키에 파일링해 지식이 누적되게 한다.

## CCMonit에 적용한 방식

- `docs/`를 위키형 구조로 재설계했다.
- `_system/`, `registry/`, `knowledge/`, `reports/`, `sources/`를 추가했다.
- `index.md`와 `log.md`를 핵심 네비게이션 장치로 채택했다.

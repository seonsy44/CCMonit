---
id: ARCH-DOC-SYSTEM
title: '문서 시스템 아키텍처'
type: spec
status: active
owners: [docs-steward]
updated: 2026-04-10
tags: [docs-system, architecture, wiki]
links:
  - ../_system/DOCS_SCHEMA.md
  - ../decisions/ADR-002-docs-as-wiki.md
---

# 문서 시스템 아키텍처

이 문서는 `docs/` 폴더를 **유지보수 가능한 문서 시스템**으로 다루기 위한 구조를 정의한다.

## 1. 배경

기존 `docs/`는 기획서·명세서·운영 가이드가 폴더별로 정리되어 있었지만, 시간이 지나면 다음 문제가 생기기 쉽다.

- 어떤 문서가 최신 기준인지 모호해짐
- 질문에 답한 중요한 통찰이 채팅에만 남고 문서에 축적되지 않음
- 구현/운영 변화가 여러 문서에 분산되어 불일치가 생김
- 새 문서를 만들수록 찾기와 정비 비용이 커짐

## 2. 구조 원칙

### A. source 와 wiki를 구분한다

- raw source는 가능한 한 원형을 유지한다.
- `docs/sources/`는 raw 자체가 아니라 **source summary page**를 둔다.

### B. spec 와 knowledge를 구분한다

- `product/`, `architecture/`, `operations/`, `decisions/`는 기준 문서다.
- `knowledge/`는 기준 문서 사이를 이어주는 재사용 지식 계층이다.

### C. schema 를 문서 안에 명시한다

- `_system/`과 `registry/`가 문서 유지의 규칙과 카탈로그를 담당한다.
- `index.md`는 콘텐츠 중심, `log.md`는 시간 중심이다.

## 3. 권장 흐름

```text
raw idea / conversation / result
            ↓
     source summary page
            ↓
 update spec / knowledge / report
            ↓
   update index / registry / log
            ↓
 periodic lint and consolidation
```

## 4. 주요 역할

- `index.md`: 사람이 가장 먼저 읽는 길찾기 문서
- `registry/page-index.md`: 운영용 전체 목록
- `registry/source-index.md`: 출처 추적
- `log.md`: append-only 작업 이력
- `_system/*`: LLM과 사람이 공유하는 운영 규약
- `reports/*`: 시점성이 강한 분석
- `knowledge/*`: 계속 누적되는 개념/엔티티/합성 지식

## 5. 기대 효과

- 같은 질문에 답할 때 기존 문서를 재조합하기 쉬워진다.
- 설계/운영/실험 결과가 채팅에만 남지 않고 프로젝트 자산으로 축적된다.
- 문서가 늘어도 인덱스와 로그, source registry 덕분에 유지보수 난이도가 완만해진다.

---
id: DOCS-ROOT-README
title: "CCMonit 문서 시스템 안내"
type: guide
status: active
owners: [docs-steward]
updated: 2026-04-11
tags: [docs-system, wiki, guide]
links:
  - index.md
  - log.md
  - _system/DOCS_SCHEMA.md
  - operations/claude-code-session-workflow.md
---

# CCMonit 문서 시스템 안내

이 `docs/` 폴더는 단순 산출물 보관소가 아니라, **계속 누적·정비·검색·회고되는 프로젝트 위키**로 운영한다.

핵심 방향은 다음과 같다.

1. **문서를 다시 쓰지 않게 한다.**
   - 기존 기획/아키텍처/운영 문서를 단발성 산출물로 두지 않고, 지식 페이지와 연결한다.
2. **새로운 정보가 들어오면 위키를 갱신한다.**
   - 새 설계 결정, 구현 변화, 실험 결과, 쿼리 결과를 기존 페이지에 통합한다.
3. **LLM이 유지보수하기 쉬운 구조로 만든다.**
   - 인덱스, 로그, 스키마, 템플릿, 링크 규칙을 명시한다.
4. **사람도 빠르게 길을 찾을 수 있어야 한다.**
   - `index.md`와 `registry/page-index.md`를 먼저 읽으면 전체 구조를 파악할 수 있게 한다.

## 문서 계층
- **운영/산출물 문서**: `product/`, `architecture/`, `operations/`, `decisions/`
- **누적 지식 문서**: `knowledge/`
- **문서 시스템 자체**: `_system/`, `registry/`, `index.md`, `log.md`
- **쿼리/감사/헬스체크 결과**: `reports/`
- **출처 관리**: `sources/`

## 가장 먼저 읽을 문서
1. [index](index.md)
2. [_system/DOCS_SCHEMA](_system/DOCS_SCHEMA.md)
3. [registry/page-index](registry/page-index.md)
4. [operations/claude-code-session-workflow](operations/claude-code-session-workflow.md)
5. [reports/docs-health-baseline](reports/docs-health-baseline.md)

## 운영 원칙
- 문서는 **최대한 링크 가능하고 재사용 가능하게** 쪼갠다.
- 새로운 사실은 기존 문서를 덮어쓰는 대신, **출처를 기록하고 관련 페이지를 갱신**한다.
- 답변 가치가 있는 분석은 채팅에서 끝내지 말고 `reports/queries/` 또는 `knowledge/syntheses/`에 남긴다.
- `log.md`는 append-only 로 운영한다.

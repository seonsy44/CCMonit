---
name: docs-ingest
description: 구현 변화나 새 source를 docs 위키에 편입한다. index, registry, source summary, log까지 함께 갱신하는 문서 유지보수 스킬.
argument-hint: [반영할 변화 또는 source]
disable-model-invocation: true
allowed-tools: Read Edit Write MultiEdit Glob Grep
---

반영 대상: **$ARGUMENTS**

## 목표
새로운 사실, 설계 변화, 외부 source, 세션 회고를 `docs/` 위키에 자연스럽게 편입한다.

## 수행 절차
1. `docs/index.md`, `docs/_system/DOCS_SCHEMA.md`, `docs/registry/page-index.md`, `docs/registry/source-index.md`, `docs/log.md`를 읽는다.
2. 반영해야 할 변화가 product / architecture / operations / knowledge / sources 중 어디에 속하는지 결정한다.
3. 기존 페이지를 우선 갱신하고, 정말 필요할 때만 새 페이지를 만든다.
4. 새 페이지를 만들면 `docs/index.md`와 `docs/registry/page-index.md`를 갱신한다.
5. 새 source 를 편입하면 `docs/sources/*`와 `docs/registry/source-index.md`를 갱신한다.
6. `docs/log.md`에 append-only 항목을 추가한다.

## 출력 형식
### Docs Ingest
- Updated pages:
- New pages:
- Registry updates:
- Log appended:
- Follow-up pages:

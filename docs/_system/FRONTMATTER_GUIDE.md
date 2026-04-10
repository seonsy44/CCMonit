---
id: DOCS-FRONTMATTER-GUIDE
title: "문서 Frontmatter 가이드"
type: guide
status: active
owners: [docs-steward]
updated: 2026-04-10
tags: [frontmatter, metadata]
links:
  - DOCS_SCHEMA.md
  - ../registry/page-index.md
---

# 문서 Frontmatter 가이드

모든 핵심 문서는 YAML frontmatter를 가진다. 목적은 3가지다.

1. 문서 역할을 빠르게 알 수 있게 한다.
2. LLM이 페이지를 정렬/갱신/분류하기 쉽게 한다.
3. Obsidian, Dataview 같은 도구와 연결 가능하게 한다.

## 최소 필드

```yaml
---
id: DOCS-EXAMPLE
title: "문서 제목"
type: spec
status: active
owners: [architecture]
updated: 2026-04-10
tags: [architecture, events]
links:
  - ../index.md
  - ../knowledge/concepts/canonical-event.md
---
```

## 필드 설명

- `id`: 문서 고유 식별자
- `title`: 표준 제목
- `type`: 문서 성격
- `status`: `active | draft | deprecated | archived`
- `owners`: 책임 주체
- `updated`: 마지막 업데이트 날짜
- `tags`: 탐색용 키워드
- `links`: 우선 읽기 연결

## status 사용 규칙

- `draft`: 아직 합의 전
- `active`: 현재 기준 문서
- `deprecated`: 대체 문서가 존재
- `archived`: 더 이상 갱신하지 않음

## owners 예시

- `product`
- `architecture`
- `operations`
- `docs-steward`

## 주의

- frontmatter가 사실의 진실성 자체를 보장하지는 않는다.
- 날짜는 문서 생성일보다 **실제 내용 갱신일**을 우선한다.
- `links`는 너무 길게 늘리지 않고, 문서의 핵심 관련 문서만 넣는다.
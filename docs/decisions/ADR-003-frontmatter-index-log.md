---
id: ADR-003
title: "ADR-003: frontmatter, index, log를 표준으로 둔다"
type: decision
status: active
owners: [docs-steward]
updated: 2026-04-10
tags: [adr, frontmatter, index, log]
links: [[[_system/FRONTMATTER_GUIDE]], [[index]], [[log]]]
---

# ADR-003: frontmatter, index, log를 표준으로 둔다

## 상태
승인 초안

## 맥락
문서 수가 늘어나면 제목만으로는 역할·최신성·소유 범위를 파악하기 어렵다.
또한 “무엇이 바뀌었는가”를 시간 흐름으로 추적하는 장치가 없으면 문서 유지보수가 힘들어진다.

## 결정
다음 3가지를 문서 시스템 표준으로 둔다.

1. **frontmatter**
   - 모든 핵심 문서는 `id`, `type`, `status`, `owners`, `updated`, `tags`, `links`를 가진다.
2. **index**
   - `index.md`를 사람이 읽는 길찾기 문서로 둔다.
3. **log**
   - `log.md`를 append-only 문서 운영 로그로 둔다.

## 결과
- LLM이 문서를 기계적으로 다루기 쉬워진다.
- 사람도 어떤 문서가 무엇을 소유하는지 빠르게 파악한다.
- 새 문서를 만들고도 인덱스 갱신을 빠뜨릴 가능성이 줄어든다.

## 후속
- 필요 시 Dataview 또는 간단한 스크립트로 자동 카탈로그 보강을 검토한다.

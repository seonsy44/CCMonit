---
id: DOCS-INGEST-WORKFLOW
title: "문서 Ingest 워크플로우"
type: guide
status: active
owners: [docs-steward]
updated: 2026-04-10
tags: [workflow, ingest]
links:
  - DOCS_SCHEMA.md
  - ../registry/source-index.md
  - ../log.md
---

# 문서 Ingest 워크플로우

새로운 source를 문서 시스템에 편입할 때의 표준 절차다.

## 1. source 식별
다음 중 하나인지 분류한다.

- 새 기획/요구사항
- 설계 초안
- 구현 결과
- 회고/리포트
- 외부 레퍼런스
- 질의 응답 결과

## 2. source page 작성
`sources/` 아래에 source summary page를 만든다.

필수 포함:
- source가 어디서 왔는지
- 핵심 포인트 3~7개
- 영향을 받는 기존 문서
- 신규로 만들 페이지 후보
- 확인이 필요한 불확실성

## 3. 반영 대상 결정
아래 중 무엇을 갱신할지 고른다.

- 기존 spec 문서
- 지식 문서(entity/concept)
- synthesis 문서
- ADR
- 운영 문서

## 4. 위키 갱신
한 source가 여러 페이지를 동시에 갱신할 수 있다.  
CCMonit에서는 보통 다음이 함께 움직인다.

- `product/` 또는 `architecture/`
- `knowledge/`
- `operations/`
- `registry/page-index.md`
- `log.md`

## 5. 출처 연결
가능하면 갱신된 문서에 다음을 남긴다.

- 어떤 source에서 왔는지
- 이전 판단과 무엇이 달라졌는지
- 아직 미해결인 쟁점은 무엇인지

## 6. 기록
`log.md`에 append-only 형식으로 남긴다.

예시:
```md
## [2026-04-10] ingest | event model revision
- updated [architecture/event-flow](../architecture/event-flow.md)
- updated [knowledge/concepts/canonical-event](../knowledge/concepts/canonical-event.md)
- added [sources/SRC-0002-event-model-spec](../sources/SRC-0002-event-model-spec.md)
```
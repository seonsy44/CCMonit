---
id: DOCS-SOURCE-INDEX
title: '문서 Source 인덱스'
type: registry
status: active
owners: [docs-steward]
updated: 2026-04-10
tags: [registry, sources]
links:
  - ../sources/README.md
  - ../log.md
---

# 문서 Source 인덱스

이 문서는 `docs/` 지식이 어떤 source에서 왔는지 추적하기 위한 카탈로그다.

| Source ID                                                                                                                    | 요약                                                | 주요 반영 대상                                                                                      |
| ---------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| [sources/SRC-0001-initial-product-docs](../sources/SRC-0001-initial-product-docs.md)                                         | 초기 기획/기능/화면 문서 묶음                       | `product/`, `knowledge/overview/project-map.md`                                                     |
| [sources/SRC-0002-event-model-spec](../sources/SRC-0002-event-model-spec.md)                                                 | 이벤트 모델 명세                                    | `architecture/event-flow.md`, `knowledge/concepts/canonical-event.md`, `knowledge/entities/*`       |
| [sources/SRC-0003-module-responsibility-spec](../sources/SRC-0003-module-responsibility-spec.md)                             | 모듈 책임 명세                                      | `architecture/module-responsibilities.md`, `registry/ownership-matrix.md`                           |
| [sources/SRC-0004-workflow-playbook](../sources/SRC-0004-workflow-playbook.md)                                               | 저비용 플랜용 실행 순서서 초안                      | `operations/claude-code-session-workflow.md`, `operations/docs-operations.md`, `product/roadmap.md` |
| [sources/SRC-0005-llm-wiki-concept](../sources/SRC-0005-llm-wiki-concept.md)                                                 | 문서를 지속형 위키로 운영하는 컨셉                  | `_system/*`, `architecture/doc-system-architecture.md`, `decisions/ADR-002-docs-as-wiki.md`         |
| [sources/SRC-0006-claude-skills-playbook-and-doc-alignment](../sources/SRC-0006-claude-skills-playbook-and-doc-alignment.md) | `.claude/` 작업 루틴과 docs 위키를 정렬한 통합 변경 | `operations/claude-code-session-workflow.md`, `.claude/*`, `WORKFLOW.md`                            |

## 사용 규칙

- 새 source를 반영하면 이 표에 새 행을 추가한다.
- source 하나가 여러 문서를 바꾸는 것이 정상이다.
- source page는 raw 원본이 아니라 **raw를 문서 시스템에 편입하기 위한 요약 페이지**다.

---
id: DOCS-SCHEMA
title: "CCMonit 문서 스키마"
type: schema
status: active
owners: [docs-steward]
updated: 2026-04-10
tags: [schema, docs-system, llm-maintenance]
links: [[[README]], [[index]], [[registry/page-index]]]
---

# CCMonit 문서 스키마

이 문서는 LLM과 사람이 함께 `docs/`를 유지보수하기 위한 **운영 스키마**다.

## 1. 목적

CCMonit 문서는 더 이상 단발성 명세 파일 모음이 아니다.  
새로운 설계, 구현 결과, 실험, 질문 응답이 들어올 때마다 **기존 지식을 갱신하고 연결하는 프로젝트 위키**로 운영한다.

## 2. 세 계층

### A. Raw sources
문서의 직접 출처. 예:
- 대화에서 생성된 초안
- 구현 결과
- 세션 회고
- 외부 레퍼런스
- 회의 기록

원칙:
- raw source 는 가능한 한 **원본을 수정하지 않는다.**
- `docs/` 안에는 raw 자체보다 **raw를 요약한 source page**를 둔다.

### B. Wiki
LLM이 유지하는 실제 지식 계층. 예:
- `product/`
- `architecture/`
- `operations/`
- `decisions/`
- `knowledge/`
- `reports/`

### C. Schema
문서 유지 규칙과 워크플로우. 예:
- `_system/`
- `registry/`
- `index.md`
- `log.md`

## 3. 문서 타입

- `index`: 길찾기 문서
- `guide`: 사용 안내 문서
- `schema`: 유지 규칙 문서
- `spec`: 명세 문서
- `decision`: ADR
- `concept`: 핵심 개념 페이지
- `entity`: 도메인 엔티티 페이지
- `synthesis`: 여러 문서를 종합한 페이지
- `report`: 질의 결과, 점검 보고서
- `source`: 출처 요약 페이지
- `registry`: 카탈로그 문서
- `log`: append-only 운영 로그
- `template`: 새 페이지 생성 템플릿

## 4. 필수 유지 규칙

1. 새 정보가 들어오면 먼저 **어느 기존 페이지를 갱신해야 하는지** 판단한다.
2. 완전히 새로운 주제일 때만 새 페이지를 만든다.
3. 새 페이지를 만들면 반드시 아래를 갱신한다.
   - `index.md`
   - `registry/page-index.md`
   - 필요 시 `registry/source-index.md`
   - `log.md`
4. 중요한 분석 결과는 채팅에만 두지 말고 `reports/` 또는 `knowledge/syntheses/`로 보존한다.
5. 문서가 서로 모순될 경우:
   - 바로 덮어쓰지 않는다.
   - source 와 최신성 차이를 명시한다.
   - `reports/docs-health-baseline.md` 또는 후속 lint 보고서에 남긴다.

## 5. 우선 링크 전략

문서를 작성할 때는 아래 순서로 링크를 고려한다.

1. 상위 개요 문서
2. 관련 entity / concept 페이지
3. source page
4. 결정 문서(ADR)
5. 운영 문서

## 6. 권장 질문

새 정보를 반영할 때 LLM은 최소한 아래를 자문한다.

- 이 정보는 기존 어떤 문서를 바꾸는가?
- 이 정보는 새로운 entity / concept page가 필요한가?
- 이 정보는 의사결정인가, 사실인가, 가설인가?
- 이 정보는 log와 source index에 남겨야 하는가?
- 이 정보는 보고서로만 남길지, 장기 지식으로 승격할지?

## 7. CCMonit에 특화된 운영 포인트

- **제품 문서**는 방향과 범위를 소유한다.
- **아키텍처 문서**는 구현 경계를 소유한다.
- **운영 문서**는 실제 사용/회고/유지 관리를 소유한다.
- **지식 문서**는 재사용 가능한 핵심 개념을 소유한다.
- **리포트 문서**는 시점이 있는 판단을 소유한다.

## 8. 권장 세션 루틴

- 새 문서/아이디어 편입: [[_system/INGEST_WORKFLOW]]
- 질문 응답을 자산화: [[_system/QUERY_WORKFLOW]]
- 건강 상태 점검: [[_system/LINT_WORKFLOW]]
- 주기 운영: [[_system/MAINTENANCE_POLICY]]

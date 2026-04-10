# docs maintenance prompt

이번 세션은 코드 구현이 아니라 **docs 시스템 유지보수 작업만** 수행한다.

## 먼저 읽을 것
- `docs/index.md`
- `docs/log.md`
- `docs/registry/page-index.md`
- `docs/registry/source-index.md`
- `docs/_system/DOCS_SCHEMA.md`
- `docs/_system/INGEST_WORKFLOW.md`
- `docs/_system/QUERY_WORKFLOW.md`
- `docs/_system/LINT_WORKFLOW.md`
- `docs/_system/MAINTENANCE_POLICY.md`
- 필요 시 `docs/knowledge/`, `docs/reports/`, `docs/sources/`

## 이번 세션에서 해야 할 일
- 누락된 index / registry / log 갱신 여부를 점검한다.
- 새로 추가되거나 바뀐 문서가 source index와 page index에 반영되었는지 본다.
- orphan page, broken link, drift, 중복 문서를 점검한다.
- 필요하면 문서 간 링크와 summary를 보강한다.
- 변경 사항을 `docs/log.md`에 남길 수 있게 정리한다.

## 작업 원칙
- raw source를 직접 수정하지 않는다.
- wiki 문서와 registry 문서를 분리해서 다룬다.
- 내용 추가보다 구조 정합성을 우선한다.
- 세션이 길어지면 lint / ingest / rewrite를 따로 분리한다.

## 원하는 출력
1. docs 건강 상태 요약
2. 이번 세션에서 고칠 우선순위 1~3개
3. 수정 대상 문서 목록
4. 갱신해야 할 index / registry / log 항목
5. 종료 시 남길 log entry 초안

## 추가 지시
문서 변경 범위가 크면 한 번에 다 하지 말고, 작은 정비 배치로 나눠서 제안해줘.

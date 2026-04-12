# Docs System Summary

`docs/`는 단순 산출물 보관소가 아니라 **지속 관리형 프로젝트 위키**다.

핵심 구성:

- `docs/index.md`: 콘텐츠 탐색용 인덱스
- `docs/log.md`: append-only 운영 로그
- `docs/_system/*`: 스키마, frontmatter, ingest/query/lint/maintenance 규칙
- `docs/registry/*`: 전체 페이지 목록, source 목록, glossary, ownership
- `docs/product|architecture|operations|decisions`: 기준 문서
- `docs/knowledge/*`: 재사용 가치가 큰 누적 지식
- `docs/reports/*`: 질의/감사/헬스체크 결과
- `docs/sources/*`: raw source 를 위키에 편입하기 위한 요약 페이지

문서 작업 시 사고 순서:

1. 기준 문서가 먼저다: `product/`, `architecture/`, `operations/`, `decisions/`
2. 그다음 운영 문서를 맞춘다: `index.md`, `registry/page-index.md`, `log.md`
3. 세션 운영 흐름의 source of truth는 `docs/operations/claude-code-session-workflow.md`
4. `.claude/context/*`는 docs 요약본이므로, docs와 충돌하면 docs를 우선한다.

운영 원칙:

- 기준 문서를 먼저 갱신한다.
- 새 문서를 만들면 index / registry 를 같이 갱신한다.
- 중요 변경은 `docs/log.md`에 append 한다.
- Claude Code 운영 흐름의 source of truth는 `docs/operations/claude-code-session-workflow.md`다.
- 간소화된 현재 스킬 구조는 `dev-kickoff`(optional), `dev-open`, `dev-sprint`, `dev-close`, `dev-check`(optional) 다섯 개다.

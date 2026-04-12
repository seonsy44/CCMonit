# dev-kickoff prompt

이번 세션을 시작하기 위한 진입 템플릿이다. `/dev-kickoff` 스킬을 실행한다.

## 먼저 읽을 것
- `CLAUDE.md`
- `docs/operations/claude-code-session-workflow.md`
- `.claude/context/product-summary.md`
- `.claude/context/architecture-summary.md`
- `.claude/context/docs-system-summary.md`
- `.claude/context/glossary.md`
- `.claude/scratch/notes.md`
- `.claude/scratch/dev-list.md` (있으면)
- `.claude/scratch/devs/` 하위 디렉토리 목록 + 각 진행 중 dev의 `next-prompt.md`
- 필요 시 `docs/index.md`, `docs/log.md`, `docs/registry/page-index.md`

## 이번 세션 목표
- 현재 프로젝트 상태에서 가능한 개발건 후보 2~5개를 도출한다.
- 각 후보의 예상 스프린트(2~3개), 긴급도, 불확실성을 정리한다.
- 결과를 `.claude/scratch/dev-list.md`에 table 형식으로 추가한다.
- 1순위 추천 개발건과 다음 단계 (`/dev-open {slug}`)를 안내한다.

## 작업 원칙
- docs를 source of truth로 본다.
- 개발건은 `dev-open`에 slug 파라미터로 줄 수 있는 단위로 정의한다.
- 완료 후 dev-list는 "아직 시작 안 한 개발건" 목록으로 유지된다.

## 원하는 출력
1. 프로젝트 상태 요약 (1~3문장)
2. 개발건 후보 table (slug, 예상 스프린트, 긴급도, 불확실성, 선행 조건)
3. 1순위 추천 + 이유
4. 다음 단계: `/dev-open {slug}`

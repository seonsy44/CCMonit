# flow-start prompt

이번 세션을 시작하기 위한 진입 템플릿이다. `/flow-start` 스킬을 실행한다.

## 먼저 읽을 것
- `CLAUDE.md`
- `docs/operations/claude-code-session-workflow.md`
- `.claude/context/product-summary.md`
- `.claude/context/architecture-summary.md`
- `.claude/context/docs-system-summary.md`
- `.claude/context/glossary.md`
- `.claude/scratch/next-prompt.md`
- `.claude/scratch/worklog.md`
- `.claude/scratch/open-questions.md`
- 필요 시 `docs/index.md`, `docs/log.md`, `docs/registry/page-index.md`

## 이번 세션 목표
- 지금 바로 할 수 있는 작업 후보 1~3개를 추천한다.
- 각 후보의 범위 크기(넓은/보통/좁은)와 이유를 짧게 적는다.
- 사용자가 선택하면 이번 세션 작업 목록, stop line, flow-work 순서를 확정한다.

## 작업 원칙
- docs를 source of truth로 본다.
- 각 작업은 독립된 커밋 단위로 처리한다.
- 완료 후 `.claude/scratch/`를 다음 세션이 읽을 수 있는 상태로 남긴다.

## 원하는 출력
1. 작업 후보 1~3개 (범위 크기 포함)
2. 이번 세션 작업 목록 (선택 후 확정)
3. 세션 stop line
4. `/flow-work` 실행 순서

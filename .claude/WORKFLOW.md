# .claude Workflow Pointer

이 저장소의 workflow source of truth는 `docs/operations/claude-code-session-workflow.md`이다.

Claude Code는 작업 전에 아래 순서로 읽는다.
1. `docs/index.md`
2. `docs/_system/DOCS_SCHEMA.md`
3. `docs/registry/page-index.md`
4. `docs/operations/claude-code-session-workflow.md`
5. `.claude/context/*.md`
6. 필요 시 `.claude/skills/_shared/*.md`
7. `.claude/scratch/*`

이 파일은 짧은 진입 포인터만 제공한다. 세션 루틴, 배치 분할, ASCII 다이어그램, 종료 체크리스트는 `docs/operations/claude-code-session-workflow.md`를 따른다.

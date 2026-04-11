# .claude Workflow Pointer

이 저장소의 workflow source of truth는 `docs/operations/claude-code-session-workflow.md`이다.

핵심만 요약하면:
1. `/session-start [목표]`
2. `/token-budget-plan [optional]`
3. `/scope-map [범위]`
4. `/slice-work [작업 단위]`
5. 구현 스킬 1개 또는 docs 스킬 1개
6. `/manual-verify [배치명]`
7. `/update-context [optional]`
8. `/resume-next`
9. `/handoff-report [optional]`

고정 의미:
- `session-start`는 시작 시 현재 `docs/`, `.claude/context/`, `.claude/scratch/`를 읽는다.
- `resume-next`는 종료 시 다음 세션용 handoff를 남긴다.
- `handoff-report`는 큰 세션에서만 선택적으로 쓴다.

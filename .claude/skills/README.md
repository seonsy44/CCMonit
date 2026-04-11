# ccmonit Claude Skills Pack

이 폴더는 **저렴한 요금제 / 짧은 세션 / 여러 번 이어서 작업**을 전제로 설계한 Claude Code 스킬 모음이다.

핵심 원칙:
- 한 번에 한 배치만 처리한다.
- 한 세션에서 바꾸는 파일 수를 최대한 줄인다.
- 매 세션 종료 전에 다음 세션이 바로 이어받을 수 있도록 문맥을 남긴다.
- 구현보다 먼저 범위, 종료선(stop line), 수용 기준을 고정한다.
- 자동 호출보다는 수동 `/skill-name` 호출을 기본으로 한다.
- `docs/`는 항상 source of truth 후보이므로, 구조 변경 시 같이 갱신할지 검토한다.

먼저 읽을 문서:
1. `CLAUDE.md`
2. `docs/operations/claude-code-session-workflow.md`
3. `.claude/context/*.md`
4. `.claude/skills/_shared/*.md`
5. `.claude/scratch/*`

권장 순서:
1. `/session-start [목표]`
2. `/token-budget-plan [optional]`
3. `/scope-map [영역]`
4. `/slice-work [작업]`
5. 구현 스킬 1개 또는 docs 스킬 1개
6. `/manual-verify [배치명]`
7. `/update-context [optional]`
8. `/resume-next`
9. `/handoff-report [optional]`

구조 원칙:
- `.claude/context/`는 사람+일반 세션 공용 안정 요약을 둔다.
- `.claude/skills/_shared/`는 여러 스킬이 공통으로 읽는 실행 컨텍스트를 둔다.
- 세션 handoff 정보는 `.claude/scratch/`에 둔다.
- `resume-next`는 시작 단계가 아니라 종료 단계에 둔다.

문서 유지보수용 스킬:
- `/docs-ingest`
- `/docs-lint`

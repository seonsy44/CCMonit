# ccmonit Claude Skills Pack

이 폴더는 **세레모니 최소화, 작업 밀도 최대화**를 목표로 정리한 Claude Code 스킬 모음이다.

핵심 원칙:
- 한 세션에 흐름(flow) 1개, 작업(task) 2~3개를 처리한다.
- 스킬 수를 최소화한다.
- 범위 고정, 실행, 문서 반영, handoff를 꼭 필요한 수준으로만 유지한다.
- `docs/`는 항상 source of truth 후보이므로, 구조 변경 시 같이 갱신할지 검토한다.
- 자동 호출보다는 수동 `/skill-name` 호출을 기본으로 한다.

먼저 읽을 문서:
1. `docs/operations/claude-code-session-workflow.md`
2. `.claude/context/*.md`
3. `.claude/scratch/*`

현재 스킬:
1. `/flow-start` — 작업 후보 추천 + 세션 계획 고정
2. `/flow-work [작업]` — 작업 1개 실행 + 커밋 메시지 추천 (N번 반복)
3. `/flow-close` — docs-sync(optional) + handoff 정리
4. `/flow-check` — (optional) flow-work 사이 체크포인트, 작업 3개 이상일 때

구조 원칙:
- `.claude/context/`는 사람+일반 세션 공용 안정 요약 및 실행 컨텍스트를 둔다.
- 세션 handoff 정보는 `.claude/scratch/`에 둔다.
- 큰 작업도 가능한 한 위 네 스킬 안에서 해결하고, 필요 이상으로 새 스킬을 늘리지 않는다.

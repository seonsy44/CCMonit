# ccmonit Claude Skills Pack

이 폴더는 **코스트를 너무 아끼느라 운영이 과하게 복잡해지지 않도록** 재정리한 Claude Code 스킬 모음이다.

핵심 원칙:
- 한 세션에 한 목표만 다룬다.
- 스킬 수를 최소화한다.
- 범위 고정, 작은 배치, 문서 반영, handoff를 꼭 필요한 수준으로만 유지한다.
- `docs/`는 항상 source of truth 후보이므로, 구조 변경 시 같이 갱신할지 검토한다.
- 자동 호출보다는 수동 `/skill-name` 호출을 기본으로 한다.

먼저 읽을 문서:
1. `docs/operations/claude-code-session-workflow.md`
2. `.claude/context/*.md`
3. `.claude/scratch/*`

현재 스킬:
1. `/kick-off` — 가능한 작은 작업 후보 추천
2. `/session-start [목표]` — 이번 세션 범위와 stop line 정리
3. `/work [이번 배치]` — 실제 작업 수행
4. `/docs-sync [optional]` — 문서 / context / registry 동기화
5. `/close-session` — handoff와 scratch 정리

구조 원칙:
- `.claude/context/`는 사람+일반 세션 공용 안정 요약 및 실행 컨텍스트를 둔다.
- 세션 handoff 정보는 `.claude/scratch/`에 둔다.
- 큰 작업도 가능한 한 위 다섯 스킬 안에서 해결하고, 필요 이상으로 새 스킬을 늘리지 않는다.

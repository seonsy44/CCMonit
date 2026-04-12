# ccmonit Claude Skills Pack

이 폴더는 **세레모니 최소화, 작업 밀도 최대화**를 목표로 정리한 Claude Code 스킬 모음이다.

핵심 원칙:
- 한 세션에 개발건 1개, 스프린트 2~3개를 처리한다.
- 스킬 수를 최소화한다.
- 개발건 도출, 실행, 문서 반영, handoff를 꼭 필요한 수준으로만 유지한다.
- `docs/`는 항상 source of truth 후보이므로, 구조 변경 시 같이 갱신할지 검토한다.
- 자동 호출보다는 수동 `/skill-name` 호출을 기본으로 한다.

먼저 읽을 문서:
1. `docs/operations/claude-code-session-workflow.md`
2. `.claude/context/*.md`
3. `.claude/scratch/*`

현재 스킬:
0. `/dev-kickoff [주제?]` — (optional) 개발건 후보 도출 + `.claude/scratch/dev-list.md`에 추가. 할 개발건이 불분명할 때만.
1. `/dev-open {slug}` — dev-list의 개발건 시작 + 스프린트 계획 고정. **dev-list에 있는 slug만 가능.**
2. `/dev-sprint [스프린트]` — 스프린트 1개 실행 + 커밋 메시지 추천 (N번 반복)
3. `/dev-close` — dev-list에서 완료된 개발건 제거 + handoff 정리
4. `/dev-check` — (optional) dev-sprint 사이 체크포인트, 스프린트 3개 이상일 때

표준 워크플로우: `dev-kickoff` → 선택 → `dev-open {slug}` → `dev-sprint` × N → `dev-close`
빠른 워크플로우: `dev-sprint [스프린트]` → `dev-close`

scratch 경로: named 개발건 → `.claude/scratch/devs/{slug}/`

구조 원칙:
- `.claude/context/`는 사람+일반 세션 공용 안정 요약 및 실행 컨텍스트를 둔다.
- 세션 handoff 정보는 `.claude/scratch/`에 둔다.
- 큰 작업도 가능한 한 위 다섯 스킬 안에서 해결하고, 필요 이상으로 새 스킬을 늘리지 않는다.
- `dev-kickoff`와 `dev-check`는 optional이며, 핵심 루프는 `dev-open` → `dev-sprint` × N → `dev-close` 세 개다.
- `dev-open`은 dev-list에 있는 개발건만 시작할 수 있다. `dev-kickoff`로 먼저 도출해야 한다.

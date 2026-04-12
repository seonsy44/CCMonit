현재 상태 (2026-04-12):
- 도메인 엔티티 전체 완성: Session, Agent, Task, Skill, ToolUsage, TokenUsage, Alert
- CLI 부트스트랩 완료: pnpm dev → TUI 렌더링, pnpm build → dist/main.js
- dev-list.md 생성 완료 (.claude/scratch/dev-list.md)
- .claude scratch 정리 진행 중 (claude-scratch-cleanup)

남은 도메인 작업:
- TeamId VO (agentEntity.teamId가 string 임시)
- 도메인 서비스 4개 미착수 (cost-estimation, session-health, stuck-detection, token-aggregation)
- application 포트 미착수

다음 세션 시작:
- dev-list에 개발건 목록 있음 → /dev-open {slug}으로 바로 시작 가능
- 1순위 권장: /dev-open domain-services (엔티티 완성, 선행 조건 없음)

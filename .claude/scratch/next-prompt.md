다음 세션 목표:
- Agent 엔티티 + AgentId 값 객체 구현 (또는 Duration + TimestampRange 값 객체)

수정 허용 범위:
- packages/domain/src/entities/agent.ts
- packages/domain/src/value-objects/ (duration.ts, timestamp-range.ts)
- 필요 시 entities/event.ts (sessionId: string → SessionId 교체)

stop line:
- 엔티티 1개 + 관련 값 객체 1~2개까지

먼저 읽을 문서:
- docs/index.md
- docs/registry/page-index.md
- .claude/context/*.md
- 필요 시 .claude/skills/_shared/*.md
- .claude/scratch/worklog.md

추천 시작 순서:
1. /session-start ...
2. /resume-next
3. /scope-map ...

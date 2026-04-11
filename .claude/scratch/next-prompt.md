다음 세션 목표:

- ToolUsage 엔티티 구현 (ToolUsageEntity, ToolCallId)

수정 허용 범위:

- packages/domain/src/entities/tool-usage.ts
- 필요 시 packages/domain/src/types/ (tool-result-status.ts 등 신규)

stop line:

- ToolUsageEntity 타입 완성 및 tsc 통과

먼저 읽을 문서:

- docs/knowledge/entities/tool-usage.md
- docs/architecture/event-flow.md §15 (Tool Call 이벤트)
- .claude/scratch/worklog.md

추천 시작 순서:

1. /session-start [이번 세션 목표]
2. /work [이번 배치]
3. 필요 시 /docs-sync

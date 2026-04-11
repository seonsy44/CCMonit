다음 세션 목표:
- Task 엔티티 구현 (TaskEntity, TaskId, TaskStatus)

수정 허용 범위:
- packages/domain/src/entities/task.ts
- 필요 시 packages/domain/src/types/ (task-status.ts 신규)

stop line:
- TaskEntity + TaskStatus 타입 완성 및 tsc 통과

먼저 읽을 문서:
- docs/index.md
- .claude/context/*.md
- .claude/scratch/worklog.md
- docs/knowledge/entities/task.md
- docs/architecture/event-flow.md §13 (Task 이벤트)

추천 시작 순서:
1. /session-start
2. /scope-map packages/domain
3. /implement-domain-batch task

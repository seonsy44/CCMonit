# Worklog

## Latest Batch
- name: Task 엔티티 (TaskEntity, TaskId, TaskStatus)
- layer: domain
- changed files:
  - packages/domain/src/types/task-status.ts (신규 생성)
  - packages/domain/src/entities/task.ts (empty interface → TaskId + TaskEntity)
- done:
  - TaskId: type alias (string)
  - TaskStatus: 'queued' | 'running' | 'waiting' | 'blocked' | 'retrying' | 'completed' | 'failed' | 'cancelled'
  - TaskEntity: 12개 필드 (event-flow.md §13, knowledge/entities/task.md 기준)
  - tsc --noEmit strict 통과
- remaining:
  - Skill 엔티티
  - ToolUsage, TokenUsage, Alert 엔티티
  - TeamId VO (agentEntity.teamId는 string으로 임시 처리 중)
- risks:
  - 없음 (다른 파일이 TaskEntity를 import하는 곳 없음)

## Previous Batch
- name: agent entity + Duration/TimestampRange VO + EventEntity.sessionId 교체
- layer: domain
- changed files:
  - packages/domain/src/value-objects/duration.ts (빈 interface → Duration 필드 정의)
  - packages/domain/src/value-objects/timestamp-range.ts (빈 interface → TimestampRange 필드 정의)
  - packages/domain/src/entities/agent.ts (빈 interface → AgentId + AgentStatus + AgentEntity)
  - packages/domain/src/entities/event.ts (sessionId: string → SessionId 교체)
- docs touched: docs/log.md (append)
- done:
  - Duration: { seconds: number; accuracy: TokenAccuracy }
  - TimestampRange: { startedAt: string; endedAt?: string }
  - AgentId: type alias (string)
  - AgentStatus: 'running' | 'waiting' | 'idle' | 'completed' | 'failed'
  - AgentEntity: 14개 필드 (event-flow.md §12, knowledge/entities/agent.md 기준)
  - EventEntity.sessionId: string → SessionId 교체 완료
  - tsc --noEmit strict 통과 (domain 파일 대상)
- remaining:
  - Task 엔티티
  - Skill 엔티티
  - ToolUsage, TokenUsage, Alert 엔티티
  - TeamId VO (현재 agentEntity.teamId는 string으로 임시 처리)
- risks:
  - 없음 (다른 파일이 Agent/Duration/TimestampRange를 import하는 곳 없음)

## Previous Batch
- name: session entity + session-id + session-status
- layer: domain
- changed files:
  - packages/domain/src/value-objects/session-id.ts (empty interface → type alias)
  - packages/domain/src/types/session-status.ts (신규 생성)
  - packages/domain/src/entities/session.ts (empty interface → SessionEntity 필드 정의)
- done:
  - SessionId: plain `type SessionId = string`
  - SessionStatus: 'detected' | 'active' | 'idle' | 'completed' | 'interrupted' | 'failed'
  - SessionEntity: 13개 필드

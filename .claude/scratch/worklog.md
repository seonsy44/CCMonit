# Worklog

## Latest Batch
- name: Skill 엔티티 (SkillId, SkillStatus, SkillEntity)
- layer: domain
- changed files:
  - packages/domain/src/types/skill-status.ts (신규 생성)
  - packages/domain/src/entities/skill.ts (empty interface → SkillId + SkillEntity)
- done:
  - SkillId: type alias (string)
  - SkillStatus: 'detected' | 'running' | 'waiting' | 'completed' | 'failed' | 'cancelled'
  - SkillEntity: 12개 필드 (event-flow.md §14, knowledge/entities/skill.md 기준)
  - tsc --noEmit strict 통과
- remaining:
  - ToolUsage 엔티티
  - TokenUsage 엔티티
  - Alert 엔티티
  - TeamId VO (agentEntity.teamId는 string으로 임시 처리 중)
- risks:
  - 없음 (다른 파일이 SkillEntity를 import하는 곳 없음)

## Previous Batch
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
- risks:
  - 없음

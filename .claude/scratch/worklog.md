# Worklog

## Latest Batch
- name: 도메인 엔티티 완성 (ToolUsage, TokenUsage 보완, Alert)
- layer: domain
- changed files:
  - packages/domain/src/types/tool-call-status.ts (신규)
  - packages/domain/src/entities/tool-usage.ts (stub → ToolCallId + ToolUsageEntity)
  - packages/domain/src/entities/token-usage.ts (TokenUsageId, scopeType, scopeId, estimatedCostUsd, recordedAt 추가)
  - packages/domain/src/types/alert-status.ts (신규)
  - packages/domain/src/entities/alert.ts (stub → AlertId + AlertType + AlertSeverity + AlertEntity)
- done:
  - ToolCallId: type alias (string)
  - ToolCallStatus: 'detected' | 'called' | 'success' | 'error' | 'timeout' | 'cancelled' (event-flow §20.5)
  - ToolUsageEntity: 11개 필드 (event-flow §15 기준)
  - TokenUsageId: type alias (string)
  - TokenUsageScopeType: 'session' | 'agent' | 'task' | 'skill' | 'tool_call'
  - TokenUsageEntity: 기존 7필드 → 12필드 (id, scope, estimatedCostUsd, recordedAt 추가)
  - AlertId: type alias (string)
  - AlertStatus: 'raised' | 'acknowledged' | 'suppressed' | 'resolved' (event-flow §18)
  - AlertType: 8가지 알림 유형 (event-flow §18.1)
  - AlertSeverity: 'info' | 'warn' | 'error'
  - AlertEntity: 11개 필드
  - tsc --noEmit 통과
- remaining:
  - TeamId VO (agentEntity.teamId는 string으로 임시 처리 중)
  - 도메인 서비스 구현
  - application 포트 구현
- risks:
  - token-aggregation.service.ts가 TokenUsageEntity를 import하지만 stub이므로 영향 없음

## Previous Batch
- name: Skill 엔티티 (SkillId, SkillStatus, SkillEntity)
- layer: domain
- done: SkillEntity 12개 필드, tsc 통과

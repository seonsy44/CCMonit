다음 세션 목표:
- Skill 엔티티 구현 (SkillEntity, SkillId, SkillStatus)

수정 허용 범위:
- packages/domain/src/entities/skill.ts
- 필요 시 packages/domain/src/types/ (skill-status.ts 신규)

stop line:
- SkillEntity + SkillStatus 타입 완성 및 tsc 통과

먼저 읽을 문서:
- docs/index.md
- .claude/scratch/worklog.md
- docs/knowledge/entities/skill.md
- docs/architecture/event-flow.md §14 (Skill 이벤트)

추천 시작 순서:
1. /session-start
2. /scope-map packages/domain
3. /implement-domain-batch skill

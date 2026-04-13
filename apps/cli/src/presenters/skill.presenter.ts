import type { SkillSummaryItem } from '@ccmonit/application/dto/skill-summary-item.dto.js';

export interface SkillViewModel {
  readonly id: string;
  readonly skillName: string;
  readonly status: string;
  readonly startedAtText: string;
  readonly toolCallCount: number;
}

export class SkillPresenter {
  toViewModels(items: readonly SkillSummaryItem[]): SkillViewModel[] {
    return items.map((s) => ({
      id: s.skillId.length > 8 ? s.skillId.slice(0, 8) : s.skillId,
      skillName: s.skillName,
      status: s.status,
      startedAtText: s.startedAt
        ? new Date(s.startedAt).toLocaleTimeString()
        : '-',
      toolCallCount: s.toolCallCount,
    }));
  }
}

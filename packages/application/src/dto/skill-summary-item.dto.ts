export interface SkillSummaryItem {
  readonly skillId: string;
  readonly skillName: string;
  readonly status: string;
  readonly taskId?: string;
  readonly startedAt?: string;
  readonly toolCallCount: number;
}

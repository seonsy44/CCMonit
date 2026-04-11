import type { TaskId } from './task.js';
import type { SessionId } from '../value-objects/session-id.js';
import type { TokenAccuracy } from '../value-objects/token-accuracy.js';
import type { TimestampRange } from '../value-objects/timestamp-range.js';
import type { SkillStatus } from '../types/skill-status.js';

export type SkillId = string;

export interface SkillEntity {
  readonly skillId: SkillId;
  readonly sessionId: SessionId;
  readonly taskId?: TaskId;
  readonly status: SkillStatus;
  readonly skillName: string;
  readonly skillPath?: string;
  readonly range: TimestampRange;
  readonly durationMs?: number;
  readonly toolCallCount: number;
  readonly isRepeated: boolean;
  readonly note?: string;
  readonly startedAtAccuracy: TokenAccuracy;
}

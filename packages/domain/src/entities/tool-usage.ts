import type { SkillId } from './skill.js';
import type { SessionId } from '../value-objects/session-id.js';
import type { TokenAccuracy } from '../value-objects/token-accuracy.js';
import type { TimestampRange } from '../value-objects/timestamp-range.js';
import type { ToolCallStatus } from '../types/tool-call-status.js';

export type ToolCallId = string;

export interface ToolUsageEntity {
  readonly toolCallId: ToolCallId;
  readonly sessionId: SessionId;
  readonly skillId?: SkillId;
  readonly status: ToolCallStatus;
  readonly toolName: string;
  readonly argsPreview?: string;
  readonly range: TimestampRange;
  readonly durationMs?: number;
  readonly inputSizeBytes?: number;
  readonly outputSizeBytes?: number;
  readonly startedAtAccuracy: TokenAccuracy;
}

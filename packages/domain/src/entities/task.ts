import type { AgentId } from './agent.js';
import type { SessionId } from '../value-objects/session-id.js';
import type { TokenAccuracy } from '../value-objects/token-accuracy.js';
import type { TimestampRange } from '../value-objects/timestamp-range.js';
import type { TaskStatus } from '../types/task-status.js';

export type TaskId = string;

export interface TaskEntity {
  readonly taskId: TaskId;
  readonly sessionId: SessionId;
  readonly agentId: AgentId;
  readonly status: TaskStatus;
  readonly title: string;
  readonly category?: string;
  readonly range: TimestampRange;
  readonly progressText?: string;
  readonly summaryText?: string;
  readonly retryCount: number;
  readonly isStuck: boolean;
  readonly startedAtAccuracy: TokenAccuracy;
}

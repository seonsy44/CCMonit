import type { SessionId } from '../value-objects/session-id.js';
import type { TokenAccuracy } from '../value-objects/token-accuracy.js';
import type { TimestampRange } from '../value-objects/timestamp-range.js';

export type AgentId = string;

export type AgentStatus = 'running' | 'waiting' | 'idle' | 'completed' | 'failed';

export interface AgentEntity {
  readonly agentId: AgentId;
  readonly sessionId: SessionId;
  readonly status: AgentStatus;
  readonly roleName?: string;
  readonly parentAgentId?: AgentId;
  readonly teamId?: string; // TODO: TeamId VO 정의 후 교체
  readonly startedBy?: 'session' | 'team' | 'agent' | 'system';
  readonly range: TimestampRange;
  readonly totalElapsedSec: number;
  readonly activeTaskCount: number;
  readonly completedTaskCount: number;
  readonly toolCallCount: number;
  readonly lastActivityAt?: string; // ISO 8601
  readonly startedAtAccuracy: TokenAccuracy;
}

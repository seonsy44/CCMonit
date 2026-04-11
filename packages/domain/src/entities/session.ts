import type { SessionId } from '../value-objects/session-id.js';
import type { SessionStatus } from '../types/session-status.js';
import type { TokenAccuracy } from '../value-objects/token-accuracy.js';

export interface SessionEntity {
  readonly sessionId: SessionId;
  readonly status: SessionStatus;
  readonly startedAt: string; // ISO 8601
  readonly endedAt?: string; // ISO 8601, 종료 시 확정
  readonly cwd: string;
  readonly model?: string;
  readonly provider?: string;
  readonly totalElapsedSec: number;
  readonly totalIdleSec: number;
  readonly lastEventAt?: string; // ISO 8601
  readonly activeAgentCount: number;
  readonly activeTaskCount: number;
  readonly startedAtAccuracy: TokenAccuracy;
}

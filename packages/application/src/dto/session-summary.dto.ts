import type { SessionId } from '@ccmonit/domain/value-objects/session-id.js';
import type { SessionStatus } from '@ccmonit/domain/types/session-status.js';
import type { TokenAccuracy } from '@ccmonit/domain/value-objects/token-accuracy.js';
import type { SessionHealthLevel } from '@ccmonit/domain/services/session-health.service.js';
import type { CostEstimationResult } from '@ccmonit/domain/services/cost-estimation.service.js';
import type { TokenBreakdownDto } from './token-breakdown.dto.js';

export interface SessionSummaryDto {
  readonly sessionId: SessionId;
  readonly status: SessionStatus;
  readonly startedAt: string;
  readonly endedAt?: string;
  readonly model?: string;
  readonly cwd: string;
  readonly totalElapsedSec: number;
  readonly totalIdleSec: number;
  readonly activeAgentCount: number;
  readonly activeTaskCount: number;
  readonly tokens: TokenBreakdownDto;
  readonly cost: CostEstimationResult | null;
  readonly healthLevel: SessionHealthLevel;
  readonly alertCount: number;
  readonly accuracy: TokenAccuracy;
}

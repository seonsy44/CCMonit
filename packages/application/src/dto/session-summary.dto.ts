import type { SessionId } from '@ccmonit/domain/value-objects/session-id.js';
import type { SessionStatus } from '@ccmonit/domain/types/session-status.js';
import type { TokenAccuracy } from '@ccmonit/domain/value-objects/token-accuracy.js';
import type { SessionHealthLevel } from '@ccmonit/domain/services/session-health.service.js';
import type { CostEstimationResult } from '@ccmonit/domain/services/cost-estimation.service.js';
import type { TokenBreakdownDto } from './token-breakdown.dto.js';
import type { AgentSummaryItem } from './agent-summary-item.dto.js';
import type { TaskSummaryItem } from './task-summary-item.dto.js';
import type { SkillSummaryItem } from './skill-summary-item.dto.js';
import type { FileActivityItem } from './file-activity-item.dto.js';
import type { EventLogItem } from './event-log-item.dto.js';

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
  readonly agentSummaries: readonly AgentSummaryItem[];
  readonly taskSummaries: readonly TaskSummaryItem[];
  readonly skillSummaries: readonly SkillSummaryItem[];
  readonly fileActivities: readonly FileActivityItem[];
  readonly recentEvents: readonly EventLogItem[];
}

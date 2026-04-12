import type { SessionId } from '@ccmonit/domain/value-objects/session-id.js';
import type { TokenAccuracy } from '@ccmonit/domain/value-objects/token-accuracy.js';
import type { TokenUsageEntity } from '@ccmonit/domain/entities/token-usage.js';
import type { EventEntity } from '@ccmonit/domain/entities/event.js';
import type { TokenAggregationService } from '@ccmonit/domain/services/token-aggregation.service.js';
import type { CostEstimationService } from '@ccmonit/domain/services/cost-estimation.service.js';
import type {
  SessionHealthService,
  SessionHealthInput,
} from '@ccmonit/domain/services/session-health.service.js';
import type { EventStorePort } from '../ports/event-store.port.js';
import type { SessionStorePort } from '../ports/session-store.port.js';
import type { ClockPort } from '../ports/clock.port.js';
import type { SessionSummaryDto } from '../dto/session-summary.dto.js';

export interface BuildSessionSummaryInput {
  readonly sessionId: SessionId;
}

export class BuildSessionSummaryUsecase {
  constructor(
    private readonly eventStore: EventStorePort,
    private readonly sessionStore: SessionStorePort,
    private readonly clock: ClockPort,
    private readonly tokenAggregation: TokenAggregationService,
    private readonly costEstimation: CostEstimationService,
    private readonly sessionHealth: SessionHealthService,
  ) {}

  async execute(input: BuildSessionSummaryInput): Promise<SessionSummaryDto | null> {
    const session = await this.sessionStore.findById(input.sessionId);
    if (!session) return null;

    const events = await this.eventStore.listBySession(input.sessionId);

    // Token aggregation
    const tokenUsages = this.extractTokenUsages(events);
    const tokens = this.tokenAggregation.aggregate(tokenUsages);

    // Cost estimation
    const cost = this.costEstimation.estimate({
      model: session.model,
      inputTokens: tokens.inputTokens,
      outputTokens: tokens.outputTokens,
      cacheReadTokens: tokens.cacheReadTokens,
      cacheWriteTokens: tokens.cacheWriteTokens,
    });

    // Health evaluation
    const alertCount = this.countAlerts(events);
    const healthInput = this.buildHealthInput(session, events, alertCount);
    const health = this.sessionHealth.evaluate(healthInput);

    return {
      sessionId: session.sessionId,
      status: session.status,
      startedAt: session.startedAt,
      endedAt: session.endedAt,
      model: session.model,
      cwd: session.cwd,
      totalElapsedSec: session.totalElapsedSec,
      totalIdleSec: session.totalIdleSec,
      activeAgentCount: session.activeAgentCount,
      activeTaskCount: session.activeTaskCount,
      tokens,
      cost,
      healthLevel: health.level,
      alertCount,
      accuracy: session.startedAtAccuracy,
    };
  }

  private extractTokenUsages(events: readonly EventEntity[]): TokenUsageEntity[] {
    return events
      .filter((e) => e.eventKind === 'token.updated')
      .map((e) => ({
        tokenUsageId: String(e.payload['tokenUsageId'] ?? e.eventId),
        scopeType: (e.payload['scopeType'] as TokenUsageEntity['scopeType']) ?? 'session',
        scopeId: String(e.payload['scopeId'] ?? e.entityId),
        inputTokens: asOptionalNumber(e.payload['inputTokens']),
        outputTokens: asOptionalNumber(e.payload['outputTokens']),
        cacheReadTokens: asOptionalNumber(e.payload['cacheReadTokens']),
        cacheWriteTokens: asOptionalNumber(e.payload['cacheWriteTokens']),
        totalTokens: asOptionalNumber(e.payload['totalTokens']),
        estimatedCostUsd: asOptionalNumber(e.payload['estimatedCostUsd']),
        accuracy: (e.payload['accuracy'] as TokenAccuracy) ?? e.accuracy ?? 'unavailable',
        source: (e.payload['source'] as TokenUsageEntity['source']) ?? 'unknown',
        recordedAt: String(e.payload['recordedAt'] ?? e.occurredAt),
      }));
  }

  private countAlerts(events: readonly EventEntity[]): number {
    return events.filter((e) => e.eventKind === 'alert.detected').length;
  }

  private buildHealthInput(
    session: {
      status: string;
      totalElapsedSec: number;
      totalIdleSec: number;
      lastEventAt?: string;
    },
    events: readonly EventEntity[],
    alertCount: number,
  ): SessionHealthInput {
    const now = this.clock.now();
    const lastEventAt = session.lastEventAt ? new Date(session.lastEventAt) : null;
    const lastEventAgeSec = lastEventAt
      ? (now.getTime() - lastEventAt.getTime()) / 1000
      : undefined;

    const errorAlerts = events.filter(
      (e) => e.eventKind === 'alert.detected' && e.payload['severity'] === 'error',
    ).length;

    const taskEvents = events.filter((e) => e.entityType === 'task');
    const taskStates = new Map<string, string>();
    for (const e of taskEvents) {
      const status = e.payload['status'];
      if (typeof status === 'string') {
        taskStates.set(e.entityId, status);
      }
    }
    let stuckCount = 0;
    let failedCount = 0;
    for (const status of taskStates.values()) {
      if (status === 'blocked') stuckCount++;
      if (status === 'failed') failedCount++;
    }

    return {
      sessionStatus: session.status as SessionHealthInput['sessionStatus'],
      totalElapsedSec: session.totalElapsedSec,
      totalIdleSec: session.totalIdleSec,
      lastEventAgeSec,
      activeAlertCount: alertCount,
      errorAlertCount: errorAlerts,
      stuckTaskCount: stuckCount,
      failedTaskCount: failedCount,
      totalTaskCount: taskStates.size,
    };
  }
}

function asOptionalNumber(v: unknown): number | undefined {
  return typeof v === 'number' ? v : undefined;
}

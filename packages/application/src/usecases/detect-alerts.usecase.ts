import type { SessionId } from '@ccmonit/domain/value-objects/session-id.js';
import type { EventEntity } from '@ccmonit/domain/entities/event.js';
import type { AlertEntity, AlertSeverity, AlertType } from '@ccmonit/domain/entities/alert.js';
import type { SessionEntity } from '@ccmonit/domain/entities/session.js';
import type { StuckDetectionService, StuckDetectionInput } from '@ccmonit/domain/services/stuck-detection.service.js';
import type { SessionHealthService, SessionHealthInput } from '@ccmonit/domain/services/session-health.service.js';
import type { EventStorePort } from '../ports/event-store.port.js';
import type { SessionStorePort } from '../ports/session-store.port.js';
import type { ClockPort } from '../ports/clock.port.js';

export interface DetectAlertsInput {
  readonly sessionId: SessionId;
  readonly stuckThresholdMs?: number;
}

export interface DetectAlertsResult {
  readonly alerts: readonly AlertEntity[];
}

const DEFAULT_STUCK_THRESHOLD_MS = 120_000; // 2 minutes

export class DetectAlertsUsecase {
  constructor(
    private readonly eventStore: EventStorePort,
    private readonly sessionStore: SessionStorePort,
    private readonly clock: ClockPort,
    private readonly stuckDetection: StuckDetectionService,
    private readonly sessionHealth: SessionHealthService,
  ) {}

  async execute(input: DetectAlertsInput): Promise<DetectAlertsResult> {
    const session = await this.sessionStore.findById(input.sessionId);
    if (!session) return { alerts: [] };

    const events = await this.eventStore.listBySession(input.sessionId);
    const nowMs = this.clock.now().getTime();
    const thresholdMs = input.stuckThresholdMs ?? DEFAULT_STUCK_THRESHOLD_MS;
    const alerts: AlertEntity[] = [];

    // ── Session-level stuck detection ─────────────────
    const sessionStuckAlert = this.detectSessionStuck(session, events, nowMs, thresholdMs);
    if (sessionStuckAlert) alerts.push(sessionStuckAlert);

    // ── Health-based alert ────────────────────────────
    const healthAlert = this.detectHealthDegradation(session, events, nowMs);
    if (healthAlert) alerts.push(healthAlert);

    return { alerts };
  }

  private detectSessionStuck(
    session: SessionEntity,
    events: readonly EventEntity[],
    nowMs: number,
    thresholdMs: number,
  ): AlertEntity | null {
    if (session.status !== 'active' && session.status !== 'idle') return null;

    const meaningfulKinds = new Set([
      'tool.started', 'tool.finished', 'file.changed',
      'task.started', 'task.updated', 'agent.started',
    ]);
    const meaningfulEvents = events.filter((e) => meaningfulKinds.has(e.eventKind));
    const lastMeaningful = meaningfulEvents.length > 0
      ? meaningfulEvents[meaningfulEvents.length - 1]
      : null;

    const recentWindowMs = thresholdMs;
    const hasRecentToolCall = events.some(
      (e) => (e.eventKind === 'tool.started' || e.eventKind === 'tool.finished') &&
        nowMs - new Date(e.occurredAt).getTime() < recentWindowMs,
    );
    const hasRecentFileChange = events.some(
      (e) => e.eventKind === 'file.changed' &&
        nowMs - new Date(e.occurredAt).getTime() < recentWindowMs,
    );
    const recentErrors = events.filter(
      (e) => e.eventKind === 'alert.detected' &&
        e.payload['severity'] === 'error' &&
        nowMs - new Date(e.occurredAt).getTime() < recentWindowMs,
    ).length;

    const stuckInput: StuckDetectionInput = {
      nowMs,
      lastMeaningfulEventMs: lastMeaningful
        ? new Date(lastMeaningful.occurredAt).getTime()
        : undefined,
      stuckThresholdMs: thresholdMs,
      hasRecentToolCall,
      hasRecentFileChange,
      recentErrorCount: recentErrors,
      isLongRunningExpected: false,
    };

    const result = this.stuckDetection.detect(stuckInput);
    if (!result.isStuck) return null;

    const silenceSec = Math.round(result.silenceDurationMs / 1000);
    return makeAlert(session.sessionId, 'session_idle_long', 'warn',
      `Session idle for ${silenceSec}s`,
      `No meaningful activity detected for ${silenceSec} seconds.`,
      new Date(nowMs).toISOString(),
    );
  }

  private detectHealthDegradation(
    session: SessionEntity,
    events: readonly EventEntity[],
    nowMs: number,
  ): AlertEntity | null {
    const lastEventAt = session.lastEventAt
      ? new Date(session.lastEventAt)
      : null;
    const lastEventAgeSec = lastEventAt
      ? (nowMs - lastEventAt.getTime()) / 1000
      : undefined;

    const alertEvents = events.filter((e) => e.eventKind === 'alert.detected');
    const errorAlerts = alertEvents.filter((e) => e.payload['severity'] === 'error').length;

    const taskStates = new Map<string, string>();
    for (const e of events.filter((ev) => ev.entityType === 'task')) {
      const status = e.payload['status'];
      if (typeof status === 'string') taskStates.set(e.entityId, status);
    }
    let stuckCount = 0;
    let failedCount = 0;
    for (const s of taskStates.values()) {
      if (s === 'blocked') stuckCount++;
      if (s === 'failed') failedCount++;
    }

    const healthInput: SessionHealthInput = {
      sessionStatus: session.status,
      totalElapsedSec: session.totalElapsedSec,
      totalIdleSec: session.totalIdleSec,
      lastEventAgeSec,
      activeAlertCount: alertEvents.length,
      errorAlertCount: errorAlerts,
      stuckTaskCount: stuckCount,
      failedTaskCount: failedCount,
      totalTaskCount: taskStates.size,
    };

    const result = this.sessionHealth.evaluate(healthInput);
    if (result.level === 'healthy' || result.level === 'degraded') return null;

    const severity: AlertSeverity = result.level === 'critical' ? 'error' : 'warn';
    const signals = result.factors
      .filter((f) => f.impact === 'negative')
      .map((f) => f.signal)
      .join(', ');

    return makeAlert(session.sessionId, 'retry_loop', severity,
      `Session health: ${result.level}`,
      `Negative signals: ${signals || 'none'}`,
      new Date(nowMs).toISOString(),
    );
  }
}

let alertSeq = 0;
function makeAlert(
  sessionId: string,
  alertType: AlertType,
  severity: AlertSeverity,
  title: string,
  message: string,
  raisedAt: string,
): AlertEntity {
  return {
    alertId: `alert-${Date.now()}-${++alertSeq}`,
    sessionId,
    status: 'raised',
    alertType,
    severity,
    title,
    message,
    raisedAt,
  };
}

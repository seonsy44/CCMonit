import type { SessionStatus } from '../types/session-status.js';

// ── Types ──────────────────────────────────────────────

export type SessionHealthLevel = 'healthy' | 'degraded' | 'unhealthy' | 'critical';

export interface SessionHealthInput {
  readonly sessionStatus: SessionStatus;
  readonly totalElapsedSec: number;
  readonly totalIdleSec: number;
  readonly lastEventAgeSec?: number;
  readonly activeAlertCount: number;
  readonly errorAlertCount: number;
  readonly stuckTaskCount: number;
  readonly failedTaskCount: number;
  readonly totalTaskCount: number;
}

export interface SessionHealthFactor {
  readonly signal: string;
  readonly impact: 'positive' | 'negative';
}

export interface SessionHealthResult {
  readonly level: SessionHealthLevel;
  readonly factors: readonly SessionHealthFactor[];
}

// ── Constants ──────────────────────────────────────────

const HIGH_IDLE_RATIO = 0.7;
const STALE_EVENT_THRESHOLD_SEC = 120;

// ── Service ────────────────────────────────────────────

export class SessionHealthService {
  evaluate(input: SessionHealthInput): SessionHealthResult {
    const factors: SessionHealthFactor[] = [];

    // ── Negative factors ───────────────────────────────

    const isTerminated = input.sessionStatus === 'failed' || input.sessionStatus === 'interrupted';

    if (isTerminated) {
      factors.push({ signal: 'session_terminated', impact: 'negative' });
    }

    if (input.errorAlertCount > 0) {
      factors.push({ signal: 'error_alerts', impact: 'negative' });
    }

    if (input.stuckTaskCount > 0) {
      factors.push({ signal: 'stuck_tasks', impact: 'negative' });
    }

    if (input.failedTaskCount > 0) {
      factors.push({ signal: 'failed_tasks', impact: 'negative' });
    }

    const idleRatio = input.totalElapsedSec > 0 ? input.totalIdleSec / input.totalElapsedSec : 0;

    if (idleRatio > HIGH_IDLE_RATIO) {
      factors.push({ signal: 'high_idle_ratio', impact: 'negative' });
    }

    const isStale =
      input.lastEventAgeSec != null && input.lastEventAgeSec > STALE_EVENT_THRESHOLD_SEC;

    if (isStale) {
      factors.push({ signal: 'stale_events', impact: 'negative' });
    }

    if (input.activeAlertCount > 0 && input.errorAlertCount === 0) {
      factors.push({ signal: 'active_alerts', impact: 'negative' });
    }

    // ── Positive factors ───────────────────────────────

    const hasNegative = factors.length > 0;

    if (input.sessionStatus === 'active' && !hasNegative) {
      factors.push({ signal: 'active_no_issues', impact: 'positive' });
    }

    if (input.sessionStatus === 'completed' && !hasNegative) {
      factors.push({
        signal: 'completed_cleanly',
        impact: 'positive',
      });
    }

    // ── Level determination ────────────────────────────

    const majorFailure =
      input.totalTaskCount > 0 && input.failedTaskCount >= input.totalTaskCount / 2;

    let level: SessionHealthLevel;

    if (isTerminated || input.errorAlertCount > 0) {
      level = 'critical';
    } else if (input.stuckTaskCount > 0 || majorFailure) {
      level = 'unhealthy';
    } else if (
      input.activeAlertCount > 0 ||
      input.failedTaskCount > 0 ||
      idleRatio > HIGH_IDLE_RATIO ||
      isStale
    ) {
      level = 'degraded';
    } else {
      level = 'healthy';
    }

    return { level, factors };
  }
}

import type { SessionId } from '../value-objects/session-id.js';
import type { AlertStatus } from '../types/alert-status.js';

export type AlertId = string;

export type AlertType =
  | 'task_stuck'
  | 'stderr_burst'
  | 'token_spike'
  | 'retry_loop'
  | 'adapter_disconnected'
  | 'orphan_growth'
  | 'parse_failure_burst'
  | 'session_idle_long';

export type AlertSeverity = 'info' | 'warn' | 'error';

export interface AlertEntity {
  readonly alertId: AlertId;
  readonly sessionId: SessionId;
  readonly status: AlertStatus;
  readonly alertType: AlertType;
  readonly severity: AlertSeverity;
  readonly title: string;
  readonly message: string;
  readonly raisedAt: string;
  readonly resolvedAt?: string;
  readonly suppressedUntil?: string;
  readonly resolvedReason?: string;
}

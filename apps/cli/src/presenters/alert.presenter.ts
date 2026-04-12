import type { AlertEntity } from '@ccmonit/domain/entities/alert.js';

export interface AlertViewModel {
  readonly id: string;
  readonly title: string;
  readonly severity: string;
  readonly description: string;
  readonly timeText: string;
  readonly alertType: string;
}

export class AlertPresenter {
  toViewModel(alert: AlertEntity): AlertViewModel {
    return {
      id: alert.alertId,
      title: alert.title,
      severity: alert.severity,
      description: alert.message,
      timeText: formatTime(alert.raisedAt),
      alertType: alert.alertType.replace(/_/g, ' '),
    };
  }
}

function formatTime(iso: string): string {
  try {
    return new Date(iso).toLocaleTimeString();
  } catch {
    return iso;
  }
}

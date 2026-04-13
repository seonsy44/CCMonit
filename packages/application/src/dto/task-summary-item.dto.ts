export interface TaskSummaryItem {
  readonly taskId: string;
  readonly title: string;
  readonly status: string;
  readonly agentId?: string;
  readonly elapsedSec: number;
  readonly retryCount: number;
  readonly isStuck: boolean;
}

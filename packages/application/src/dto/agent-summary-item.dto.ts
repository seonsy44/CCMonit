export interface AgentSummaryItem {
  readonly agentId: string;
  readonly roleName: string;
  readonly status: string;
  readonly teamId?: string;
  readonly elapsedSec: number;
  readonly toolCallCount: number;
  readonly lastActivityAt?: string;
}

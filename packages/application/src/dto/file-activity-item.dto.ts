export interface FileActivityItem {
  readonly filePath: string;
  readonly action: string;
  readonly occurredAt: string;
  readonly agentId?: string;
  readonly taskId?: string;
}

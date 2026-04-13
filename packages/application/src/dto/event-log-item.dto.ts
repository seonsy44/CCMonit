export interface EventLogItem {
  readonly eventId: string;
  readonly eventKind: string;
  readonly entityType: string;
  readonly entityId: string;
  readonly occurredAt: string;
}

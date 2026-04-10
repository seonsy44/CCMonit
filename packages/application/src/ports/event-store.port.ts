export interface EventStorePort {
  append(event: unknown): Promise<void>;
  appendMany(events: unknown[]): Promise<void>;
  listBySession(sessionId: string): Promise<unknown[]>;
}

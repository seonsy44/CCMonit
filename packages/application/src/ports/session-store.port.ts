export interface SessionStorePort {
  save(session: unknown): Promise<void>;
  findById(sessionId: string): Promise<unknown | null>;
  listRecent(): Promise<unknown[]>;
}

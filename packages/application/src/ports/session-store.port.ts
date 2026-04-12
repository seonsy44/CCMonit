import type { SessionEntity } from '@ccmonit/domain/entities/session.js';
import type { SessionId } from '@ccmonit/domain/value-objects/session-id.js';

export interface SessionStorePort {
  save(session: SessionEntity): Promise<void>;
  findById(sessionId: SessionId): Promise<SessionEntity | null>;
  listRecent(limit?: number): Promise<readonly SessionEntity[]>;
}

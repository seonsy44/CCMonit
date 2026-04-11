import type { EventEntity } from '@ccmonit/domain/entities/event.js';

export interface EventStorePort {
  append(event: EventEntity): Promise<void>;
  appendMany(events: EventEntity[]): Promise<void>;
  listBySession(sessionId: string): Promise<EventEntity[]>;
}

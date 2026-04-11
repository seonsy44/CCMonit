import type { EntityType } from '../types/entity-type.js';
import type { EventKind } from '../types/event-kind.js';
import type { SessionId } from '../value-objects/session-id.js';
import type { TokenAccuracy } from '../value-objects/token-accuracy.js';

export interface EventEntity {
  readonly eventId: string;
  readonly eventKind: EventKind;
  readonly sessionId: SessionId;
  readonly occurredAt: string;
  readonly entityType: EntityType;
  readonly entityId: string;
  readonly parentId?: string;
  readonly accuracy?: TokenAccuracy;
  readonly confidenceScore?: number;
  readonly payload: Record<string, unknown>;
}

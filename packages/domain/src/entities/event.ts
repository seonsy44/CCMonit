import type { EventKind } from '../types/event-kind.js';
import type { SessionId } from '../value-objects/session-id.js';
import type { TokenAccuracy } from '../value-objects/token-accuracy.js';

export interface EventEntity {
  readonly eventId: string;
  readonly eventKind: EventKind;
  readonly sessionId: SessionId;
  readonly timestamp: string;
  readonly accuracy: TokenAccuracy;
  readonly confidenceScore?: number;
  readonly payload: Record<string, unknown>;
}

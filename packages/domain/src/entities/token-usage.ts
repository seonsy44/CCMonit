import type { TokenAccuracy } from '../value-objects/token-accuracy.js';
import type { TokenSource } from '../value-objects/token-source.js';

export type TokenUsageId = string;

export type TokenUsageScopeType = 'session' | 'agent' | 'task' | 'skill' | 'tool_call';

export interface TokenUsageEntity {
  readonly tokenUsageId: TokenUsageId;
  readonly scopeType: TokenUsageScopeType;
  readonly scopeId: string;
  readonly inputTokens?: number;
  readonly outputTokens?: number;
  readonly cacheReadTokens?: number;
  readonly cacheWriteTokens?: number;
  readonly totalTokens?: number;
  readonly estimatedCostUsd?: number;
  readonly accuracy: TokenAccuracy;
  readonly source: TokenSource;
  readonly recordedAt: string;
}

import type { TokenAccuracy } from '../value-objects/token-accuracy.js';
import type { TokenSource } from '../value-objects/token-source.js';

export interface TokenUsageEntity {
  readonly inputTokens?: number;
  readonly outputTokens?: number;
  readonly cacheReadTokens?: number;
  readonly cacheWriteTokens?: number;
  readonly totalTokens?: number;
  readonly accuracy: TokenAccuracy;
  readonly source: TokenSource;
}

import type { TokenAccuracy } from '@ccmonit/domain/value-objects/token-accuracy.js';
import type { AccuracyMix } from '@ccmonit/domain/services/token-aggregation.service.js';

export interface TokenBreakdownDto {
  readonly inputTokens: number;
  readonly outputTokens: number;
  readonly cacheReadTokens: number;
  readonly cacheWriteTokens: number;
  readonly totalTokens: number;
  readonly accuracy: TokenAccuracy;
  readonly accuracyMix: AccuracyMix;
  readonly itemCount: number;
}

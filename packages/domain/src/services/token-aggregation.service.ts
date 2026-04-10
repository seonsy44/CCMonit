import type { TokenUsageEntity } from '../entities/token-usage.js';

export class TokenAggregationService {
  aggregate(items: TokenUsageEntity[]): TokenUsageEntity {
    void items;
    throw new Error('Not implemented');
  }
}

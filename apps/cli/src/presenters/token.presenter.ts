import type { TokenBreakdownDto } from '@ccmonit/application/dto/token-breakdown.dto.js';
import type { CostEstimationResult } from '@ccmonit/domain/services/cost-estimation.service.js';
import { formatTokens } from '@ccmonit/shared/utils/format-tokens.js';

export interface TokenBreakdownViewModel {
  readonly inputText: string;
  readonly outputText: string;
  readonly cacheReadText: string;
  readonly cacheWriteText: string;
  readonly totalText: string;
  readonly accuracy: string;
  readonly costText: string;
}

export class TokenPresenter {
  toViewModel(
    tokens: TokenBreakdownDto,
    cost: CostEstimationResult | null,
  ): TokenBreakdownViewModel {
    return {
      inputText: formatTokens(tokens.inputTokens),
      outputText: formatTokens(tokens.outputTokens),
      cacheReadText: formatTokens(tokens.cacheReadTokens),
      cacheWriteText: formatTokens(tokens.cacheWriteTokens),
      totalText: formatTokens(tokens.totalTokens),
      accuracy: tokens.accuracy,
      costText: cost ? `$${cost.totalCostUsd.toFixed(4)}` : '-',
    };
  }
}

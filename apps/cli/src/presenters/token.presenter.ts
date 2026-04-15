import type { TokenBreakdownDto } from '@ccmonit/application/dto/token-breakdown.dto.js';
import { formatTokens } from '@ccmonit/shared/utils/format-tokens.js';

export interface TokenBreakdownViewModel {
  readonly inputText: string;
  readonly outputText: string;
  readonly cacheReadText: string;
  readonly cacheWriteText: string;
  readonly totalText: string;
  readonly accuracy: string;
}

export class TokenPresenter {
  toViewModel(tokens: TokenBreakdownDto): TokenBreakdownViewModel {
    return {
      inputText: formatTokens(tokens.inputTokens),
      outputText: formatTokens(tokens.outputTokens),
      cacheReadText: formatTokens(tokens.cacheReadTokens),
      cacheWriteText: formatTokens(tokens.cacheWriteTokens),
      totalText: formatTokens(tokens.totalTokens),
      accuracy: tokens.accuracy,
    };
  }
}

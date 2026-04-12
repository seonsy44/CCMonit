import type { TokenAccuracy } from '../value-objects/token-accuracy.js';
import type { TokenUsageEntity } from '../entities/token-usage.js';

// ── Types ──────────────────────────────────────────────

export interface AccuracyMix {
  readonly exact: number;
  readonly derived: number;
  readonly estimated: number;
  readonly unavailable: number;
}

export interface TokenAggregationResult {
  readonly inputTokens: number;
  readonly outputTokens: number;
  readonly cacheReadTokens: number;
  readonly cacheWriteTokens: number;
  readonly totalTokens: number;
  readonly accuracy: TokenAccuracy;
  readonly accuracyMix: AccuracyMix;
  readonly itemCount: number;
}

// ── Constants ──────────────────────────────────────────

const ACCURACY_RANK: Record<TokenAccuracy, number> = {
  exact: 0,
  derived: 1,
  estimated: 2,
  unavailable: 3,
};

const RANKED_ACCURACIES: readonly TokenAccuracy[] = [
  'exact',
  'derived',
  'estimated',
  'unavailable',
];

// ── Service ────────────────────────────────────────────

export class TokenAggregationService {
  aggregate(items: readonly TokenUsageEntity[]): TokenAggregationResult {
    if (items.length === 0) {
      return {
        inputTokens: 0,
        outputTokens: 0,
        cacheReadTokens: 0,
        cacheWriteTokens: 0,
        totalTokens: 0,
        accuracy: 'unavailable',
        accuracyMix: { exact: 0, derived: 0, estimated: 0, unavailable: 0 },
        itemCount: 0,
      };
    }

    let inputTokens = 0;
    let outputTokens = 0;
    let cacheReadTokens = 0;
    let cacheWriteTokens = 0;
    let totalTokens = 0;
    let worstRank = 0;
    const mix = { exact: 0, derived: 0, estimated: 0, unavailable: 0 };

    for (const item of items) {
      inputTokens += item.inputTokens ?? 0;
      outputTokens += item.outputTokens ?? 0;
      cacheReadTokens += item.cacheReadTokens ?? 0;
      cacheWriteTokens += item.cacheWriteTokens ?? 0;

      // Use explicit total if available; otherwise derive from input + output.
      // Cache tokens are a subset of input, not additive.
      if (item.totalTokens != null) {
        totalTokens += item.totalTokens;
      } else {
        totalTokens +=
          (item.inputTokens ?? 0) + (item.outputTokens ?? 0);
      }

      const rank = ACCURACY_RANK[item.accuracy];
      if (rank > worstRank) {
        worstRank = rank;
      }

      mix[item.accuracy]++;
    }

    return {
      inputTokens,
      outputTokens,
      cacheReadTokens,
      cacheWriteTokens,
      totalTokens,
      accuracy: RANKED_ACCURACIES[worstRank],
      accuracyMix: mix,
      itemCount: items.length,
    };
  }
}

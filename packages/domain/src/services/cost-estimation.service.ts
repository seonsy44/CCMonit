import type { TokenAccuracy } from '../value-objects/token-accuracy.js';

// ── Types ──────────────────────────────────────────────

export interface ModelPricing {
  readonly inputPerMTok: number;
  readonly outputPerMTok: number;
  readonly cacheReadPerMTok: number;
  readonly cacheWritePerMTok: number;
}

export interface CostEstimationInput {
  readonly model?: string;
  readonly inputTokens?: number;
  readonly outputTokens?: number;
  readonly cacheReadTokens?: number;
  readonly cacheWriteTokens?: number;
}

export interface CostBreakdown {
  readonly inputCostUsd: number;
  readonly outputCostUsd: number;
  readonly cacheReadCostUsd: number;
  readonly cacheWriteCostUsd: number;
}

export interface CostEstimationResult {
  readonly totalCostUsd: number;
  readonly breakdown: CostBreakdown;
  readonly accuracy: TokenAccuracy;
}

// ── Pricing table ──────────────────────────────────────

const MTOK = 1_000_000;

const MODEL_PRICING: ReadonlyMap<string, ModelPricing> = new Map([
  [
    'opus',
    {
      inputPerMTok: 15,
      outputPerMTok: 75,
      cacheReadPerMTok: 1.5,
      cacheWritePerMTok: 18.75,
    },
  ],
  [
    'sonnet',
    {
      inputPerMTok: 3,
      outputPerMTok: 15,
      cacheReadPerMTok: 0.3,
      cacheWritePerMTok: 3.75,
    },
  ],
  [
    'haiku',
    {
      inputPerMTok: 0.8,
      outputPerMTok: 4,
      cacheReadPerMTok: 0.08,
      cacheWritePerMTok: 1,
    },
  ],
]);

function resolveModelTier(model: string): string | null {
  const lower = model.toLowerCase();
  if (lower.includes('opus')) return 'opus';
  if (lower.includes('sonnet')) return 'sonnet';
  if (lower.includes('haiku')) return 'haiku';
  return null;
}

// ── Service ────────────────────────────────────────────

export class CostEstimationService {
  estimate(input: CostEstimationInput): CostEstimationResult | null {
    if (!input.model) return null;

    const tier = resolveModelTier(input.model);
    if (!tier) return null;

    const pricing = MODEL_PRICING.get(tier);
    if (!pricing) return null;

    const inputCostUsd = ((input.inputTokens ?? 0) / MTOK) * pricing.inputPerMTok;
    const outputCostUsd = ((input.outputTokens ?? 0) / MTOK) * pricing.outputPerMTok;
    const cacheReadCostUsd = ((input.cacheReadTokens ?? 0) / MTOK) * pricing.cacheReadPerMTok;
    const cacheWriteCostUsd = ((input.cacheWriteTokens ?? 0) / MTOK) * pricing.cacheWritePerMTok;

    return {
      totalCostUsd: inputCostUsd + outputCostUsd + cacheReadCostUsd + cacheWriteCostUsd,
      breakdown: {
        inputCostUsd,
        outputCostUsd,
        cacheReadCostUsd,
        cacheWriteCostUsd,
      },
      accuracy: 'estimated',
    };
  }
}

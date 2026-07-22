export interface ReviewTokenUsage {
  inputTokens: number;
  cachedInputTokens: number;
  cacheWriteTokens: number;
  outputTokens: number;
  reasoningTokens: number;
  totalTokens: number;
}

export interface ReviewExecutionMetadata {
  model: string;
  usage: ReviewTokenUsage | null;
  estimatedCostUsd: number | null;
  pricingEffectiveDate: string | null;
}

interface ModelTokenPricing {
  inputUsdPerMillion: number;
  cachedInputUsdPerMillion: number;
  outputUsdPerMillion: number;
}

export const REVIEW_PRICING_EFFECTIVE_DATE =
  "2026-07-22";

const MODEL_TOKEN_PRICING: Record<
  string,
  ModelTokenPricing
> = {
  "gpt-5": {
    inputUsdPerMillion: 1.25,
    cachedInputUsdPerMillion: 0.125,
    outputUsdPerMillion: 10,
  },
  "gpt-5-2025-08-07": {
    inputUsdPerMillion: 1.25,
    cachedInputUsdPerMillion: 0.125,
    outputUsdPerMillion: 10,
  },
};

export function estimateReviewCostUsd(
  model: string,
  usage: ReviewTokenUsage,
): number | null {
  const pricing = MODEL_TOKEN_PRICING[model];

  if (!pricing) {
    return null;
  }

  const uncachedInputTokens = Math.max(
    usage.inputTokens -
      usage.cachedInputTokens,
    0,
  );

  const inputCost =
    (uncachedInputTokens / 1_000_000) *
    pricing.inputUsdPerMillion;

  const cachedInputCost =
    (usage.cachedInputTokens / 1_000_000) *
    pricing.cachedInputUsdPerMillion;

  const outputCost =
    (usage.outputTokens / 1_000_000) *
    pricing.outputUsdPerMillion;

  return Number(
    (
      inputCost +
      cachedInputCost +
      outputCost
    ).toFixed(8),
  );
}
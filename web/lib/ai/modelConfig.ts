export const MODEL_CONFIG = {
  sqlReview: {
    provider: "openai",
    reasoningEffort: "low",
    maxOutputTokens: 2_000,
  },
} as const;
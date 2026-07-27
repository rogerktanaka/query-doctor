import { neon } from "@neondatabase/serverless";

import type { ReviewExecutionMetadata } from "@/lib/ai/reviewMetrics";
import type { SqlDialect } from "@/lib/review/sqlDialect";

interface RecordReviewEventInput {
  reviewId: string;
  sessionId: string | null;
  dialect: SqlDialect;
  durationMs: number;
  metadata: ReviewExecutionMetadata;
}

function getDatabaseUrl(): string | null {
  const databaseUrl =
    process.env
      .QUERYMEND_DATABASE_POSTGRES_URL;

  if (!databaseUrl) {
    return null;
  }

  return databaseUrl;
}

export async function recordReviewEvent(
  input: RecordReviewEventInput,
): Promise<boolean> {
  const databaseUrl = getDatabaseUrl();

  if (!databaseUrl) {
    console.warn(
      "Review telemetry skipped: database URL is not configured.",
    );

    return false;
  }

  const sql = neon(databaseUrl);
  const usage = input.metadata.usage;

  try {
    await sql`
      INSERT INTO review_events (
        review_id,
        session_id,
        dialect,
        model,
        duration_ms,
        input_tokens,
        cached_input_tokens,
        output_tokens,
        reasoning_tokens,
        total_tokens,
        estimated_cost_usd
      )
      VALUES (
        ${input.reviewId},
        ${input.sessionId},
        ${input.dialect},
        ${input.metadata.model},
        ${input.durationMs},
        ${usage?.inputTokens ?? null},
        ${usage?.cachedInputTokens ?? null},
        ${usage?.outputTokens ?? null},
        ${usage?.reasoningTokens ?? null},
        ${usage?.totalTokens ?? null},
        ${input.metadata.estimatedCostUsd}
      )
    `;

    return true;
  } catch (error) {
    console.warn(
      "Review telemetry could not be recorded.",
      {
        reviewId: input.reviewId,
        error:
          error instanceof Error
            ? error.message
            : "Unknown database error",
      },
    );

    return false;
  }
}
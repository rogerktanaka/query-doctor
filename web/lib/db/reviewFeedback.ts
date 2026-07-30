import { neon } from "@neondatabase/serverless";

export const FEEDBACK_USEFULNESS_VALUES = [
  "yes",
  "partly",
  "no",
] as const;

export type FeedbackUsefulness =
  (typeof FEEDBACK_USEFULNESS_VALUES)[number];

export const FEEDBACK_REPEAT_INTENT_VALUES = [
  "yes",
  "maybe",
  "no",
] as const;

export type FeedbackRepeatIntent =
  (typeof FEEDBACK_REPEAT_INTENT_VALUES)[number];

export const FEEDBACK_IMPROVEMENT_VALUES = [
  "revised_code",
  "plsql_support",
  "deeper_oracle_sql",
  "other_dialects",
  "workflow_integration",
  "other",
] as const;

export type FeedbackImprovement =
  (typeof FEEDBACK_IMPROVEMENT_VALUES)[number];

interface RecordReviewFeedbackInput {
  feedbackId: string;
  reviewId: string;
  sessionId: string | null;
  usefulness: FeedbackUsefulness;
  repeatIntent: FeedbackRepeatIntent;
  wantsRevisedCode: boolean;
  wantsPlsql: boolean;
  preferredImprovement:
    | FeedbackImprovement
    | null;
  comment: string | null;
}

export type ReviewFeedbackWriteResult =
  | "recorded"
  | "duplicate"
  | "review_not_found"
  | "unavailable";

function getDatabaseUrl(): string | null {
  const databaseUrl =
    process.env
      .QUERYMEND_DATABASE_POSTGRES_URL;

  if (!databaseUrl) {
    return null;
  }

  return databaseUrl;
}

function getDatabaseErrorCode(
  error: unknown,
): string | null {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "string"
  ) {
    return error.code;
  }

  return null;
}

export async function recordReviewFeedback(
  input: RecordReviewFeedbackInput,
): Promise<ReviewFeedbackWriteResult> {
  const databaseUrl = getDatabaseUrl();

  if (!databaseUrl) {
    console.warn(
      "Review feedback skipped: database URL is not configured.",
    );

    return "unavailable";
  }

  const sql = neon(databaseUrl);

  try {
    await sql`
      INSERT INTO review_feedback (
        feedback_id,
        review_id,
        session_id,
        usefulness,
        repeat_intent,
        wants_revised_code,
        wants_plsql,
        preferred_improvement,
        comment
      )
      VALUES (
        ${input.feedbackId},
        ${input.reviewId},
        ${input.sessionId},
        ${input.usefulness},
        ${input.repeatIntent},
        ${input.wantsRevisedCode},
        ${input.wantsPlsql},
        ${input.preferredImprovement},
        ${input.comment}
      )
    `;

    return "recorded";
  } catch (error) {
    const errorCode =
      getDatabaseErrorCode(error);

    if (errorCode === "23505") {
      return "duplicate";
    }

    if (errorCode === "23503") {
      return "review_not_found";
    }

    console.warn(
      "Review feedback could not be recorded.",
      {
        reviewId: input.reviewId,
        error:
          error instanceof Error
            ? error.message
            : "Unknown database error",
      },
    );

    return "unavailable";
  }
}
export type FeedbackUsefulness =
  | "yes"
  | "partly"
  | "no";

export type FeedbackRepeatIntent =
  | "yes"
  | "maybe"
  | "no";

export type FeedbackImprovement =
  | "revised_code"
  | "plsql_support"
  | "deeper_oracle_sql"
  | "other_dialects"
  | "workflow_integration"
  | "other";

export interface ReviewFeedbackInput {
  reviewId: string;
  usefulness: FeedbackUsefulness;
  repeatIntent: FeedbackRepeatIntent;
  wantsRevisedCode: boolean;
  wantsPlsql: boolean;
  preferredImprovement:
    | FeedbackImprovement
    | null;
  comment: string | null;
}

interface FeedbackErrorResponse {
  error?: string;
  code?: string;
}

interface FeedbackSuccessResponse {
  feedbackId: string;
}

function isFeedbackErrorResponse(
  value: unknown,
): value is FeedbackErrorResponse {
  return (
    typeof value === "object" &&
    value !== null &&
    (!("error" in value) ||
      typeof value.error === "string") &&
    (!("code" in value) ||
      typeof value.code === "string")
  );
}

export async function submitReviewFeedback(
  feedback: ReviewFeedbackInput,
): Promise<FeedbackSuccessResponse> {
  let response: Response;

  try {
    response = await fetch("/api/feedback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...feedback,
        sessionId: null,
      }),
    });
  } catch {
    throw new Error(
      "Unable to connect to the feedback service. Please try again.",
    );
  }

  let result: unknown;

  try {
    result = await response.json();
  } catch {
    throw new Error(
      "The feedback service returned an invalid response. Please try again.",
    );
  }

  if (!response.ok) {
    const message =
      isFeedbackErrorResponse(result) &&
      result.error
        ? result.error
        : "Feedback could not be submitted. Please try again.";

    throw new Error(message);
  }

  return result as FeedbackSuccessResponse;
}
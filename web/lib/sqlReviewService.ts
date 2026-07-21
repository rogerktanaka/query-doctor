import type { ReviewResult } from "@/types/review";

interface ReviewErrorResponse {
  error?: string;
  code?: string;
}

function isReviewErrorResponse(
  value: unknown,
): value is ReviewErrorResponse {
  return (
    typeof value === "object" &&
    value !== null &&
    (!("error" in value) ||
      typeof value.error === "string") &&
    (!("code" in value) ||
      typeof value.code === "string")
  );
}

export async function reviewSql(
  sql: string,
): Promise<ReviewResult> {
  if (!sql.trim()) {
    throw new Error("SQL query is required.");
  }

  let response: Response;

  try {
    response = await fetch("/api/review", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sql }),
    });
  } catch {
    throw new Error(
      "Unable to connect to the review service. Check your connection and try again.",
    );
  }

  let result: unknown;

  try {
    result = await response.json();
  } catch {
    throw new Error(
      response.ok
        ? "The review service returned an invalid response. Please try again."
        : "The review service is temporarily unavailable. Please try again shortly.",
    );
  }

  if (!response.ok) {
    const message =
      isReviewErrorResponse(result) &&
      result.error
        ? result.error
        : "The SQL review request failed. Please try again.";

    throw new Error(message);
  }

  return result as ReviewResult;
}
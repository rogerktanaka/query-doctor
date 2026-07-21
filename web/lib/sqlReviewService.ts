import type { ReviewResult } from "@/types/review";

interface ReviewErrorResponse {
  error?: string;
}

export async function reviewSql(
  sql: string,
): Promise<ReviewResult> {
  if (!sql.trim()) {
    throw new Error("SQL query is required.");
  }

  const response = await fetch("/api/review", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sql }),
  });

  const result: unknown = await response.json();

  if (!response.ok) {
    const errorResponse = result as ReviewErrorResponse;

    throw new Error(
      errorResponse.error ||
        "The SQL review request failed.",
    );
  }

  return result as ReviewResult;
}
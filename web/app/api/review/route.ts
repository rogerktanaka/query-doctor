import { NextResponse } from "next/server";

import { reviewSql } from "@/lib/ai/reviewEngine";

import { MAX_SQL_LENGTH } from "@/lib/review/reviewLimits";

function getErrorStatus(error: unknown): number | null {
  if (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    typeof error.status === "number"
  ) {
    return error.status;
  }

  return null;
}

export async function POST(request: Request) {
  const startedAt = Date.now();

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        error: "The request body must contain valid JSON.",
        code: "INVALID_JSON",
      },
      { status: 400 },
    );
  }

  if (
    typeof body !== "object" ||
    body === null ||
    !("sql" in body) ||
    typeof body.sql !== "string" ||
    !body.sql.trim()
  ) {
    return NextResponse.json(
      {
        error: "SQL query is required.",
        code: "SQL_REQUIRED",
      },
      { status: 400 },
    );
  }

  const sql = body.sql.trim();

  if (sql.length > MAX_SQL_LENGTH) {
    return NextResponse.json(
      {
        error: `SQL query must not exceed ${MAX_SQL_LENGTH.toLocaleString("en-US")} characters.`,
        code: "SQL_TOO_LONG",
      },
      { status: 413 },
    );
  }

  try {
    const review = await reviewSql(sql);
    const durationMs = Date.now() - startedAt;

    console.info(`SQL review completed in ${durationMs}ms.`);

    return NextResponse.json(review, {
      headers: {
        "Server-Timing": `sql-review;dur=${durationMs}`,
      },
    });
  } catch (error) {
    const durationMs = Date.now() - startedAt;
    const upstreamStatus = getErrorStatus(error);

    console.error(
      `SQL review failed after ${durationMs}ms:`,
      error,
    );

    if (upstreamStatus === 429) {
      return NextResponse.json(
        {
          error:
            "The review service is receiving too many requests. Please wait a moment and try again.",
          code: "REVIEW_RATE_LIMITED",
        },
        { status: 503 },
      );
    }

    if (
      upstreamStatus !== null &&
      upstreamStatus >= 500
    ) {
      return NextResponse.json(
        {
          error:
            "The review service is temporarily unavailable. Please try again shortly.",
          code: "REVIEW_UNAVAILABLE",
        },
        { status: 503 },
      );
    }

    return NextResponse.json(
      {
        error:
          "We could not complete the SQL review. Please try again.",
        code: "REVIEW_FAILED",
      },
      { status: 500 },
    );
  }
}
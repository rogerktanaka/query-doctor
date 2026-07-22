import { NextResponse } from "next/server";

import { reviewSql } from "@/lib/ai/reviewEngine";
import { MAX_SQL_LENGTH } from "@/lib/review/reviewLimits";
import {
  DEFAULT_SQL_DIALECT,
  isSqlDialect,
  SQL_DIALECTS,
} from "@/lib/review/sqlDialect";

function getErrorStatus(
  error: unknown,
): number | null {
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
        error:
          "The request body must contain valid JSON.",
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
        error:
          `SQL query must not exceed ${MAX_SQL_LENGTH.toLocaleString("en-US")} characters.`,
        code: "SQL_TOO_LONG",
      },
      { status: 413 },
    );
  }

  const dialectCandidate =
    "dialect" in body
      ? body.dialect
      : DEFAULT_SQL_DIALECT;

  if (!isSqlDialect(dialectCandidate)) {
    return NextResponse.json(
      {
        error:
          `SQL dialect must be one of: ${SQL_DIALECTS.join(", ")}.`,
        code: "INVALID_DIALECT",
      },
      { status: 400 },
    );
  }

  try {
    const {
      review,
      metadata,
    } = await reviewSql(
      sql,
      dialectCandidate,
    );

    const durationMs =
      Date.now() - startedAt;

    console.info(
      "SQL review completed.",
      {
        durationMs,
        dialect: dialectCandidate,
        model: metadata.model,
        usage: metadata.usage,
        estimatedCostUsd:
          metadata.estimatedCostUsd,
        pricingEffectiveDate:
          metadata.pricingEffectiveDate,
      },
    );

    const headers: Record<string, string> = {
      "Server-Timing":
        `sql-review;dur=${durationMs}`,
    };

    const exposeReviewMetrics =
      process.env.NODE_ENV !==
      "production";

    if (exposeReviewMetrics) {
      headers[
        "X-Query-Doctor-Model"
      ] = metadata.model;

      if (metadata.usage !== null) {
      headers[
        "X-Query-Doctor-Input-Tokens"
      ] = String(
        metadata.usage.inputTokens,
      );

      headers[
        "X-Query-Doctor-Cached-Input-Tokens"
      ] = String(
        metadata.usage.cachedInputTokens,
      );

      headers[
        "X-Query-Doctor-Cache-Write-Tokens"
      ] = String(
        metadata.usage.cacheWriteTokens,
      );

      headers[
        "X-Query-Doctor-Output-Tokens"
      ] = String(
        metadata.usage.outputTokens,
      );

      headers[
        "X-Query-Doctor-Reasoning-Tokens"
      ] = String(
        metadata.usage.reasoningTokens,
      );

        headers[
          "X-Query-Doctor-Total-Tokens"
        ] = String(
          metadata.usage.totalTokens,
        );
      }

      if (
        metadata.estimatedCostUsd !== null
      ) {
      headers[
        "X-Query-Doctor-Estimated-Cost-USD"
      ] =
        metadata.estimatedCostUsd.toFixed(8);
    }

      if (
        metadata.pricingEffectiveDate !==
        null
      ) {
        headers[
          "X-Query-Doctor-Pricing-Effective-Date"
        ] =
          metadata.pricingEffectiveDate;
      }
    }

    return NextResponse.json(review, {
      headers,
    });
  } catch (error) {
    const durationMs =
      Date.now() - startedAt;

    const upstreamStatus =
      getErrorStatus(error);

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
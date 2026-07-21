import { NextResponse } from "next/server";

import { reviewSql } from "@/lib/ai/reviewEngine";

const MAX_SQL_LENGTH = 20_000;

export async function POST(request: Request) {
  const startedAt = Date.now();

  try {
    const body: unknown = await request.json();

    if (
      typeof body !== "object" ||
      body === null ||
      !("sql" in body) ||
      typeof body.sql !== "string" ||
      !body.sql.trim()
    ) {
      return NextResponse.json(
        { error: "SQL query is required." },
        { status: 400 },
      );
    }

    const sql = body.sql.trim();

    if (sql.length > MAX_SQL_LENGTH) {
      return NextResponse.json(
        {
          error: `SQL query must not exceed ${MAX_SQL_LENGTH.toLocaleString()} characters.`,
        },
        { status: 413 },
      );
    }

    const review = await reviewSql(sql);
    const durationMs = Date.now() - startedAt;

    console.info(`SQL review completed in ${durationMs}ms.`);

    return NextResponse.json(review, {
      headers: {
        "Server-Timing": `sql-review;dur=${durationMs}`,
      },
    });
  } catch (error) {
    console.error("SQL review failed:", error);

    const message =
      error instanceof Error
        ? error.message
        : "An unexpected error occurred.";

    return NextResponse.json(
      { error: message },
      { status: 500 },
    );
  }
}
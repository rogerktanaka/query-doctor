import { NextResponse } from "next/server";

import { reviewSql } from "@/lib/ai/reviewEngine";

export async function POST(request: Request) {
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

    const review = await reviewSql(body.sql);

    return NextResponse.json(review);
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
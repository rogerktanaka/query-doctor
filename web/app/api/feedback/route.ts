import { NextResponse } from "next/server";
import { z } from "zod";

import {
  FEEDBACK_IMPROVEMENT_VALUES,
  FEEDBACK_REPEAT_INTENT_VALUES,
  FEEDBACK_USEFULNESS_VALUES,
  recordReviewFeedback,
} from "@/lib/db/reviewFeedback";

const FeedbackRequestSchema = z
  .object({
    reviewId: z.string().uuid(),
    sessionId: z
      .string()
      .uuid()
      .nullable()
      .optional(),
    usefulness: z.enum(
      FEEDBACK_USEFULNESS_VALUES,
    ),
    repeatIntent: z.enum(
      FEEDBACK_REPEAT_INTENT_VALUES,
    ),
    wantsRevisedCode: z.boolean(),
    wantsPlsql: z.boolean(),
    preferredImprovement: z
      .enum(FEEDBACK_IMPROVEMENT_VALUES)
      .nullable()
      .optional(),
    comment: z
      .string()
      .trim()
      .max(1000)
      .nullable()
      .optional(),
  })
  .strict();

export async function POST(request: Request) {
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

  const validationResult =
    FeedbackRequestSchema.safeParse(body);

  if (!validationResult.success) {
    return NextResponse.json(
      {
        error:
          "The submitted feedback is invalid.",
        code: "INVALID_FEEDBACK",
      },
      { status: 400 },
    );
  }

  const feedback =
    validationResult.data;

  const feedbackId =
    crypto.randomUUID();

  const writeResult =
    await recordReviewFeedback({
      feedbackId,
      reviewId: feedback.reviewId,
      sessionId:
        feedback.sessionId ?? null,
      usefulness: feedback.usefulness,
      repeatIntent:
        feedback.repeatIntent,
      wantsRevisedCode:
        feedback.wantsRevisedCode,
      wantsPlsql: feedback.wantsPlsql,
      preferredImprovement:
        feedback.preferredImprovement ??
        null,
      comment:
        feedback.comment?.trim() ||
        null,
    });

  if (writeResult === "duplicate") {
    return NextResponse.json(
      {
        error:
          "Feedback has already been submitted for this review.",
        code: "FEEDBACK_ALREADY_SUBMITTED",
      },
      { status: 409 },
    );
  }

  if (
    writeResult ===
    "review_not_found"
  ) {
    return NextResponse.json(
      {
        error:
          "The associated review could not be found.",
        code: "REVIEW_NOT_FOUND",
      },
      { status: 404 },
    );
  }

  if (writeResult === "unavailable") {
    return NextResponse.json(
      {
        error:
          "Feedback could not be saved right now. Please try again later.",
        code: "FEEDBACK_UNAVAILABLE",
      },
      { status: 503 },
    );
  }

  return NextResponse.json(
    {
      feedbackId,
    },
    { status: 201 },
  );
}
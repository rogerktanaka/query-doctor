import { zodTextFormat } from "openai/helpers/zod";

import {
  ReviewResultSchema,
  type ReviewResult,
  validateReviewResult,
} from "@/lib/review/reviewSchema";

import { MODEL_CONFIG } from "./modelConfig";
import {
  getOpenAIClient,
  getOpenAIModel,
} from "./openai";
import { loadPrompt } from "./promptLoader";

export async function reviewSql(
  sql: string,
): Promise<ReviewResult> {
  const normalizedSql = sql.trim();

  if (!normalizedSql) {
    throw new Error("SQL must not be empty.");
  }

  const systemPrompt = await loadPrompt(
    "sql-review-system.md",
  );

  const client = getOpenAIClient();
  const model = getOpenAIModel();
  const config = MODEL_CONFIG.sqlReview;

  const response = await client.responses.parse({
    model,
    instructions: systemPrompt,
    input: [
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: [
              "Review the following SQL statement.",
              "",
              "```sql",
              normalizedSql,
              "```",
            ].join("\n"),
          },
        ],
      },
    ],
    ...(model.startsWith("gpt-5")
      ? {
          reasoning: {
            effort: config.reasoningEffort,
          },
        }
      : {}),
    max_output_tokens: config.maxOutputTokens,
    text: {
      format: zodTextFormat(
        ReviewResultSchema,
        "sql_review_result",
      ),
    },
  });

  if (!response.output_parsed) {
    console.error("Structured review parsing failed:", {
      status: response.status,
      incompleteDetails: response.incomplete_details,
      output: response.output,
    });

    throw new Error(
      `OpenAI returned no structured SQL review. Status: ${response.status}.`,
    );
  }

  return validateReviewResult(
    response.output_parsed,
  );
}
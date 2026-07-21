import { zodTextFormat } from "openai/helpers/zod";

import {
  ReviewResultSchema,
  type ReviewResult,
  validateReviewResult,
} from "@/lib/review/reviewSchema";
import {
  DEFAULT_SQL_DIALECT,
  getSqlDialectLabel,
  type SqlDialect,
} from "@/lib/review/sqlDialect";

import { MODEL_CONFIG } from "./modelConfig";
import {
  getOpenAIClient,
  getOpenAIModel,
} from "./openai";
import { loadPrompt } from "./promptLoader";

function buildDialectInstructions(
  dialect: SqlDialect,
): string {
  if (dialect === "unspecified") {
    return [
      "## Selected SQL Dialect",
      "",
      "The user did not specify a target SQL dialect.",
      "",
      "Do not assume a database engine.",
      "You may identify a likely dialect only when directly supported by distinctive syntax in the supplied SQL.",
      "If you infer a dialect, clearly label it as an inference.",
      "Do not present database-specific rules as facts when the dialect remains uncertain.",
      "Prefer portable guidance when possible.",
    ].join("\n");
  }

  const dialectLabel =
    getSqlDialectLabel(dialect);

  return [
    "## Selected SQL Dialect",
    "",
    `The user explicitly selected ${dialectLabel}.`,
    "",
    `Interpret syntax and semantics according to ${dialectLabel}.`,
    `Use ${dialectLabel}-appropriate terminology and rewrite syntax.`,
    "Do not recommend syntax, functions, configuration, or behavior from another database engine.",
    "Do not question the selected dialect merely because the SQL also uses portable standard syntax.",
    "If a recommendation depends on a database version or optional feature, state that dependency.",
  ].join("\n");
}

export async function reviewSql(
  sql: string,
  dialect: SqlDialect = DEFAULT_SQL_DIALECT,
): Promise<ReviewResult> {
  const normalizedSql = sql.trim();

  if (!normalizedSql) {
    throw new Error("SQL must not be empty.");
  }

  const systemPrompt = await loadPrompt(
    "sql-review-system.md",
  );

  const instructions = [
    systemPrompt,
    "",
    "---",
    "",
    buildDialectInstructions(dialect),
  ].join("\n");

  const client = getOpenAIClient();
  const model = getOpenAIModel();
  const config = MODEL_CONFIG.sqlReview;

  const response = await client.responses.parse({
    model,
    instructions,
    input: [
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: [
              "Review the following SQL statement.",
              "",
              `Selected SQL dialect: ${getSqlDialectLabel(dialect)}`,
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
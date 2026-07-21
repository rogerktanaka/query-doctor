import type { ReviewResult } from "@/types/review";

export async function reviewSql(sql: string): Promise<ReviewResult> {
  if (!sql.trim()) {
    throw new Error("SQL query is required.");
  }

  await new Promise((resolve) => setTimeout(resolve, 800));

  return {
    overallScore: 7.8,

    summary:
      "The query is readable and functionally straightforward, but there are opportunities to improve clarity and validate potential performance risks.",

    categories: [
      {
        id: "readability",
        name: "Readability",
        score: 8.5,
        summary: "The query is easy to understand.",
        observations: [
          "The selected columns are explicit.",
          "The aggregation logic is clear.",
          "Aliases could improve readability in more complex queries.",
        ],
      },
      {
        id: "performance",
        name: "Potential performance risks",
        score: 6.5,
        summary:
          "No critical performance issue can be confirmed without database context.",
        observations: [
          "The GROUP BY may require sorting or hashing on large datasets.",
          "An index on customer_id may help, depending on table size and data distribution.",
          "Actual performance cannot be determined from SQL text alone.",
        ],
      },
      {
        id: "maintainability",
        name: "Maintainability",
        score: 8,
        summary: "The query is simple and easy to maintain.",
        observations: [
          "Formatting is consistent.",
          "The query has limited structural complexity.",
        ],
      },
    ],

    suggestions: [
      "Provide table definitions and indexes for a more accurate performance review.",
      "Include an execution plan when investigating a real performance issue.",
      "Use descriptive aliases if the query grows in complexity.",
    ],

    limitations: [
      "The query was not executed.",
      "Database statistics and data distribution were not analyzed.",
      "Indexes and execution plans were not provided.",
    ],
  };
}
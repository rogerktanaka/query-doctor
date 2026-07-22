"use client";

import { useState } from "react";

import { ReviewResult } from "@/components/ReviewResult";
import { MAX_SQL_LENGTH } from "@/lib/review/reviewLimits";
import {
  isSqlDialect,
  SQL_DIALECT_OPTIONS,
  type SqlDialect,
} from "@/lib/review/sqlDialect";
import { reviewSql } from "@/lib/sqlReviewService";
import type { ReviewResult as ReviewResultType } from "@/types/review";

const SAMPLE_SQL = `SELECT
  c.customer_id,
  c.customer_name,
  COUNT(o.order_id) AS open_order_count
FROM customers c
LEFT JOIN orders o
  ON o.customer_id = c.customer_id
WHERE o.status = 'OPEN'
GROUP BY
  c.customer_id,
  c.customer_name
ORDER BY
  c.customer_name;`;

export default function Home() {
  const [sql, setSql] = useState("");
  const [dialect, setDialect] =
    useState<SqlDialect>(
      "oracle",
    );
  const [review, setReview] =
    useState<ReviewResultType | null>(null);
  const [isReviewing, setIsReviewing] =
    useState(false);
  const [error, setError] =
    useState<string | null>(null);

  const isSqlTooLong =
    sql.length > MAX_SQL_LENGTH;

  const isNearSqlLimit =
    sql.length >= MAX_SQL_LENGTH * 0.9;

  function clearReviewState() {
    setReview(null);
    setError(null);
  }

  function handleDialectChange(
    event: React.ChangeEvent<HTMLSelectElement>,
  ) {
    const nextDialect = event.target.value;

    if (!isSqlDialect(nextDialect)) {
      return;
    }

    setDialect(nextDialect);
    clearReviewState();
  }

  function handleSqlChange(
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) {
    setSql(event.target.value);
    clearReviewState();
  }

  function handleLoadSample() {
    setSql(SAMPLE_SQL);
    clearReviewState();
  }

  async function handleReview() {
    if (!sql.trim() || isReviewing) {
      return;
    }

    if (isSqlTooLong) {
      setError(
        `SQL query must not exceed ${MAX_SQL_LENGTH.toLocaleString("en-US")} characters.`,
      );
      return;
    }

    setIsReviewing(true);
    setReview(null);
    setError(null);

    try {
      const result = await reviewSql(
        sql,
        dialect,
      );

      setReview(result);
    } catch (caughtError) {
      const message =
        caughtError instanceof Error
          ? caughtError.message
          : "An unexpected error occurred.";

      setError(message);
    } finally {
      setIsReviewing(false);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-12 text-zinc-100">
      <div className="mx-auto max-w-5xl">
        <header className="mb-10 pt-8">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.3em] text-emerald-400">
            AI-powered static SQL review
          </p>

          <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
            Query Doctor
          </h1>

          <p className="mt-4 max-w-2xl text-lg leading-8 text-zinc-400">
            Paste your SQL query and receive a structured review focused on
            readability, maintainability, best practices, and potential
            performance risks.
          </p>
        </header>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl">
          <div className="mb-6 max-w-sm">
            <div className="mb-2 flex items-center gap-2">
              <label
                htmlFor="sql-dialect"
                className="block text-sm font-medium text-zinc-200"
              >
                Database dialect
              </label>

              <span className="rounded-full border border-violet-500/20 bg-violet-500/10 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-violet-300">
                Beta
              </span>
            </div>

            <select
              id="sql-dialect"
              value={dialect}
              onChange={handleDialectChange}
              disabled={isReviewing}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:text-zinc-500"
            >
              {SQL_DIALECT_OPTIONS.map(
                (option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ),
              )}
            </select>

            <p className="mt-2 text-xs leading-5 text-zinc-500">
              Oracle is preselected for this Beta. Other dialects remain
              experimental.
            </p>
          </div>

          <div className="mb-3 flex items-center justify-between gap-4">
            <label
              htmlFor="sql-query"
              className="block text-sm font-medium text-zinc-200"
            >
              SQL query
            </label>

            <button
              type="button"
              onClick={handleLoadSample}
              disabled={isReviewing}
              className="text-sm font-medium text-emerald-400 transition hover:text-emerald-300 disabled:cursor-not-allowed disabled:text-zinc-600"
            >
              Load sample query
            </button>
          </div>

          <textarea
            id="sql-query"
            value={sql}
            onChange={handleSqlChange}
            aria-describedby="sql-character-count"
            aria-invalid={isSqlTooLong}
            placeholder={`SELECT customer_id, COUNT(*)
FROM orders
GROUP BY customer_id;`}
            className={`min-h-80 w-full resize-y rounded-xl border bg-zinc-950 p-4 font-mono text-sm leading-6 text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:ring-2 ${
              isSqlTooLong
                ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                : "border-zinc-700 focus:border-emerald-500 focus:ring-emerald-500/20"
            }`}
          />

          <div
            id="sql-character-count"
            className={`mt-2 text-right text-xs ${
              isSqlTooLong
                ? "font-medium text-red-400"
                : isNearSqlLimit
                  ? "font-medium text-amber-400"
                  : "text-zinc-500"
            }`}
          >
            {sql.length.toLocaleString("en-US")} /{" "}
            {MAX_SQL_LENGTH.toLocaleString("en-US")} characters
          </div>

          {isSqlTooLong && (
            <p className="mt-2 text-sm text-red-300">
              Remove{" "}
              {(sql.length - MAX_SQL_LENGTH).toLocaleString("en-US")}{" "}
              characters before submitting the query.
            </p>
          )}

          <div className="mt-5 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <p className="max-w-2xl text-sm leading-6 text-zinc-500">
              Query Doctor performs static analysis only. It does not execute
              your query or inspect your database schema, indexes, statistics,
              or data distribution.
            </p>

            <button
              type="button"
              onClick={handleReview}
              disabled={
                !sql.trim() ||
                isSqlTooLong ||
                isReviewing
              }
              className="shrink-0 rounded-lg bg-emerald-500 px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-500"
            >
              {isReviewing
                ? "Reviewing..."
                : "Review query"}
            </button>
          </div>
        </section>

        {error && (
          <p
            role="alert"
            className="mt-6 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-300"
          >
            {error}
          </p>
        )}

        {review && (
          <ReviewResult
            review={review}
            dialect={dialect}
          />
        )}
      </div>
    </main>
  );
}
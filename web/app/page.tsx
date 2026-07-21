"use client";

import { useState } from "react";

import { ReviewResult } from "@/components/ReviewResult";
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
  const [review, setReview] = useState<ReviewResultType | null>(null);
  const [isReviewing, setIsReviewing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleLoadSample() {
    setSql(SAMPLE_SQL);
    setReview(null);
    setError(null);
  }

  async function handleReview() {
    if (!sql.trim() || isReviewing) {
      return;
    }

    setIsReviewing(true);
    setReview(null);
    setError(null);

    try {
      const result = await reviewSql(sql);
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
            onChange={(event) => setSql(event.target.value)}
            placeholder={`SELECT customer_id, COUNT(*)
FROM orders
GROUP BY customer_id;`}
            className="min-h-80 w-full resize-y rounded-xl border border-zinc-700 bg-zinc-950 p-4 font-mono text-sm leading-6 text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
          />

          <div className="mt-5 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <p className="max-w-2xl text-sm leading-6 text-zinc-500">
              Query Doctor performs static analysis only. It does not execute
              your query or inspect your database schema, indexes, statistics,
              or data distribution.
            </p>

            <button
              type="button"
              onClick={handleReview}
              disabled={!sql.trim() || isReviewing}
              className="shrink-0 rounded-lg bg-emerald-500 px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-500"
            >
              {isReviewing ? "Reviewing..." : "Review query"}
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

        {review && <ReviewResult review={review} />}
      </div>
    </main>
  );
}
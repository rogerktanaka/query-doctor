"use client";

import { useState } from "react";

export default function Home() {
  const [sql, setSql] = useState("");

  function handleReview() {
    if (!sql.trim()) {
      return;
    }

    alert("SQL review coming soon.");
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-12 text-zinc-100">
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-4xl flex-col justify-center">
        <header className="mb-10">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.3em] text-emerald-400">
            AI-powered SQL review
          </p>

          <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
            Query Doctor
          </h1>

          <p className="mt-4 max-w-2xl text-lg leading-8 text-zinc-400">
            Paste your SQL query and receive a structured review focused on
            readability, performance, maintainability, and best practices.
          </p>
        </header>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl">
          <label
            htmlFor="sql-query"
            className="mb-3 block text-sm font-medium text-zinc-200"
          >
            SQL query
          </label>

          <textarea
            id="sql-query"
            value={sql}
            onChange={(event) => setSql(event.target.value)}
            placeholder={`SELECT customer_id, COUNT(*)
FROM orders
GROUP BY customer_id;`}
            className="min-h-80 w-full resize-y rounded-xl border border-zinc-700 bg-zinc-950 p-4 font-mono text-sm leading-6 text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
          />

          <div className="mt-5 flex items-center justify-between gap-4">
            <p className="text-sm text-zinc-500">
              Your query is not executed against a database.
            </p>

            <button
              type="button"
              onClick={handleReview}
              disabled={!sql.trim()}
              className="rounded-lg bg-emerald-500 px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-500"
            >
              Review query
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
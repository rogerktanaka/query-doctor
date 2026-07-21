import type { ReviewResult as ReviewResultType } from "@/types/review";

type ReviewResultProps = {
  review: ReviewResultType;
};

function ScoreBadge({ score }: { score: number }) {
  return (
    <span className="shrink-0 rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-semibold text-emerald-400">
      {score.toFixed(1)} / 10
    </span>
  );
}

export function ReviewResult({ review }: ReviewResultProps) {
  return (
    <section className="mt-8 space-y-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-wider text-zinc-500">
            Overall review
          </p>

          <h2 className="mt-2 text-2xl font-semibold">SQL review result</h2>
        </div>

        <ScoreBadge score={review.overallScore} />
      </div>

      <p className="leading-7 text-zinc-300">{review.summary}</p>

      <div className="grid gap-4 md:grid-cols-3">
        {review.categories.map((category) => (
          <article
            key={category.id}
            className="rounded-xl border border-zinc-800 bg-zinc-950 p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-semibold">{category.name}</h3>

              <ScoreBadge score={category.score} />
            </div>

            <p className="mt-3 text-sm leading-6 text-zinc-400">
              {category.summary}
            </p>

            <ul className="mt-4 space-y-2 text-sm text-zinc-300">
              {category.observations.map((observation) => (
                <li key={observation}>• {observation}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <div>
        <h3 className="font-semibold">Suggested improvements</h3>

        <ul className="mt-3 space-y-2 text-sm text-zinc-300">
          {review.suggestions.map((suggestion) => (
            <li key={suggestion}>• {suggestion}</li>
          ))}
        </ul>
      </div>

      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
        <h3 className="font-semibold text-amber-300">
          Analysis limitations
        </h3>

        <ul className="mt-3 space-y-2 text-sm text-amber-100/80">
          {review.limitations.map((limitation) => (
            <li key={limitation}>• {limitation}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
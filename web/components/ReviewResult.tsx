import {
  getSqlDialectLabel,
  type SqlDialect,
} from "@/lib/review/sqlDialect";
import type {
  ReviewObservation,
  ReviewResult as ReviewResultType,
} from "@/types/review";

type ReviewResultProps = {
  review: ReviewResultType;
  dialect: SqlDialect;
};

const observationStyles = {
  positive: {
    label: "Good practice",
    className:
      "border-emerald-500/20 bg-emerald-500/5 text-emerald-300",
  },
  issue: {
    label: "Issue",
    className:
      "border-red-500/20 bg-red-500/5 text-red-300",
  },
  risk: {
    label: "Potential risk",
    className:
      "border-amber-500/20 bg-amber-500/5 text-amber-300",
  },
} as const;

function ScoreBadge({
  score,
}: {
  score: number;
}) {
  return (
    <span className="shrink-0 rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-semibold text-emerald-400">
      {score.toFixed(1)} / 10
    </span>
  );
}

function Observation({
  observation,
}: {
  observation: ReviewObservation;
}) {
  const style =
    observationStyles[observation.type];

  return (
    <li className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-3">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span
          className={`rounded-full border px-2 py-0.5 text-xs font-medium ${style.className}`}
        >
          {style.label}
        </span>

        <span className="text-xs text-zinc-500">
          {observation.severity} severity
        </span>

        <span className="text-xs text-zinc-500">
          {observation.confidence} confidence
        </span>
      </div>

      <p className="leading-6 text-zinc-300">
        {observation.message}
      </p>
    </li>
  );
}

export function ReviewResult({
  review,
  dialect,
}: ReviewResultProps) {
  const dialectLabel =
    getSqlDialectLabel(dialect);

  return (
    <section className="mt-8 space-y-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-wider text-zinc-500">
            Overall review
          </p>

          <h2 className="mt-2 text-2xl font-semibold">
            SQL review result
          </h2>

          <p className="mt-2 text-sm text-zinc-500">
            Database dialect:{" "}
            <span className="font-medium text-zinc-300">
              {dialectLabel}
            </span>
          </p>
        </div>

        <ScoreBadge
          score={review.overallScore}
        />
      </div>

      <p className="leading-7 text-zinc-300">
        {review.summary}
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        {review.categories.map(
          (category) => (
            <article
              key={category.id}
              className="rounded-xl border border-zinc-800 bg-zinc-950 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-semibold">
                  {category.name}
                </h3>

                <ScoreBadge
                  score={category.score}
                />
              </div>

              <p className="mt-3 text-sm leading-6 text-zinc-400">
                {category.summary}
              </p>

              {category.observations.length >
                0 && (
                <ul className="mt-4 space-y-3 text-sm">
                  {category.observations.map(
                    (
                      observation,
                      index,
                    ) => (
                      <Observation
                        key={`${category.id}-${index}`}
                        observation={
                          observation
                        }
                      />
                    ),
                  )}
                </ul>
              )}
            </article>
          ),
        )}
      </div>

      {review.suggestions.length > 0 && (
        <div>
          <h3 className="font-semibold">
            Suggested improvements
          </h3>

          <ul className="mt-3 space-y-2 text-sm text-zinc-300">
            {review.suggestions.map(
              (suggestion, index) => (
                <li key={index}>
                  • {suggestion}
                </li>
              ),
            )}
          </ul>
        </div>
      )}

      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
        <h3 className="font-semibold text-amber-300">
          Analysis limitations
        </h3>

        <ul className="mt-3 space-y-2 text-sm text-amber-100/80">
          {review.limitations.map(
            (limitation, index) => (
              <li key={index}>
                • {limitation}
              </li>
            ),
          )}
        </ul>
      </div>
    </section>
  );
}
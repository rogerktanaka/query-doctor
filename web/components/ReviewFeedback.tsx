"use client";

import {
  useState,
  type FormEvent,
} from "react";

import {
  submitReviewFeedback,
  type FeedbackImprovement,
  type FeedbackRepeatIntent,
  type FeedbackUsefulness,
} from "@/lib/reviewFeedbackService";

interface ReviewFeedbackProps {
  reviewId: string;
}

const improvementOptions: ReadonlyArray<{
  value: FeedbackImprovement;
  label: string;
}> = [
  {
    value: "revised_code",
    label: "Return revised SQL code",
  },
  {
    value: "plsql_support",
    label: "Add Oracle PL/SQL support",
  },
  {
    value: "deeper_oracle_sql",
    label: "Provide deeper Oracle SQL analysis",
  },
  {
    value: "other_dialects",
    label: "Improve support for other databases",
  },
  {
    value: "workflow_integration",
    label: "Add IDE, CLI, or pull-request integration",
  },
  {
    value: "other",
    label: "Something else",
  },
];

export function ReviewFeedback({
  reviewId,
}: ReviewFeedbackProps) {
  const [usefulness, setUsefulness] =
    useState<FeedbackUsefulness | "">("");
  const [repeatIntent, setRepeatIntent] =
    useState<FeedbackRepeatIntent | "">(
      "",
    );
  const [
    wantsRevisedCode,
    setWantsRevisedCode,
  ] = useState(false);
  const [wantsPlsql, setWantsPlsql] =
    useState(false);
  const [
    preferredImprovement,
    setPreferredImprovement,
  ] = useState<FeedbackImprovement | "">(
    "",
  );
  const [comment, setComment] =
    useState("");
  const [isSubmitting, setIsSubmitting] =
    useState(false);
  const [isSubmitted, setIsSubmitted] =
    useState(false);
  const [error, setError] =
    useState<string | null>(null);

  const canSubmit =
    usefulness !== "" &&
    repeatIntent !== "" &&
    !isSubmitting &&
    !isSubmitted;

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (
      usefulness === "" ||
      repeatIntent === "" ||
      isSubmitting ||
      isSubmitted
    ) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await submitReviewFeedback({
        reviewId,
        usefulness,
        repeatIntent,
        wantsRevisedCode,
        wantsPlsql,
        preferredImprovement:
          preferredImprovement || null,
        comment: comment.trim() || null,
      });

      setIsSubmitted(true);
    } catch (caughtError) {
      const message =
        caughtError instanceof Error
          ? caughtError.message
          : "Feedback could not be submitted. Please try again.";

      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSubmitted) {
    return (
      <section className="mt-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6">
        <h2 className="text-lg font-semibold text-emerald-300">
          Thank you for your feedback
        </h2>

        <p className="mt-2 text-sm leading-6 text-zinc-400">
          Your response was recorded and will
          help guide the next QueryMend
          improvements.
        </p>
      </section>
    );
  }

  return (
    <section className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl">
      <div>
        <p className="text-sm font-medium uppercase tracking-wider text-emerald-400">
          Public Beta feedback
        </p>

        <h2 className="mt-2 text-xl font-semibold">
          Was this review useful?
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
          A short response helps us improve
          review quality and decide what to
          build next. Do not include
          confidential code or business
          information.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-6 space-y-7"
      >
        <fieldset>
          <legend className="text-sm font-medium text-zinc-200">
            Was the review useful?
          </legend>

          <div className="mt-3 flex flex-wrap gap-3">
            {(
              [
                ["yes", "Yes"],
                ["partly", "Partly"],
                ["no", "No"],
              ] as const
            ).map(([value, label]) => (
              <label
                key={value}
                className={`cursor-pointer rounded-lg border px-4 py-2 text-sm transition ${
                  usefulness === value
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-300"
                    : "border-zinc-700 bg-zinc-950 text-zinc-300 hover:border-zinc-600"
                }`}
              >
                <input
                  type="radio"
                  name="usefulness"
                  value={value}
                  checked={
                    usefulness === value
                  }
                  onChange={() =>
                    setUsefulness(value)
                  }
                  className="sr-only"
                />

                {label}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-sm font-medium text-zinc-200">
            Would you use QueryMend again?
          </legend>

          <div className="mt-3 flex flex-wrap gap-3">
            {(
              [
                ["yes", "Yes"],
                ["maybe", "Maybe"],
                ["no", "No"],
              ] as const
            ).map(([value, label]) => (
              <label
                key={value}
                className={`cursor-pointer rounded-lg border px-4 py-2 text-sm transition ${
                  repeatIntent === value
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-300"
                    : "border-zinc-700 bg-zinc-950 text-zinc-300 hover:border-zinc-600"
                }`}
              >
                <input
                  type="radio"
                  name="repeat-intent"
                  value={value}
                  checked={
                    repeatIntent === value
                  }
                  onChange={() =>
                    setRepeatIntent(value)
                  }
                  className="sr-only"
                />

                {label}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-sm font-medium text-zinc-200">
            What would make QueryMend more
            useful?
          </legend>

          <div className="mt-3 space-y-3">
            <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-zinc-800 bg-zinc-950 p-4">
              <input
                type="checkbox"
                checked={wantsRevisedCode}
                onChange={(event) =>
                  setWantsRevisedCode(
                    event.target.checked,
                  )
                }
                className="mt-1 h-4 w-4 accent-emerald-500"
              />

              <span>
                <span className="block text-sm font-medium text-zinc-200">
                  Return revised code
                </span>

                <span className="mt-1 block text-xs leading-5 text-zinc-500">
                  Include a proposed SQL rewrite
                  alongside the review.
                </span>
              </span>
            </label>

            <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-zinc-800 bg-zinc-950 p-4">
              <input
                type="checkbox"
                checked={wantsPlsql}
                onChange={(event) =>
                  setWantsPlsql(
                    event.target.checked,
                  )
                }
                className="mt-1 h-4 w-4 accent-emerald-500"
              />

              <span>
                <span className="block text-sm font-medium text-zinc-200">
                  Add Oracle PL/SQL support
                </span>

                <span className="mt-1 block text-xs leading-5 text-zinc-500">
                  Review procedures, functions,
                  packages, triggers, and
                  procedural logic.
                </span>
              </span>
            </label>
          </div>
        </fieldset>

        <div>
          <label
            htmlFor="preferred-improvement"
            className="block text-sm font-medium text-zinc-200"
          >
            Most important next improvement
          </label>

          <select
            id="preferred-improvement"
            value={preferredImprovement}
            onChange={(event) =>
              setPreferredImprovement(
                event.target
                  .value as
                  | FeedbackImprovement
                  | "",
              )
            }
            className="mt-3 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
          >
            <option value="">
              Select an option (optional)
            </option>

            {improvementOptions.map(
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
        </div>

        <div>
          <div className="flex items-center justify-between gap-4">
            <label
              htmlFor="feedback-comment"
              className="block text-sm font-medium text-zinc-200"
            >
              Additional comments
            </label>

            <span className="text-xs text-zinc-500">
              {comment.length} / 1,000
            </span>
          </div>

          <textarea
            id="feedback-comment"
            value={comment}
            onChange={(event) =>
              setComment(event.target.value)
            }
            maxLength={1000}
            rows={4}
            placeholder="Tell us what worked, what was incorrect, or what you expected to receive."
            className="mt-3 w-full resize-y rounded-lg border border-zinc-700 bg-zinc-950 p-3 text-sm leading-6 text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>

        {error && (
          <p
            role="alert"
            className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-300"
          >
            {error}
          </p>
        )}

        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <p className="max-w-xl text-xs leading-5 text-zinc-500">
            Your submitted SQL is not included
            in this feedback record.
          </p>

          <button
            type="submit"
            disabled={!canSubmit}
            className="shrink-0 rounded-lg bg-emerald-500 px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-500"
          >
            {isSubmitting
              ? "Sending feedback..."
              : "Send feedback"}
          </button>
        </div>
      </form>
    </section>
  );
}
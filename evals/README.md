# Query Doctor Evaluation Suite

This directory contains a small evaluation suite for measuring SQL review quality and response time.

## Purpose

The suite helps detect:

- false positives on clean SQL
- missed correctness defects
- speculative performance claims
- invented schema or business assumptions
- inconsistent severity and confidence
- semantic changes in suggested rewrites
- response-time regressions

## Automated checks

The runner automatically verifies:

- whether the API request completed successfully
- whether the response contains a numeric overall score
- whether the score is inside the expected range
- whether the configured SQL dialect is accepted by the API


The process exits with code `1` if any automated check fails.

A successful automated check does not prove that the review is correct.

## Qualitative review

The following expectations still require manual review:

- required findings
- forbidden claims
- correctness of explanations
- severity and confidence classification
- semantic safety of suggestions
- unsupported or speculative claims

Each evaluation case declares the dialect sent to the review API. Use `unspecified` for portable SQL cases that must not assume a database engine.

These expectations are stored in `expectations.json` and copied into each generated result.

## Running locally

Start the application in one terminal:

```bash
npm --prefix web run dev
```

Run the evaluation suite from the repository root in another terminal:

```bash
node evals/run.mjs local
```

You can provide a descriptive run label:

```bash
node evals/run.mjs gpt-5-low-v3
```

### Running selected cases

Use `--case` to run a specific evaluation case:

```bash
node evals/run.mjs targeted \
  --case 001-clean-query
```

Repeat the option to run multiple cases:

```bash
node evals/run.mjs targeted \
  --case 001-clean-query \
  --case 005-invalid-aggregation
```

When no `--case` option is provided, all cases run as before.

Unknown case IDs and invalid arguments fail before any API request is made.
## Running against another environment

Set `EVAL_BASE_URL` to the target application:

```bash
EVAL_BASE_URL=https://example.vercel.app \
  node evals/run.mjs production
```

Only run the complete suite against production intentionally because each case makes an AI API request.

## Exit codes

- `0` — all automated checks passed
- `1` — server unavailable, request failure, invalid score, or score outside its expected range

## Results

Generated results are written to `evals/results/`.

Each result includes:

- response time
- HTTP status
- expected score range
- actual score
- automated pass or fail status
- failure reasons
- complete structured review
- qualitative expectations

Generated result files are ignored by Git.

## Structure

```text
evals/
├── baselines/        Versioned qualitative assessments
├── cases/            SQL input files
├── results/          Generated results, ignored by Git
├── expectations.json
├── README.md
└── run.mjs
```
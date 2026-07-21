# Query Doctor

Query Doctor is an AI-powered static SQL code review tool.

Instead of simply explaining SQL, Query Doctor reviews a query as if it were part of a professional Pull Request. It focuses on correctness, readability, maintainability, and potential performance risks while clearly separating observable behavior from assumptions that require database context.

## Live Application

https://query-doctor-six.vercel.app

## Current Version

**v0.2.0 — Review Quality**

The MVP is publicly deployed and under active development.

## Features

- Structured AI-generated SQL reviews
- Overall and category scores
- Correctness and semantic analysis
- Readability and maintainability analysis
- Conditional performance-risk analysis
- Observation severity and confidence levels
- Positive feedback for good SQL
- Suggested improvements
- Explicit analysis limitations
- Sample SQL query
- Input validation and character-limit feedback
- Safe user-facing error handling
- Automated evaluation suite
- Targeted evaluation runs
- Qualitative model baselines

## Static Analysis Scope

Query Doctor analyzes only the supplied SQL text.

It does not:

- execute SQL
- connect to a database
- inspect schemas or constraints
- inspect indexes
- read statistics or data distribution
- generate or inspect execution plans
- measure runtime performance

Performance observations are therefore conditional unless directly supported by the SQL text.

## Technology

- Next.js
- React
- TypeScript
- Tailwind CSS
- OpenAI Responses API
- Zod Structured Outputs
- Vercel

## Local Development

Clone the repository:

```bash
git clone https://github.com/rogerktanaka/query-doctor.git
cd query-doctor
```

Install dependencies:

```bash
npm --prefix web install
```

Create `web/.env.local`:

```text
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-5
```

Do not commit this file or expose the API key in browser code.

Start the development server:

```bash
npm --prefix web run dev
```

Open:

```text
http://localhost:3000
```

## Validation

Run lint and the production build from the repository root:

```bash
npm --prefix web run lint
npm --prefix web run build
```

## Evaluation Suite

Keep the local application running, then execute all evaluation cases:

```bash
node evals/run.mjs local
```

Run a specific case:

```bash
node evals/run.mjs targeted \
  --case 001-clean-query
```

Run multiple selected cases:

```bash
node evals/run.mjs targeted \
  --case 001-clean-query \
  --case 005-invalid-aggregation
```

The automated gate checks HTTP success and expected score ranges. Required findings and forbidden claims still require qualitative review.

See `evals/README.md` for the complete workflow.

## Project Documentation

- `docs/PRD.md` — product requirements
- `docs/ROADMAP.md` — delivery roadmap
- `docs/CHANGELOG.md` — version history
- `docs/FOUNDING.md` — product and engineering principles
- `web/prompts/sql-review-system.md` — versioned review prompt

## Security

- The OpenAI API key is used only on the server.
- Environment files are excluded from Git.
- Production secrets are stored as Vercel environment variables.
- Technical provider errors are logged on the server and are not exposed directly to users.
- SQL input length is limited before AI processing.

## Vision

Help developers write better SQL through concise, trustworthy, and educational code reviews.
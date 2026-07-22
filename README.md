# Query Doctor

Query Doctor is an AI-powered static SQL code review tool.

Instead of simply explaining SQL, Query Doctor reviews queries as if they were part of a professional pull request.

**Production:** https://query-doctor-six.vercel.app

## Status

**Current version:** `0.4.0`
**Stage:** Oracle Deep Review Beta

Query Doctor supports multiple SQL dialect contexts while Oracle remains the first deep technical and commercial specialization.

## Features

- Structured SQL code review
- Overall review score
- Correctness and semantics analysis
- Readability and maintainability analysis
- Potential performance-risk analysis
- Observation severity and confidence
- Suggested improvements
- Explicit analysis limitations
- Database dialect selection
- Input validation and safe user-facing errors
- Automated evaluation suite
- Token-usage and estimated-cost monitoring

## Supported Dialect Contexts

- Not specified
- Oracle
- PostgreSQL
- SQL Server
- MySQL

Oracle currently has the deepest evaluation coverage.

PostgreSQL, SQL Server, and MySQL support is experimental and may produce speculative recommendations.

## Product Direction

Query Doctor is architecturally multi-dialect, but Oracle is the first deep specialization.

The current release adds deeper Oracle coverage for NULL semantics, temporal boundaries, Top-N queries, CTEs, and analytic functions.

See [Private Oracle Beta](docs/PRIVATE_BETA.md) for the testing workflow, success criteria, and participant guidance.

The initial target audience includes:

- Oracle SQL developers
- PL/SQL developers
- Oracle consultants
- Oracle DBAs
- Technical leads who review Oracle SQL
- Teams that maintain Oracle-based systems

## How It Works

1. Select the target database dialect.
2. Paste a SQL statement.
3. Submit the query for review.
4. Receive a structured analysis with scores, observations, severity, confidence, suggestions, and limitations.

Query Doctor performs static analysis only.

It does not:

- execute SQL;
- connect to a database;
- inspect schemas automatically;
- inspect indexes or statistics;
- generate or inspect execution plans;
- guarantee runtime performance;
- replace professional database review.

## Cost Monitoring

Query Doctor records token usage and estimated AI-provider cost in server-side logs.

The local evaluation runner also records per-review and aggregate usage metrics, including:

- input and output tokens;
- cached input tokens;
- reasoning tokens;
- total token usage;
- estimated cost per review;
- estimated cost for the complete evaluation run.

Detailed metric headers are available only in non-production environments. Cost calculations are estimates and may differ from the provider invoice.

See [Cost Monitoring and Unit Economics](docs/COSTS.md) for pricing assumptions, budget thresholds, and the initial benchmark.

## Privacy and Responsible Use

Do not submit confidential SQL, credentials, personal data, internal identifiers, proprietary business rules, or customer information.

SQL submitted for review is sent to the application server and processed by the configured AI provider.

Use anonymized or synthetic SQL when evaluating the Beta.

## Technology Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- OpenAI Responses API
- Zod Structured Outputs
- Vercel

## Local Development

Install the web application dependencies:

```bash
npm --prefix web install
# Changelog

All notable changes to Query Doctor will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

---

## [Unreleased]

---

## [0.2.0] — 2026-07-21

### Added

- Sample SQL query action
- Visible SQL character counter
- User feedback when SQL approaches or exceeds the input limit
- Shared SQL input limit between the interface and API
- Stable API error codes
- Automated evaluation pass and fail gates
- Non-zero evaluation exit codes for regressions
- Targeted evaluation runs using repeated `--case` options
- Versioned qualitative evaluation baselines

### Changed

- Improved SQL review prompt for more consistent classifications
- Reduced speculative NULL, index, sorting, and cardinality observations
- Improved distinction between observable behavior and unknown author intent
- Improved NOT IN and NULL-semantics guidance
- Improved LEFT JOIN semantic analysis
- Improved aggregation correctness analysis
- Restricted COUNT-versus-EXISTS recommendations to supported claims
- Restricted unsafe representative-value aggregate suggestions
- Improved date and timestamp review guidance
- Improved score calibration for clean queries and correctness defects
- Selected GPT-5 with low reasoning effort as the MVP model
- Updated the evaluation workflow documentation

### Security

- Technical OpenAI errors remain in server logs
- User-facing responses no longer expose provider or configuration details
- Network, invalid response, rate-limit, and service failures receive safe messages

### Performance

- Established a 20-second average response-time target for the MVP
- Added response-time measurement to the evaluation runner
- Added targeted evaluations to reduce development time and API usage

### Deployment

- Sprint 002 improvements are available at:
  https://query-doctor-six.vercel.app

---

## [0.1.0] — 2026-07-21

### Added

- Initial Query Doctor MVP
- Next.js web application
- SQL query input interface
- AI-generated structured SQL reviews
- Overall review score
- Review categories and category scores
- Observation types, severity levels, and confidence levels
- Suggested improvements
- Static-analysis limitations
- Loading and error states
- Empty-input validation
- Maximum SQL input length validation
- OpenAI Responses API integration
- Zod Structured Outputs validation
- Versioned SQL review system prompt
- Automated SQL review evaluation suite
- Evaluation cases for clean SQL and observable SQL defects
- Product requirements and engineering documentation
- Initial product roadmap

### Security

- OpenAI API key is handled only by the server
- Environment files and secrets are excluded from Git
- Production secrets are stored as Vercel environment variables
- SQL input length is limited before AI processing

### Infrastructure

- Git version control
- GitHub repository
- Automated lint and production build validation
- Vercel production deployment
- Production environment configuration

### Deployment

- Query Doctor is publicly available at:
  https://query-doctor-six.vercel.app

---

## Release Guidelines

Versions follow semantic versioning:

- **MAJOR** — incompatible or fundamental product changes
- **MINOR** — new backward-compatible functionality
- **PATCH** — backward-compatible fixes and improvements
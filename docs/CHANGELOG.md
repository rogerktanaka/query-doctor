# Changelog

All notable changes to Query Doctor will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

---

## [Unreleased]

### Planning

- Started Sprint 005 — Public Beta Validation
- Expanded validation beyond the initial Oracle Retail and integration cohort
- Defined controlled public-Beta safety, measurement, and recruitment goals
- Added PL/SQL and revised-code demand as explicit validation hypotheses
- Added the controlled public Beta operating plan
- Defined participant segments, rollout stages, success criteria, and pause conditions
- Preserved the initial private Oracle Beta as the first validation cohort

## [0.4.1] — 2026-07-22

### Changed

- Preselected Oracle as the initial database dialect in the Beta interface
- Updated interface guidance to clarify that other dialects remain experimental
- Preserved Not specified and all other dialect options
- Preserved unspecified as the conservative API fallback when no dialect is supplied

### Deployment

- Oracle-first Beta interface available at:
  https://query-doctor-six.vercel.app


## [0.4.0] — 2026-07-22

### Added

- First Oracle Deep Review evaluation case
- Oracle ROWNUM and ORDER BY Top-N regression coverage
- Qualitative baseline for Oracle Top-N review behavior
- Second Oracle Deep Review evaluation case
- Oracle empty-string and NULL-semantics regression coverage
- Qualitative baseline for Oracle empty-string review behavior
- Third Oracle Deep Review evaluation case
- Oracle TO_DATE and NLS_DATE_FORMAT regression coverage
- Qualitative baseline for Oracle NLS-dependent date parsing
- Fourth Oracle Deep Review evaluation case
- Oracle DATE equality and whole-day filtering regression coverage
- Qualitative baseline for Oracle half-open date-range guidance
- Fifth Oracle Deep Review evaluation case covering inclusive BETWEEN boundaries
- Sixth Oracle Deep Review evaluation case covering clean CTE and analytic SQL
- Consolidated v0.4.0 release-candidate evaluation baseline
- Private Oracle Beta workflow and success criteria
- Token-usage and estimated-cost instrumentation for SQL reviews
- Per-case and aggregate cost metrics in the evaluation runner
- Cost-monitoring and unit-economics documentation

### Changed

- Improved recognition of explicit intent documented in SQL comments
- Reduced unsupported tie-handling and deterministic-ordering recommendations
- Restricted unsupported performance claims for Top-N rewrites
- Added Oracle-specific guidance for zero-length character strings
- Prevented unsupported TRIM, NVL, and whitespace recommendations for missing Oracle character values
- Reduced speculative performance findings for clean analytic queries
- Prevented unnecessary alternative ranking recommendations for correct ROW_NUMBER solutions
- Added model, token-usage, and estimated-cost data to server-side review logs
- Restricted detailed review-metric response headers to non-production environments

### Quality

- Added the ninth automated SQL review evaluation case
- Completed a nine-case regression with all automated score gates passing
- Documented probabilistic variation in secondary recommendations
- Added the tenth automated SQL review evaluation case
- Completed a targeted Oracle NULL-semantics regression with two passing cases
- Qualitatively accepted the Oracle TO_DATE review after recalibrating its score range
- Recorded token usage and estimated cost for the third Oracle Deep Review case
- Validated Oracle whole-day filtering with a half-open date range
- Recorded the first evaluation with substantial cached-input usage
- Validated the inclusive upper boundary of Oracle temporal BETWEEN
- Recorded the lowest estimated evaluation cost observed so far
- Validated a clean Oracle CTE and analytic-function review
- Recorded comparative cost and latency across three targeted analytic evaluations
- Captured the first measured review-cost benchmark at approximately US$0.0195
- Verified cost instrumentation with a passing clean-query smoke evaluation
- Completed the fourteen-case v0.4.0 release-candidate regression with all automated gates passing
- Completed focused post-regression validation for Oracle date semantics
- Measured US$0.014756 average estimated cost per review in the full release-candidate regression
- Accepted v0.4.0-rc1 after automated and qualitative review

### Release Validation

- Fourteen automated evaluation cases passed
- Oracle-specific prompt changes passed focused regression checks
- Clean Oracle analytic SQL produced no forced performance findings or suggestions
- Detailed token and cost metrics were captured

### Known Limitations

- Average release-candidate latency was 24.446 seconds
- Individual AI responses remain probabilistic
- Qualitative assessment remains necessary in addition to score gates
- PL/SQL procedural analysis is not included
- PostgreSQL, SQL Server, and MySQL have shallower coverage than Oracle

### Deployment

- Oracle Deep Review Beta is available at:
  https://query-doctor-six.vercel.app

---

## [0.3.0] — 2026-07-22

### Added

- Database dialect selector
- Shared SQL dialect contract
- Support for the following dialect contexts:
  - Not specified
  - Oracle
  - PostgreSQL
  - SQL Server
  - MySQL
- Server-side dialect validation
- Explicit dialect context in AI review instructions
- Selected dialect display in review results
- Conservative review mode when no dialect is specified
- Initial PostgreSQL-specific evaluation case
- Initial SQL Server-specific evaluation case
- Initial MySQL-specific evaluation case
- Cross-dialect contamination assessment
- Dialect metadata in evaluation results
- Qualitative baseline for the `v0.3.0` release candidate

### Changed

- Repositioned Query Doctor as a dialect-aware SQL review platform
- Established Oracle as the first deep technical and commercial specialization
- Updated the review interface with dialect maturity guidance
- Updated the evaluation suite from five to eight cases
- Updated the product roadmap for Oracle-focused review and private Beta validation
- Preserved conservative review behavior for unsupported or unspecified database details

### Quality

- All eight release-candidate evaluation cases passed their automated score gates
- Existing clean-query and correctness-defect cases continued to pass
- No direct cross-dialect syntax contamination was observed in the evaluated cases
- Oracle-specific behavior remained compatible with existing review-quality rules
- Average release-candidate response time was 17.992 seconds

### Known Limitations

- Dialect-aware guidance remains a Beta feature
- Oracle has deeper evaluation coverage than PostgreSQL, SQL Server, and MySQL
- Experimental dialect reviews may produce speculative ordering, collation, sorting, or index recommendations
- Qualitative review is still required in addition to automated score gates
- Stored procedures and procedural SQL are not supported
- Query conversion between dialects is not part of this release

### Deployment

- Dialect-aware Beta reviews are available at:
  https://query-doctor-six.vercel.app

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
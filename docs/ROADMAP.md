# Query Doctor Roadmap

## Current Version

**Version:** 0.4.1
**Status:** Oracle Deep Review Beta publicly deployed
**Production:** https://query-doctor-six.vercel.app

---

# Sprint 001 — Foundation

**Status:** Complete
**Completed:** 2026-07-21

## Goal

Create the first working version of Query Doctor.

A user must be able to paste a SQL query and receive a structured AI-generated review.

## Delivered Scope

- Project repository
- Development environment
- Product documentation
- Next.js application
- SQL input interface
- Review submission
- OpenAI API integration
- Structured review response
- Overall and category scores
- Severity and confidence classifications
- Input validation
- Loading and error states
- Automated evaluation suite
- Secure environment variable handling
- Public Vercel deployment

## Definition of Done

- [x] The application is publicly accessible.
- [x] A user can paste a SQL query.
- [x] The application sends the query for analysis.
- [x] The user receives a useful structured review.
- [x] The OpenAI API key is not exposed in the browser.

---

# Sprint 002 — Review Quality

**Status:** Complete
**Completed:** 2026-07-21

## Goal

Improve the usefulness, consistency, and trustworthiness of SQL reviews.

## Delivered Scope

- Improved SQL review system prompt
- Structured review categories
- Severity levels
- Confidence levels
- Overall and category scores
- Sample SQL query action
- Improved loading and error states
- Empty-input validation
- Maximum-input validation
- Visible character counter and limit feedback
- Safe user-facing API errors
- Model quality and latency comparison
- Selection of GPT-5 for the MVP
- Reduced speculative recommendations
- Score calibration for clean and defective SQL
- Automated evaluation gates
- Targeted evaluation runs
- Qualitative evaluation baselines
- Documented evaluation workflow
- Production validation on Vercel

## Definition of Done

- [x] Reviews distinguish observable behavior from unknown intent.
- [x] Directly observable correctness defects receive appropriate severity and confidence.
- [x] Clean SQL receives positive feedback without forced criticism.
- [x] Performance claims remain conditional without runtime evidence.
- [x] Automated checks detect request and scoring regressions.
- [x] Evaluation results support manual qualitative review.
- [x] User-facing errors do not expose technical provider details.
- [x] Sprint improvements are available in production.

---

# Sprint 003 — Dialect-Aware Reviews

**Status:** Complete
**Completed:** 2026-07-21

## Goal

Allow users to select the target SQL dialect so Query Doctor can provide more accurate syntax and semantics guidance without guessing the database engine.

## Supported Dialect Choices

- Not specified
- Oracle
- PostgreSQL
- SQL Server
- MySQL

Oracle currently has the deepest evaluation coverage.

PostgreSQL, SQL Server, and MySQL support is experimental.

## Delivered Scope

- Shared SQL dialect definition
- Database dialect selector
- Dialect validation in the API
- Dialect context passed to the review engine
- Explicit selected dialect in the AI instructions
- Selected dialect displayed in the review result
- Conservative behavior when the dialect is not specified
- Oracle-specific evaluation coverage
- Initial PostgreSQL evaluation case
- Initial SQL Server evaluation case
- Initial MySQL evaluation case
- Cross-dialect contamination assessment
- Updated evaluation runner metadata
- Beta and dialect-maturity guidance in the interface
- Production deployment

## Definition of Done

- [x] A user can select a supported SQL dialect.
- [x] The selected dialect is validated by the server.
- [x] The selected dialect is included in the AI review context.
- [x] The review identifies which dialect was used.
- [x] Not specified mode does not assume a database engine.
- [x] Oracle reviews do not recommend MySQL, PostgreSQL, or T-SQL syntax.
- [x] PostgreSQL reviews do not recommend Oracle, MySQL, or T-SQL syntax.
- [x] SQL Server reviews do not recommend Oracle, PostgreSQL, or MySQL syntax.
- [x] MySQL reviews do not recommend Oracle, PostgreSQL, or T-SQL syntax.
- [x] Existing generic evaluation cases continue to pass.
- [x] New dialect-specific cases pass automated review.
- [x] New dialect-specific cases receive qualitative assessment.
- [x] Sprint improvements are available in production.

## Known Limitations

- Dialect-aware guidance remains a Beta feature.
- Oracle has deeper evaluation coverage than the other dialects.
- PostgreSQL, SQL Server, and MySQL reviews may still generate speculative recommendations.
- Ordering stability, collations, indexes, and sorting may be discussed without sufficient evidence.
- Dialect-specific claims still require continued evaluation.
- Stored procedures and procedural SQL are not supported.

---

# Sprint 004 — Oracle Deep Review

**Status:** Complete

**Started:** 2026-07-22

**Completed:** 2026-07-22

## Progress

- Added the first Oracle Deep Review evaluation case.
- Validated Oracle Top-N behavior involving ROWNUM and ORDER BY.
- Added evidence-based guidance for explicit SQL comments.
- Reduced unsupported tie-handling and deterministic-ordering recommendations.
- Completed a nine-case regression run with all automated gates passing.
- Documented remaining variability in speculative performance recommendations.
- Added Oracle empty-string and NULL-semantics evaluation coverage.
- Validated that Oracle `column = ''` does not match missing values.
- Added focused guidance recommending `IS NULL` for missing Oracle character values.
- Completed a targeted regression against clean Oracle SQL and demonstrable NOT IN NULL behavior.
- Recorded the initial OpenAI API budget snapshot for evaluation-cost tracking.
- Added token-usage and estimated-cost instrumentation for SQL reviews.
- Added per-case and aggregate cost metrics to the evaluation workflow.
- Captured the first measured benchmark at approximately US$0.0195 per review.
- Documented cost assumptions, budget thresholds, and unit-economics limitations.
- Added Oracle TO_DATE and NLS_DATE_FORMAT evaluation coverage.
- Validated session-dependent date parsing guidance without treating failure as guaranteed.
- Recalibrated the score range for a correct but NLS-dependent Oracle query.
- Added Oracle DATE equality and whole-day filtering evaluation coverage.
- Validated half-open date ranges for explicit whole-day requirements.
- Recorded substantial prompt-cache usage in an Oracle evaluation.
- Added Oracle BETWEEN inclusive-boundary evaluation coverage.
- Validated exclusive upper bounds for Oracle daily intervals.
- Added clean Oracle CTE and analytic-function evaluation coverage.
- Reduced forced performance criticism for correct analytic SQL.
- Validated empty suggestions and performance findings for a clean Oracle query.
- Completed the fourteen-case v0.4.0 release-candidate regression.
- Completed focused regression checks after final Oracle date-guidance improvements.
- Documented the private Oracle Beta audience, workflow, metrics, and success criteria.
- Accepted v0.4.0-rc1 as the technical release candidate.

## Goal

Make Query Doctor especially useful for Oracle SQL developers while preserving the multi-dialect architecture.

## Product Direction

Query Doctor remains architecturally multi-dialect, but Oracle is the first commercial and technical specialization.

The initial target audience is:

- Oracle SQL developers
- PL/SQL developers
- Oracle consultants
- Oracle DBAs
- Technical leads who review Oracle SQL
- Teams that maintain Oracle-based systems

## Candidate Scope

- Deeper Oracle SQL review rules
- Oracle-specific best practices
- Oracle date and timestamp semantics
- Oracle NULL and empty-string behavior
- Oracle joins and subquery patterns
- Oracle analytic functions
- Oracle pagination and top-N patterns
- Oracle-specific anti-pattern detection
- Expanded Oracle-focused evaluation suite
- Initial PL/SQL review research
- Execution-plan education without inventing plans
- Preparation for a private Oracle-focused Beta
- Definition of the first Oracle user-feedback workflow

## Definition of Done

- [x] Oracle-specific guidance is backed by targeted evaluation cases.
- [x] Oracle reviews avoid unsupported schema and performance assumptions.
- [x] Common Oracle semantic traps receive appropriate severity and confidence.
- [x] Clean Oracle SQL is recognized without forced criticism.
- [x] Oracle-specific recommendations preserve observable behavior.
- [x] The private Beta audience and testing workflow are documented.
- [x] Sprint improvements are available in production.

## Out of Scope

- Complete PL/SQL procedural analysis
- Database connections
- SQL execution
- Execution-plan generation
- Automatic schema inspection
- Equal-depth specialization for all dialects
- Query conversion between dialects
- Authentication and billing

---

# Sprint 005 — Public Beta Validation

**Status:** In progress

**Started:** 2026-07-23

## Goal

Validate who finds recurring value in Query Doctor, for which review workflow, and under what conditions, through a controlled, safe, and measurable public Beta.

## Validation Strategy

Expand validation beyond the initial Oracle Retail and integration cohort while preserving Oracle as the deepest technical specialization.

The Beta should recruit participants across different:

- database dialects;
- professional roles;
- SQL and PL/SQL use cases;
- experience levels;
- review workflows.

## Candidate Scope

- Public Beta information and recruitment page
- In-product usefulness feedback
- Optional incorrect-review reporting
- Anonymous session identification
- Privacy-preserving aggregate metrics
- Review completion, dialect, latency, and cost measurement
- Per-session and global usage limits
- Daily cost protection
- Controlled Beta pause mechanism
- Gradual participant recruitment
- Qualitative interviews
- Repeat-usage measurement
- Preferred-workflow validation
- PL/SQL and revised-code demand validation
- Willingness-to-pay research

## Initial Participant Segments

- Oracle SQL and PL/SQL developers
- Oracle integration developers
- Oracle DBAs and technical reviewers
- PostgreSQL developers
- SQL Server developers
- MySQL developers
- Data engineers and data analysts
- Technical consultants outside Oracle Retail

## Validation Questions

- Is the review technically useful?
- Does it identify material issues?
- Does it generate incorrect or speculative claims?
- Would the participant use it again?
- Does the participant expect revised code as part of the review?
- Is SQL review sufficient, or is PL/SQL support required?
- Where should the tool be available: web, IDE, CLI, or pull request?
- Which professional and database segments perceive the most value?
- Would an individual or company pay for the result?
- Can expected revenue support review costs?

## Definition of Done

- [x] Public Beta purpose, audience, limits, and success criteria are documented.
- [ ] Participants receive clear privacy and confidentiality guidance.
- [ ] Submitted SQL is not stored by the Beta telemetry layer.
- [ ] Review feedback can be submitted from the application.
- [ ] Review usage, latency, dialect, and estimated cost can be measured.
- [ ] Abuse and accidental budget consumption have basic protections.
- [ ] The Beta can be paused without a code deployment.
- [ ] At least 15 participants complete a review.
- [ ] At least three professional profiles are represented.
- [ ] At least three database contexts are represented.
- [ ] At least five participants provide qualitative feedback.
- [ ] Repeat-use intent and revised-code demand are measured.
- [ ] Sprint 006 direction is documented from observed evidence.

## Out of Scope

- Complete PL/SQL procedural analysis
- Production-ready automatic code rewriting
- Authentication and user accounts
- Billing and paid subscriptions
- Storing submitted SQL
- Equal-depth specialization for every dialect
- Paid acquisition campaigns
- IDE and pull-request integrations
- Sophisticated analytics dashboards

---

# Future Possibilities

These items are not committed and may change based on user feedback.

- Deeper PostgreSQL specialization
- Deeper SQL Server specialization
- Deeper MySQL specialization
- Oracle-to-SQL Server conversion
- Additional cross-dialect conversion modes
- Query rewrite mode
- Query comparison
- Review history
- Export review
- Authentication
- Team workspaces
- Usage limits
- Paid plans
- Database integrations
- IDE extension
- GitHub pull request integration
- PL/SQL procedural review

---

# Roadmap Principles

- The roadmap is directional, not contractual.
- User feedback may change priorities.
- Each Sprint must deliver something usable.
- New features must justify their complexity.
- MVP scope must remain protected.
- Dialect-specific claims require explicit dialect context or direct SQL evidence.
- Broad support must remain conservative until backed by dedicated evaluations.
- Shared review behavior belongs in the core.
- Database-specific behavior belongs in dialect-aware guidance.
- Oracle is the first deep specialization and initial validation market.
- Product validation should begin before extensive feature expansion.
- Query conversion is a separate future product mode.
# Query Doctor Roadmap

## Current Version

**Version:** 0.2.0  
**Status:** MVP publicly deployed  
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

**Status:** Next

## Goal

Allow users to select the target SQL dialect so Query Doctor can provide more accurate syntax and semantics guidance without guessing the database engine.

## Supported Dialect Choices

- Not specified
- Oracle
- PostgreSQL
- SQL Server
- MySQL

## Planned Scope

- Shared SQL dialect definition
- Database dialect selector
- Dialect validation in the API
- Dialect context passed to the review engine
- Explicit selected dialect in the AI instructions
- Selected dialect displayed in the review result
- Conservative behavior when the dialect is not specified
- Dialect-specific evaluation cases
- Cross-dialect contamination tests
- Updated evaluation runner metadata
- Updated product documentation

## Definition of Done

- [ ] A user can select a supported SQL dialect.
- [ ] The selected dialect is validated by the server.
- [ ] The selected dialect is included in the AI review context.
- [ ] The review identifies which dialect was used.
- [ ] Not specified mode does not assume a database engine.
- [ ] Oracle reviews do not recommend MySQL, PostgreSQL, or T-SQL syntax.
- [ ] PostgreSQL reviews do not recommend Oracle, MySQL, or T-SQL syntax.
- [ ] SQL Server reviews do not recommend Oracle, PostgreSQL, or MySQL syntax.
- [ ] MySQL reviews do not recommend Oracle, PostgreSQL, or T-SQL syntax.
- [ ] Existing generic evaluation cases continue to pass.
- [ ] New dialect-specific cases pass automated and qualitative review.
- [ ] Sprint improvements are available in production.

## Out of Scope

- PL/SQL procedural review
- T-SQL procedural review
- PL/pgSQL procedural review
- MySQL stored-program review
- Database connections
- SQL execution
- Execution-plan analysis
- Complete specialization for every supported database

---

# Sprint 004 — Oracle Deep Review

**Status:** Planned

## Goal

Make Query Doctor especially useful for Oracle SQL developers while preserving the multi-dialect architecture.

## Candidate Scope

- Deeper Oracle SQL review rules
- Oracle-specific best practices
- Oracle date and timestamp semantics
- Oracle NULL and empty-string behavior
- Oracle joins and subquery patterns
- Oracle analytic functions
- Oracle pagination patterns
- Oracle-specific anti-pattern detection
- Oracle-focused evaluation suite
- Initial PL/SQL review research
- Execution-plan education without inventing plans

---

# Sprint 005 — Product Validation

**Status:** Planned

## Goal

Collect feedback from real users and measure whether the product solves a relevant problem.

## Candidate Scope

- Feedback mechanism
- Basic usage analytics
- Review quality rating
- Public landing page
- Product demonstration
- Initial user testing
- Dialect usage measurement
- Qualitative interviews with SQL developers

---

# Future Possibilities

These items are not committed and may change based on user feedback.

- Deeper PostgreSQL specialization
- Deeper SQL Server specialization
- Deeper MySQL specialization
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

---

# Roadmap Principles

- The roadmap is directional, not contractual.
- User feedback may change priorities.
- Each Sprint must deliver something usable.
- New features must justify their complexity.
- MVP scope must remain protected.
- Dialect-specific claims require explicit dialect context or direct SQL evidence.
- Broad support must remain conservative until backed by dedicated evaluations.
- Shared review behavior belongs in the core; database-specific behavior belongs in dialect-aware guidance.
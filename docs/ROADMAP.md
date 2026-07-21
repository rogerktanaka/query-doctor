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

# Sprint 003 — Oracle Specialization

**Status:** Planned

## Goal

Make Query Doctor more useful for Oracle developers.

## Candidate Scope

- Oracle SQL review mode
- Explicit SQL dialect selection
- PL/SQL review support
- Oracle-specific best practices
- Detection of common Oracle anti-patterns
- Oracle date and NULL-semantics guidance
- Review guidance for indexes and joins
- Oracle-specific evaluation cases
- Execution plan education without inventing plans

---

# Sprint 004 — Product Validation

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

---

# Future Possibilities

These items are not committed and may change based on user feedback.

- PostgreSQL support
- SQL Server support
- MySQL support
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
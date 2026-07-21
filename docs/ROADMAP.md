# Query Doctor Roadmap

## Current Version

**Version:** 0.1.0  
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

**Status:** In progress

## Goal

Improve the usefulness, consistency, and trustworthiness of SQL reviews.

## Already Delivered

- Improved SQL review system prompt
- Structured review categories
- Severity levels
- Confidence levels
- Overall score
- Category scores
- Improved loading state
- Empty-input validation
- Maximum-input validation
- Initial automated evaluation suite
- Model quality and latency comparison
- Selection of GPT-5 for the MVP

## Next Priorities

- Add a sample SQL query action
- Improve user-facing error messages
- Improve score calibration
- Reduce speculative recommendations
- Expand evaluation coverage
- Add regression checks for review quality
- Document the evaluation workflow
- Validate production latency and reliability

---

# Sprint 003 — Oracle Specialization

## Goal

Make Query Doctor more useful for Oracle developers.

## Candidate Scope

- Oracle SQL review mode
- PL/SQL review support
- Oracle-specific best practices
- Execution plan recommendations
- Detection of common Oracle anti-patterns
- Review guidance for indexes and joins
- Oracle-specific evaluation cases

---

# Sprint 004 — Product Validation

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
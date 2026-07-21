# Changelog

All notable changes to Query Doctor will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

---

## [Unreleased]

### Planned

- Continue improving review quality and consistency
- Improve user-facing error messages
- Add a sample SQL query
- Expand the automated evaluation suite

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
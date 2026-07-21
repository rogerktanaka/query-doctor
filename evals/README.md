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

Evaluation results require manual qualitative review.

A score inside the expected range does not automatically mean that a review passed.

## Structure

```text
evals/
├── baselines/        Versioned qualitative assessments
├── cases/            SQL input files
├── results/          Generated results, ignored by Git
├── expectations.json
├── README.md
└── run.mjs
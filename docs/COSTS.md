# Query Doctor Cost Monitoring

## Purpose

This document records how Query Doctor measures and estimates AI review costs.

The goals are to:

- understand cost per SQL review;
- protect the development budget;
- support future pricing decisions;
- compare model quality, latency, and cost;
- prevent unmeasured usage growth;
- establish basic product unit economics.

All monetary values in this document are expressed in US dollars.

---

## Current Model

- Provider: OpenAI
- Model: `gpt-5`
- Reasoning effort: `low`
- Maximum output tokens: `4,000`
- Pricing effective date: `2026-07-22`

The application reads the active model from its environment configuration.

If a configured model does not have a registered pricing entry, Query Doctor records token usage but returns no cost estimate.

It must not apply `gpt-5` pricing to another model automatically.

---

## Pricing Reference

The cost estimator currently uses the following `gpt-5` standard token prices:

| Token type | Price per 1 million tokens |
|---|---:|
| Input | US$1.25 |
| Cached input | US$0.125 |
| Output | US$10.00 |

Official reference:

https://developers.openai.com/api/docs/models/gpt-5

OpenAI prices may change.

The pricing table in the application is versioned manually and must be reviewed before changing models or making financial projections.

---

## Cost Formula

For a supported model:

```text
uncached input tokens =
  input tokens - cached input tokens

estimated cost =
  uncached input tokens × input price / 1,000,000
  + cached input tokens × cached input price / 1,000,000
  + output tokens × output price / 1,000,000
# Evaluation Baseline — Clean Oracle Analytic CTE v1

## Configuration

- Model: `gpt-5`
- Reasoning effort: `low`
- Dialect: Oracle
- Case: `014-oracle-clean-analytic-cte`
- Date: 2026-07-22
- Accepted run: `oracle-clean-analytic-cte-v3`

## Purpose

Evaluate whether Query Doctor recognizes a clean Oracle query using a CTE, `ROW_NUMBER`, `PARTITION BY`, analytic ordering, and an outer filter selecting the first ranked row per customer.

The case also verifies that ordinary analytic ordering is not automatically presented as a performance risk.

## Query Assumptions

The supplied comments explicitly state that `created_at` is not nullable and `order_id` uniquely identifies each order. These assumptions support the ranking and tie-breaking behavior.

## Results

| Version | Duration | Score | Tokens | Estimated cost | Qualitative result |
|---|---:|---:|---:|---:|---|
| v1 | 30.801s | 9.1 | 5,288 | US$0.017723 | Partial |
| v2 | 11.440s | 9.4 | 4,732 | US$0.011654 | Partial |
| v3 | 25.758s | 9.7 | 5,494 | US$0.018898 | Accepted |

Total estimated calibration cost: **US$0.048275**.

## Version 1 Assessment

The review understood the CTE and analytic ranking, but invented nullability and generic sorting concerns and recommended `KEEP(DENSE_RANK...)` without demonstrated need.

## Version 2 Assessment

The review removed the nullability concern and unnecessary alternative, but still treated analytic ordering as a performance risk without execution evidence.

## Version 3 Assessment

**Accepted.**

The review correctly explained the CTE, `ROW_NUMBER`, `PARTITION BY`, the outer `row_number = 1` filter, and the documented uniqueness assumption. It generated only positive correctness and readability observations, an empty performance observations array, and an empty suggestions array.

## Prompt Improvement

The clean-query discipline now treats analytic `PARTITION BY` and `ORDER BY` as required query semantics rather than performance risks by themselves. Without additional query-specific evidence, the reviewer must not invent sorting, memory, temporary-space, index, or data-volume concerns or replace a correct analytic solution merely to provide an alternative.

## Cost and Latency Assessment

Cost and latency varied substantially across the three executions. The accepted response was not the cheapest or fastest run. Score, latency, token usage, and cost remain probabilistic, and repeated tuning calls require a concrete quality reason.

## Decision

The v3 result is accepted as the clean Oracle analytic-query baseline. No further targeted execution is required. The prompt improvement should now be validated through the complete evaluation regression.

## Evidence

Generated results:

```text
evals/results/2026-07-22T14-51-39-063Z-oracle-clean-analytic-cte-v1.json
evals/results/2026-07-22T14-55-29-554Z-oracle-clean-analytic-cte-v2.json
evals/results/2026-07-22T14-57-59-152Z-oracle-clean-analytic-cte-v3.json
```

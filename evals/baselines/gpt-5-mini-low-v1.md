# Evaluation Baseline — gpt-5-mini-low-v1

## Configuration

- Model: `gpt-5-mini`
- Reasoning effort: `low`
- Structured output: compact, exactly three categories
- Cases: 5
- Date: 2026-07-21

## Performance

| Case | Duration | Score | Expected score |
|---|---:|---:|---:|
| 001-clean-query | 20.507s | 8.3 | 8.0–10.0 |
| 002-oracle-antipatterns | 27.401s | 6.5 | 5.5–7.0 |
| 003-left-join-filter | 17.204s | 4.0 | 5.0–7.5 |
| 004-demonstrable-not-in-null | 21.089s | 3.5 | 0.0–4.9 |
| 005-invalid-aggregation | 15.720s | 4.5 | 0.0–4.9 |

Average duration: **20.384s**

## Qualitative Results

### 001-clean-query — Partial

Correctly recognized:

- explicit columns
- clear aliases
- typed DATE literal
- valid aggregation

Problems:

- invented speculative NULL requirements
- suggested removing ORDER BY without evidence
- suggested an index without schema or workload
- claimed ORDER BY necessarily forces a sort
- filled the performance category with generic risks

### 002-oracle-antipatterns — Partial

Correctly recognized:

- conditional NOT IN NULL risk
- SELECT *
- comma-style joins
- COUNT(*) existence pattern
- function-on-column predicates
- typed date rewrite

Problems:

- incorrectly suggested changed time semantics from the date rewrite
- suggested generic IN/EXISTS performance differences
- repeated observations across categories

### 003-left-join-filter — Failed

Correctly observed:

- WHERE predicate rejects NULL-extended rows
- LEFT JOIN therefore behaves like INNER JOIN

Problems:

- assumed this behavior was unintended
- classified it as a high-severity, high-confidence issue
- gave an excessively low correctness score
- invented grouping and MAX(customer_name) recommendations
- filled performance observations without useful evidence

### 004-demonstrable-not-in-null — Passed with caveats

Correctly recognized:

- explicit NULL in the NOT IN set
- high-confidence correctness issue
- low overall score
- NULL-safe alternatives

Problems:

- used conditional wording for a demonstrable result
- repeated the same finding
- added weak performance speculation

### 005-invalid-aggregation — Passed with caveats

Correctly recognized:

- employee_name is neither grouped nor aggregated
- high-confidence correctness issue
- low overall score
- multiple conditional fixes based on intended grain

Problems:

- added generic GROUP BY performance speculation
- Oracle-specific expectation could not be satisfied because dialect was not provided to the model

## Baseline Decision

This baseline is **not accepted as release quality**.

Main systemic problems:

1. The model invents observations to fill every category.
2. Observable behavior and unknown author intent are sometimes conflated.
3. Conditional performance effects are occasionally presented too strongly.
4. Date lower-bound equivalence is not applied consistently.
5. Valid IN predicates receive generic EXISTS recommendations.
6. Dialect metadata is recorded by the evaluator but not sent to the application.

## Next Changes

- Allow categories to contain zero observations.
- Allow zero suggestions when no useful change exists.
- Require empty arrays instead of speculative filler.
- Separate observable SQL behavior from inferred author intent.
- Reinforce date lower-bound equivalence.
- Prohibit generic IN-versus-EXISTS performance claims.
- Adjust the aggregation expectation to standard SQL until dialect selection exists.
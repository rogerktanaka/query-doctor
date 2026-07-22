# Oracle Evaluation Baseline — ROWNUM Top-N v1

## Configuration

- Model: `gpt-5`
- Reasoning effort: `low`
- Dialect: Oracle
- Case: `009-oracle-rownum-order`
- Date: 2026-07-22
- Sprint: Oracle Deep Review

## Purpose

Evaluate whether Query Doctor recognizes the Oracle Top-N semantic error caused by applying `ROWNUM` in the same query block as `ORDER BY`.

The SQL comment explicitly requests the 10 employees with the highest salaries.

In the supplied query, Oracle applies the `ROWNUM <= 10` predicate before the final ordering of that query block. The query therefore selects up to 10 rows and then sorts those rows, rather than guaranteeing the 10 highest salaries.

## Targeted Runs

| Run | Duration | Score | Primary finding | Qualitative result |
|---|---:|---:|---|---|
| oracle-rownum-v1 | 18.755s | 4.5 | Correct | Partial |
| oracle-rownum-v2 | 20.858s | 4.5 | Correct | Partial |
| oracle-rownum-v3 | 19.794s | 3.8 | Correct | Partial |
| oracle-rownum-v4 | 16.732s | 4.6 | Correct | Partial |
| oracle-rownum-v5 | 18.047s | 3.8 | Correct | Accepted |

Average targeted duration: **18.837s**

## Full Regression

- Run: `oracle-deep-review-regression-v1`
- Cases: 9
- Automated checks: 9 passed, 0 failed
- Average duration: 22.969s
- Case 009 score: 4.0
- Case 009 automated result: PASS
- Case 009 qualitative result: Accepted with caveats

## Consistent Strengths

Across all targeted runs and the full regression, Query Doctor:

- recognized that `ROWNUM <= 10` is applied before `ORDER BY` in the same Oracle query block;
- explained that the query does not guarantee the 10 highest salaries;
- classified the defect as high severity and high confidence;
- connected observable behavior to the explicit SQL comment;
- recommended an ordered inline view with an outer `ROWNUM` predicate;
- mentioned `FETCH FIRST` with Oracle-version qualification;
- avoided PostgreSQL and MySQL `LIMIT`;
- avoided SQL Server `TOP`;
- assigned an appropriately low overall score.

## Variability Observed

Secondary recommendations varied between runs.

Observed speculative output included:

- deterministic ordering among equal salaries;
- boundary tie handling;
- `WITH TIES`;
- secondary ordering keys;
- possible Top-N optimization;
- possible sorting work;
- possible index support.

Prompt changes removed several of these claims from later targeted runs, but the full regression still produced a conditional sorting and index observation.

## Cross-Dialect Effects

The updated ordering guidance removed tie-breaker and deterministic-ordering recommendations from the evaluated PostgreSQL, SQL Server, and MySQL cases in the full regression.

Other known experimental-dialect concerns remain:

- PostgreSQL may infer date-level ordering intent and recommend specialized indexes.
- SQL Server may create conditional collation concerns.
- MySQL may recommend composite indexes or additional projected columns without sufficient evidence.

These limitations were already characteristic of the experimental dialect support.

## Performance Observation

The full regression average increased from the previous release-candidate baseline of 17.992 seconds to 22.969 seconds.

A single run is insufficient to establish a latency regression.

No model or token-setting change was made as part of this evaluation.

## Decision

The case is **accepted with caveats** as the first Oracle Deep Review evaluation.

The core Oracle semantic defect was detected consistently and accurately.

The remaining problem is not Oracle knowledge. It is inconsistent generation of unsupported secondary recommendations.

Further prompt repetition is not recommended without new evidence.

Potential future approaches include:

- automated semantic checks for forbidden claim classes;
- deterministic pre-review rules for demonstrable SQL patterns;
- a second review pass focused on evidence discipline;
- post-generation validation that rejects unsupported performance claims.

## Evidence

Targeted accepted result:

```text
evals/results/2026-07-22T13-11-36-690Z-oracle-rownum-v5.json
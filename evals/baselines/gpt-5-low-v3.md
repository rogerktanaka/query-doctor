# Evaluation Baseline — gpt-5-low-v3

## Configuration

- Model: `gpt-5`
- Reasoning effort: `low`
- Structured output: compact, exactly three categories
- Cases: 5
- Date: 2026-07-21
- Automated gate: enabled

## Automated Results

| Case | Duration | Score | Accepted range | Result |
|---|---:|---:|---:|---|
| 001-clean-query | 15.136s | 9.2 | 8.0–10.0 | PASS |
| 002-oracle-antipatterns | 22.517s | 7.8 | 6.5–8.0 | PASS |
| 003-left-join-filter | 17.920s | 7.8 | 6.5–8.5 | PASS |
| 004-demonstrable-not-in-null | 19.152s | 3.8 | 0.0–4.9 | PASS |
| 005-invalid-aggregation | 13.920s | 4.0 | 0.0–4.9 | PASS |

Average duration: **17.729s**

Automated checks: **5 passed, 0 failed**.

## Qualitative Assessment

### 001-clean-query — Accepted with caveats

Strengths:

- recognized valid aggregation
- acknowledged explicit column selection
- acknowledged clear aliases
- acknowledged the typed DATE literal
- assigned a suitably high score
- did not claim that an index is missing
- did not claim that the query is slow
- kept index-related language conditional

Caveats:

- introduced a speculative `SUM(NULL)` concern without evidence that zero is expected
- introduced a low-confidence ORDER BY sort concern
- suggested removing ORDER BY based on unknown caller requirements

### 002-oracle-antipatterns — Accepted with a qualitative failure

Strengths:

- identified the conditional NULL risk of NOT IN
- used medium confidence for the conditional risk
- recognized the NVL predicate simplification
- recommended a typed DATE comparison without adding an upper boundary
- recognized SELECT * as a maintainability concern
- recognized comma-style joins as a maintainability concern
- recognized COUNT(*) > 0 as a less direct existence expression
- kept index-related observations conditional
- avoided claiming that item_supp_country.item is nullable
- avoided claiming that IN is inherently slower than EXISTS
- avoided an incorrect time-of-day semantic change

Qualitative failure:

- stated that correlated COUNT(*) “runs per qualifying row” and that EXISTS may short-circuit and be cheaper
- this claim is too execution-specific without an execution plan because the optimizer may transform either expression
- the clarity recommendation is valid, but the runtime conclusion is not sufficiently supported

### 003-left-join-filter — Accepted

Strengths:

- observed that the WHERE predicate rejects NULL-extended rows
- explained that the LEFT JOIN therefore behaves like an INNER JOIN
- kept correctness dependent on intended behavior
- offered valid alternatives for both possible intentions
- did not assume that customers without orders must be returned
- did not invent an index recommendation
- used an empty performance observation array

Caveat:

- the readability observation calls the LEFT JOIN redundant, but correctly limits that conclusion to the query’s current behavior

### 004-demonstrable-not-in-null — Accepted

Strengths:

- identified the explicit NULL inside the NOT IN set
- classified the defect as high severity and high confidence
- definitively explained that the predicate cannot evaluate to TRUE
- stated that the query returns no rows
- assigned a suitably low score
- recommended NULL-safe alternatives
- used an empty performance observation array

Caveats:

- added a secondary conditional nullability observation after already proving the concrete defect
- suggested adding a comment even though fixing the SQL is the meaningful action

### 005-invalid-aggregation — Accepted with caveats

Strengths:

- identified employee_name as neither grouped nor aggregated
- classified the defect as high severity and high confidence
- explained that the SQL violates standard aggregation rules
- assigned a suitably low score
- did not focus on speculative performance issues
- used an empty performance observation array
- kept primary corrections conditional on intended result grain

Caveats:

- mentioned permissive database modes even though the case is intended as Oracle-oriented
- suggested MIN, MAX, or ANY_VALUE as a possible representative value despite no evidence that an arbitrary name is meaningful
- dialect is still not supplied to the review engine

## Comparison with gpt-5-low-v1

Improvements:

- average response time remains below 20 seconds
- COUNT(*) > 0 readability concern is no longer omitted
- demonstrable correctness cases use empty performance observation arrays
- invalid aggregation receives a clear high-confidence classification
- all automated score checks pass
- LEFT JOIN intent remains conditional

Regressions or unresolved issues:

- clean SQL still attracts speculative NULL and ordering observations
- COUNT(*) versus EXISTS received an unsupported execution-level claim
- optional suggestions may still be generated without sufficient evidence
- dialect remains inferred instead of explicitly provided

## Decision

This baseline is **accepted with caveats** as the current regression reference.

It is suitable for the MVP because:

1. All five automated checks pass.
2. Directly observable correctness defects are identified reliably.
3. Unknown author intent is generally treated conditionally.
4. Empty performance observation arrays are used when appropriate.
5. Average response time remains below the 20-second MVP target.

It is not a perfect qualitative pass because case 002 violates one forbidden-claim expectation with an execution-specific COUNT-versus-EXISTS statement.

## Next Prompt Improvement

The next prompt revision should explicitly require:

- recommend EXISTS over COUNT(*) > 0 primarily for clarity of intent
- do not claim per-row execution, mandatory full counting, short-circuiting, or lower runtime without an execution plan
- do not suggest removing ORDER BY unless ordering is demonstrably unnecessary
- avoid conditional NULL advice on clean SQL unless it is materially relevant
- avoid representative-value aggregates without evidence that an arbitrary value is meaningful

## Known Limitations

- Individual requests may exceed 20 seconds.
- Automated gates validate HTTP success and score ranges only.
- Required findings and forbidden claims still require manual review.
- Clean queries may receive low-value conditional observations.
- SQL dialect is inferred because the MVP has no dialect selector.
- Runtime behavior cannot be established without schema, statistics, and execution plans.
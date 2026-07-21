# Evaluation Baseline — gpt-5-low-v1

## Configuration

- Model: `gpt-5`
- Reasoning effort: `low`
- Structured output: compact, exactly three categories
- Cases: 5
- Date: 2026-07-21

## Performance

| Case | Duration | Score | Accepted range |
|---|---:|---:|---:|
| 001-clean-query | 20.463s | 9.1 | 8.0–10.0 |
| 002-oracle-antipatterns | 23.333s | 7.8 | 6.5–8.0 |
| 003-left-join-filter | 14.308s | 7.9 | 6.5–8.5 |
| 004-demonstrable-not-in-null | 17.199s | 3.8 | 0.0–4.9 |
| 005-invalid-aggregation | 13.572s | 3.8 | 0.0–4.9 |

Average duration: **17.775s**

## Qualitative Assessment

### 001-clean-query — Accepted with caveats

Strengths:

- recognized valid aggregation
- acknowledged explicit columns, aliases and typed date
- assigned a high score
- did not invent a missing index

Caveats:

- added speculative NULL-grouping concern
- added conditional ORDER BY sort concern
- suggested removing ORDER BY based on unknown consumer requirements

### 002-oracle-antipatterns — Accepted

Strengths:

- correctly classified conditional NOT IN NULL risk
- recognized NVL simplification
- recognized TO_CHAR and UPPER function-on-column risks
- recognized SELECT * and comma joins
- avoided incorrect time-boundary claims
- avoided generic IN-versus-EXISTS claims

Caveat:

- omitted the COUNT(*) > 0 clarity observation due to response limits

### 003-left-join-filter — Accepted

Strengths:

- directly explained null-rejecting WHERE behavior
- kept author intent conditional
- provided both valid interpretations
- used an empty performance observation array
- avoided invented keys, grouping changes and representative values

### 004-demonstrable-not-in-null — Accepted

Strengths:

- identified explicit NULL as a high-confidence correctness issue
- stated definitively that the predicate cannot be TRUE
- assigned a low score
- proposed NULL-safe alternatives

Caveat:

- included a minor speculative performance observation

### 005-invalid-aggregation — Accepted

Strengths:

- identified the ungrouped employee_name
- classified it as high severity and high confidence
- assigned a low score
- kept corrections conditional on intended result grain
- used an empty performance observation array

Caveat:

- included an optional representative-value suggestion that should be used cautiously

## Decision

`gpt-5` is selected for the Query Doctor MVP.

Reasons:

1. Higher review accuracy than `gpt-5-mini`.
2. Better separation between observable behavior and unknown intent.
3. Fewer speculative performance recommendations.
4. Correct use of empty observation arrays.
5. Average response time remains below the MVP target of 20 seconds.

## Known Limitations

- Individual requests may exceed 20 seconds.
- Clean queries may still receive minor speculative observations.
- Response limits can cause lower-priority findings to be omitted.
- Dialect is inferred because the MVP has no dialect selector.
- Evaluation still requires manual qualitative review.
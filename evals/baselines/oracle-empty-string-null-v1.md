# Oracle Evaluation Baseline — Empty String and NULL v1

## Configuration

- Model: `gpt-5`
- Reasoning effort: `low`
- Dialect: Oracle
- Case: `010-oracle-empty-string-null`
- Date: 2026-07-22
- Sprint: Oracle Deep Review

## Purpose

Evaluate whether Query Doctor recognizes Oracle SQL semantics for zero-length character strings.

The SQL comment explicitly requests customers without an email address.

In Oracle SQL, a zero-length character string is treated as NULL. The predicate `c.email = ''` therefore does not evaluate to TRUE for NULL email values and does not return the customers requested by the comment.

The direct correction is `c.email IS NULL`.

## Targeted Runs

| Run | Duration | Score | Primary finding | Qualitative result |
|---|---:|---:|---|---|
| oracle-empty-string-v1 | 14.731s | 3.8 | Correct | Partial |
| oracle-empty-string-v2 | 10.274s | 3.8 | Correct | Accepted |

Average targeted duration: **12.503s**

## Initial Qualitative Issue

The first run correctly identified the Oracle empty-string behavior but added an unsupported whitespace-handling suggestion:

```sql
TRIM(c.email) IS NULL
OR TRIM(c.email) = ''
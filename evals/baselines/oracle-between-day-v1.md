# Evaluation Baseline — Oracle BETWEEN Day Boundary v1

## Configuration

- Model: `gpt-5`
- Reasoning effort: `low`
- Dialect: Oracle
- Case: `013-oracle-between-day`
- Date: 2026-07-22
- Run label: `oracle-between-day-v1`

## Purpose

Evaluate whether Query Doctor recognizes that SQL `BETWEEN` includes both boundaries when used for an Oracle temporal interval.

The supplied comment requests only orders created during January 1, 2026.

The tested predicate is:

```sql
o.created_at BETWEEN DATE '2026-01-01'
                 AND DATE '2026-01-02'
-- Return only orders created during January 1, 2026.
SELECT
  o.order_id,
  o.customer_id,
  o.created_at
FROM orders o
WHERE o.created_at BETWEEN DATE '2026-01-01'
                       AND DATE '2026-01-02';

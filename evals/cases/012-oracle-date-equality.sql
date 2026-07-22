-- Return all orders created on January 1, 2026.
SELECT
  o.order_id,
  o.customer_id,
  o.created_at
FROM orders o
WHERE o.created_at = DATE '2026-01-01';

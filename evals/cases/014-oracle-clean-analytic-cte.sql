-- Return the most recent order for each customer.
-- created_at is NOT NULL and order_id uniquely identifies each order.
WITH ranked_orders AS (
  SELECT
    o.order_id,
    o.customer_id,
    o.created_at,
    ROW_NUMBER() OVER (
      PARTITION BY o.customer_id
      ORDER BY
        o.created_at DESC,
        o.order_id DESC
    ) AS row_number
  FROM orders o
)
SELECT
  order_id,
  customer_id,
  created_at
FROM ranked_orders
WHERE row_number = 1;

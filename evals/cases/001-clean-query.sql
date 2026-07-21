SELECT
    o.customer_id,
    COUNT(*) AS order_count,
    SUM(o.total_amount) AS total_amount
FROM orders o
WHERE o.created_at >= DATE '2026-01-01'
GROUP BY o.customer_id
ORDER BY o.customer_id;
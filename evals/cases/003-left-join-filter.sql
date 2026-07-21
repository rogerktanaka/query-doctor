SELECT
    c.customer_id,
    c.customer_name,
    COUNT(o.order_id) AS open_order_count
FROM customers c
LEFT JOIN orders o
    ON o.customer_id = c.customer_id
WHERE o.status = 'OPEN'
GROUP BY
    c.customer_id,
    c.customer_name;
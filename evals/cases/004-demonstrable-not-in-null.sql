SELECT
    p.product_id,
    p.product_name
FROM products p
WHERE p.product_id NOT IN (
    SELECT d.product_id
    FROM discontinued_products d

    UNION ALL

    SELECT NULL
    FROM dual
);
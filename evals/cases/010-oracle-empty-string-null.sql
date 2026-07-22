-- Return customers without an email address.
SELECT
    c.customer_id,
    c.customer_name
FROM customers c
WHERE c.email = '';
-- Return the 10 employees with the highest salaries.
SELECT
    e.employee_id,
    e.employee_name,
    e.salary
FROM employees e
WHERE ROWNUM <= 10
ORDER BY e.salary DESC;
SELECT
    e.department_id,
    e.employee_name,
    SUM(e.salary) AS total_salary
FROM employees e
GROUP BY e.department_id;
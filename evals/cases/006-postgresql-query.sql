SELECT
  u.user_id,
  u.email,
  u.created_at::date AS created_date
FROM app_user AS u
WHERE u.email ILIKE 'ana%'
ORDER BY u.created_at DESC
LIMIT 25;
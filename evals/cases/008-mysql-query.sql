SELECT
  u.user_id,
  u.email,
  DATE(u.created_at) AS created_date
FROM `app_user` AS u
WHERE u.email LIKE 'ana%'
ORDER BY u.created_at DESC
LIMIT 25;
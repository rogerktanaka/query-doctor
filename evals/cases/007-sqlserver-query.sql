SELECT TOP (25)
  u.user_id,
  u.email,
  CAST(u.created_at AS date) AS created_date
FROM dbo.app_user AS u
WHERE u.email LIKE N'ana%'
ORDER BY u.created_at DESC;
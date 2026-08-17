insert into public.admin_users (user_id, email, role)
values (
  '537b84df-3a5a-43b4-9e8b-a0715902eb24',
  'ssemawereronald@gmail.com',
  'owner'
)
on conflict (role) do update
set
  user_id = excluded.user_id,
  email = excluded.email,
  updated_at = now();

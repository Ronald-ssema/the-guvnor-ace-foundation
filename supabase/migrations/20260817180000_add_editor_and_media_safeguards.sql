drop index if exists public.admin_users_one_owner_idx;

alter table public.admin_users
  drop constraint if exists admin_users_role_check;

alter table public.admin_users
  add constraint admin_users_role_check
  check (role in ('owner', 'editor'));

create unique index admin_users_one_owner_idx
on public.admin_users(role)
where role = 'owner';

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = (select auth.uid())
      and role in ('owner', 'editor')
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

drop policy if exists "Owners can update own admin record" on public.admin_users;

-- Role assignment remains an accountable setup operation in the Supabase SQL
-- editor. Website sessions can read the allowlist but cannot promote themselves.
revoke update on public.admin_users from authenticated;

alter table public.media_assets
  add column if not exists consent_confirmed boolean not null default false,
  add column if not exists safeguarding_reviewed_at timestamptz;

comment on column public.media_assets.consent_confirmed is
  'Confirms that appropriate individual or parental permission is held for publication.';

comment on column public.media_assets.safeguarding_reviewed_at is
  'Time the image was reviewed for publication and safeguarding suitability.';

-- Premium production hardening: private media delivery and persistent abuse controls.

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    coalesce((auth.jwt() ->> 'aal') = 'aal2', false)
    and exists (
      select 1
      from public.admin_users
      where user_id = (select auth.uid())
        and role in ('owner', 'editor')
    );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

update storage.buckets
set
  public = false,
  file_size_limit = 5242880,
  allowed_mime_types = array['image/webp']::text[]
where id = 'site-media';

drop policy if exists "Public can view site media" on storage.objects;
drop policy if exists "Public can view published site media" on storage.objects;

create policy "Public can view published site media"
on storage.objects for select
to anon, authenticated
using (
  bucket_id = 'site-media'
  and exists (
    select 1
    from public.media_assets
    where media_assets.storage_path = storage.objects.name
      and media_assets.is_published = true
      and media_assets.consent_confirmed = true
      and media_assets.safeguarding_reviewed_at is not null
  )
);

create table if not exists public.security_rate_limits (
  key_hash text primary key check (char_length(key_hash) between 32 and 128),
  attempts integer not null default 0 check (attempts >= 0),
  window_started_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.security_rate_limits enable row level security;
revoke all on public.security_rate_limits from public, anon, authenticated;

create or replace function public.consume_rate_limit(
  p_key_hash text,
  p_limit integer,
  p_window_seconds integer
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  current_row public.security_rate_limits%rowtype;
  window_interval interval;
begin
  if char_length(p_key_hash) < 32 or char_length(p_key_hash) > 128 then
    return false;
  end if;

  if p_limit < 1 or p_limit > 1000 or p_window_seconds < 1 or p_window_seconds > 86400 then
    return false;
  end if;

  window_interval := make_interval(secs => p_window_seconds);
  perform pg_advisory_xact_lock(hashtext(p_key_hash));

  select * into current_row
  from public.security_rate_limits
  where key_hash = p_key_hash;

  if not found or current_row.window_started_at + window_interval <= now() then
    insert into public.security_rate_limits (key_hash, attempts, window_started_at, updated_at)
    values (p_key_hash, 1, now(), now())
    on conflict (key_hash) do update
    set attempts = 1, window_started_at = now(), updated_at = now();
    return true;
  end if;

  if current_row.attempts >= p_limit then
    update public.security_rate_limits set updated_at = now() where key_hash = p_key_hash;
    return false;
  end if;

  update public.security_rate_limits
  set attempts = attempts + 1, updated_at = now()
  where key_hash = p_key_hash;

  return true;
end;
$$;

revoke all on function public.consume_rate_limit(text, integer, integer) from public;
grant execute on function public.consume_rate_limit(text, integer, integer) to anon, authenticated;

comment on function public.consume_rate_limit(text, integer, integer) is
  'Atomically enforces hashed, fixed-window request limits without storing raw identifiers.';

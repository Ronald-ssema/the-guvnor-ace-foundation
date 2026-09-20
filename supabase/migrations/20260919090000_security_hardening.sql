create table if not exists public.request_rate_limits (
  key text primary key check (length(key) = 64),
  request_count integer not null check (request_count > 0),
  window_started_at timestamptz not null,
  updated_at timestamptz not null default now()
);

create index if not exists request_rate_limits_updated_at_idx
on public.request_rate_limits(updated_at);

alter table public.request_rate_limits enable row level security;
revoke all on public.request_rate_limits from public, anon, authenticated;
grant select, insert, update, delete on public.request_rate_limits to service_role;

drop function if exists public.consume_rate_limit(text, integer, integer);

create function public.consume_rate_limit(
  p_key text,
  p_limit integer,
  p_window_seconds integer
)
returns table (
  allowed boolean,
  remaining integer,
  reset_at timestamptz
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  request_time timestamptz := clock_timestamp();
  current_count integer;
  current_window timestamptz;
begin
  if length(p_key) <> 64
    or p_limit < 1
    or p_limit > 1000
    or p_window_seconds < 1
    or p_window_seconds > 86400 then
    raise exception 'Invalid rate limit parameters';
  end if;

  if random() < 0.01 then
    delete from public.request_rate_limits
    where updated_at < request_time - interval '2 days';
  end if;

  insert into public.request_rate_limits as limits (
    key,
    request_count,
    window_started_at,
    updated_at
  )
  values (p_key, 1, request_time, request_time)
  on conflict (key) do update
  set
    request_count = case
      when limits.window_started_at <= request_time - make_interval(secs => p_window_seconds)
        then 1
      else limits.request_count + 1
    end,
    window_started_at = case
      when limits.window_started_at <= request_time - make_interval(secs => p_window_seconds)
        then request_time
      else limits.window_started_at
    end,
    updated_at = request_time
  returning request_count, window_started_at
  into current_count, current_window;

  return query
  select
    current_count <= p_limit,
    greatest(p_limit - current_count, 0),
    current_window + make_interval(secs => p_window_seconds);
end;
$$;

revoke all on function public.consume_rate_limit(text, integer, integer)
from public, anon, authenticated;
grant execute on function public.consume_rate_limit(text, integer, integer)
to service_role;

create or replace function public.stamp_content_actor()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if auth.uid() is not null then
    if tg_op = 'INSERT' then
      new.created_by := auth.uid();
    else
      new.created_by := old.created_by;
    end if;

    new.updated_by := auth.uid();
  end if;

  return new;
end;
$$;

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'site_content',
    'impact_stats',
    'media_assets',
    'stories',
    'projects',
    'reports',
    'volunteer_opportunities',
    'site_links'
  ]
  loop
    execute format(
      'drop trigger if exists stamp_content_actor on public.%I',
      table_name
    );
    execute format(
      'create trigger stamp_content_actor before insert or update on public.%I for each row execute function public.stamp_content_actor()',
      table_name
    );
  end loop;
end;
$$;

create or replace function public.stamp_updated_actor()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if auth.uid() is not null then
    new.updated_by := auth.uid();
  end if;

  return new;
end;
$$;

drop trigger if exists stamp_updated_actor on public.site_settings;
create trigger stamp_updated_actor
before insert or update on public.site_settings
for each row execute function public.stamp_updated_actor();

drop trigger if exists stamp_updated_actor on public.seo_metadata;
create trigger stamp_updated_actor
before insert or update on public.seo_metadata
for each row execute function public.stamp_updated_actor();

create or replace function public.stamp_audit_actor()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.actor_id := auth.uid();
  return new;
end;
$$;

drop trigger if exists stamp_audit_actor on public.admin_audit_log;
create trigger stamp_audit_actor
before insert on public.admin_audit_log
for each row execute function public.stamp_audit_actor();

drop policy if exists "Owners can create audit log entries"
on public.admin_audit_log;
create policy "Owners can create own audit log entries"
on public.admin_audit_log for insert
to authenticated
with check (
  (select public.is_admin())
  and actor_id = (select auth.uid())
);

update storage.buckets
set public = false
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

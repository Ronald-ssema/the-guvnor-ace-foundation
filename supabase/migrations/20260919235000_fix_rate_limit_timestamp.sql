create or replace function public.consume_rate_limit(
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

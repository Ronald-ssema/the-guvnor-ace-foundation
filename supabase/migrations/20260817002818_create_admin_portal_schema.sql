create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  role text not null default 'owner' check (role = 'owner'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index admin_users_one_owner_idx
on public.admin_users(role);

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
      and role = 'owner'
  );
$$;

create table public.site_content (
  id uuid primary key default gen_random_uuid(),
  page_slug text not null,
  section_key text not null,
  title text,
  body text,
  content jsonb not null default '{}'::jsonb,
  is_published boolean not null default true,
  sort_order integer not null default 0,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (page_slug, section_key)
);

create table public.impact_stats (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  value text not null,
  description text,
  icon_name text,
  is_published boolean not null default true,
  sort_order integer not null default 0,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.media_assets (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null unique,
  original_name text not null,
  mime_type text not null,
  file_size bigint not null check (file_size > 0),
  media_kind text not null check (media_kind in ('image', 'video', 'document')),
  alt_text text not null default '',
  caption text,
  metadata jsonb not null default '{}'::jsonb,
  is_published boolean not null default false,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.stories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text,
  body text not null default '',
  cover_media_id uuid references public.media_assets(id) on delete set null,
  is_featured boolean not null default false,
  is_published boolean not null default false,
  published_at timestamptz,
  sort_order integer not null default 0,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  summary text,
  description text not null default '',
  status text not null default 'planned'
    check (status in ('planned', 'active', 'completed')),
  cover_media_id uuid references public.media_assets(id) on delete set null,
  is_featured boolean not null default false,
  is_published boolean not null default false,
  sort_order integer not null default 0,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  report_date date,
  media_id uuid references public.media_assets(id) on delete set null,
  is_published boolean not null default false,
  published_at timestamptz,
  sort_order integer not null default 0,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.volunteer_opportunities (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  summary text,
  description text not null default '',
  location text,
  commitment text,
  application_email text,
  application_url text,
  is_published boolean not null default false,
  sort_order integer not null default 0,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.site_settings (
  id uuid primary key default gen_random_uuid(),
  setting_key text not null unique,
  label text not null,
  value jsonb not null default '{}'::jsonb,
  is_public boolean not null default true,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.site_links (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  url text not null,
  link_type text not null default 'other'
    check (link_type in ('social', 'donation', 'contact', 'other')),
  is_visible boolean not null default true,
  sort_order integer not null default 0,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.seo_metadata (
  page_slug text primary key,
  title text not null,
  description text,
  canonical_url text,
  no_index boolean not null default false,
  is_published boolean not null default true,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.admin_audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users(id) on delete set null,
  action text not null
    check (action in ('create', 'update', 'delete', 'publish', 'unpublish', 'login', 'logout')),
  entity_type text not null,
  entity_id uuid,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index site_content_page_order_idx
on public.site_content(page_slug, sort_order);

create index impact_stats_order_idx
on public.impact_stats(sort_order);

create index stories_published_order_idx
on public.stories(is_published, sort_order);

create index projects_published_order_idx
on public.projects(is_published, sort_order);

create index reports_published_order_idx
on public.reports(is_published, sort_order);

create index volunteer_published_order_idx
on public.volunteer_opportunities(is_published, sort_order);

grant usage on schema public to anon, authenticated;

grant select on
  public.site_content,
  public.impact_stats,
  public.media_assets,
  public.stories,
  public.projects,
  public.reports,
  public.volunteer_opportunities,
  public.site_settings,
  public.site_links,
  public.seo_metadata
to anon;

grant select, insert, update, delete on
  public.site_content,
  public.impact_stats,
  public.media_assets,
  public.stories,
  public.projects,
  public.reports,
  public.volunteer_opportunities,
  public.site_settings,
  public.site_links,
  public.seo_metadata
to authenticated;

grant select, update on public.admin_users to authenticated;
grant select, insert on public.admin_audit_log to authenticated;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

alter table public.admin_users enable row level security;
alter table public.site_content enable row level security;
alter table public.impact_stats enable row level security;
alter table public.media_assets enable row level security;
alter table public.stories enable row level security;
alter table public.projects enable row level security;
alter table public.reports enable row level security;
alter table public.volunteer_opportunities enable row level security;
alter table public.site_settings enable row level security;
alter table public.site_links enable row level security;
alter table public.seo_metadata enable row level security;
alter table public.admin_audit_log enable row level security;

create policy "Owners can read admin records"
on public.admin_users for select
to authenticated
using ((select public.is_admin()));

create policy "Owners can update own admin record"
on public.admin_users for update
to authenticated
using ((select public.is_admin()) and user_id = (select auth.uid()))
with check (user_id = (select auth.uid()) and role = 'owner');

create policy "Public can read published site content"
on public.site_content for select
to anon, authenticated
using (is_published = true);

create policy "Owners can read all site content"
on public.site_content for select
to authenticated
using ((select public.is_admin()));

create policy "Owners can create site content"
on public.site_content for insert
to authenticated
with check ((select public.is_admin()));

create policy "Owners can update site content"
on public.site_content for update
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

create policy "Owners can delete site content"
on public.site_content for delete
to authenticated
using ((select public.is_admin()));

create policy "Public can read published impact stats"
on public.impact_stats for select
to anon, authenticated
using (is_published = true);

create policy "Owners can read all impact stats"
on public.impact_stats for select
to authenticated
using ((select public.is_admin()));

create policy "Owners can create impact stats"
on public.impact_stats for insert
to authenticated
with check ((select public.is_admin()));

create policy "Owners can update impact stats"
on public.impact_stats for update
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

create policy "Owners can delete impact stats"
on public.impact_stats for delete
to authenticated
using ((select public.is_admin()));

create policy "Public can read published media"
on public.media_assets for select
to anon, authenticated
using (is_published = true);

create policy "Owners can read all media"
on public.media_assets for select
to authenticated
using ((select public.is_admin()));

create policy "Owners can create media"
on public.media_assets for insert
to authenticated
with check ((select public.is_admin()));

create policy "Owners can update media"
on public.media_assets for update
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

create policy "Owners can delete media"
on public.media_assets for delete
to authenticated
using ((select public.is_admin()));

create policy "Public can read published stories"
on public.stories for select
to anon, authenticated
using (is_published = true);

create policy "Owners can read all stories"
on public.stories for select
to authenticated
using ((select public.is_admin()));

create policy "Owners can create stories"
on public.stories for insert
to authenticated
with check ((select public.is_admin()));

create policy "Owners can update stories"
on public.stories for update
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

create policy "Owners can delete stories"
on public.stories for delete
to authenticated
using ((select public.is_admin()));

create policy "Public can read published projects"
on public.projects for select
to anon, authenticated
using (is_published = true);

create policy "Owners can read all projects"
on public.projects for select
to authenticated
using ((select public.is_admin()));

create policy "Owners can create projects"
on public.projects for insert
to authenticated
with check ((select public.is_admin()));

create policy "Owners can update projects"
on public.projects for update
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

create policy "Owners can delete projects"
on public.projects for delete
to authenticated
using ((select public.is_admin()));

create policy "Public can read published reports"
on public.reports for select
to anon, authenticated
using (is_published = true);

create policy "Owners can read all reports"
on public.reports for select
to authenticated
using ((select public.is_admin()));

create policy "Owners can create reports"
on public.reports for insert
to authenticated
with check ((select public.is_admin()));

create policy "Owners can update reports"
on public.reports for update
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

create policy "Owners can delete reports"
on public.reports for delete
to authenticated
using ((select public.is_admin()));

create policy "Public can read published volunteer opportunities"
on public.volunteer_opportunities for select
to anon, authenticated
using (is_published = true);

create policy "Owners can read all volunteer opportunities"
on public.volunteer_opportunities for select
to authenticated
using ((select public.is_admin()));

create policy "Owners can create volunteer opportunities"
on public.volunteer_opportunities for insert
to authenticated
with check ((select public.is_admin()));

create policy "Owners can update volunteer opportunities"
on public.volunteer_opportunities for update
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

create policy "Owners can delete volunteer opportunities"
on public.volunteer_opportunities for delete
to authenticated
using ((select public.is_admin()));

create policy "Public can read public settings"
on public.site_settings for select
to anon, authenticated
using (is_public = true);

create policy "Owners can read all settings"
on public.site_settings for select
to authenticated
using ((select public.is_admin()));

create policy "Owners can create settings"
on public.site_settings for insert
to authenticated
with check ((select public.is_admin()));

create policy "Owners can update settings"
on public.site_settings for update
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

create policy "Owners can delete settings"
on public.site_settings for delete
to authenticated
using ((select public.is_admin()));

create policy "Public can read visible links"
on public.site_links for select
to anon, authenticated
using (is_visible = true);

create policy "Owners can read all links"
on public.site_links for select
to authenticated
using ((select public.is_admin()));

create policy "Owners can create links"
on public.site_links for insert
to authenticated
with check ((select public.is_admin()));

create policy "Owners can update links"
on public.site_links for update
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

create policy "Owners can delete links"
on public.site_links for delete
to authenticated
using ((select public.is_admin()));

create policy "Public can read published SEO metadata"
on public.seo_metadata for select
to anon, authenticated
using (is_published = true and no_index = false);

create policy "Owners can read all SEO metadata"
on public.seo_metadata for select
to authenticated
using ((select public.is_admin()));

create policy "Owners can create SEO metadata"
on public.seo_metadata for insert
to authenticated
with check ((select public.is_admin()));

create policy "Owners can update SEO metadata"
on public.seo_metadata for update
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

create policy "Owners can delete SEO metadata"
on public.seo_metadata for delete
to authenticated
using ((select public.is_admin()));

create policy "Owners can read audit log"
on public.admin_audit_log for select
to authenticated
using ((select public.is_admin()));

create policy "Owners can create audit log entries"
on public.admin_audit_log for insert
to authenticated
with check ((select public.is_admin()));

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'admin_users',
    'site_content',
    'impact_stats',
    'media_assets',
    'stories',
    'projects',
    'reports',
    'volunteer_opportunities',
    'site_settings',
    'site_links',
    'seo_metadata'
  ]
  loop
    execute format(
      'create trigger %I before update on public.%I for each row execute function public.set_updated_at()',
      'set_' || table_name || '_updated_at',
      table_name
    );
  end loop;
end;
$$;

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'site-media',
  'site-media',
  true,
  52428800,
  array[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'video/mp4',
    'video/webm',
    'video/quicktime',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]::text[]
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "Public can view site media"
on storage.objects for select
to public
using (bucket_id = 'site-media');

create policy "Owners can upload site media"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'site-media'
  and (select public.is_admin())
);

create policy "Owners can update site media"
on storage.objects for update
to authenticated
using (
  bucket_id = 'site-media'
  and (select public.is_admin())
)
with check (
  bucket_id = 'site-media'
  and (select public.is_admin())
);

create policy "Owners can delete site media"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'site-media'
  and (select public.is_admin())
);

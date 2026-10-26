-- Review: 2026-10-27. Not applied as part of the review.
-- Requires the base migration with public.profiles (id, role).
-- The existing public.profiles RLS allows users to read their own role,
-- and the authenticated/anon roles must NOT have UPDATE on profiles.role.
-- Database writes use the authenticated user's JWT, never a service key.
--
-- This table stores exactly ONE whole-document roadmap. Each write is protected
-- by RLS and optimistic concurrency in /api/admin/roadmap (version match).
-- A single, controlled CREATE intentionally fails if the table already exists,
-- rather than hiding a schema mismatch behind IF NOT EXISTS.

create table public.admin_roadmap (
  id text primary key,
  items jsonb not null default '[]'::jsonb,
  version integer not null default 1,
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now(),

  constraint admin_roadmap_single_document
    check (id = 'global-master-roadmap'),
  constraint admin_roadmap_positive_version
    check (version > 0),
  constraint admin_roadmap_items_array
    check (jsonb_typeof(items) = 'array'),
  constraint admin_roadmap_payload_limit
    check (pg_column_size(items) < 600000)
);

-- The table lives in the exposed "public" schema: enable RLS before exposing it.
alter table public.admin_roadmap enable row level security;

-- Supabase projects can automatically grant broad access to new public tables.
-- Explicitly narrow access before the table becomes usable over the Data API.
revoke all privileges on table public.admin_roadmap from public, anon, authenticated;
grant select, insert, update on table public.admin_roadmap to authenticated;
-- Deliberately no DELETE/TRUNCATE grant or DELETE policy for anon/authenticated.
-- No service-role secret is needed by the application's roadmap API.

create policy "Only admins read product roadmap"
  on public.admin_roadmap
  for select to authenticated
  using (
    id = 'global-master-roadmap'
    and exists (
      select 1 from public.profiles p
      where p.id = (select auth.uid()) and p.role = 'admin'
    )
  );

create policy "Only admins create product roadmap"
  on public.admin_roadmap
  for insert to authenticated
  with check (
    id = 'global-master-roadmap'
    and updated_by = (select auth.uid())
    and exists (
      select 1 from public.profiles p
      where p.id = (select auth.uid()) and p.role = 'admin'
    )
  );

create policy "Only admins update product roadmap"
  on public.admin_roadmap
  for update to authenticated
  using (
    id = 'global-master-roadmap'
    and exists (
      select 1 from public.profiles p
      where p.id = (select auth.uid()) and p.role = 'admin'
    )
  )
  with check (
    id = 'global-master-roadmap'
    and updated_by = (select auth.uid())
    and exists (
      select 1 from public.profiles p
      where p.id = (select auth.uid()) and p.role = 'admin'
    )
  );

comment on table public.admin_roadmap is
  'One versioned master Roadmap document. RLS permits only authorized Admin users.';
comment on column public.admin_roadmap.updated_by is
  'Must match the authenticated writer on INSERT/UPDATE; null only after user deletion.';

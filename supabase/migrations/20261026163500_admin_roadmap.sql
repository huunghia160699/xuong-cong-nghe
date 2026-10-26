-- Admin product roadmap. Run after base profiles migration.
-- The browser never uses privileged keys; authorization is evaluated in RLS.
create table if not exists public.admin_roadmap (
 id text primary key,
 items jsonb not null default '[]'::jsonb,
 version integer not null default 1 check (version > 0),
 updated_by uuid references auth.users(id) on delete set null,
 updated_at timestamptz not null default now(),
 constraint admin_roadmap_items_array check (jsonb_typeof(items)='array'),
 constraint admin_roadmap_payload_limit check (pg_column_size(items)<600000)
);
alter table public.admin_roadmap enable row level security;
revoke all on table public.admin_roadmap from public,anon,authenticated;
grant select,insert,update on public.admin_roadmap to authenticated;
-- auth.uid() and profiles.role are server-backed, not editable user_metadata.
create policy "Only admins read product roadmap"
 on public.admin_roadmap for select to authenticated
 using (exists (select 1 from public.profiles p
  where p.id=(select auth.uid()) and p.role='admin'));
create policy "Only admins create product roadmap"
 on public.admin_roadmap for insert to authenticated
 with check (exists (select 1 from public.profiles p
  where p.id=(select auth.uid()) and p.role='admin'));
create policy "Only admins update product roadmap"
 on public.admin_roadmap for update to authenticated
 using (exists (select 1 from public.profiles p
  where p.id=(select auth.uid()) and p.role='admin'))
 with check (exists (select 1 from public.profiles p
  where p.id=(select auth.uid()) and p.role='admin'));
comment on table public.admin_roadmap is 'Versioned whole-document admin product roadmap with admin-only RLS';

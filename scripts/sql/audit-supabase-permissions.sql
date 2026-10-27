-- READ-ONLY Supabase security inventory. Run in SQL Editor for snapshots;
-- do not paste JWT secrets or bypass policies.
-- 1. RLS and effective grants for the exposed public schema.
select t.tablename,c.relrowsecurity as rls_enabled,
 has_table_privilege('anon',format('%I.%I',t.schemaname,t.tablename),'SELECT') as anon_select,
 has_table_privilege('anon',format('%I.%I',t.schemaname,t.tablename),'INSERT') as anon_insert,
 has_table_privilege('anon',format('%I.%I',t.schemaname,t.tablename),'UPDATE') as anon_update,
 has_table_privilege('authenticated',format('%I.%I',t.schemaname,t.tablename),'SELECT') as authenticated_select
from pg_tables t join pg_class c
 on c.oid=format('%I.%I',t.schemaname,t.tablename)::regclass
where t.schemaname='public' order by t.tablename;

-- 2. Security-definer routines that require a separate API/grant audit.
select n.nspname,p.proname,p.prosecdef,
 has_function_privilege('anon',p.oid,'EXECUTE') as anon_exec,
 has_function_privilege('authenticated',p.oid,'EXECUTE') as authenticated_exec,
 pg_get_functiondef(p.oid) like '%search_path%' as has_search_path
from pg_proc p join pg_namespace n on n.oid=p.pronamespace
where n.nspname in ('public','xcn_private') and p.prosecdef
order by n.nspname,p.proname;

-- 3. Roadmap remains RLS-guarded, single-document, append-only audited.
select (select count(*) from public.admin_roadmap) as roadmap_documents,
 (select max(version) from public.admin_roadmap) as last_version,
 (select count(*) from public.admin_roadmap_events) as committed_revisions;

-- 4. Inspect actual policies as SQL expressions; grants do not prove access.
select tablename,cmd,roles,policyname,qual,with_check
from pg_policies where schemaname='public'
order by tablename,cmd,policyname;

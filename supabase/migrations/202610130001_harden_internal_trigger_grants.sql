-- Defense-in-depth: trigger and event-trigger functions are invoked internally,
-- and must not be exposed as callable Data API functions to anon/authenticated.
revoke all on function public.create_new_student_profile() from public, anon, authenticated;
revoke all on function public.rls_auto_enable() from public, anon, authenticated;
-- public.is_admin() is referenced by public read RLS policies; changing its
-- EXECUTE grants requires coordinated RLS policy revisions.

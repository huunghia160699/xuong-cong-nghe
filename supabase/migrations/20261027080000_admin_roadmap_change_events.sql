-- Persistent, append-only audit trail for every committed Roadmap document revision.
-- The trigger derives changes from OLD/NEW rows, not client-provided descriptions.
-- Requires migration 20261026163500_admin_roadmap.
-- No Roadmap data is inserted/modified by this migration.

create table public.admin_roadmap_events (
  id bigint generated always as identity primary key,
  document_id text not null default 'global-master-roadmap',
  version integer not null check (version > 0),
  actor_id uuid references auth.users(id) on delete set null,
  occurred_at timestamptz not null default now(),
  changes jsonb not null check (jsonb_typeof(changes) = 'array'),
  constraint admin_roadmap_events_document check (document_id = 'global-master-roadmap'),
  constraint admin_roadmap_events_version_unique unique (document_id, version)
);
create index admin_roadmap_events_time_idx
  on public.admin_roadmap_events (occurred_at desc, id desc);

alter table public.admin_roadmap_events enable row level security;
revoke all privileges on table public.admin_roadmap_events from public, anon, authenticated;
grant select on table public.admin_roadmap_events to authenticated;

create policy "Only admins read committed Roadmap changes"
  on public.admin_roadmap_events for select to authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = (select auth.uid()) and p.role = 'admin'
    )
  );

-- A trigger function in a non-exposed schema is not an HTTP endpoint.
create schema if not exists xcn_private;
revoke all on schema xcn_private from public, anon, authenticated;

create function xcn_private.write_admin_roadmap_event()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  changes jsonb := '[]'::jsonb;
  new_item jsonb;
  old_item jsonb;
  old_task jsonb;
  new_task jsonb;
  old_note jsonb;
  new_note jsonb;
  epic_id text;
  epic_title text;
  task_id text;
  note_id text;
begin
  if tg_op = 'INSERT' then
    changes := jsonb_build_array(jsonb_build_object(
      'kind','roadmap.created',
      'title','Khởi tạo Roadmap tập trung',
      'count',jsonb_array_length(new.items)
    ));
  else
    if new.version <> old.version + 1 then
      raise exception 'Roadmap version must increase by exactly one';
    end if;
    if new.items = old.items then
      raise exception 'Cannot create a revision without a Roadmap data change';
    end if;

    for new_item in select value from jsonb_array_elements(new.items)
    loop
      epic_id := new_item ->> 'id';
      epic_title := new_item ->> 'title';
      select value into old_item
        from jsonb_array_elements(old.items) x(value)
        where x.value ->> 'id' = epic_id limit 1;
      if old_item is null then
        changes := changes || jsonb_build_array(jsonb_build_object(
          'kind','epic.added','epicId',epic_id,'title',epic_title));
      else
        if (new_item - 'checklist' - 'entries' - 'updatedAt')
          is distinct from (old_item - 'checklist' - 'entries' - 'updatedAt') then
          changes := changes || jsonb_build_array(jsonb_build_object(
            'kind','epic.updated','epicId',epic_id,'title',epic_title));
        end if;
        for new_task in select value from jsonb_array_elements(new_item -> 'checklist')
        loop
          task_id := new_task ->> 'id';
          select value into old_task
            from jsonb_array_elements(old_item -> 'checklist') x(value)
            where x.value ->> 'id' = task_id limit 1;
          if old_task is null then
            changes := changes || jsonb_build_array(jsonb_build_object(
              'kind','task.added','epicId',epic_id,'title',new_task ->> 'text'));
          elsif new_task ->> 'text' is distinct from old_task ->> 'text' then
            changes := changes || jsonb_build_array(jsonb_build_object(
              'kind','task.updated','epicId',epic_id,'title',new_task ->> 'text'));
          end if;
          if old_task is not null and (new_task ->> 'done') is distinct from (old_task ->> 'done') then
            changes := changes || jsonb_build_array(jsonb_build_object(
              'kind',case when new_task ->> 'done' = 'true' then 'task.completed' else 'task.reopened' end,
              'epicId',epic_id,'title',new_task ->> 'text'));
          end if;
        end loop;
        for old_task in select value from jsonb_array_elements(old_item -> 'checklist')
        loop
          if not exists (
            select 1 from jsonb_array_elements(new_item -> 'checklist') x(value)
            where x.value ->> 'id' = old_task ->> 'id'
          ) then
            changes := changes || jsonb_build_array(jsonb_build_object(
              'kind','task.deleted','epicId',epic_id,'title',old_task ->> 'text'));
          end if;
        end loop;
        for new_note in select value from jsonb_array_elements(new_item -> 'entries')
        loop
          note_id := new_note ->> 'id';
          select value into old_note
            from jsonb_array_elements(old_item -> 'entries') x(value)
            where x.value ->> 'id' = note_id limit 1;
          if old_note is null then
            changes := changes || jsonb_build_array(jsonb_build_object(
              'kind','note.added','epicId',epic_id,'title',new_note ->> 'text'));
          elsif new_note is distinct from old_note then
            changes := changes || jsonb_build_array(jsonb_build_object(
              'kind','note.updated','epicId',epic_id,'title',new_note ->> 'text'));
          end if;
        end loop;
        for old_note in select value from jsonb_array_elements(old_item -> 'entries')
        loop
          if not exists (
            select 1 from jsonb_array_elements(new_item -> 'entries') x(value)
            where x.value ->> 'id' = old_note ->> 'id'
          ) then
            changes := changes || jsonb_build_array(jsonb_build_object(
              'kind','note.deleted','epicId',epic_id,'title',old_note ->> 'text'));
          end if;
        end loop;
      end if;
    end loop;
    for old_item in select value from jsonb_array_elements(old.items)
    loop
      if not exists (select 1 from jsonb_array_elements(new.items) x(value)
        where x.value ->> 'id' = old_item ->> 'id') then
        changes := changes || jsonb_build_array(jsonb_build_object(
          'kind','epic.deleted','epicId',old_item ->> 'id','title',old_item ->> 'title'));
      end if;
    end loop;
    if jsonb_array_length(changes) = 0 then
      changes := jsonb_build_array(jsonb_build_object('kind','roadmap.reordered',
        'title','Thay đổi thứ tự các công việc'));
    end if;
  end if;

  insert into public.admin_roadmap_events(document_id,version,actor_id,changes)
  values (new.id,new.version,new.updated_by,changes);
  return new;
end;
$$;
revoke all on function xcn_private.write_admin_roadmap_event() from public, anon, authenticated;

create trigger admin_roadmap_change_audit
after insert or update of items,version on public.admin_roadmap
for each row execute function xcn_private.write_admin_roadmap_event();

comment on table public.admin_roadmap_events is
 'Append-only server-side activity: one immutable event row for each saved roadmap version.';

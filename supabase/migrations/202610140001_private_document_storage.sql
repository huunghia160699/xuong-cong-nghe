-- Private Supabase Storage bucket for Xưởng Công Nghệ.
-- Keep aligned with the applied Supabase API migration "private_document_storage_20261014".
insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('xcn-private-documents','xcn-private-documents',false,20971520,
array['application/pdf','image/png','image/jpeg','image/webp','application/msword',
'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
'application/vnd.ms-excel',
'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
'application/vnd.ms-powerpoint',
'application/vnd.openxmlformats-officedocument.presentationml.presentation',
'text/plain']::text[]) on conflict (id) do nothing;

create policy "xcn admin read files" on storage.objects for select to authenticated
using (bucket_id='xcn-private-documents' and (storage.foldername(name))[1]='admin' and public.is_admin());
create policy "xcn admin insert files" on storage.objects for insert to authenticated
with check (bucket_id='xcn-private-documents' and (storage.foldername(name))[1]='admin' and public.is_admin());
create policy "xcn admin delete files" on storage.objects for delete to authenticated
using (bucket_id='xcn-private-documents' and (storage.foldername(name))[1]='admin' and public.is_admin());

-- ============================================================================
-- NautSpace International Storage: private resume bucket for Careers & Academy submissions
-- ============================================================================

insert into storage.buckets (id, name, public)
values ('resumes', 'resumes', false)
on conflict (id) do nothing;

-- Applicants upload to a folder keyed by their own user id: `${user.id}/...`.
-- This mirrors the check applied in ApplicationForm.tsx's upload path.

create policy "resumes_owner_upload"
  on storage.objects for insert
  with check (
    bucket_id = 'resumes'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "resumes_owner_or_privileged_read"
  on storage.objects for select
  using (
    bucket_id = 'resumes'
    and (
      (storage.foldername(name))[1] = auth.uid()::text
      or public.is_privileged()
    )
  );

create policy "resumes_owner_delete"
  on storage.objects for delete
  using (
    bucket_id = 'resumes'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

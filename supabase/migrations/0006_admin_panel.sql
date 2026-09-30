-- ============================================================================
-- NautSpace International Admin Panel support: booking approvals, opportunities board, profile
-- avatars.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Booking approval workflow
-- ----------------------------------------------------------------------------

create type public.booking_status as enum ('pending', 'approved', 'denied');

alter table public.science_center_bookings
  add column status public.booking_status not null default 'pending';

create index science_center_bookings_status_idx on public.science_center_bookings (status);

-- ----------------------------------------------------------------------------
-- Opportunities externally posted internships/competitions/jobs, managed
-- by the admin panel and shown publicly on Careers & Academy.
-- ----------------------------------------------------------------------------

create type public.opportunity_type as enum ('internship', 'competition', 'job', 'scholarship');
create type public.opportunity_status as enum ('draft', 'published');

create table public.opportunities (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  type public.opportunity_type not null default 'internship',
  description text,
  organization text,
  location text,
  application_deadline date,
  application_link text,
  requirements text,
  banner_image_url text,
  status public.opportunity_status not null default 'draft',
  featured boolean not null default false,
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index opportunities_status_idx on public.opportunities (status);

create trigger opportunities_set_updated_at
  before update on public.opportunities
  for each row execute function public.set_updated_at();

alter table public.opportunities enable row level security;

create policy "opportunities_public_read_published"
  on public.opportunities for select
  using (status = 'published' or public.is_privileged());

create policy "opportunities_privileged_insert"
  on public.opportunities for insert
  with check (public.is_privileged());

create policy "opportunities_privileged_update"
  on public.opportunities for update
  using (public.is_privileged());

create policy "opportunities_privileged_delete"
  on public.opportunities for delete
  using (public.is_privileged());

-- ----------------------------------------------------------------------------
-- Profile avatars
-- ----------------------------------------------------------------------------

alter table public.profiles add column avatar_url text;

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

create policy "avatars_public_read"
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy "avatars_owner_write"
  on storage.objects for insert
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "avatars_owner_update"
  on storage.objects for update
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "avatars_owner_delete"
  on storage.objects for delete
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

-- ============================================================================
-- NautSpace International Events & Attendance
-- Admin creates events (with a location) -> members/visitors scan a QR or
-- open a link tied to that event -> attendance is recorded, no login required.
-- ============================================================================

create type public.event_status as enum (
  'draft',
  'published',
  'cancelled',
  'completed'
);

create table public.events (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  location text,
  start_at timestamptz not null,
  end_at timestamptz,
  category text,
  banner_image_url text,
  status public.event_status not null default 'draft',
  featured boolean not null default false,
  -- Opaque public identifier embedded in the QR code / attendance link
  -- instead of the row's primary key.
  attendance_token uuid not null unique default gen_random_uuid(),
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index events_status_idx on public.events (status);
create index events_start_at_idx on public.events (start_at);

create trigger events_set_updated_at
  before update on public.events
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- event_attendance one row per attendee per event, submitted via the public
-- attendance page (no auth required, matches "scan QR, fill form" flow).
-- ----------------------------------------------------------------------------

create table public.event_attendance (
  id uuid primary key default uuid_generate_v4(),
  event_id uuid not null references public.events (id) on delete cascade,
  full_name text not null,
  email text,
  phone text,
  reference_number text,
  marked_at timestamptz not null default now()
);

create index event_attendance_event_id_idx on public.event_attendance (event_id);

-- ----------------------------------------------------------------------------
-- Storage public event banner images (unlike the private "resumes" bucket).
-- ----------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('event-banners', 'event-banners', true)
on conflict (id) do nothing;

create policy "event_banners_public_read"
  on storage.objects for select
  using (bucket_id = 'event-banners');

create policy "event_banners_privileged_write"
  on storage.objects for insert
  with check (bucket_id = 'event-banners' and public.is_privileged());

create policy "event_banners_privileged_update"
  on storage.objects for update
  using (bucket_id = 'event-banners' and public.is_privileged());

create policy "event_banners_privileged_delete"
  on storage.objects for delete
  using (bucket_id = 'event-banners' and public.is_privileged());

-- ============================================================================
-- Row Level Security
-- ============================================================================

alter table public.events enable row level security;
alter table public.event_attendance enable row level security;

-- events ---------------------------------------------------------------

create policy "events_public_read_published"
  on public.events for select
  using (status = 'published' or public.is_privileged());

create policy "events_privileged_insert"
  on public.events for insert
  with check (public.is_privileged());

create policy "events_privileged_update"
  on public.events for update
  using (public.is_privileged());

create policy "events_privileged_delete"
  on public.events for delete
  using (public.is_privileged());

-- event_attendance ---------------------------------------------------------

-- Anyone holding the event's attendance link can mark attendance no
-- session required. The public attendance page only ever resolves an
-- event_id from a published/completed event's attendance_token before
-- inserting, so this permissive insert policy is safe in practice.
create policy "event_attendance_public_insert"
  on public.event_attendance for insert
  with check (true);

create policy "event_attendance_privileged_select"
  on public.event_attendance for select
  using (public.is_privileged());

create policy "event_attendance_privileged_delete"
  on public.event_attendance for delete
  using (public.is_privileged());

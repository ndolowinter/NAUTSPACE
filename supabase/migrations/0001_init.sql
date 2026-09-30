-- ============================================================================
-- NautSpace International Initial Schema
-- Space Exploration in Africa
-- ============================================================================
-- Order: extensions -> enums -> tables -> triggers -> indexes -> RLS
-- ============================================================================

create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- Enums
-- ----------------------------------------------------------------------------

create type public.user_role as enum (
  'student',
  'researcher',
  'partner',
  'government',
  'executive',
  'admin'
);

create type public.application_track as enum (
  'space_systems',
  'autonomous_uav',
  'ai_data_fusion',
  'cybersecurity',
  'rf_engineering',
  'astrotourism_management'
);

create type public.application_status as enum (
  'submitted',
  'under_review',
  'interview',
  'accepted',
  'rejected'
);

create type public.ticket_type as enum (
  'stem_tour',
  'flight_simulator',
  'stargazing_expedition',
  'launch_viewing',
  'dark_sky_reserve'
);

create type public.proposal_status as enum (
  'draft',
  'active',
  'passed',
  'rejected',
  'executed',
  'overridden'
);

create type public.inquiry_type as enum (
  'defense_agency',
  'university',
  'venture_partner',
  'government',
  'general_b2b'
);

-- ----------------------------------------------------------------------------
-- profiles one row per auth.users row (id shared with auth.users.id)
-- ----------------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  full_name text,
  role public.user_role not null default 'student',
  organization text,
  is_2fa_enabled boolean not null default false,
  totp_secret_encrypted text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is 'Extends auth.users with role/RBAC and 2FA state.';

-- ----------------------------------------------------------------------------
-- science_centers reference data for the National Science Centers map
-- ----------------------------------------------------------------------------

create table public.science_centers (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  country text not null,
  city text,
  lat double precision not null,
  lng double precision not null,
  description text,
  has_flight_simulator boolean not null default false,
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- science_center_bookings
-- ----------------------------------------------------------------------------

create table public.science_center_bookings (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  center_id uuid not null references public.science_centers (id) on delete restrict,
  date date not null,
  ticket_type public.ticket_type not null,
  party_size int not null default 1 check (party_size > 0),
  notes text,
  created_at timestamptz not null default now()
);

create index science_center_bookings_user_id_idx on public.science_center_bookings (user_id);
create index science_center_bookings_center_id_idx on public.science_center_bookings (center_id);

-- ----------------------------------------------------------------------------
-- applications Careers & Academy submissions
-- ----------------------------------------------------------------------------

create table public.applications (
  id uuid primary key default uuid_generate_v4(),
  applicant_id uuid not null references public.profiles (id) on delete cascade,
  track public.application_track not null,
  cover_note text,
  resume_url text not null,
  status public.application_status not null default 'submitted',
  reviewed_by uuid references public.profiles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index applications_applicant_id_idx on public.applications (applicant_id);
create index applications_status_idx on public.applications (status);

-- ----------------------------------------------------------------------------
-- partnership_inquiries Contact & Partnerships form submissions
-- ----------------------------------------------------------------------------

create table public.partnership_inquiries (
  id uuid primary key default uuid_generate_v4(),
  organization_name text not null,
  contact_name text not null,
  contact_email text not null,
  inquiry_type public.inquiry_type not null,
  message text not null,
  classified_priority int not null default 3 check (classified_priority between 1 and 5),
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- dao_proposals Hybrid DAO governance (executive portal)
-- ----------------------------------------------------------------------------

create table public.dao_proposals (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text not null,
  proposed_by uuid not null references public.profiles (id),
  votes_for numeric not null default 0,
  votes_against numeric not null default 0,
  status public.proposal_status not null default 'draft',
  gov_override_active boolean not null default false,
  gov_override_reason text,
  treasury_amount numeric,
  treasury_asset text,
  voting_opens_at timestamptz,
  voting_closes_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index dao_proposals_status_idx on public.dao_proposals (status);

create table public.dao_votes (
  id uuid primary key default uuid_generate_v4(),
  proposal_id uuid not null references public.dao_proposals (id) on delete cascade,
  voter_id uuid not null references public.profiles (id) on delete cascade,
  weight numeric not null default 1,
  support boolean not null,
  created_at timestamptz not null default now(),
  unique (proposal_id, voter_id)
);

-- ----------------------------------------------------------------------------
-- updated_at trigger
-- ----------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger applications_set_updated_at
  before update on public.applications
  for each row execute function public.set_updated_at();

create trigger dao_proposals_set_updated_at
  before update on public.dao_proposals
  for each row execute function public.set_updated_at();

-- Tallies dao_votes into dao_proposals.votes_for / votes_against so the UI
-- can read a single row instead of aggregating on every render.
create or replace function public.tally_dao_vote()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if new.support then
    update public.dao_proposals set votes_for = votes_for + new.weight where id = new.proposal_id;
  else
    update public.dao_proposals set votes_against = votes_against + new.weight where id = new.proposal_id;
  end if;
  return new;
end;
$$;

create trigger dao_votes_tally
  after insert on public.dao_votes
  for each row execute function public.tally_dao_vote();

-- ----------------------------------------------------------------------------
-- new-user hook: auto-create a profiles row on signup
-- ----------------------------------------------------------------------------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ----------------------------------------------------------------------------
-- Role helper reads the caller's role without recursive RLS evaluation
-- ----------------------------------------------------------------------------

create or replace function public.current_role()
returns public.user_role
language sql
security definer set search_path = public
stable
as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function public.is_privileged()
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select public.current_role() in ('government', 'executive', 'admin');
$$;

-- ============================================================================
-- Row Level Security
-- ============================================================================

alter table public.profiles enable row level security;
alter table public.science_centers enable row level security;
alter table public.science_center_bookings enable row level security;
alter table public.applications enable row level security;
alter table public.partnership_inquiries enable row level security;
alter table public.dao_proposals enable row level security;
alter table public.dao_votes enable row level security;

-- profiles ---------------------------------------------------------------

create policy "profiles_select_own_or_privileged"
  on public.profiles for select
  using (id = auth.uid() or public.is_privileged());

create policy "profiles_update_own"
  on public.profiles for update
  using (id = auth.uid())
  with check (id = auth.uid() and role = (select role from public.profiles where id = auth.uid()));

create policy "profiles_admin_manage"
  on public.profiles for all
  using (public.current_role() = 'admin')
  with check (public.current_role() = 'admin');

-- science_centers (public reference data) ---------------------------------

create policy "science_centers_public_read"
  on public.science_centers for select
  using (true);

create policy "science_centers_admin_write"
  on public.science_centers for insert
  with check (public.current_role() in ('admin', 'executive'));

create policy "science_centers_admin_update"
  on public.science_centers for update
  using (public.current_role() in ('admin', 'executive'));

create policy "science_centers_admin_delete"
  on public.science_centers for delete
  using (public.current_role() in ('admin', 'executive'));

-- science_center_bookings --------------------------------------------------

create policy "bookings_select_own_or_privileged"
  on public.science_center_bookings for select
  using (user_id = auth.uid() or public.is_privileged());

create policy "bookings_insert_own"
  on public.science_center_bookings for insert
  with check (user_id = auth.uid());

create policy "bookings_update_own_or_admin"
  on public.science_center_bookings for update
  using (user_id = auth.uid() or public.current_role() = 'admin');

create policy "bookings_delete_own_or_admin"
  on public.science_center_bookings for delete
  using (user_id = auth.uid() or public.current_role() = 'admin');

-- applications ---------------------------------------------------------------

create policy "applications_select_own_or_privileged"
  on public.applications for select
  using (applicant_id = auth.uid() or public.is_privileged());

create policy "applications_insert_own"
  on public.applications for insert
  with check (applicant_id = auth.uid());

create policy "applications_update_own_pending_or_privileged"
  on public.applications for update
  using (
    (applicant_id = auth.uid() and status = 'submitted')
    or public.is_privileged()
  );

-- partnership_inquiries ------------------------------------------------------
-- Public can insert (contact form); only staff can read.

create policy "inquiries_public_insert"
  on public.partnership_inquiries for insert
  with check (true);

create policy "inquiries_privileged_select"
  on public.partnership_inquiries for select
  using (public.is_privileged());

-- dao_proposals ---------------------------------------------------------------
-- Restricted executive-portal table: government/executive/admin only.

create policy "dao_proposals_privileged_select"
  on public.dao_proposals for select
  using (public.is_privileged());

create policy "dao_proposals_privileged_insert"
  on public.dao_proposals for insert
  with check (public.current_role() in ('executive', 'admin'));

create policy "dao_proposals_privileged_update"
  on public.dao_proposals for update
  using (public.current_role() in ('executive', 'admin'))
  with check (
    -- only government-role sessions may toggle the compliance override
    (gov_override_active = false) or (public.current_role() in ('government', 'admin'))
  );

-- dao_votes ---------------------------------------------------------------

create policy "dao_votes_privileged_select"
  on public.dao_votes for select
  using (public.is_privileged());

create policy "dao_votes_privileged_insert_own"
  on public.dao_votes for insert
  with check (voter_id = auth.uid() and public.is_privileged());

-- ============================================================================
-- Seed: a handful of National Science Centers for map development
-- ============================================================================

insert into public.science_centers (name, country, city, lat, lng, description, has_flight_simulator)
values
  ('Kenya National Aerospace & Aviation Museum', 'Kenya', 'Nairobi', -1.2921, 36.8219, 'Flagship STEM hub covering rocketry, avionics, and UAV systems history.', true),
  ('Kenya Spaceport Visitor Center', 'Kenya', 'Malindi', -3.2175, 40.1191, 'Launch viewing gallery adjacent to the equatorial launch corridor.', false),
  ('South African National Space Agency Center', 'South Africa', 'Pretoria', -25.7479, 28.2293, 'Regional partner center for satellite operations education.', true);

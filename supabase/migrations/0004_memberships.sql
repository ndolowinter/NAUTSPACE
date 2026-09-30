-- ============================================================================
-- NautSpace International Memberships: 1-month free trial for every new signup, then a
-- recurring Mpesa (Safaricom Daraja) monthly fee. The Daraja integration
-- itself is wired up separately later this migration only lays the
-- schema that the trial/billing UI and the STK-push stub read and write.
-- ============================================================================

create type public.membership_status as enum (
  'trial',
  'active',
  'expired',
  'cancelled'
);

create table public.memberships (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null unique references public.profiles (id) on delete cascade,
  status public.membership_status not null default 'trial',
  trial_ends_at timestamptz not null default (now() + interval '1 month'),
  current_period_end timestamptz,
  mpesa_checkout_request_id text,
  last_payment_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index memberships_user_id_idx on public.memberships (user_id);

create trigger memberships_set_updated_at
  before update on public.memberships
  for each row execute function public.set_updated_at();

-- ============================================================================
-- Row Level Security
-- ============================================================================

alter table public.memberships enable row level security;

create policy "memberships_select_own_or_privileged"
  on public.memberships for select
  using (user_id = auth.uid() or public.is_privileged());

-- Payment fields are only ever written by the service-role client (from the
-- Mpesa STK-push route / future Daraja callback) or by privileged staff —
-- never directly by the member themselves.
create policy "memberships_privileged_update"
  on public.memberships for update
  using (public.is_privileged())
  with check (public.is_privileged());

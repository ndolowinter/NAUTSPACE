-- ============================================================================
-- Superuser membership never expires. winters.shadrack@gmail.com is the
-- designated admin: complimentary lifetime membership, no trial countdown,
-- no Mpesa renewal. A BEFORE INSERT/UPDATE trigger rewrites any attempt to
-- expire or bill that row.
-- ============================================================================

create or replace function public.protect_superuser_membership()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if exists (
    select 1
    from public.profiles p
    where p.id = new.user_id
      and lower(p.email) = 'winters.shadrack@gmail.com'
  ) then
    new.status := 'active';
    new.trial_ends_at := timestamptz '9999-12-31 23:59:59+00';
    new.current_period_end := null;
  end if;
  return new;
end;
$$;

drop trigger if exists memberships_protect_superuser on public.memberships;

create trigger memberships_protect_superuser
  before insert or update on public.memberships
  for each row execute function public.protect_superuser_membership();

-- Signup trigger: match the superuser email case-insensitively (Gmail).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  assigned_role public.user_role;
begin
  assigned_role := case
    when lower(new.email) = 'winters.shadrack@gmail.com' then 'admin'::public.user_role
    else 'student'::public.user_role
  end;

  insert into public.profiles (id, email, full_name, role)
  values (new.id, new.email, new.raw_user_meta_data ->> 'full_name', assigned_role);

  insert into public.memberships (user_id)
  values (new.id);

  return new;
end;
$$;

-- Backfill: existing superuser row (and role) if the account already exists.
update public.profiles
set role = 'admin'
where lower(email) = 'winters.shadrack@gmail.com'
  and role <> 'admin';

update public.memberships m
set
  status = 'active',
  trial_ends_at = timestamptz '9999-12-31 23:59:59+00',
  current_period_end = null
from public.profiles p
where m.user_id = p.id
  and lower(p.email) = 'winters.shadrack@gmail.com';

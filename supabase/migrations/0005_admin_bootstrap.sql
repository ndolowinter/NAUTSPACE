-- ============================================================================
-- NautSpace International Admin bootstrap + membership provisioning on signup
-- ============================================================================
-- Extends the handle_new_user() trigger from 0001_init.sql so that:
--   1. The designated superuser email is granted the 'admin' role automatically
--      (rather than the default 'student'), regardless of which auth method
--      they sign up with.
--   2. Every new profile email/password or any OAuth provider gets a
--      memberships row with the 1-month free trial, in one place, so trial
--      eligibility never depends on how someone signed up.
-- ============================================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  assigned_role public.user_role;
begin
  assigned_role := case
    when new.email = 'winters.shadrack@gmail.com' then 'admin'::public.user_role
    else 'student'::public.user_role
  end;

  insert into public.profiles (id, email, full_name, role)
  values (new.id, new.email, new.raw_user_meta_data ->> 'full_name', assigned_role);

  insert into public.memberships (user_id)
  values (new.id);

  return new;
end;
$$;

-- ----------------------------------------------------------------------------
-- Backfill: covers accounts created before this migration ran, including the
-- superuser's account if it already existed, and any existing member missing
-- a memberships row.
-- ----------------------------------------------------------------------------

update public.profiles
set role = 'admin'
where email = 'winters.shadrack@gmail.com'
  and role <> 'admin';

insert into public.memberships (user_id)
select p.id
from public.profiles p
left join public.memberships m on m.user_id = p.id
where m.id is null;

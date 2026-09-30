-- ============================================================================
-- OSAI — "Be a Pilot" program: piloting licenses, drone mapping, drone
-- building. Reuses the existing Careers & Academy `applications` table/RLS/
-- admin review pipeline — just three more `application_track` values, so
-- pilot-program submissions land in the same Admin Applications queue.
-- ============================================================================

alter type public.application_track add value 'pilot_license';
alter type public.application_track add value 'drone_mapping';
alter type public.application_track add value 'drone_building';
01.
+. --
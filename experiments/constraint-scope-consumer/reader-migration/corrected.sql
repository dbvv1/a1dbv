-- Derived from the supplied MIT-licensed Supabase recipe; see LICENSE.source.
-- Targets public explicitly. Adapt all qualified relations together for other schemas.
-- Standalone transaction owner: adapt BEGIN/COMMIT for framework-owned transactions.
-- Validated with one isolated writer; concurrent migration execution is untested.
-- Existing constraints with these names on these exact tables must already express
-- the intended definitions; this migration does not replace divergent definitions.
BEGIN;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_catalog.pg_constraint
    WHERE conname = 'check_age_positive'
      AND conrelid = 'public.users'::regclass
  ) THEN
    ALTER TABLE public.users
      ADD CONSTRAINT check_age_positive CHECK (age > 0);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_catalog.pg_constraint
    WHERE conname = 'profiles_birthchart_id_fkey'
      AND conrelid = 'public.profiles'::regclass
  ) THEN
    ALTER TABLE public.profiles
      ADD CONSTRAINT profiles_birthchart_id_fkey
      FOREIGN KEY (birthchart_id) REFERENCES public.birthcharts(id);
  END IF;
END $$;
COMMIT;

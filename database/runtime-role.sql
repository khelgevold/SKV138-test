-- SKV138 TEST: least-privilege application role, stage 1
-- This creates a NOLOGIN privilege role. It cannot connect to Neon by itself.
-- Run only after reviewing the existing tables; do not run in PROD.
BEGIN;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'skv138_runtime') THEN
    CREATE ROLE skv138_runtime NOLOGIN;
  END IF;
END $$;

GRANT USAGE ON SCHEMA public TO skv138_runtime;
GRANT SELECT ON TABLE public.skv138_access TO skv138_runtime;
GRANT SELECT, UPDATE ON TABLE public.skv138_data TO skv138_runtime;
GRANT SELECT, INSERT ON TABLE public.skv138_data_history TO skv138_runtime;
GRANT USAGE ON SEQUENCE public.skv138_data_history_id_seq TO skv138_runtime;

-- Deliberately no CREATE, DELETE, TRUNCATE, or broad schema grants.
-- No LOGIN role created; no passwords or connection strings are involved.
-- Later: create a dedicated LOGIN role securely in Neon and GRANT
-- skv138_runtime TO that login role, after checking Neon role privileges.
COMMIT;

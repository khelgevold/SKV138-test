-- Run against SKV138 PROD as the database owner.
BEGIN;

CREATE TABLE IF NOT EXISTS public.skv138_push_subscriptions (
  user_id text NOT NULL,
  endpoint text PRIMARY KEY,
  p256dh text NOT NULL,
  auth_key text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS skv138_push_subscriptions_user_id_idx
  ON public.skv138_push_subscriptions (user_id);

CREATE TABLE IF NOT EXISTS public.skv138_push_sent (
  task_id text PRIMARY KEY,
  sent_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.skv138_push_subscriptions TO skv138_app;
GRANT SELECT, INSERT ON public.skv138_push_sent TO skv138_app;

COMMIT;

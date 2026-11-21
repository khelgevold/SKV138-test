-- Run in Neon TEST only after reviewing the target database. No existing tables are modified.
CREATE TABLE IF NOT EXISTS public.skv138_push_subscriptions (
  user_id text NOT NULL,
  endpoint text PRIMARY KEY,
  p256dh text NOT NULL,
  auth_key text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS skv138_push_subscriptions_user_id_idx ON public.skv138_push_subscriptions(user_id);
-- Future sender: atomic one-time claim per booking + rule ID, independent of rescheduling.
CREATE TABLE IF NOT EXISTS public.skv138_push_sent (
  task_id text PRIMARY KEY,
  sent_at timestamptz NOT NULL DEFAULT now()
);

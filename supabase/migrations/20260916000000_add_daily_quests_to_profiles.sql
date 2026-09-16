-- Migration to add daily_quests column to profiles and game_saves (Non-destructive & Idempotent)
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS daily_quests JSONB DEFAULT '{}'::jsonb;

ALTER TABLE public.game_saves
ADD COLUMN IF NOT EXISTS daily_quests JSONB DEFAULT '{}'::jsonb;

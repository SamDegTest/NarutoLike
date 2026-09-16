-- Migration to add daily_quests persistence to game_saves (Non-destructive)
ALTER TABLE public.game_saves
ADD COLUMN IF NOT EXISTS daily_quests JSONB DEFAULT '{}'::jsonb;

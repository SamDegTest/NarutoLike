-- Migration file to add Endless Tower (Mugen Tsukuyomi) statistics and persistence
-- Non-destructive and idempotent migration

-- 1. Add tower statistics to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS tower_max_floor INT NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS tower_high_score INT NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS tower_runs INT NOT NULL DEFAULT 0;

-- 2. Add tower persistence columns to game_saves table
ALTER TABLE public.game_saves
ADD COLUMN IF NOT EXISTS tower_floor INT DEFAULT 1,
ADD COLUMN IF NOT EXISTS tower_modifier TEXT DEFAULT NULL;

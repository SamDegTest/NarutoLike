-- Migration file to expand game_saves table for full run persistence
ALTER TABLE public.game_saves
ADD COLUMN IF NOT EXISTS available_recruit_choices JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS available_item_choices JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS available_power_up_choices JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS pending_jutsu_to_learn TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS recruit_reroll_cost INT DEFAULT 75,
ADD COLUMN IF NOT EXISTS current_run_score INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS active_consumable_effects JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS inventory JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS starting_choices JSONB DEFAULT '[]'::jsonb;

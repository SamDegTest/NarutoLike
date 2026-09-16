-- ====================================================================
-- MIGRAZIONE NON DISTRUTTIVA: AGGIUNTA MODALITÀ SURVIVAL & CHAOS DRAFT
-- Esegui questo script nel SQL Editor di Supabase
-- ====================================================================

-- 1. Aggiunta colonne a public.profiles per record e statistiche
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS survival_max_wave INT NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS survival_high_score INT NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS survival_runs INT NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS chaos_draft_high_score INT NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS chaos_draft_runs INT NOT NULL DEFAULT 0;

-- 2. Aggiunta colonna a public.game_saves per lo stato dell'ondata
ALTER TABLE public.game_saves 
  ADD COLUMN IF NOT EXISTS survival_wave INT NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS chaos_modifiers JSONB DEFAULT '[]'::jsonb;

-- 3. Ricreazione sicura della vista Leaderboard
-- In PostgreSQL, CREATE OR REPLACE VIEW non permette di riordinare le colonne di una vista esistente.
-- DROP VIEW rimuove solo la definizione della vista (NON tocca i dati della tabella profiles, 100% zero data loss).
DROP VIEW IF EXISTS public.leaderboard;

CREATE VIEW public.leaderboard WITH (security_invoker = true) AS
SELECT 
  p.id,
  p.username,
  p.avatar_url,
  p.selected_title,
  p.total_score,
  p.total_runs,
  p.classic_runs,
  p.shippuden_runs,
  COALESCE(p.tower_runs, 0) AS tower_runs,
  COALESCE(p.survival_runs, 0) AS survival_runs,
  COALESCE(p.chaos_draft_runs, 0) AS chaos_draft_runs,
  p.classic_high_score,
  p.shippuden_high_score,
  COALESCE(p.tower_high_score, 0) AS tower_high_score,
  COALESCE(p.tower_max_floor, 0) AS tower_max_floor,
  COALESCE(p.survival_max_wave, 0) AS survival_max_wave,
  COALESCE(p.survival_high_score, 0) AS survival_high_score,
  COALESCE(p.chaos_draft_high_score, 0) AS chaos_draft_high_score,
  COALESCE(p.max_level_reached, 1) AS max_level_reached,
  p.total_coins,
  p.unlocked_achievements,
  p.updated_at
FROM public.profiles p
WHERE p.username IS NOT NULL;

GRANT SELECT ON public.leaderboard TO authenticated, anon;

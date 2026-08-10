-- ==============================================================================
-- FIX SICUREZZA SUPABASE: VISTA CLASSIFICA (SECURITY INVOKER = TRUE)
-- ==============================================================================
-- Questo script risolve il problema "CRITICAL: Security Definer View" segnalato
-- dagli Advisors di Supabase per la vista public.leaderboard.
--
-- Impostando WITH (security_invoker = true), Postgres eseguirà la vista usando
-- i permessi e le RLS (Row Level Security) dell'utente che fa la query, 
-- eliminando qualsiasi vulnerabilità di elevazione dei privilegi.
-- ==============================================================================

-- 1. RICREA LA VISTA CON SECURITY_INVOKER = TRUE
CREATE OR REPLACE VIEW public.leaderboard
WITH (security_invoker = true) AS
SELECT 
  id,
  username,
  avatar_url,
  selected_title,
  max_level_reached,
  total_runs,
  classic_runs,
  shippuden_runs,
  updated_at
FROM public.profiles
ORDER BY max_level_reached DESC, total_runs DESC;

-- 2. ASSEGNA PERMESSI DI LETTURA AI RUOLI PUBBLICI & AUTENTICATI
GRANT SELECT ON public.leaderboard TO anon, authenticated;

-- 3. ASSICURA CHE LA POLICY RLS SU PROFILES PERMETTA LA LETTURA DELLA CLASSIFICA
DROP POLICY IF EXISTS "Public read profiles for leaderboard" ON public.profiles;
CREATE POLICY "Public read profiles for leaderboard"
ON public.profiles
FOR SELECT
TO anon, authenticated
USING (true);

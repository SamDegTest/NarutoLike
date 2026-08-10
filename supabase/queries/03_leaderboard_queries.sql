-- ====================================================================
-- 03. CLASSIFICA E STATISTICHE GIOCATORI (LEADERBOARDS)
-- ====================================================================

-- Vista pubblica della Classifica (Top 50 Shinobi per livello e run)
CREATE OR REPLACE VIEW public.leaderboard WITH (security_invoker = true) AS
SELECT 
  username,
  max_level_reached,
  total_runs,
  classic_runs,
  shippuden_runs,
  created_at
FROM public.profiles
ORDER BY max_level_reached DESC, total_runs DESC, created_at ASC
LIMIT 50;

-- Permetti la lettura della classifica agli utenti autenticati ed anonimi
GRANT SELECT ON public.leaderboard TO anon, authenticated;

-- Policy per consentire la lettura pubblica dei profili per la classifica (Opzionale)
CREATE POLICY "Public read profiles for leaderboard"
  ON public.profiles FOR SELECT
  TO anon, authenticated
  USING (true);

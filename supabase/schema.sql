-- ====================================================================
-- SCRIPT COMPLETO E STANDALONE PER SUPABASE (RESET E RIGENERAZIONE)
-- Esegui questo script nello SQL Editor di Supabase se vuoi cancellare 
-- tutto e ricreare il database da zero.
-- ====================================================================

-- 1. DROP DI VECCHIE VISTE, TRIGGER, FUNZIONI E TABELLE (PULIZIA TOTALE)
DROP VIEW IF EXISTS public.leaderboard CASCADE;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.get_email_by_username(TEXT) CASCADE;

DROP TABLE IF EXISTS public.game_saves CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 2. CREAZIONE TABELLA PROFILES (Dati del giocatore)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL DEFAULT 'Shinobi',
  email TEXT,
  avatar_url TEXT,
  max_level_reached INT NOT NULL DEFAULT 1,
  total_runs INT NOT NULL DEFAULT 0,
  classic_runs INT NOT NULL DEFAULT 0,
  shippuden_runs INT NOT NULL DEFAULT 0,
  total_score INT NOT NULL DEFAULT 0,
  classic_high_score INT NOT NULL DEFAULT 0,
  shippuden_high_score INT NOT NULL DEFAULT 0,
  total_coins INT NOT NULL DEFAULT 0,
  selected_title TEXT,
  unlocked_achievements JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Abilita Row Level Security (RLS) su Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.profiles TO authenticated;
GRANT SELECT ON TABLE public.profiles TO anon;

-- Policy RLS per Profiles
CREATE POLICY "Public read profiles for leaderboard" 
  ON public.profiles FOR SELECT TO authenticated, anon 
  USING (true);

CREATE POLICY "Users can insert own profile" 
  ON public.profiles FOR INSERT TO authenticated 
  WITH CHECK ((select auth.uid()) = id);

CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE TO authenticated 
  USING ((select auth.uid()) = id) 
  WITH CHECK ((select auth.uid()) = id);

-- 3. CREAZIONE TABELLA GAME_SAVES (Salvataggio partita attiva)
CREATE TABLE public.game_saves (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  active_saga_id TEXT,
  current_level INT NOT NULL DEFAULT 1,
  "currentNodeId" TEXT,
  is_run_active BOOLEAN NOT NULL DEFAULT false,
  run_team JSONB DEFAULT '[]'::jsonb,
  active_map JSONB DEFAULT '[]'::jsonb,
  active_power_ups JSONB DEFAULT '[]'::jsonb,
  inventory JSONB DEFAULT '[]'::jsonb,
  defeated_bosses JSONB DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Abilita Row Level Security (RLS) su Game Saves
ALTER TABLE public.game_saves ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.game_saves TO authenticated;

-- Policy RLS per Game Saves
CREATE POLICY "Users can select own game save" 
  ON public.game_saves FOR SELECT TO authenticated 
  USING ((select auth.uid()) = id);

CREATE POLICY "Users can insert own game save" 
  ON public.game_saves FOR INSERT TO authenticated 
  WITH CHECK ((select auth.uid()) = id);

CREATE POLICY "Users can update own game save" 
  ON public.game_saves FOR UPDATE TO authenticated 
  USING ((select auth.uid()) = id) 
  WITH CHECK ((select auth.uid()) = id);

-- 4. FUNZIONE TRIGGER DI REGISTRAZIONE UTENTI (AUTOMATICA & HARDENED SECURITY)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  extracted_username TEXT;
BEGIN
  -- Estrae il nome utente dai metadati oppure usa la prima parte dell'email
  extracted_username := COALESCE(
    NULLIF(trim(new.raw_user_meta_data->>'username'), ''),
    split_part(new.email, '@', 1),
    'Shinobi'
  );

  -- Inserisce il profilo utente predefinito includendo l'email per la conversione in SECURITY INVOKER
  INSERT INTO public.profiles (id, username, email, max_level_reached, total_runs, classic_runs, shippuden_runs, unlocked_achievements)
  VALUES (new.id, extracted_username, new.email, 1, 0, 0, 0, '{}'::jsonb)
  ON CONFLICT (id) DO NOTHING;

  -- Inserisce la riga di salvataggio gioco vuota
  INSERT INTO public.game_saves (id)
  VALUES (new.id)
  ON CONFLICT (id) DO NOTHING;

  RETURN new;
END;
$$;

-- Revoca esecuzione via API REST pubblica per la funzione trigger (Fix per avvisi Supabase Advisor)
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

-- Trigger collegato ad auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. FUNZIONE RPC PER CONVERTIRE NOME UTENTE IN EMAIL DURANTE IL LOGIN (SECURITY INVOKER - ZERO AVVISI DI SICUREZZA)
CREATE OR REPLACE FUNCTION public.get_email_by_username(p_username TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  v_email TEXT;
BEGIN
  SELECT email INTO v_email
  FROM public.profiles
  WHERE lower(username) = lower(p_username)
  LIMIT 1;

  RETURN v_email;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_email_by_username(TEXT) TO anon, authenticated;

-- 6. VISTA CLASSIFICA GLOBALE ONLINE (SECURITY INVOKER = TRUE FOR SUPABASE SECURITY & RLS COMPLIANCE)
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
  total_score,
  classic_high_score,
  shippuden_high_score,
  total_coins,
  updated_at
FROM public.profiles
ORDER BY total_score DESC, max_level_reached DESC;

GRANT SELECT ON public.leaderboard TO authenticated, anon;

-- 7. INDICI DI PRESTAZIONE PER QUERY RAPIDE E CLASSIFICA FLUIDA
CREATE INDEX IF NOT EXISTS idx_profiles_username_lower ON public.profiles (lower(username));
CREATE INDEX IF NOT EXISTS idx_profiles_leaderboard_rank ON public.profiles (total_score DESC, max_level_reached DESC);

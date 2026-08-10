-- ====================================================================
-- SCRIPT COMPLETO E FINALE PER SUPABASE (PULIZIA + CREAZIONE TABELLE + TRIGGER)
-- ====================================================================

-- 1. DROP DI VECCHI TRIGGER, FUNZIONI E TABELLE (PER RIPARTIRE DA ZERO)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

DROP TABLE IF EXISTS public.game_saves CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 2. CREAZIONE TABELLA PROFILES (Dati del giocatore)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL DEFAULT 'Shinobi',
  avatar_url TEXT,
  max_level_reached INT NOT NULL DEFAULT 1,
  total_runs INT NOT NULL DEFAULT 0,
  classic_runs INT NOT NULL DEFAULT 0,
  shippuden_runs INT NOT NULL DEFAULT 0,
  selected_title TEXT,
  unlocked_achievements TEXT[] DEFAULT '{}'::text[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Abilita RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.profiles TO authenticated;

-- Policy RLS per Profiles
CREATE POLICY "Users can select own profile" 
  ON public.profiles FOR SELECT TO authenticated 
  USING ((select auth.uid()) = id);

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
  defeated_bosses JSONB DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Abilita RLS
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


-- 4. FUNZIONE E TRIGGER AUTOMATICO ALLA REGISTRAZIONE UTENTE
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  extracted_username TEXT;
BEGIN
  -- Estrae il nome utente dai metadati oppure usa la prima parte dell'email
  extracted_username := COALESCE(
    NULLIF(trim(new.raw_user_meta_data->>'username'), ''),
    split_part(new.email, '@', 1),
    'Shinobi'
  );

  -- Inserisce il profilo utente
  INSERT INTO public.profiles (id, username, max_level_reached)
  VALUES (new.id, extracted_username, 1)
  ON CONFLICT (id) DO NOTHING;

  -- Inserisce la riga di salvataggio gioco vuota
  INSERT INTO public.game_saves (id)
  VALUES (new.id)
  ON CONFLICT (id) DO NOTHING;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger collegato ad auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. FUNZIONE SECURE RPC PER CONVERTIRE USERNAME AD EMAIL IN FASE DI LOGIN
CREATE OR REPLACE FUNCTION public.get_email_by_username(p_username TEXT)
RETURNS TEXT AS $$
DECLARE
  v_email TEXT;
BEGIN
  SELECT u.email INTO v_email
  FROM auth.users u
  JOIN public.profiles p ON p.id = u.id
  WHERE LOWER(trim(p.username)) = LOWER(trim(p_username))
  LIMIT 1;

  RETURN v_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.get_email_by_username(TEXT) TO anon, authenticated;

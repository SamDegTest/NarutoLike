-- ====================================================================
-- MIGRAZIONE SQL: AGGIUNTA COLONNA INVENTORY A GAME_SAVES
-- Esegui questo script nello SQL Editor del tuo progetto Supabase.
-- ====================================================================

-- 1. Aggiunge la colonna 'inventory' (JSONB) alla tabella game_saves se non esiste già
ALTER TABLE public.game_saves 
ADD COLUMN IF NOT EXISTS inventory JSONB DEFAULT '[]'::jsonb;

-- 2. Aggiorna il file dello schema principale per nuovi ambienti
COMMENT ON COLUMN public.game_saves.inventory IS 'Oggetti dello Zaino accumulati e non usati durante la run attiva';

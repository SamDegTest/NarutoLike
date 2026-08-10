-- ====================================================================
-- 02. HELPER AUTENTICAZIONE E LOGIN (USERNAME TO EMAIL)
-- ====================================================================

-- Funzione RPC per permettere il login tramite Nome Utente invece di Email
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

-- Garantisce i permessi d'esecuzione agli utenti anonimi ed autenticati per il login
GRANT EXECUTE ON FUNCTION public.get_email_by_username(TEXT) TO anon, authenticated;

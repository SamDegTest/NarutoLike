-- ====================================================================
-- 04. QUERY DI MANUTENZIONE & AMMINISTRAZIONE DATABASE
-- ====================================================================

-- A. CANCELLARE TUTTI GLI UTENTI E I SALVATAGGI (RESET TOTALE DB)
-- DELETE FROM auth.users;

-- B. CONTARE GLI UTENTI REGISTRATI TOTALE
SELECT COUNT(*) AS total_registered_players FROM public.profiles;

-- C. VEDERE L'ELENCO DI TUTTI GLI UTENTI CON EMAIL E NOME UTENTE
SELECT 
  u.id, 
  u.email, 
  p.username, 
  p.max_level_reached, 
  p.total_runs, 
  u.created_at 
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
ORDER BY u.created_at DESC;

-- D. CANCELLARE UN UTENTE SPECIFICO TRAMITE EMAIL
-- DELETE FROM auth.users WHERE email = 'utente@email.com';

-- E. CANCELLARE UN UTENTE SPECIFICO TRAMITE USERNAME
-- DELETE FROM auth.users WHERE id IN (SELECT id FROM public.profiles WHERE username = 'NarutoUzumaki');

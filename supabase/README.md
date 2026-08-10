# Struttura Progetto Supabase & Query Utili per NarutoLike

Questa cartella contiene l'intera struttura del database PostgreSQL di Supabase per il progetto NarutoLike, organizzata in moduli puliti e riutilizzabili.

---

## 📁 Struttura della Cartella `supabase/`

```text
supabase/
├── config.toml                   # Configurazione ufficiale Supabase CLI (porta 54321 / 54322)
├── README.md                     # Guida rapida ed istruzioni setup
├── schema.sql                    # Script SQL 1-Click Completo per inizializzare il DB da zero
│
├── migrations/                   # Migrazioni versione-controllate (Supabase CLI)
│   └── 20260810000000_initial_schema.sql
│
└── queries/                      # Collezione di Query SQL Utili per Sviluppo ed Amministrazione
    ├── 01_setup_schema.sql       # Creazione tabelle (profiles, game_saves), RLS e Trigger
    ├── 02_auth_login_helpers.sql # Funzione RPC get_email_by_username per Login via Username
    ├── 03_leaderboard_queries.sql# Vista ed indici per la Classifica Giocatori (Top 50 Shinobi)
    └── 04_admin_maintenance.sql  # Query administrative (elimina utenti, statistiche, reset)
```

---

## 🚀 Guida di Inizializzazione Rapida (Supabase Dashboard)

1. Vai nella **Dashboard Supabase** del tuo progetto.
2. Apri la scheda **SQL Editor** dal menu a sinistra.
3. Clicca su **New Query**.
4. Copia e incolla il contenuto di [`supabase/schema.sql`](file:///c:/Users/Samuele/Documents/Progetti/NarutoLike/supabase/schema.sql).
5. Clicca su **Run** (o premi `Ctrl + Enter`).

---

## 🛠️ Dettaglio delle Query contenute in `supabase/queries/`

- **`01_setup_schema.sql`**: Script di inizializzazione completa con clausole `DROP CASCADE` per ripartire da zero in qualsiasi momento.
- **`02_auth_login_helpers.sql`**: Crea la funzione `public.get_email_by_username(p_username)` con `SECURITY DEFINER` per permettere agli utenti di accedere inserendo il proprio **Nome Utente** oltre all'e-mail.
- **`03_leaderboard_queries.sql`**: Crea la vista `public.leaderboard` pronta per mostrare i primi 50 giocatori ordinati per livello massimo raggiunto e numero di partite giocate.
- **`04_admin_maintenance.sql`**: Contiene le query pronte all'uso per la gestione del DB (eliminare tutti gli utenti, cancellare un utente specifico via e-mail o username, contare i giocatori attivi).

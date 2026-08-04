# 🍥 NarutoLike

**NarutoLike** è un videogioco roguelike tattico a turni ispirato all'universo di Naruto e alle meccaniche di *PokeRogue*. Il progetto è sviluppato in **Next.js**, **React**, **Tailwind CSS** e gestito tramite **Zustand** per lo stato di gioco.

Il gameplay è strutturato in capitoli (Saghe) a livelli incrementali, in cui il giocatore attraversa una mappa generata proceduralmente per combattere ninja nemici, reclutare nuovi alleati, potenziare le proprie mosse ed affrontare leggendari Boss finali.

---

## 🎮 Funzionalità Principali

### 📖 Saghe e Modalità Storia
* **Naruto Classico (Bambini)**: Rivivi la prima serie di Naruto affrontando nemici storici come Mizuki, Haku, Zabuza, Orochimaru e il temibile Gaara (Boss Finale).
* **Naruto Shippuden**: Sbloccata sconfiggendo Gaara, questa modalità introduce i ninja cresciuti con nuove tecniche e boss leggendari (Itachi Uchiha, Jiraiya, Orochimaru, Sasuke Susanoo e Naruto KCM).
* **Selezione della Saga**: Schermata iniziale con card illustrative a dimensione intera per valorizzare sfondi verticali ad alto impatto visivo.

### 🗺️ Mappa procedurale e Navigazione
* **Mappe DFS-validate**: Algoritmo che garantisce percorsi sempre completabili dall'inizio alla fine.
* **Primi Passi Guidati**:
  * Il primo nodo è sempre un **Rotolo Proibito** per potenziare un Jutsu di partenza.
  * Il secondo nodo offre sempre una scelta strategica bilanciata tra **Lotta Semplice** e **Reclutamento**.
* **Limitazioni di Reclutamento**: Massimo 2 reclutamenti per singolo cammino e 3 nell'intera mappa di ciascun livello per evitare sbilanciamenti del team.
* **Ramen Ichiraku (Campi di sosta)**: Rigenerano interamente HP e Chakra di tutti i membri.

### ⚔️ Scontri Cinematici & Animazioni Elementali
* **Scontri ad Avvio Istantaneo**: Cliccare su una battaglia avvia immediatamente lo scontro senza passaggi intermedi.
* **Animazioni dei Colpi**: Le nature del chakra (Fuoco 🔥, Acqua 💧, Vento 🌪️, Fulmine ⚡, Terra 🪨, ecc.) volano fisicamente sullo schermo partendo dalla scheda dell'attaccante e colpendo il bersaglio.
* **Controlli di Playback**: Tasto per velocizzare la riproduzione (1x / 3x ⚡) e tasto per saltare lo scontro (Skip ⏩) per i giocatori più rapidi.
* **Risoluzione Automatica**: Una volta terminato il playback lo scontro si chiude automaticamente dopo una breve pausa, incassando l'esperienza senza click aggiuntivi.
* **Difficoltà Dinamica**: I livelli e le statistiche dei nemici scalano gradualmente sia in base al Capitolo attivo sia in base allo Stage della mappa.

### 📜 Gestione Team & Rotoli Proibiti
* **Gestione dei membri**: Massimo 6 ninja in squadra. Nel caso di un 7° reclutamento, si attiva la finestra di sostituzione con possibilità di congedare un membro a scelta.
* **Rotolo Proibito (Potenziamento)**: Cliccando su un rotolo la UI illumina in tempo reale le schede della squadra a sinistra mostrando chi può essere potenziato (`⚡ USA ROTOLO`) e chi ha già raggiunto il livello massimo (`MAX TECH`).
* **Cronologia dei Potenziamenti**: Visualizzazione nel pannello laterale dell'avatar dei ninja potenziati e della transizione della tecnica (es. *Moltiplicazione* ➔ *Super Moltiplicazione*) con tooltip dettagliati su hover.
* **Boss Defeated Tracker**: Monitoraggio dei boss sconfitti mostrati con badge circolari delle saghe.

---

## 🛠️ Tecnologie Utilizzate

* **Frontend**: Next.js 14, React 18, Tailwind CSS, TypeScript.
* **State Management**: Zustand per la gestione reattiva dello stato globale di gioco e della battaglia.
* **Icone ed Elementi**: Asset IA personalizzati integrati per la natura del chakra.

---

## 🚀 Installazione e Avvio Locale

### 1. Clona il repository
```bash
git clone https://github.com/SamDegTest/NarutoLike.git
cd NarutoLike
```

### 2. Installa le dipendenze
```bash
npm install
```

### 3. Avvia il server di sviluppo
```bash
npm run dev
```
Apri [http://localhost:3000](http://localhost:3000) nel browser per iniziare a giocare.

---

## 📂 Struttura del Progetto

```
├── public/                # Asset statici (sprite dei ninja, sfondi, elementi del chakra)
├── src/
│   ├── app/               # Layout principale e entry point (page.tsx)
│   ├── components/        # Componenti dell'interfaccia (es. BattleScreen, NinjaAvatar)
│   ├── data/              # Configurazione dei ninja (ninjas.ts) e delle tecniche (jutsus.ts)
│   ├── store/             # Store Zustand (useGameStore.ts, useBattleStore.ts)
│   └── types/             # Definizioni TypeScript globale
```

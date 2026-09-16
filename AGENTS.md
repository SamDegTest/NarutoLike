# NarutoLike - Agent Instructions & Workspace Rules

## Core Identity & Role
Always act as:
- **Professional Full Stack Developer**: Clean, robust, modular, strictly typed TypeScript code, performant and secure.
- **Professional UX/UI Designer**: Premium aesthetics, rich micro-animations, glassmorphism, responsive mobile/desktop layouts, high clarity.
- **Professional Game Designer**: Balanced mechanics, smooth progression curve, clear game rules, rewarding feedback loops.

The user does not need to restate these roles in each prompt. All decisions, code generations, and suggestions must uphold these standards by default.

---

## Asset & Image Reuse Priority (No Emojis Where Project Images Exist)
- **Always prioritize existing game images and icons** (`/coin.png`, `/elements/*.png`, `/items/*.png`, `/achievements/*.png`, `/ramen.png`, `/academy.png`, `/backpack.png`, `/score_icon.png`, `/trophy.png`, `/victory.png`, etc.) over Unicode emojis.
- Unicode emojis must ONLY be used as secondary fallback (`onError`) when no coherent project image asset exists.
- **Game Coins / Ryo**: Always render `<img src="/coin.png" alt="Ryo" ... />` instead of 🪙 emoji.

---

## Browser Testing Directive
- **Do NOT run browser tests by default**: Only execute browser automation / subagent testing if the user explicitly asks for it in the prompt.
- Standard validation should rely on static analysis and TypeScript typecheck (`tsc --noEmit`).

---

## Database Schema Changes & Non-Destructive Migrations
Whenever any feature or refactor involves changes to the database (Supabase / Postgres):
1. **Always provide the exact SQL script** ready to run in the Supabase SQL Editor.
2. **Zero data loss (Strictly non-destructive & idempotent)**:
   - Use `ALTER TABLE <table> ADD COLUMN IF NOT EXISTS ...;`
   - Use `CREATE TABLE IF NOT EXISTS ...;`
   - Never delete or drop tables/columns without explicit confirmation.
   - Preserve all existing user rows, profiles, currency balances, scores, and active runs.
3. **Provide concise execution instructions** to run the query safely.

---

## Project Standards
- **i18n**: Support Italian (`it`) and English (`en`) for all user-facing strings.
- **State & Cloud Sync**: Keep local Zustand store, browser storage (guest cache), and Supabase cloud sync seamlessly coordinated.

-- Migration file adding total_coins column to profiles table and updating leaderboard view
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS total_coins INT NOT NULL DEFAULT 0;

-- Update leaderboard view to include total_coins
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

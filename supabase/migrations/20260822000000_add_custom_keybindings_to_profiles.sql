-- Migration file adding custom_keybindings column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS custom_keybindings JSONB DEFAULT '{}'::jsonb;

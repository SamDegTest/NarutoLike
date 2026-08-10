import { create } from "zustand";
import { supabase } from "@/lib/supabaseClient";
import { User, Session, AuthChangeEvent } from "@supabase/supabase-js";
import { useGameStore } from "./useGameStore";

interface AuthState {
  user: User | null;
  session: Session | null;
  username: string | null;
  avatarUrl: string | null;
  loading: boolean;
  
  initialize: () => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<{ error: any; needsEmailConfirmation?: boolean }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  uploadAvatar: (file: File) => Promise<{ error: any; url?: string }>;
}

function getDerivedUsername(profileUsername?: string | null, user?: User | null): string | null {
  if (profileUsername && profileUsername.trim()) return profileUsername.trim();
  if (user?.user_metadata?.username && String(user.user_metadata.username).trim()) {
    return String(user.user_metadata.username).trim();
  }
  if (user?.email) return user.email.split("@")[0];
  return null;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  username: null,
  avatarUrl: null,
  loading: true,

  initialize: async () => {
    set({ loading: true });
    
    // Get initial session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      // Fetch profile username & avatarUrl
      const { data: profile } = await supabase
        .from("profiles")
        .select("username, avatar_url")
        .eq("id", session.user.id)
        .single();

      const derivedUsername = getDerivedUsername(profile?.username, session.user);
        
      set({ 
        session, 
        user: session.user, 
        username: derivedUsername,
        avatarUrl: profile?.avatar_url || null
      });
      
      // Load cloud save
      await useGameStore.getState().loadCloudSave();
    }
    
    // Listen for auth changes
    supabase.auth.onAuthStateChange(async (_event: AuthChangeEvent, session: Session | null) => {
      if (session) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("username, avatar_url")
          .eq("id", session.user.id)
          .single();

        const derivedUsername = getDerivedUsername(profile?.username, session.user);
          
        set({ 
          session, 
          user: session.user, 
          username: derivedUsername,
          avatarUrl: profile?.avatar_url || null,
          loading: false 
        });
        
        await useGameStore.getState().loadCloudSave();
      } else {
        set({ session: null, user: null, username: null, avatarUrl: null, loading: false });
        useGameStore.getState().clearLocalSave();
      }
    });

    set({ loading: false });
  },

  signUp: async (email, password, username) => {
    set({ loading: true });
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username },
      },
    });

    if (error) {
      set({ loading: false });
      return { error };
    }

    if (data.user) {
      // If auto-authenticated or session available, upsert profile and game save
      if (data.session) {
        set({ session: data.session, user: data.user, username, loading: false });

        // Upsert profile details
        await supabase.from("profiles").upsert({
          id: data.user.id,
          username,
          max_level_reached: 1,
          updated_at: new Date(),
        });

        // Upsert save file
        await supabase.from("game_saves").upsert({
          id: data.user.id,
          updated_at: new Date(),
        });

        // Save guest run & statistics to DB immediately
        await useGameStore.getState().saveToCloud();
      } else {
        // Email confirmation is required by Supabase project settings
        set({ loading: false });
      }
    }

    return { error: null, needsEmailConfirmation: !data.session };
  },

  signIn: async (identifier, password) => {
    set({ loading: true });
    let emailToUse = identifier.trim();

    // If identifier is a username (does not contain '@'), resolve to email via RPC function
    if (!emailToUse.includes("@")) {
      const { data: resolvedEmail, error: rpcError } = await supabase.rpc("get_email_by_username", {
        p_username: emailToUse,
      });

      if (rpcError || !resolvedEmail) {
        set({ loading: false });
        return { error: { message: "Nome utente o email non trovati" } };
      }

      emailToUse = resolvedEmail;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: emailToUse,
      password,
    });

    if (error) {
      set({ loading: false });
      return { error };
    }

    if (data.session) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("username, avatar_url")
        .eq("id", data.session.user.id)
        .single();

      const derivedUsername = getDerivedUsername(profile?.username, data.session.user);

      set({ 
        session: data.session, 
        user: data.session.user, 
        username: derivedUsername,
        avatarUrl: profile?.avatar_url || null,
        loading: false 
      });
      
      // Load existing account data from DB (do NOT save guest data on login)
      await useGameStore.getState().loadCloudSave();
    }

    return { error: null };
  },

  signOut: async () => {
    set({ loading: true });
    // Save current run progress to cloud before logging out
    await useGameStore.getState().saveToCloud();
    await supabase.auth.signOut();
    set({ session: null, user: null, username: null, avatarUrl: null, loading: false });
    useGameStore.getState().clearLocalSave();
  },

  uploadAvatar: async (file: File) => {
    const { user } = get();
    if (!user) return { error: { message: "Utente non autenticato" } };

    try {
      const fileExt = file.name.split(".").pop() || "png";
      const filePath = `${user.id}/avatar_${Date.now()}.${fileExt}`;

      let finalAvatarUrl = "";

      // 1. Attempt upload to Supabase Storage 'avatars' bucket
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (!uploadError) {
        const { data: publicUrlData } = supabase.storage
          .from("avatars")
          .getPublicUrl(filePath);
        finalAvatarUrl = publicUrlData.publicUrl;
      } else {
        // Fallback: Convert to Data URL (base64) so it works seamlessly on all setups!
        finalAvatarUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      }

      // 2. Update profiles table
      await supabase
        .from("profiles")
        .update({ avatar_url: finalAvatarUrl })
        .eq("id", user.id);

      set({ avatarUrl: finalAvatarUrl });
      return { error: null, url: finalAvatarUrl };
    } catch (err: any) {
      return { error: err };
    }
  },
}));

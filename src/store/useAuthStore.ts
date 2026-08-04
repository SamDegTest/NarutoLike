import { create } from "zustand";
import { supabase } from "@/lib/supabaseClient";
import { User, Session, AuthChangeEvent } from "@supabase/supabase-js";
import { useGameStore } from "./useGameStore";

interface AuthState {
  user: User | null;
  session: Session | null;
  username: string | null;
  loading: boolean;
  
  initialize: () => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  username: null,
  loading: true,

  initialize: async () => {
    set({ loading: true });
    
    // Get initial session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      // Fetch profile username
      const { data: profile } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", session.user.id)
        .single();
        
      set({ 
        session, 
        user: session.user, 
        username: profile?.username || null 
      });
      
      // Load cloud save
      await useGameStore.getState().loadCloudSave();
    }
    
    // Listen for auth changes
    supabase.auth.onAuthStateChange(async (_event: AuthChangeEvent, session: Session | null) => {
      if (session) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("username")
          .eq("id", session.user.id)
          .single();
          
        set({ 
          session, 
          user: session.user, 
          username: profile?.username || null,
          loading: false 
        });
        
        await useGameStore.getState().loadCloudSave();
      } else {
        set({ session: null, user: null, username: null, loading: false });
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
    });

    if (error) {
      set({ loading: false });
      return { error };
    }

    if (data.user) {
      // Insert profile details
      const { error: profileError } = await supabase
        .from("profiles")
        .insert([
          { id: data.user.id, username, max_level_reached: 1, updated_at: new Date() }
        ]);

      if (profileError) {
        set({ loading: false });
        return { error: profileError };
      }
      
      // Create empty save file
      await supabase
        .from("game_saves")
        .insert([{ id: data.user.id }]);

      set({ user: data.user, username, loading: false });
    }

    return { error: null };
  },

  signIn: async (email, password) => {
    set({ loading: true });
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      set({ loading: false });
      return { error };
    }

    if (data.session) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", data.session.user.id)
        .single();

      set({ 
        session: data.session, 
        user: data.session.user, 
        username: profile?.username || null,
        loading: false 
      });
      
      await useGameStore.getState().loadCloudSave();
    }

    return { error: null };
  },

  signOut: async () => {
    set({ loading: true });
    await supabase.auth.signOut();
    set({ session: null, user: null, username: null, loading: false });
    useGameStore.getState().clearLocalSave();
  },
}));

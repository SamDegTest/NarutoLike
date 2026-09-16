import { create } from "zustand";
import { supabase } from "@/lib/supabaseClient";
import { User, Session, AuthChangeEvent } from "@supabase/supabase-js";
import { useGameStore } from "./useGameStore";
import { ACHIEVEMENTS, getAchievementRewardCoins } from "@/data/achievements";

interface AuthState {
  user: User | null;
  session: Session | null;
  username: string | null;
  avatarUrl: string | null;
  selectedTitle: string | null;
  loading: boolean;
  
  initialize: () => Promise<void>;
  signUp: (email: string, password: string, username: string, keepCoins?: boolean) => Promise<{ error: any; needsEmailConfirmation?: boolean }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  uploadAvatar: (file: File) => Promise<{ error: any; url?: string }>;
  resendConfirmationEmail: (email: string) => Promise<{ error: any }>;
  resetPassword: (emailOrUsername: string) => Promise<{ error: any }>;
  updatePassword: (newPassword: string) => Promise<{ error: any }>;
  signInWithMagicLink: (email: string) => Promise<{ error: any }>;
  updateEmailAddress: (newEmail: string) => Promise<{ error: any }>;
  reauthenticateUser: (currentPassword?: string) => Promise<{ error: any }>;
}

function getDerivedUsername(profileUsername?: string | null, user?: User | null): string | null {
  if (profileUsername && profileUsername.trim()) return profileUsername.trim();
  if (user?.user_metadata?.username && String(user.user_metadata.username).trim()) {
    return String(user.user_metadata.username).trim();
  }
  if (user?.email) return user.email.split("@")[0];
  return null;
}

async function applyPendingSignupCoinsIfNeeded(userId: string) {
  if (typeof window === "undefined") return;
  const pending = localStorage.getItem("pending_signup_coins");
  if (pending !== null) {
    const runCoinsToSave = Math.max(0, Number(pending) || 0);
    localStorage.removeItem("pending_signup_coins");
    localStorage.removeItem("guest_coins_cache");

    // Award achievement reward coins for all achievements unlocked while playing as guest
    let achievementBonusCoins = 0;
    try {
      const unlockedMapStr = localStorage.getItem("unlockedAchievementsMap") || "{}";
      const unlockedMap: Record<string, string> = JSON.parse(unlockedMapStr);
      for (const achId of Object.keys(unlockedMap)) {
        const ach = ACHIEVEMENTS.find((a) => a.id === achId);
        if (ach) {
          achievementBonusCoins += getAchievementRewardCoins(ach);
        }
      }
    } catch (e) {
      console.error("Error calculating achievement bonus coins for new user:", e);
    }

    const totalCoinsToSave = runCoinsToSave + achievementBonusCoins;

    useGameStore.setState({ totalCoins: totalCoinsToSave, sessionCoins: totalCoinsToSave });
    if (typeof window !== "undefined") {
      localStorage.setItem("totalCoins", String(totalCoinsToSave));
    }

    try {
      await supabase.from("profiles").upsert({
        id: userId,
        total_coins: totalCoinsToSave,
        updated_at: new Date(),
      });
    } catch (e) {
      console.error("Error applying pending signup coins to DB:", e);
    }
  }
}

export const DEFAULT_SHINOBI_TITLE = "Novizio di Konoha 🍃";

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  username: null,
  avatarUrl: null,
  selectedTitle: null,
  loading: true,

  initialize: async () => {
    set({ loading: true });
    
    // Get initial session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      await applyPendingSignupCoinsIfNeeded(session.user.id);

      // Fetch profile username, avatarUrl, selected_title
      const { data: profile } = await supabase
        .from("profiles")
        .select("username, avatar_url, selected_title")
        .eq("id", session.user.id)
        .single();

      const derivedUsername = getDerivedUsername(profile?.username, session.user);
        
      set({ 
        session, 
        user: session.user, 
        username: derivedUsername,
        avatarUrl: profile?.avatar_url || null,
        selectedTitle: profile?.selected_title || DEFAULT_SHINOBI_TITLE,
      });
      
      // Load cloud save
      await useGameStore.getState().loadCloudSave();
    } else {
      // Load guest save from localStorage
      useGameStore.getState().loadGuestRunFromLocalStorage();
    }
    
    // Listen for auth changes
    supabase.auth.onAuthStateChange(async (_event: AuthChangeEvent, session: Session | null) => {
      if (session) {
        await applyPendingSignupCoinsIfNeeded(session.user.id);

        const { data: profile } = await supabase
          .from("profiles")
          .select("username, avatar_url, selected_title")
          .eq("id", session.user.id)
          .single();

        const derivedUsername = getDerivedUsername(profile?.username, session.user);
          
        set({ 
          session, 
          user: session.user, 
          username: derivedUsername,
          avatarUrl: profile?.avatar_url || null,
          selectedTitle: profile?.selected_title || DEFAULT_SHINOBI_TITLE,
          loading: false 
        });
        
        await useGameStore.getState().loadCloudSave();
      } else {
        set({ session: null, user: null, username: null, avatarUrl: null, selectedTitle: null, loading: false });
        useGameStore.getState().clearLocalSave();
      }
    });

    set({ loading: false });
  },

  signUp: async (email, password, username, keepCoins = true) => {
    set({ loading: true });
    const redirectUrl = typeof window !== "undefined" ? window.location.href.split("#")[0] : undefined;

    const guestCoinsCache = typeof window !== "undefined" ? Number(localStorage.getItem("guest_coins_cache") || "0") : 0;
    const initialCoins = keepCoins ? Math.max(0, guestCoinsCache) : 0;

    if (typeof window !== "undefined") {
      localStorage.setItem("pending_signup_coins", String(initialCoins));
      localStorage.removeItem("guest_coins_cache");
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: { username },
      },
    });

    if (error) {
      set({ loading: false });
      return { error };
    }

    if (data.user) {
      if (data.session) {
        set({ session: data.session, user: data.user, username, selectedTitle: DEFAULT_SHINOBI_TITLE, loading: false });

        await supabase.from("profiles").upsert({
          id: data.user.id,
          username,
          selected_title: DEFAULT_SHINOBI_TITLE,
          max_level_reached: 1,
          total_coins: initialCoins,
          updated_at: new Date(),
        });

        await applyPendingSignupCoinsIfNeeded(data.user.id);

        await supabase.from("game_saves").upsert({
          id: data.user.id,
          updated_at: new Date(),
        });

        await useGameStore.getState().saveToCloud();
      } else {
        set({ loading: false });
      }
    }

    return { error: null, needsEmailConfirmation: !data.session };
  },

  resendConfirmationEmail: async (email: string) => {
    const redirectUrl = typeof window !== "undefined" ? window.location.href.split("#")[0] : undefined;
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: {
        emailRedirectTo: redirectUrl,
      },
    });
    return { error };
  },

  signIn: async (identifier, password) => {
    set({ loading: true });
    let emailToUse = identifier.trim();

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
      if (typeof window !== "undefined") {
        localStorage.removeItem("guest_coins_cache");
        localStorage.removeItem("pending_signup_coins");
        localStorage.removeItem("narutolike_guest_run_save");
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("username, avatar_url, selected_title")
        .eq("id", data.session.user.id)
        .single();

      const derivedUsername = getDerivedUsername(profile?.username, data.session.user);

      set({ 
        session: data.session, 
        user: data.session.user, 
        username: derivedUsername,
        avatarUrl: profile?.avatar_url || null,
        selectedTitle: profile?.selected_title || DEFAULT_SHINOBI_TITLE,
        loading: false 
      });
      
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

  resetPassword: async (emailOrUsername: string) => {
    set({ loading: true });
    let emailToUse = emailOrUsername.trim();

    // If input is not a direct email format, attempt to resolve via RPC
    if (!emailToUse.includes("@")) {
      const { data: resolvedEmail, error: rpcError } = await supabase.rpc("get_user_email_by_username", {
        p_username: emailToUse,
      });

      if (rpcError || !resolvedEmail) {
        set({ loading: false });
        return { error: { message: "Nome utente o email non trovati" } };
      }

      emailToUse = resolvedEmail;
    }

    const redirectUrl = typeof window !== "undefined" ? `${window.location.origin}/?resetPassword=true` : undefined;

    const { error } = await supabase.auth.resetPasswordForEmail(emailToUse, {
      redirectTo: redirectUrl,
    });

    set({ loading: false });
    return { error };
  },

  updatePassword: async (newPassword: string) => {
    set({ loading: true });
    const { error } = await supabase.auth.updateUser({
      password: newPassword.trim(),
    });
    set({ loading: false });
    return { error };
  },

  signInWithMagicLink: async (email: string) => {
    set({ loading: true });
    const redirectUrl = typeof window !== "undefined" ? `${window.location.origin}/?signup=true` : undefined;
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: redirectUrl,
      },
    });
    set({ loading: false });
    return { error };
  },

  updateEmailAddress: async (newEmail: string) => {
    set({ loading: true });
    const redirectUrl = typeof window !== "undefined" ? `${window.location.origin}` : undefined;
    const { error } = await supabase.auth.updateUser({
      email: newEmail.trim(),
    }, {
      emailRedirectTo: redirectUrl,
    });
    set({ loading: false });
    return { error };
  },

  reauthenticateUser: async (currentPassword?: string) => {
    set({ loading: true });
    const { user } = get();
    if (!user || !user.email) {
      set({ loading: false });
      return { error: { message: "Utente non autenticato" } };
    }

    if (currentPassword) {
      // Reauthenticate via password verification
      const { error } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });
      set({ loading: false });
      return { error };
    } else {
      // Reauthenticate via security OTP/magic link email
      const { error } = await supabase.auth.reauthenticate();
      set({ loading: false });
      return { error };
    }
  },
}));

// context/AuthContext.tsx
// ─────────────────────────────────────────────────────────────────────────────
// AuthContext — shares auth state (session, user) across the entire Acator app.
//
// Pattern:
//   1. AuthProvider wraps the entire app in app/_layout.tsx
//   2. Any screen calls useAuth() to read session/user or call signIn/signUp/signOut
//   3. The session state is the single source of truth — set by Supabase's listener
//
// Folder: context/AuthContext.tsx  (create a /context folder at the project root)
// ─────────────────────────────────────────────────────────────────────────────

import type { Session, User } from "@supabase/supabase-js";
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

// ── Types ─────────────────────────────────────────────────────────────────────

type AuthContextType = {
  session: Session | null; // null = not signed in
  user: User | null; // shortcut for session?.user
  isLoading: boolean; // true while Supabase loads the session from storage
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

// ── Context ───────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | null>(null);

// ── Provider ──────────────────────────────────────────────────────────────────

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true); // true until we know if a session exists

  useEffect(() => {
    // 1. Load any existing session from AsyncStorage (set by a previous sign-in).
    //    This is how "stay logged in" works — we check storage before showing any screen.
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        setSession(session);
      })
      .catch(() => {
        setSession(null);
      })
      .finally(() => {
        setIsLoading(false);
      });

    // 2. Subscribe to all future auth state changes:
    //    SIGNED_IN, SIGNED_OUT, TOKEN_REFRESHED, PASSWORD_RECOVERY, etc.
    //    This is the single place that updates session state — no manual state
    //    management needed after signIn() or signOut() calls.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // Clean up the subscription when the provider unmounts
    return () => subscription.unsubscribe();
  }, []);

  // ── Auth functions ────────────────────────────────────────────────────────

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    // On success: onAuthStateChange fires → session updates → AuthGuard redirects to /(tabs)
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    // If "Confirm email" is ON in Supabase → user gets a verification email first.
    // If OFF (dev mode) → session is set immediately on sign-up.
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    // On success: onAuthStateChange fires with session = null → AuthGuard redirects to /(auth)
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        isLoading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ── Hook ──────────────────────────────────────────────────────────────────────

// useAuth() — call this from any screen to read auth state or trigger auth actions.
// Throws if called outside <AuthProvider> — a hard error is better than a silent null.
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be called inside <AuthProvider>");
  }
  return context;
};

// store/auth.ts
// ─────────────────────────────────────────────────────────────────────────────
// Auth utility helpers — complements AuthContext.tsx.
//
// AuthContext owns: session state, signIn, signUp, signOut, isLoading.
// This file owns: one-off Supabase auth calls that don't need to live in context
// (password reset, profile updates, password change, resend verification).
// ─────────────────────────────────────────────────────────────────────────────

import { supabase } from "../lib/supabase";

// ── Password reset ────────────────────────────────────────────────────────────

/**
 * Sends a password reset email to the given address.
 * Used by ForgotPasswordScreen.
 */
export async function sendPasswordReset(email: string): Promise<void> {
  const { error } = await supabase.auth.resetPasswordForEmail(
    email.trim().toLowerCase(),
    { redirectTo: "acator://reset-password" },
  );
  if (error) throw error;
}

// ── Profile update ────────────────────────────────────────────────────────────

/**
 * Updates the authenticated user's metadata (e.g. full_name, avatar_url).
 * Pass only the fields you want to change.
 */
export async function updateUserProfile(data: {
  full_name?: string;
  avatar_url?: string;
}): Promise<void> {
  const { error } = await supabase.auth.updateUser({ data });
  if (error) throw error;
}

// ── Password change ───────────────────────────────────────────────────────────

/**
 * Updates the authenticated user's password.
 * User must already be signed in (e.g. after clicking a reset link).
 */
export async function updatePassword(newPassword: string): Promise<void> {
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) throw error;
}

// ── Resend verification email ─────────────────────────────────────────────────

/**
 * Resends the signup confirmation email.
 * Used by VerifyEmailScreen.
 */
export async function resendVerificationEmail(email: string): Promise<void> {
  const { error } = await supabase.auth.resend({
    type: "signup",
    email: email.trim().toLowerCase(),
  });
  if (error) throw error;
}

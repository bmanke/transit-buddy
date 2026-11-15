// src/lib/auth.ts
import { supabase } from './supabaseClient'

export async function sendMagicLink(
  email: string,
  redirectTo: string = window.location.origin,
) {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: redirectTo,
      shouldCreateUser: true, // false = don't auto-register new users
    },
  })
  return { ok: !error, error: error?.message ?? null }
}
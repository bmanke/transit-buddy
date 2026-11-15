// src/lib/auth.ts
import { supabase } from './supabaseClient'

export async function sendMagicLink(email: string) {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: window.location.origin,
      shouldCreateUser: true, // false = don't auto-register new users
    },
  })
  return { ok: !error, error: error?.message ?? null }
}
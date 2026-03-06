import type { SupabaseClient } from '@supabase/supabase-js'

export async function signIn(
  supabase: SupabaseClient,
  email: string,
  password: string
) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  return { data, error }
}

export async function signUp(
  supabase: SupabaseClient,
  email: string,
  password: string,
  metadata: { full_name: string; role: string },
  redirectTo?: string
) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
      emailRedirectTo: redirectTo,
    },
  })
  return { data, error }
}

export async function signOut(supabase: SupabaseClient) {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export async function exchangeCodeForSession(supabase: SupabaseClient, code: string) {
  const { error } = await supabase.auth.exchangeCodeForSession(code)
  return { error }
}

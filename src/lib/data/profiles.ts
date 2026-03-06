import type { SupabaseClient } from '@supabase/supabase-js'

export async function getCurrentUser(supabase: SupabaseClient) {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function getProfile(supabase: SupabaseClient, userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  return { data, error }
}

export async function updateProfile(
  supabase: SupabaseClient,
  userId: string,
  updates: { full_name: string; phone: string; location: string; bio: string }
) {
  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
  return { error }
}

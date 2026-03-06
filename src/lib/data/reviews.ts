import type { SupabaseClient } from '@supabase/supabase-js'

export async function getTradesReviews(supabase: SupabaseClient, tradespersonId: string) {
  const { data, error } = await supabase
    .from('reviews')
    .select('*, reviewer:profiles!reviewer_id(full_name, avatar_url)')
    .eq('tradesperson_id', tradespersonId)
    .order('created_at', { ascending: false })
    .limit(10)

  return { data, error }
}

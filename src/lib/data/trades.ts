import type { SupabaseClient } from '@supabase/supabase-js'

export async function searchTradespeople(
  supabase: SupabaseClient,
  filters: { category?: string; q?: string; sort?: string }
) {
  let query = supabase
    .from('trades_profiles')
    .select('*, profiles!inner(*)')

  if (filters.category && filters.category !== 'all') {
    query = query.eq('trade_category', filters.category)
  }

  if (filters.q) {
    query = query.or(
      `profiles.full_name.ilike.%${filters.q}%,profiles.location.ilike.%${filters.q}%,profiles.bio.ilike.%${filters.q}%`
    )
  }

  if (filters.sort === 'price-low') {
    query = query.order('hourly_rate', { ascending: true })
  } else if (filters.sort === 'price-high') {
    query = query.order('hourly_rate', { ascending: false })
  } else {
    query = query.order('rating', { ascending: false })
  }

  const { data, error } = await query.limit(20)
  return { data, error }
}

export async function getTradesProfile(supabase: SupabaseClient, id: string) {
  const { data, error } = await supabase
    .from('trades_profiles')
    .select('*, profiles!inner(*)')
    .eq('id', id)
    .single()
  return { data, error }
}

export async function upsertTradesProfile(
  supabase: SupabaseClient,
  userId: string,
  data: {
    trade_category: string
    experience_years: number
    hourly_rate: number | null
    service_radius_miles: number
    skills: string[]
    availability_status: string
  },
  isUpdate: boolean
) {
  const payload = { id: userId, ...data }
  if (isUpdate) {
    const { error } = await supabase
      .from('trades_profiles')
      .update(payload)
      .eq('id', userId)
    return { error }
  } else {
    const { error } = await supabase
      .from('trades_profiles')
      .insert(payload)
    return { error }
  }
}

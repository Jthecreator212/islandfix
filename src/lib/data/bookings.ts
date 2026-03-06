import type { SupabaseClient } from '@supabase/supabase-js'

export async function getUserBookings(
  supabase: SupabaseClient,
  userId: string,
  role: 'homeowner' | 'tradesperson'
) {
  const field = role === 'homeowner' ? 'homeowner_id' : 'tradesperson_id'

  const { data, error } = await supabase
    .from('bookings')
    .select('*, homeowner:profiles!homeowner_id(full_name), tradesperson:profiles!tradesperson_id(full_name)')
    .eq(field, userId)
    .order('created_at', { ascending: false })
    .limit(10)

  return { data, error }
}

export async function getBookingDetail(supabase: SupabaseClient, bookingId: string) {
  const { data, error } = await supabase
    .from('bookings')
    .select('*, homeowner:profiles!homeowner_id(full_name, email), tradesperson:profiles!tradesperson_id(full_name, email)')
    .eq('id', bookingId)
    .single()

  return { data, error }
}

export async function createBooking(
  supabase: SupabaseClient,
  booking: {
    homeowner_id: string
    tradesperson_id: string
    title: string
    description: string
    proposed_date: string | null
    location: string
    budget: number | null
  }
) {
  const { data, error } = await supabase
    .from('bookings')
    .insert(booking)
    .select()
    .single()

  return { data, error }
}

export async function updateBookingStatus(
  supabase: SupabaseClient,
  bookingId: string,
  status: string
) {
  const { error } = await supabase
    .from('bookings')
    .update({ status })
    .eq('id', bookingId)

  return { error }
}

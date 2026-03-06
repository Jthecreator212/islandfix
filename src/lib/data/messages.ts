import type { SupabaseClient } from '@supabase/supabase-js'

export async function getBookingMessages(supabase: SupabaseClient, bookingId: string) {
  const { data, error } = await supabase
    .from('messages')
    .select('*, sender:profiles!sender_id(full_name)')
    .eq('booking_id', bookingId)
    .order('created_at', { ascending: true })

  return { data, error }
}

export async function sendMessage(
  supabase: SupabaseClient,
  message: { booking_id: string; sender_id: string; content: string }
) {
  const { data, error } = await supabase
    .from('messages')
    .insert(message)
    .select()
    .single()

  return { data, error }
}

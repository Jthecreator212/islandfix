import { describe, it, expect } from 'vitest'
import { createMockSupabase } from './mock-supabase'
import { getBookingMessages, sendMessage } from '../messages'
import type { SupabaseClient } from '@supabase/supabase-js'

describe('messages', () => {
  describe('getBookingMessages', () => {
    it('fetches messages for a booking ordered by creation time', async () => {
      const msgs = [
        { id: 'm1', booking_id: 'b1', sender_id: 's1', content: 'Hello', created_at: '2026-01-01', sender: { full_name: 'John' } },
        { id: 'm2', booking_id: 'b1', sender_id: 's2', content: 'Hi!', created_at: '2026-01-02', sender: { full_name: 'Mike' } },
      ]
      const mock = createMockSupabase()
      mock._chain.order.mockResolvedValue({ data: msgs, error: null })

      const { data } = await getBookingMessages(mock as unknown as SupabaseClient, 'b1')

      expect(mock.from).toHaveBeenCalledWith('messages')
      expect(mock._chain.eq).toHaveBeenCalledWith('booking_id', 'b1')
      expect(mock._chain.order).toHaveBeenCalledWith('created_at', { ascending: true })
      expect(data).toHaveLength(2)
    })

    it('returns empty array for booking with no messages', async () => {
      const mock = createMockSupabase()
      mock._chain.order.mockResolvedValue({ data: [], error: null })

      const { data } = await getBookingMessages(mock as unknown as SupabaseClient, 'b-empty')
      expect(data).toEqual([])
    })
  })

  describe('sendMessage', () => {
    it('inserts a new message', async () => {
      const newMsg = { booking_id: 'b1', sender_id: 's1', content: 'New message' }
      const mock = createMockSupabase()
      mock._chain.single.mockResolvedValue({ data: { id: 'm-new', ...newMsg, created_at: '2026-01-03' }, error: null })

      const { data, error } = await sendMessage(mock as unknown as SupabaseClient, newMsg)

      expect(mock.from).toHaveBeenCalledWith('messages')
      expect(mock._chain.insert).toHaveBeenCalledWith(newMsg)
      expect(error).toBeNull()
      expect(data?.content).toBe('New message')
    })

    it('returns error for unauthorized sender', async () => {
      const mock = createMockSupabase()
      mock._chain.single.mockResolvedValue({ data: null, error: { message: 'new row violates RLS policy' } })

      const { error } = await sendMessage(mock as unknown as SupabaseClient, {
        booking_id: 'b1',
        sender_id: 'unauthorized',
        content: 'Spam',
      })

      expect(error).toBeTruthy()
    })
  })
})

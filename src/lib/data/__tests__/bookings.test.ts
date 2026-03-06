import { describe, it, expect } from 'vitest'
import { createMockSupabase } from './mock-supabase'
import { getUserBookings, getBookingDetail, createBooking, updateBookingStatus } from '../bookings'
import type { SupabaseClient } from '@supabase/supabase-js'

describe('bookings', () => {
  describe('getUserBookings', () => {
    it('fetches homeowner bookings by homeowner_id', async () => {
      const bookingsData = [
        { id: 'b1', title: 'Fix pipe', status: 'pending', homeowner: { full_name: 'John' }, tradesperson: { full_name: 'Mike' } },
      ]
      const mock = createMockSupabase()
      mock._chain.limit.mockResolvedValue({ data: bookingsData, error: null })

      const { data } = await getUserBookings(mock as unknown as SupabaseClient, 'user-1', 'homeowner')

      expect(mock.from).toHaveBeenCalledWith('bookings')
      expect(mock._chain.eq).toHaveBeenCalledWith('homeowner_id', 'user-1')
      expect(data).toEqual(bookingsData)
    })

    it('fetches tradesperson bookings by tradesperson_id', async () => {
      const mock = createMockSupabase()
      mock._chain.limit.mockResolvedValue({ data: [], error: null })

      await getUserBookings(mock as unknown as SupabaseClient, 'user-2', 'tradesperson')

      expect(mock._chain.eq).toHaveBeenCalledWith('tradesperson_id', 'user-2')
    })
  })

  describe('getBookingDetail', () => {
    it('fetches single booking with participant details', async () => {
      const booking = {
        id: 'b1',
        title: 'Fix pipe',
        status: 'pending',
        homeowner_id: 'h1',
        tradesperson_id: 't1',
        homeowner: { full_name: 'John', email: 'john@test.com' },
        tradesperson: { full_name: 'Mike', email: 'mike@test.com' },
      }
      const mock = createMockSupabase()
      mock._chain.single.mockResolvedValue({ data: booking, error: null })

      const { data } = await getBookingDetail(mock as unknown as SupabaseClient, 'b1')

      expect(mock.from).toHaveBeenCalledWith('bookings')
      expect(mock._chain.eq).toHaveBeenCalledWith('id', 'b1')
      expect(data).toEqual(booking)
    })
  })

  describe('createBooking', () => {
    it('inserts a new booking', async () => {
      const newBooking = {
        homeowner_id: 'h1',
        tradesperson_id: 't1',
        title: 'Fix leaking pipe',
        description: 'Kitchen sink leaking',
        proposed_date: '2026-04-01',
        location: 'Kingston, Jamaica',
        budget: 150,
      }
      const mock = createMockSupabase()
      mock._chain.single.mockResolvedValue({ data: { id: 'b-new', ...newBooking, status: 'pending' }, error: null })

      const { data, error } = await createBooking(mock as unknown as SupabaseClient, newBooking)

      expect(mock.from).toHaveBeenCalledWith('bookings')
      expect(mock._chain.insert).toHaveBeenCalledWith(newBooking)
      expect(error).toBeNull()
      expect(data?.status).toBe('pending')
    })

    it('returns error for missing required fields', async () => {
      const mock = createMockSupabase()
      mock._chain.single.mockResolvedValue({ data: null, error: { message: 'null value in column "title"' } })

      const { error } = await createBooking(mock as unknown as SupabaseClient, {
        homeowner_id: 'h1',
        tradesperson_id: 't1',
        title: '',
        description: '',
        proposed_date: null,
        location: '',
        budget: null,
      })

      expect(error).toBeTruthy()
    })
  })

  describe('updateBookingStatus', () => {
    it('updates booking status to accepted', async () => {
      const mock = createMockSupabase()
      mock._chain.eq.mockResolvedValue({ error: null })

      const { error } = await updateBookingStatus(mock as unknown as SupabaseClient, 'b1', 'accepted')

      expect(mock.from).toHaveBeenCalledWith('bookings')
      expect(mock._chain.update).toHaveBeenCalledWith({ status: 'accepted' })
      expect(mock._chain.eq).toHaveBeenCalledWith('id', 'b1')
      expect(error).toBeNull()
    })

    it('handles all status transitions', async () => {
      const statuses = ['accepted', 'in_progress', 'completed', 'cancelled']
      for (const status of statuses) {
        const mock = createMockSupabase()
        mock._chain.eq.mockResolvedValue({ error: null })

        const { error } = await updateBookingStatus(mock as unknown as SupabaseClient, 'b1', status)
        expect(mock._chain.update).toHaveBeenCalledWith({ status })
        expect(error).toBeNull()
      }
    })
  })
})

import { describe, it, expect } from 'vitest'
import { createMockSupabase } from './mock-supabase'
import { searchTradespeople, getTradesProfile, upsertTradesProfile } from '../trades'
import type { SupabaseClient } from '@supabase/supabase-js'

describe('trades', () => {
  describe('searchTradespeople', () => {
    it('fetches all tradespeople with no filters', async () => {
      const tradespeople = [
        { id: 't1', trade_category: 'plumbing', rating: 4.5, profiles: { full_name: 'Mike' } },
      ]
      const mock = createMockSupabase()
      mock._chain.limit.mockResolvedValue({ data: tradespeople, error: null })

      const { data } = await searchTradespeople(mock as unknown as SupabaseClient, {})

      expect(mock.from).toHaveBeenCalledWith('trades_profiles')
      expect(mock._chain.select).toHaveBeenCalledWith('*, profiles!inner(*)')
      expect(mock._chain.order).toHaveBeenCalledWith('rating', { ascending: false })
      expect(data).toEqual(tradespeople)
    })

    it('filters by category', async () => {
      const mock = createMockSupabase()
      mock._chain.limit.mockResolvedValue({ data: [], error: null })

      await searchTradespeople(mock as unknown as SupabaseClient, { category: 'plumbing' })

      expect(mock._chain.eq).toHaveBeenCalledWith('trade_category', 'plumbing')
    })

    it('skips category filter for "all"', async () => {
      const mock = createMockSupabase()
      mock._chain.limit.mockResolvedValue({ data: [], error: null })

      await searchTradespeople(mock as unknown as SupabaseClient, { category: 'all' })

      expect(mock._chain.eq).not.toHaveBeenCalled()
    })

    it('applies search query', async () => {
      const mock = createMockSupabase()
      mock._chain.limit.mockResolvedValue({ data: [], error: null })

      await searchTradespeople(mock as unknown as SupabaseClient, { q: 'Kingston' })

      expect(mock._chain.or).toHaveBeenCalledWith(
        expect.stringContaining('Kingston')
      )
    })

    it('sorts by price low to high', async () => {
      const mock = createMockSupabase()
      mock._chain.limit.mockResolvedValue({ data: [], error: null })

      await searchTradespeople(mock as unknown as SupabaseClient, { sort: 'price-low' })

      expect(mock._chain.order).toHaveBeenCalledWith('hourly_rate', { ascending: true })
    })

    it('sorts by price high to low', async () => {
      const mock = createMockSupabase()
      mock._chain.limit.mockResolvedValue({ data: [], error: null })

      await searchTradespeople(mock as unknown as SupabaseClient, { sort: 'price-high' })

      expect(mock._chain.order).toHaveBeenCalledWith('hourly_rate', { ascending: false })
    })
  })

  describe('getTradesProfile', () => {
    it('fetches a single trades profile with joined profile data', async () => {
      const tp = { id: 't1', trade_category: 'electrical', rating: 4.8, profiles: { full_name: 'Jane' } }
      const mock = createMockSupabase()
      mock._chain.single.mockResolvedValue({ data: tp, error: null })

      const { data } = await getTradesProfile(mock as unknown as SupabaseClient, 't1')

      expect(mock.from).toHaveBeenCalledWith('trades_profiles')
      expect(mock._chain.eq).toHaveBeenCalledWith('id', 't1')
      expect(data).toEqual(tp)
    })

    it('returns null for non-existent tradesperson', async () => {
      const mock = createMockSupabase()
      mock._chain.single.mockResolvedValue({ data: null, error: { message: 'Not found' } })

      const { data } = await getTradesProfile(mock as unknown as SupabaseClient, 'fake-id')
      expect(data).toBeNull()
    })
  })

  describe('upsertTradesProfile', () => {
    const tradesData = {
      trade_category: 'plumbing',
      experience_years: 5,
      hourly_rate: 50,
      service_radius_miles: 30,
      skills: ['Pipe fitting', 'Drain repair'],
      availability_status: 'available',
    }

    it('updates existing trades profile', async () => {
      const mock = createMockSupabase()
      mock._chain.eq.mockResolvedValue({ error: null })

      const { error } = await upsertTradesProfile(mock as unknown as SupabaseClient, 'user-1', tradesData, true)

      expect(mock.from).toHaveBeenCalledWith('trades_profiles')
      expect(mock._chain.update).toHaveBeenCalledWith({ id: 'user-1', ...tradesData })
      expect(error).toBeNull()
    })

    it('inserts new trades profile', async () => {
      const mock = createMockSupabase()
      mock._chain.insert.mockResolvedValue({ error: null })

      const { error } = await upsertTradesProfile(mock as unknown as SupabaseClient, 'user-2', tradesData, false)

      expect(mock.from).toHaveBeenCalledWith('trades_profiles')
      expect(mock._chain.insert).toHaveBeenCalledWith({ id: 'user-2', ...tradesData })
      expect(error).toBeNull()
    })
  })
})

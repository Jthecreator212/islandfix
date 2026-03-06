import { describe, it, expect } from 'vitest'
import { createMockSupabase } from './mock-supabase'
import { getTradesReviews } from '../reviews'
import type { SupabaseClient } from '@supabase/supabase-js'

describe('reviews', () => {
  describe('getTradesReviews', () => {
    it('fetches reviews for a tradesperson', async () => {
      const reviews = [
        { id: 'r1', rating: 5, comment: 'Great work!', reviewer: { full_name: 'John', avatar_url: null } },
        { id: 'r2', rating: 4, comment: 'Good job', reviewer: { full_name: 'Jane', avatar_url: null } },
      ]
      const mock = createMockSupabase()
      mock._chain.limit.mockResolvedValue({ data: reviews, error: null })

      const { data } = await getTradesReviews(mock as unknown as SupabaseClient, 't1')

      expect(mock.from).toHaveBeenCalledWith('reviews')
      expect(mock._chain.eq).toHaveBeenCalledWith('tradesperson_id', 't1')
      expect(mock._chain.order).toHaveBeenCalledWith('created_at', { ascending: false })
      expect(mock._chain.limit).toHaveBeenCalledWith(10)
      expect(data).toHaveLength(2)
    })

    it('returns empty for tradesperson with no reviews', async () => {
      const mock = createMockSupabase()
      mock._chain.limit.mockResolvedValue({ data: [], error: null })

      const { data } = await getTradesReviews(mock as unknown as SupabaseClient, 't-new')
      expect(data).toEqual([])
    })
  })
})

import { describe, it, expect } from 'vitest'
import { createMockSupabase } from './mock-supabase'
import { getCurrentUser, getProfile, updateProfile } from '../profiles'
import type { SupabaseClient } from '@supabase/supabase-js'

describe('profiles', () => {
  describe('getCurrentUser', () => {
    it('returns user when authenticated', async () => {
      const mock = createMockSupabase()
      mock.auth.getUser.mockResolvedValue({ data: { user: { id: 'user-1', email: 'test@test.com' } } })

      const user = await getCurrentUser(mock as unknown as SupabaseClient)
      expect(user).toEqual({ id: 'user-1', email: 'test@test.com' })
    })

    it('returns null when not authenticated', async () => {
      const mock = createMockSupabase()
      mock.auth.getUser.mockResolvedValue({ data: { user: null } })

      const user = await getCurrentUser(mock as unknown as SupabaseClient)
      expect(user).toBeNull()
    })
  })

  describe('getProfile', () => {
    it('fetches profile by user id', async () => {
      const profileData = { id: 'user-1', full_name: 'John', role: 'homeowner', email: 'john@test.com' }
      const mock = createMockSupabase()
      mock._chain.single.mockResolvedValue({ data: profileData, error: null })

      const { data } = await getProfile(mock as unknown as SupabaseClient, 'user-1')

      expect(mock.from).toHaveBeenCalledWith('profiles')
      expect(mock._chain.select).toHaveBeenCalledWith('*')
      expect(mock._chain.eq).toHaveBeenCalledWith('id', 'user-1')
      expect(data).toEqual(profileData)
    })

    it('returns error for non-existent profile', async () => {
      const mock = createMockSupabase()
      mock._chain.single.mockResolvedValue({ data: null, error: { message: 'Not found' } })

      const { data, error } = await getProfile(mock as unknown as SupabaseClient, 'non-existent')
      expect(data).toBeNull()
      expect(error).toBeTruthy()
    })
  })

  describe('updateProfile', () => {
    it('updates profile fields', async () => {
      const mock = createMockSupabase()
      mock._chain.eq.mockResolvedValue({ error: null })

      const updates = { full_name: 'Jane Doe', phone: '555-1234', location: 'Kingston', bio: 'Hello' }
      const { error } = await updateProfile(mock as unknown as SupabaseClient, 'user-1', updates)

      expect(mock.from).toHaveBeenCalledWith('profiles')
      expect(mock._chain.update).toHaveBeenCalledWith(updates)
      expect(error).toBeNull()
    })
  })
})

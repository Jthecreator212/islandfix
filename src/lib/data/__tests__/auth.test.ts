import { describe, it, expect } from 'vitest'
import { createMockSupabase } from './mock-supabase'
import { signIn, signUp, signOut, exchangeCodeForSession } from '../auth'
import type { SupabaseClient } from '@supabase/supabase-js'

describe('auth', () => {
  describe('signIn', () => {
    it('calls signInWithPassword with email and password', async () => {
      const mock = createMockSupabase()
      mock.auth.signInWithPassword.mockResolvedValue({ data: { session: {} }, error: null })

      const result = await signIn(mock as unknown as SupabaseClient, 'test@test.com', 'password123')

      expect(mock.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@test.com',
        password: 'password123',
      })
      expect(result.error).toBeNull()
    })

    it('returns error on invalid credentials', async () => {
      const mock = createMockSupabase()
      mock.auth.signInWithPassword.mockResolvedValue({
        data: null,
        error: { message: 'Invalid login credentials' },
      })

      const result = await signIn(mock as unknown as SupabaseClient, 'bad@test.com', 'wrong')

      expect(result.error).toBeTruthy()
      expect(result.error!.message).toBe('Invalid login credentials')
    })
  })

  describe('signUp', () => {
    it('calls signUp with email, password, and metadata', async () => {
      const mock = createMockSupabase()
      mock.auth.signUp.mockResolvedValue({ data: { user: { id: '123' } }, error: null })

      const result = await signUp(
        mock as unknown as SupabaseClient,
        'new@test.com',
        'password123',
        { full_name: 'Test User', role: 'homeowner' }
      )

      expect(mock.auth.signUp).toHaveBeenCalledWith({
        email: 'new@test.com',
        password: 'password123',
        options: { data: { full_name: 'Test User', role: 'homeowner' } },
      })
      expect(result.error).toBeNull()
    })

    it('returns error for duplicate email', async () => {
      const mock = createMockSupabase()
      mock.auth.signUp.mockResolvedValue({
        data: null,
        error: { message: 'User already registered' },
      })

      const result = await signUp(
        mock as unknown as SupabaseClient,
        'existing@test.com',
        'pass123',
        { full_name: 'Test', role: 'homeowner' }
      )

      expect(result.error!.message).toBe('User already registered')
    })
  })

  describe('signOut', () => {
    it('calls auth.signOut', async () => {
      const mock = createMockSupabase()
      await signOut(mock as unknown as SupabaseClient)
      expect(mock.auth.signOut).toHaveBeenCalled()
    })
  })

  describe('exchangeCodeForSession', () => {
    it('exchanges code for session', async () => {
      const mock = createMockSupabase()
      const result = await exchangeCodeForSession(mock as unknown as SupabaseClient, 'auth-code-123')
      expect(mock.auth.exchangeCodeForSession).toHaveBeenCalledWith('auth-code-123')
      expect(result.error).toBeNull()
    })
  })
})

'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Mail, Lock, Loader2 } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="font-display font-bold text-2xl tracking-tight">
            Island<span className="text-[#4fc3f7]">Fix</span>
          </Link>
          <h1 className="font-display font-bold text-3xl mt-6">Welcome back</h1>
          <p className="text-[#4a5568] mt-2">Log in to your account</p>
        </div>

        <form onSubmit={handleLogin} className="bg-white rounded-2xl border border-[#c8d1dc] p-8 space-y-5">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl">{error}</div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4a5568]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#f0f4f8] border border-[#c8d1dc] rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-[#4fc3f7] transition-colors"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4a5568]" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#f0f4f8] border border-[#c8d1dc] rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-[#4fc3f7] transition-colors"
                placeholder="Your password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#4fc3f7] text-white font-semibold py-3 rounded-full hover:bg-[#81d4fa] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 size={18} className="animate-spin" />}
            Log In
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-[#4a5568]">
          Don't have an account?{' '}
          <Link href="/signup" className="text-[#4fc3f7] font-medium hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  )
}

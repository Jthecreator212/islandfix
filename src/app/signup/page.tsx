'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { signUp } from '@/lib/data/auth'
import Link from 'next/link'
import { Mail, Lock, User, Loader2, Home, Wrench } from 'lucide-react'

export default function SignupPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'homeowner' | 'tradesperson'>('homeowner')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await signUp(supabase, email, password, { full_name: fullName, role })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSuccess(true)
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="w-full max-w-md text-center">
          <div className="bg-white rounded-2xl border border-[#c8d1dc] p-10">
            <div className="w-16 h-16 bg-[#4fc3f7]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail size={28} className="text-[#4fc3f7]" />
            </div>
            <h2 className="font-display font-bold text-2xl">Check your email</h2>
            <p className="text-[#4a5568] mt-3 text-sm">
              We&apos;ve sent a confirmation link to <strong>{email}</strong>. Click the link to activate your account.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="font-display font-bold text-2xl tracking-tight">
            Island<span className="text-[#4fc3f7]">Fix</span>
          </Link>
          <h1 className="font-display font-bold text-3xl mt-6">Create your account</h1>
          <p className="text-[#4a5568] mt-2">Join the IslandFix community</p>
        </div>

        <form onSubmit={handleSignup} className="bg-white rounded-2xl border border-[#c8d1dc] p-8 space-y-5">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl">{error}</div>
          )}

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium mb-3">I am a...</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('homeowner')}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  role === 'homeowner'
                    ? 'border-[#4fc3f7] bg-[#4fc3f7]/5'
                    : 'border-[#c8d1dc] hover:border-[#4fc3f7]/50'
                }`}
              >
                <Home size={24} className={role === 'homeowner' ? 'text-[#4fc3f7]' : 'text-[#4a5568]'} />
                <span className="text-sm font-medium">Homeowner</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('tradesperson')}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  role === 'tradesperson'
                    ? 'border-[#4fc3f7] bg-[#4fc3f7]/5'
                    : 'border-[#c8d1dc] hover:border-[#4fc3f7]/50'
                }`}
              >
                <Wrench size={24} className={role === 'tradesperson' ? 'text-[#4fc3f7]' : 'text-[#4a5568]'} />
                <span className="text-sm font-medium">Tradesperson</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Full Name</label>
            <div className="relative">
              <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4a5568]" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-[#f0f4f8] border border-[#c8d1dc] rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-[#4fc3f7] transition-colors"
                placeholder="Your full name"
                required
              />
            </div>
          </div>

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
                placeholder="Min 6 characters"
                minLength={6}
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
            Create Account
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-[#4a5568]">
          Already have an account?{' '}
          <Link href="/login" className="text-[#4fc3f7] font-medium hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  )
}

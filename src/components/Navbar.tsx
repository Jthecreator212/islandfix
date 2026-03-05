'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, User, LogOut, LayoutDashboard } from 'lucide-react'

interface NavbarProps {
  user?: { email: string; full_name: string } | null
}

export default function Navbar({ user }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-[#c8d1dc]">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-display font-bold text-xl tracking-tight">
          Island<span className="text-[#4fc3f7]">Fix</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/search" className="text-sm text-[#4a5568] hover:text-[#1a1a2e] transition-colors">
            Find Trades
          </Link>
          <Link href="/#how-it-works" className="text-sm text-[#4a5568] hover:text-[#1a1a2e] transition-colors">
            How It Works
          </Link>
          <Link href="/#pricing" className="text-sm text-[#4a5568] hover:text-[#1a1a2e] transition-colors">
            Pricing
          </Link>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 text-sm font-medium"
              >
                <div className="w-8 h-8 rounded-full bg-[#4fc3f7] flex items-center justify-center text-white text-xs font-bold">
                  {user.full_name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                </div>
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-[#c8d1dc] py-2">
                  <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-[#f0f4f8]">
                    <LayoutDashboard size={16} /> Dashboard
                  </Link>
                  <Link href="/profile" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-[#f0f4f8]">
                    <User size={16} /> Profile
                  </Link>
                  <form action="/auth/signout" method="post">
                    <button className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-[#f0f4f8] w-full text-left text-red-500">
                      <LogOut size={16} /> Sign Out
                    </button>
                  </form>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-sm font-medium text-[#4a5568] hover:text-[#1a1a2e]">
                Log In
              </Link>
              <Link href="/signup" className="text-sm font-semibold bg-[#4fc3f7] text-white px-5 py-2.5 rounded-full hover:bg-[#81d4fa] transition-colors">
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-[#c8d1dc] px-6 py-6 space-y-4">
          <Link href="/search" className="block text-lg font-medium" onClick={() => setMobileOpen(false)}>Find Trades</Link>
          <Link href="/#how-it-works" className="block text-lg font-medium" onClick={() => setMobileOpen(false)}>How It Works</Link>
          <Link href="/#pricing" className="block text-lg font-medium" onClick={() => setMobileOpen(false)}>Pricing</Link>
          {user ? (
            <>
              <Link href="/dashboard" className="block text-lg font-medium" onClick={() => setMobileOpen(false)}>Dashboard</Link>
              <form action="/auth/signout" method="post">
                <button className="text-lg font-medium text-red-500">Sign Out</button>
              </form>
            </>
          ) : (
            <div className="flex flex-col gap-3 pt-4">
              <Link href="/login" className="text-center py-3 border border-[#c8d1dc] rounded-full font-medium">Log In</Link>
              <Link href="/signup" className="text-center py-3 bg-[#4fc3f7] text-white rounded-full font-semibold">Sign Up</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}

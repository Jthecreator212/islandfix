import { createClient } from '@/lib/supabase/server'
import { getCurrentUser, getProfile } from '@/lib/data/profiles'
import { getUserBookings } from '@/lib/data/bookings'
import { redirect } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  const user = await getCurrentUser(supabase)
  if (!user) redirect('/login')

  const { data: profile } = await getProfile(supabase, user.id)
  if (!profile) redirect('/login')

  const { data: bookings } = await getUserBookings(supabase, user.id, profile.role)

  const statusIcons: Record<string, { icon: React.ComponentType<{ size?: number }>; color: string }> = {
    pending: { icon: Clock, color: 'text-yellow-600 bg-yellow-50' },
    accepted: { icon: CheckCircle, color: 'text-blue-600 bg-blue-50' },
    in_progress: { icon: AlertCircle, color: 'text-purple-600 bg-purple-50' },
    completed: { icon: CheckCircle, color: 'text-green-600 bg-green-50' },
    cancelled: { icon: XCircle, color: 'text-red-600 bg-red-50' },
  }

  const pendingCount = bookings?.filter(b => b.status === 'pending').length || 0
  const activeCount = bookings?.filter(b => ['accepted', 'in_progress'].includes(b.status)).length || 0
  const completedCount = bookings?.filter(b => b.status === 'completed').length || 0

  return (
    <>
      <Navbar user={profile} />
      <main className="pt-24 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-display font-bold text-3xl">Dashboard</h1>
              <p className="text-[#4a5568] mt-1">Welcome back, {profile.full_name || 'there'}</p>
            </div>
            {profile.role === 'homeowner' && (
              <Link href="/search" className="bg-[#4fc3f7] text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-[#81d4fa] transition-colors">
                Find Tradespeople
              </Link>
            )}
            {profile.role === 'tradesperson' && (
              <Link href="/profile/edit" className="bg-[#4fc3f7] text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-[#81d4fa] transition-colors">
                Edit Profile
              </Link>
            )}
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl border border-[#c8d1dc] p-5">
              <div className="text-sm text-[#4a5568]">Total Bookings</div>
              <div className="font-display font-bold text-2xl mt-1">{bookings?.length || 0}</div>
            </div>
            <div className="bg-white rounded-xl border border-[#c8d1dc] p-5">
              <div className="text-sm text-[#4a5568]">Pending</div>
              <div className="font-display font-bold text-2xl mt-1 text-yellow-600">{pendingCount}</div>
            </div>
            <div className="bg-white rounded-xl border border-[#c8d1dc] p-5">
              <div className="text-sm text-[#4a5568]">Active</div>
              <div className="font-display font-bold text-2xl mt-1 text-blue-600">{activeCount}</div>
            </div>
            <div className="bg-white rounded-xl border border-[#c8d1dc] p-5">
              <div className="text-sm text-[#4a5568]">Completed</div>
              <div className="font-display font-bold text-2xl mt-1 text-green-600">{completedCount}</div>
            </div>
          </div>

          {/* Bookings List */}
          <h2 className="font-display font-bold text-xl mb-4">Your Bookings</h2>
          <div className="space-y-3">
            {bookings && bookings.length > 0 ? (
              bookings.map((booking: { id: string; title: string; status: string; created_at: string; homeowner: { full_name: string } | null; tradesperson: { full_name: string } | null }) => {
                const status = statusIcons[booking.status] || statusIcons.pending
                const StatusIcon = status.icon
                const otherPerson = profile.role === 'homeowner' ? booking.tradesperson : booking.homeowner

                return (
                  <Link key={booking.id} href={`/dashboard/booking/${booking.id}`} className="block">
                    <div className="bg-white rounded-xl border border-[#c8d1dc] p-5 hover:shadow-md hover:border-[#4fc3f7]/50 transition-all">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${status.color}`}>
                            <StatusIcon size={18} />
                          </div>
                          <div>
                            <h3 className="font-medium">{booking.title}</h3>
                            <p className="text-sm text-[#4a5568]">
                              {profile.role === 'homeowner' ? 'With' : 'From'}: {otherPerson?.full_name || 'Unknown'}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`text-xs font-medium px-3 py-1 rounded-full capitalize ${status.color}`}>
                            {booking.status.replace('_', ' ')}
                          </span>
                          <p className="text-xs text-[#4a5568] mt-1">
                            {new Date(booking.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })
            ) : (
              <div className="bg-white rounded-xl border border-[#c8d1dc] p-10 text-center">
                <Calendar size={40} className="text-[#c8d1dc] mx-auto mb-3" />
                <p className="text-[#4a5568]">No bookings yet</p>
                {profile.role === 'homeowner' && (
                  <Link href="/search" className="mt-3 inline-block text-[#4fc3f7] font-medium text-sm hover:underline">
                    Find a tradesperson →
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  )
}

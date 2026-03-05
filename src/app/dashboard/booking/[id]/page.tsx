import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Navbar from '@/components/Navbar'
import BookingMessages from '@/components/BookingMessages'
import BookingActions from '@/components/BookingActions'
import { Calendar, MapPin, DollarSign, Clock } from 'lucide-react'

export default async function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

  const { data: booking } = await supabase
    .from('bookings')
    .select('*, homeowner:profiles!homeowner_id(full_name, email), tradesperson:profiles!tradesperson_id(full_name, email)')
    .eq('id', id)
    .single()

  if (!booking) notFound()

  // Verify user is a participant
  if (booking.homeowner_id !== user.id && booking.tradesperson_id !== user.id) notFound()

  const { data: messages } = await supabase
    .from('messages')
    .select('*, sender:profiles!sender_id(full_name)')
    .eq('booking_id', id)
    .order('created_at', { ascending: true })

  const isHomeowner = booking.homeowner_id === user.id
  const otherPerson = isHomeowner ? booking.tradesperson : booking.homeowner

  return (
    <>
      <Navbar user={profile} />
      <main className="pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Booking Header */}
          <div className="bg-white rounded-2xl border border-[#c8d1dc] p-8">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <h1 className="font-display font-bold text-2xl">{booking.title}</h1>
                <p className="text-[#4a5568] mt-1">
                  {isHomeowner ? 'Tradesperson' : 'Homeowner'}: <strong>{otherPerson?.full_name}</strong>
                </p>
              </div>
              <span className={`text-sm font-medium px-4 py-1.5 rounded-full capitalize ${
                booking.status === 'pending' ? 'bg-yellow-50 text-yellow-700' :
                booking.status === 'accepted' ? 'bg-blue-50 text-blue-700' :
                booking.status === 'in_progress' ? 'bg-purple-50 text-purple-700' :
                booking.status === 'completed' ? 'bg-green-50 text-green-700' :
                'bg-red-50 text-red-700'
              }`}>
                {booking.status.replace('_', ' ')}
              </span>
            </div>

            {booking.description && (
              <p className="mt-4 text-[#4a5568]">{booking.description}</p>
            )}

            <div className="flex flex-wrap gap-6 mt-6 text-sm text-[#4a5568]">
              {booking.proposed_date && (
                <div className="flex items-center gap-2">
                  <Calendar size={16} /> {new Date(booking.proposed_date).toLocaleDateString()}
                </div>
              )}
              {booking.location && (
                <div className="flex items-center gap-2">
                  <MapPin size={16} /> {booking.location}
                </div>
              )}
              {booking.budget && (
                <div className="flex items-center gap-2">
                  <DollarSign size={16} /> ${booking.budget}
                </div>
              )}
              <div className="flex items-center gap-2">
                <Clock size={16} /> Created {new Date(booking.created_at).toLocaleDateString()}
              </div>
            </div>

            {/* Actions */}
            <BookingActions
              bookingId={booking.id}
              status={booking.status}
              isHomeowner={isHomeowner}
            />
          </div>

          {/* Messages */}
          <div className="mt-6">
            <h2 className="font-display font-bold text-xl mb-4">Messages</h2>
            <BookingMessages
              bookingId={booking.id}
              currentUserId={user.id}
              initialMessages={messages || []}
            />
          </div>
        </div>
      </main>
    </>
  )
}

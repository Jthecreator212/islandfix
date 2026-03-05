'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

interface Props {
  bookingId: string
  status: string
  isHomeowner: boolean
}

export default function BookingActions({ bookingId, status, isHomeowner }: Props) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const updateStatus = async (newStatus: string) => {
    setLoading(true)
    const supabase = createClient()
    await supabase.from('bookings').update({ status: newStatus }).eq('id', bookingId)
    router.refresh()
    setLoading(false)
  }

  if (loading) {
    return <div className="mt-6 flex items-center gap-2 text-[#4a5568]"><Loader2 size={16} className="animate-spin" /> Updating...</div>
  }

  return (
    <div className="mt-6 flex flex-wrap gap-3">
      {/* Tradesperson actions */}
      {!isHomeowner && status === 'pending' && (
        <>
          <button onClick={() => updateStatus('accepted')} className="bg-[#4fc3f7] text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-[#81d4fa] transition-colors">
            Accept Job
          </button>
          <button onClick={() => updateStatus('cancelled')} className="border border-red-300 text-red-600 px-5 py-2 rounded-full text-sm font-medium hover:bg-red-50 transition-colors">
            Decline
          </button>
        </>
      )}
      {!isHomeowner && status === 'accepted' && (
        <button onClick={() => updateStatus('in_progress')} className="bg-[#4fc3f7] text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-[#81d4fa] transition-colors">
          Start Work
        </button>
      )}
      {!isHomeowner && status === 'in_progress' && (
        <button onClick={() => updateStatus('completed')} className="bg-green-500 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-green-600 transition-colors">
          Mark Complete
        </button>
      )}

      {/* Homeowner actions */}
      {isHomeowner && status === 'pending' && (
        <button onClick={() => updateStatus('cancelled')} className="border border-red-300 text-red-600 px-5 py-2 rounded-full text-sm font-medium hover:bg-red-50 transition-colors">
          Cancel Booking
        </button>
      )}
    </div>
  )
}

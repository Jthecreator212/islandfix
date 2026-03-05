'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Loader2, CheckCircle } from 'lucide-react'

interface Props {
  tradespersonId: string
  tradespersonName: string
}

export default function BookingForm({ tradespersonId, tradespersonName }: Props) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')
  const [location, setLocation] = useState('')
  const [budget, setBudget] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      setError('You must be logged in')
      setLoading(false)
      return
    }

    const { error: bookingError } = await supabase.from('bookings').insert({
      homeowner_id: user.id,
      tradesperson_id: tradespersonId,
      title,
      description,
      proposed_date: date || null,
      location,
      budget: budget ? parseFloat(budget) : null,
    })

    if (bookingError) {
      setError(bookingError.message)
    } else {
      setSuccess(true)
    }
    setLoading(false)
  }

  if (success) {
    return (
      <div className="bg-white rounded-xl border border-[#c8d1dc] p-6 text-center">
        <CheckCircle size={40} className="text-green-500 mx-auto mb-3" />
        <p className="font-display font-bold text-lg">Booking Sent!</p>
        <p className="text-[#4a5568] text-sm mt-2">
          {tradespersonName} will review your request and get back to you.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-[#c8d1dc] p-6 space-y-4">
      {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl">{error}</div>}

      <div>
        <label className="block text-sm font-medium mb-1">Job Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Fix leaking pipe"
          className="w-full bg-[#f0f4f8] border border-[#c8d1dc] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#4fc3f7]"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the work needed..."
          rows={3}
          className="w-full bg-[#f0f4f8] border border-[#c8d1dc] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#4fc3f7] resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Preferred Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full bg-[#f0f4f8] border border-[#c8d1dc] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#4fc3f7]"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Location</label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Your address or area"
          className="w-full bg-[#f0f4f8] border border-[#c8d1dc] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#4fc3f7]"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Budget (optional)</label>
        <input
          type="number"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          placeholder="$"
          className="w-full bg-[#f0f4f8] border border-[#c8d1dc] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#4fc3f7]"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#4fc3f7] text-white font-semibold py-3 rounded-full hover:bg-[#81d4fa] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading && <Loader2 size={16} className="animate-spin" />}
        Send Booking Request
      </button>
    </form>
  )
}

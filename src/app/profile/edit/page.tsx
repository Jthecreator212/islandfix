'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { Loader2, Save } from 'lucide-react'
import { TRADE_CATEGORIES } from '@/lib/types'

export default function EditProfilePage() {
  const [profile, setProfile] = useState<any>(null)
  const [tradesProfile, setTradesProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  // Form state
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [location, setLocation] = useState('')
  const [bio, setBio] = useState('')
  const [tradeCategory, setTradeCategory] = useState('general')
  const [experienceYears, setExperienceYears] = useState(0)
  const [hourlyRate, setHourlyRate] = useState('')
  const [serviceRadius, setServiceRadius] = useState(25)
  const [skills, setSkills] = useState('')
  const [availability, setAvailability] = useState('available')

  useEffect(() => {
    const loadProfile = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data: p } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (!p) return
      setProfile(p)
      setFullName(p.full_name || '')
      setPhone(p.phone || '')
      setLocation(p.location || '')
      setBio(p.bio || '')

      if (p.role === 'tradesperson') {
        const { data: tp } = await supabase.from('trades_profiles').select('*').eq('id', user.id).single()
        if (tp) {
          setTradesProfile(tp)
          setTradeCategory(tp.trade_category || 'general')
          setExperienceYears(tp.experience_years || 0)
          setHourlyRate(tp.hourly_rate?.toString() || '')
          setServiceRadius(tp.service_radius_miles || 25)
          setSkills(tp.skills?.join(', ') || '')
          setAvailability(tp.availability_status || 'available')
        }
      }
      setLoading(false)
    }
    loadProfile()
  }, [router])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Update profile
    await supabase.from('profiles').update({
      full_name: fullName,
      phone,
      location,
      bio,
    }).eq('id', user.id)

    // Update trades profile if tradesperson
    if (profile?.role === 'tradesperson') {
      const tradesData = {
        id: user.id,
        trade_category: tradeCategory,
        experience_years: experienceYears,
        hourly_rate: hourlyRate ? parseFloat(hourlyRate) : null,
        service_radius_miles: serviceRadius,
        skills: skills.split(',').map(s => s.trim()).filter(Boolean),
        availability_status: availability,
      }

      if (tradesProfile) {
        await supabase.from('trades_profiles').update(tradesData).eq('id', user.id)
      } else {
        await supabase.from('trades_profiles').insert(tradesData)
      }
    }

    setMessage('Profile saved successfully!')
    setSaving(false)
    router.refresh()
  }

  if (loading) {
    return (
      <>
        <Navbar user={null} />
        <main className="pt-24 pb-16 px-6 flex justify-center">
          <Loader2 size={32} className="animate-spin text-[#4fc3f7]" />
        </main>
      </>
    )
  }

  return (
    <>
      <Navbar user={profile} />
      <main className="pt-24 pb-16 px-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="font-display font-bold text-3xl mb-8">Edit Profile</h1>

          <form onSubmit={handleSave} className="bg-white rounded-2xl border border-[#c8d1dc] p-8 space-y-6">
            {message && (
              <div className="bg-green-50 text-green-700 text-sm px-4 py-3 rounded-xl">{message}</div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <input type="text" value={fullName} onChange={e => setFullName(e.target.value)}
                className="w-full bg-[#f0f4f8] border border-[#c8d1dc] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#4fc3f7]" required />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Phone</label>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                className="w-full bg-[#f0f4f8] border border-[#c8d1dc] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#4fc3f7]" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <input type="text" value={location} onChange={e => setLocation(e.target.value)}
                placeholder="e.g. Kingston, Jamaica"
                className="w-full bg-[#f0f4f8] border border-[#c8d1dc] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#4fc3f7]" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Bio</label>
              <textarea value={bio} onChange={e => setBio(e.target.value)} rows={4}
                placeholder="Tell people about yourself..."
                className="w-full bg-[#f0f4f8] border border-[#c8d1dc] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#4fc3f7] resize-none" />
            </div>

            {profile?.role === 'tradesperson' && (
              <>
                <hr className="border-[#c8d1dc]" />
                <h2 className="font-display font-bold text-lg">Trade Details</h2>

                <div>
                  <label className="block text-sm font-medium mb-2">Trade Category</label>
                  <select value={tradeCategory} onChange={e => setTradeCategory(e.target.value)}
                    className="w-full bg-[#f0f4f8] border border-[#c8d1dc] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#4fc3f7]">
                    {TRADE_CATEGORIES.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Years Experience</label>
                    <input type="number" value={experienceYears} onChange={e => setExperienceYears(parseInt(e.target.value) || 0)}
                      className="w-full bg-[#f0f4f8] border border-[#c8d1dc] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#4fc3f7]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Hourly Rate ($)</label>
                    <input type="number" value={hourlyRate} onChange={e => setHourlyRate(e.target.value)}
                      placeholder="Optional"
                      className="w-full bg-[#f0f4f8] border border-[#c8d1dc] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#4fc3f7]" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Service Radius (miles)</label>
                  <input type="number" value={serviceRadius} onChange={e => setServiceRadius(parseInt(e.target.value) || 25)}
                    className="w-full bg-[#f0f4f8] border border-[#c8d1dc] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#4fc3f7]" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Skills (comma separated)</label>
                  <input type="text" value={skills} onChange={e => setSkills(e.target.value)}
                    placeholder="e.g. Pipe fitting, Drain repair, Boiler installation"
                    className="w-full bg-[#f0f4f8] border border-[#c8d1dc] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#4fc3f7]" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Availability</label>
                  <select value={availability} onChange={e => setAvailability(e.target.value)}
                    className="w-full bg-[#f0f4f8] border border-[#c8d1dc] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#4fc3f7]">
                    <option value="available">Available</option>
                    <option value="busy">Busy</option>
                    <option value="offline">Offline</option>
                  </select>
                </div>
              </>
            )}

            <button type="submit" disabled={saving}
              className="w-full bg-[#4fc3f7] text-white font-semibold py-3 rounded-full hover:bg-[#81d4fa] transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              Save Profile
            </button>
          </form>
        </div>
      </main>
    </>
  )
}

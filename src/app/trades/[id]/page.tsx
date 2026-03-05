import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Navbar from '@/components/Navbar'
import BookingForm from '@/components/BookingForm'
import { Star, MapPin, Clock, BadgeCheck, Shield, Calendar } from 'lucide-react'

export default async function TradesProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  let currentProfile = null
  if (user) {
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    currentProfile = data
  }

  // Fetch tradesperson
  const { data: tradesProfile } = await supabase
    .from('trades_profiles')
    .select('*, profiles!inner(*)')
    .eq('id', id)
    .single()

  if (!tradesProfile) notFound()

  const profile = tradesProfile.profiles as any

  // Fetch reviews
  const { data: reviews } = await supabase
    .from('reviews')
    .select('*, reviewer:profiles!reviewer_id(full_name, avatar_url)')
    .eq('tradesperson_id', id)
    .order('created_at', { ascending: false })
    .limit(10)

  return (
    <>
      <Navbar user={currentProfile} />
      <main className="pt-24 pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-2xl border border-[#c8d1dc] p-8 md:p-10">
            <div className="flex flex-col md:flex-row md:items-start gap-6">
              <div className="w-24 h-24 rounded-2xl bg-[#4fc3f7]/10 flex items-center justify-center font-display font-bold text-3xl text-[#4fc3f7] flex-shrink-0">
                {profile.full_name?.[0]?.toUpperCase() || '?'}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="font-display font-bold text-3xl">{profile.full_name}</h1>
                  {tradesProfile.is_verified && (
                    <span className="flex items-center gap-1 bg-[#4fc3f7]/10 text-[#4fc3f7] text-sm font-medium px-3 py-1 rounded-full">
                      <BadgeCheck size={16} /> Verified
                    </span>
                  )}
                </div>
                <p className="text-[#4a5568] mt-1 capitalize">{tradesProfile.trade_category.replace('-', ' ')}</p>

                <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-[#4a5568]">
                  <div className="flex items-center gap-1">
                    <Star size={16} className="text-yellow-500 fill-yellow-500" />
                    <span className="font-semibold text-[#1a1a2e]">{tradesProfile.rating.toFixed(1)}</span>
                    <span>({tradesProfile.total_reviews} reviews)</span>
                  </div>
                  {profile.location && (
                    <div className="flex items-center gap-1">
                      <MapPin size={16} /> {profile.location}
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Clock size={16} /> {tradesProfile.experience_years} years experience
                  </div>
                  <div className="flex items-center gap-1">
                    <Shield size={16} /> {tradesProfile.service_radius_miles} mile radius
                  </div>
                </div>

                {profile.bio && (
                  <p className="mt-4 text-[#4a5568] leading-relaxed">{profile.bio}</p>
                )}

                {tradesProfile.skills && tradesProfile.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {tradesProfile.skills.map((skill: string) => (
                      <span key={skill} className="bg-[#f0f4f8] text-[#4a5568] text-xs px-3 py-1.5 rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="text-right flex-shrink-0">
                {tradesProfile.hourly_rate && (
                  <div className="font-display font-bold text-2xl">
                    ${tradesProfile.hourly_rate}<span className="text-sm font-normal text-[#4a5568]">/hr</span>
                  </div>
                )}
                <div className="mt-2 flex items-center gap-2 justify-end">
                  <Calendar size={14} className="text-[#4a5568]" />
                  <span className={`text-sm font-medium capitalize ${
                    tradesProfile.availability_status === 'available' ? 'text-green-600' :
                    tradesProfile.availability_status === 'busy' ? 'text-yellow-600' : 'text-gray-500'
                  }`}>
                    {tradesProfile.availability_status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-6">
            {/* Reviews */}
            <div className="md:col-span-2 space-y-4">
              <h2 className="font-display font-bold text-xl">Reviews</h2>
              {reviews && reviews.length > 0 ? (
                reviews.map((review: any) => (
                  <div key={review.id} className="bg-white rounded-xl border border-[#c8d1dc] p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#f0f4f8] flex items-center justify-center text-sm font-bold text-[#4a5568]">
                          {review.reviewer?.full_name?.[0]?.toUpperCase() || '?'}
                        </div>
                        <span className="font-medium text-sm">{review.reviewer?.full_name || 'Anonymous'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} className={i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'} />
                        ))}
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-[#4a5568]">{review.comment}</p>
                    <p className="mt-2 text-xs text-[#b0bec5]">{new Date(review.created_at).toLocaleDateString()}</p>
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-xl border border-[#c8d1dc] p-8 text-center">
                  <p className="text-[#4a5568]">No reviews yet</p>
                </div>
              )}
            </div>

            {/* Booking Form */}
            <div>
              <h2 className="font-display font-bold text-xl mb-4">Book This Tradesperson</h2>
              {currentProfile && currentProfile.role === 'homeowner' ? (
                <BookingForm tradespersonId={id} tradespersonName={profile.full_name} />
              ) : currentProfile ? (
                <div className="bg-white rounded-xl border border-[#c8d1dc] p-6 text-center">
                  <p className="text-[#4a5568] text-sm">Only homeowners can book tradespeople</p>
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-[#c8d1dc] p-6 text-center">
                  <p className="text-[#4a5568] text-sm">Log in to book this tradesperson</p>
                  <a href="/login" className="mt-3 inline-block bg-[#4fc3f7] text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-[#81d4fa] transition-colors">
                    Log In
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

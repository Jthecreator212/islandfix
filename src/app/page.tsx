import { createClient } from '@/lib/supabase/server'
import { getCurrentUser, getProfile } from '@/lib/data/profiles'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import { Search, Shield, MessageSquare, Star, Wrench, Zap, Hammer, Paintbrush, Home, TreePine, ArrowRight, CheckCircle } from 'lucide-react'

export default async function HomePage() {
  const supabase = await createClient()
  const user = await getCurrentUser(supabase)

  let profile = null
  if (user) {
    const { data } = await getProfile(supabase, user.id)
    profile = data
  }

  return (
    <>
      <Navbar user={profile} />

      {/* Hero */}
      <section className="pt-32 pb-20 md:pt-44 md:pb-32 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-display font-bold tracking-tight leading-[1.1]" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}>
            Find Trusted Trades<br />
            <span className="text-[#4fc3f7]">Across the Caribbean</span>
          </h1>
          <p className="mt-6 text-[#4a5568] text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            IslandFix connects homeowners with verified, vetted tradespeople. Search, compare, book — with confidence.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/search" className="bg-[#4fc3f7] text-white font-semibold px-8 py-4 rounded-full text-base hover:bg-[#81d4fa] transition-colors flex items-center gap-2">
              <Search size={18} /> Find a Tradesperson
            </Link>
            <Link href="/signup" className="border-2 border-[#c8d1dc] text-[#1a1a2e] font-medium px-8 py-4 rounded-full text-base hover:border-[#4fc3f7] transition-colors">
              Join as a Tradesperson
            </Link>
          </div>
        </div>
      </section>

      {/* Trade Categories */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs uppercase tracking-[0.3em] text-[#4fc3f7] font-semibold">Services</span>
            <h2 className="font-display font-bold text-3xl md:text-4xl mt-3">Browse by Trade</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: 'Plumbing', icon: Wrench, color: 'bg-blue-50 text-blue-600' },
              { name: 'Electrical', icon: Zap, color: 'bg-yellow-50 text-yellow-600' },
              { name: 'Carpentry', icon: Hammer, color: 'bg-orange-50 text-orange-600' },
              { name: 'Painting', icon: Paintbrush, color: 'bg-pink-50 text-pink-600' },
              { name: 'Roofing', icon: Home, color: 'bg-red-50 text-red-600' },
              { name: 'Landscaping', icon: TreePine, color: 'bg-green-50 text-green-600' },
            ].map((trade) => (
              <Link key={trade.name} href={`/search?category=${trade.name.toLowerCase()}`}
                className="bg-white rounded-2xl border border-[#c8d1dc] p-6 text-center hover:shadow-lg hover:border-[#4fc3f7]/50 transition-all group">
                <div className={`w-12 h-12 rounded-xl ${trade.color} flex items-center justify-center mx-auto`}>
                  <trade.icon size={24} />
                </div>
                <p className="mt-3 font-medium text-sm group-hover:text-[#4fc3f7] transition-colors">{trade.name}</p>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/search" className="text-[#4fc3f7] font-medium text-sm hover:underline inline-flex items-center gap-1">
              View all categories <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs uppercase tracking-[0.3em] text-[#4fc3f7] font-semibold">How It Works</span>
            <h2 className="font-display font-bold text-3xl md:text-4xl mt-3">Simple as 1, 2, 3</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Search', desc: 'Browse verified tradespeople by category, location, and ratings. Filter by availability and price range.' },
              { step: '02', title: 'Compare & Book', desc: 'Review profiles, read verified reviews, and send a booking request directly through the platform.' },
              { step: '03', title: 'Get It Done', desc: 'Chat with your tradesperson, track progress, and leave a review when the job is complete.' },
            ].map((item) => (
              <div key={item.step} className="bg-white rounded-2xl border border-[#c8d1dc] p-8 text-center hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 rounded-2xl bg-[#4fc3f7]/10 flex items-center justify-center mx-auto">
                  <span className="font-display font-bold text-lg text-[#4fc3f7]">{item.step}</span>
                </div>
                <h3 className="font-display font-bold text-xl mt-6">{item.title}</h3>
                <p className="text-[#4a5568] text-sm mt-3 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs uppercase tracking-[0.3em] text-[#4fc3f7] font-semibold">Why IslandFix</span>
            <h2 className="font-display font-bold text-3xl md:text-4xl mt-3">Built for Trust</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: 'Verified Tradespeople', desc: 'Every tradesperson is vetted and verified before they can accept jobs on the platform.' },
              { icon: Star, title: 'Honest Reviews', desc: 'Reviews are tied to completed bookings. No fake reviews, no gaming the system.' },
              { icon: MessageSquare, title: 'Direct Messaging', desc: 'Chat with tradespeople before and during the job. Share photos, agree on scope.' },
              { icon: Search, title: 'Smart Search', desc: 'Find the right person by trade, location, rating, price, and availability.' },
              { icon: CheckCircle, title: 'Booking Management', desc: 'Track every job from request to completion. Both parties see the same status.' },
              { icon: Wrench, title: 'For Tradespeople Too', desc: 'Grow your business with a verified profile, qualified leads, and built-in reputation.' },
            ].map((feature) => (
              <div key={feature.title} className="bg-white rounded-2xl border border-[#c8d1dc] p-8 hover:shadow-lg hover:border-[#4fc3f7]/50 transition-all">
                <div className="w-12 h-12 rounded-xl bg-[#4fc3f7]/10 flex items-center justify-center">
                  <feature.icon size={24} className="text-[#4fc3f7]" />
                </div>
                <h3 className="font-display font-bold text-lg mt-5">{feature.title}</h3>
                <p className="text-[#4a5568] text-sm mt-2 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center bg-white rounded-3xl border border-[#c8d1dc] p-12 md:p-16">
          <h2 className="font-display font-bold text-3xl md:text-4xl">Ready to get started?</h2>
          <p className="text-[#4a5568] mt-4 text-lg">Join the IslandFix community today. It takes less than 2 minutes.</p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup" className="bg-[#4fc3f7] text-white font-semibold px-8 py-4 rounded-full hover:bg-[#81d4fa] transition-colors">
              Create Free Account
            </Link>
            <Link href="/search" className="text-[#4fc3f7] font-medium hover:underline">
              Browse Tradespeople →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-[#c8d1dc]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-display font-bold text-sm">Island<span className="text-[#4fc3f7]">Fix</span></span>
          <div className="flex items-center gap-6 text-xs text-[#4a5568]">
            <a href="#" className="hover:text-[#1a1a2e] transition-colors">Privacy</a>
            <a href="#" className="hover:text-[#1a1a2e] transition-colors">Terms</a>
            <a href="#" className="hover:text-[#1a1a2e] transition-colors">Contact</a>
            <span>&copy; 2026 IslandFix</span>
          </div>
        </div>
      </footer>
    </>
  )
}

import Link from 'next/link'
import { Star, MapPin, Clock, BadgeCheck } from 'lucide-react'

interface Props {
  tradesperson: any
  profile: any
}

export default function TradesCard({ tradesperson, profile }: Props) {
  const statusColors: Record<string, string> = {
    available: 'bg-green-400',
    busy: 'bg-yellow-400',
    offline: 'bg-gray-400',
  }

  return (
    <Link href={`/trades/${tradesperson.id}`} className="block group">
      <div className="bg-white rounded-2xl border border-[#c8d1dc] p-6 hover:shadow-lg hover:border-[#4fc3f7]/50 transition-all">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#4fc3f7]/10 flex items-center justify-center font-display font-bold text-lg text-[#4fc3f7]">
              {profile.full_name?.[0]?.toUpperCase() || '?'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-lg group-hover:text-[#4fc3f7] transition-colors">
                  {profile.full_name || 'Unknown'}
                </h3>
                {tradesperson.is_verified && (
                  <BadgeCheck size={18} className="text-[#4fc3f7]" />
                )}
              </div>
              <p className="text-sm text-[#4a5568] capitalize">{tradesperson.trade_category.replace('-', ' ')}</p>
            </div>
          </div>
          <div className={`w-3 h-3 rounded-full ${statusColors[tradesperson.availability_status] || 'bg-gray-400'}`} title={tradesperson.availability_status} />
        </div>

        {profile.bio && (
          <p className="mt-4 text-sm text-[#4a5568] line-clamp-2">{profile.bio}</p>
        )}

        <div className="mt-4 flex items-center gap-4 text-sm text-[#4a5568]">
          <div className="flex items-center gap-1">
            <Star size={14} className="text-yellow-500 fill-yellow-500" />
            <span className="font-medium text-[#1a1a2e]">{tradesperson.rating.toFixed(1)}</span>
            <span>({tradesperson.total_reviews})</span>
          </div>
          {profile.location && (
            <div className="flex items-center gap-1">
              <MapPin size={14} />
              <span>{profile.location}</span>
            </div>
          )}
          {tradesperson.experience_years > 0 && (
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span>{tradesperson.experience_years}yr exp</span>
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between">
          {tradesperson.hourly_rate ? (
            <span className="font-display font-bold text-lg">${tradesperson.hourly_rate}<span className="text-sm font-normal text-[#4a5568]">/hr</span></span>
          ) : (
            <span className="text-sm text-[#4a5568]">Contact for pricing</span>
          )}
          <span className="text-sm font-medium text-[#4fc3f7] group-hover:underline">View Profile →</span>
        </div>
      </div>
    </Link>
  )
}

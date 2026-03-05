export type UserRole = 'homeowner' | 'tradesperson'

export interface Profile {
  id: string
  email: string
  full_name: string
  role: UserRole
  avatar_url: string | null
  phone: string | null
  location: string | null
  bio: string | null
  created_at: string
  updated_at: string
}

export interface TradesProfile extends Profile {
  trade_category: string
  experience_years: number
  hourly_rate: number | null
  is_verified: boolean
  rating: number
  total_reviews: number
  availability_status: 'available' | 'busy' | 'offline'
  service_radius_miles: number
  skills: string[]
  portfolio_images: string[]
}

export interface Booking {
  id: string
  homeowner_id: string
  tradesperson_id: string
  title: string
  description: string
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled'
  proposed_date: string | null
  proposed_time: string | null
  budget: number | null
  location: string
  created_at: string
  updated_at: string
  homeowner?: Profile
  tradesperson?: TradesProfile
}

export interface Review {
  id: string
  booking_id: string
  reviewer_id: string
  tradesperson_id: string
  rating: number
  comment: string
  created_at: string
  reviewer?: Profile
}

export interface Message {
  id: string
  booking_id: string
  sender_id: string
  content: string
  created_at: string
  sender?: Profile
}

export interface TradeCategory {
  id: string
  name: string
  icon: string
  description: string
}

export const TRADE_CATEGORIES: TradeCategory[] = [
  { id: 'plumbing', name: 'Plumbing', icon: 'Wrench', description: 'Pipes, fixtures, water systems' },
  { id: 'electrical', name: 'Electrical', icon: 'Zap', description: 'Wiring, installations, repairs' },
  { id: 'carpentry', name: 'Carpentry', icon: 'Hammer', description: 'Woodwork, furniture, framing' },
  { id: 'painting', name: 'Painting', icon: 'Paintbrush', description: 'Interior & exterior painting' },
  { id: 'roofing', name: 'Roofing', icon: 'Home', description: 'Roof repairs & installations' },
  { id: 'landscaping', name: 'Landscaping', icon: 'TreePine', description: 'Gardens, lawns, outdoor spaces' },
  { id: 'hvac', name: 'HVAC', icon: 'Wind', description: 'Heating, ventilation, AC' },
  { id: 'tiling', name: 'Tiling', icon: 'LayoutGrid', description: 'Floor & wall tiling' },
  { id: 'masonry', name: 'Masonry', icon: 'Blocks', description: 'Brickwork, stonework, concrete' },
  { id: 'cleaning', name: 'Cleaning', icon: 'Sparkles', description: 'Deep cleaning, maintenance' },
  { id: 'pest-control', name: 'Pest Control', icon: 'Bug', description: 'Pest removal & prevention' },
  { id: 'general', name: 'General Handyman', icon: 'Settings', description: 'Multi-skill maintenance' },
]

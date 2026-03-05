'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'
import type { TradeCategory } from '@/lib/types'

interface Props {
  categories: TradeCategory[]
  currentCategory: string
  currentSort: string
  currentQuery: string
}

export default function SearchFilters({ categories, currentCategory, currentSort, currentQuery }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(currentQuery)

  const updateParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== 'all') {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/search?${params.toString()}`)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateParams('q', query)
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-3">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4a5568]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, location, or skill..."
            className="w-full bg-white border border-[#c8d1dc] rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-[#4fc3f7] transition-colors"
          />
        </div>
        <button type="submit" className="bg-[#4fc3f7] text-white px-6 py-3 rounded-xl font-medium text-sm hover:bg-[#81d4fa] transition-colors">
          Search
        </button>
      </form>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => updateParams('category', 'all')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            currentCategory === 'all'
              ? 'bg-[#4fc3f7] text-white'
              : 'bg-white border border-[#c8d1dc] text-[#4a5568] hover:border-[#4fc3f7]'
          }`}
        >
          All Trades
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => updateParams('category', cat.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              currentCategory === cat.id
                ? 'bg-[#4fc3f7] text-white'
                : 'bg-white border border-[#c8d1dc] text-[#4a5568] hover:border-[#4fc3f7]'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Sort */}
      <div className="flex items-center gap-3">
        <SlidersHorizontal size={16} className="text-[#4a5568]" />
        <select
          value={currentSort}
          onChange={(e) => updateParams('sort', e.target.value)}
          className="bg-white border border-[#c8d1dc] rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#4fc3f7]"
        >
          <option value="rating">Highest Rated</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
        </select>
      </div>
    </div>
  )
}

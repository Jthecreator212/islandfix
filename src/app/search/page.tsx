import { createClient } from '@/lib/supabase/server'
import { getCurrentUser, getProfile } from '@/lib/data/profiles'
import { searchTradespeople } from '@/lib/data/trades'
import Navbar from '@/components/Navbar'
import SearchFilters from '@/components/SearchFilters'
import TradesCard from '@/components/TradesCard'
import { TRADE_CATEGORIES } from '@/lib/types'

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string; sort?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()
  const user = await getCurrentUser(supabase)

  let profile = null
  if (user) {
    const { data } = await getProfile(supabase, user.id)
    profile = data
  }

  const { data: tradespeople } = await searchTradespeople(supabase, params)

  return (
    <>
      <Navbar user={profile} />
      <main className="pt-24 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <h1 className="font-display font-bold text-3xl md:text-4xl">Find Tradespeople</h1>
            <p className="text-[#4a5568] mt-2">Browse verified professionals in your area</p>
          </div>

          <SearchFilters
            categories={TRADE_CATEGORIES}
            currentCategory={params.category || 'all'}
            currentSort={params.sort || 'rating'}
            currentQuery={params.q || ''}
          />

          <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tradespeople && tradespeople.length > 0 ? (
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              tradespeople.map((tp: any) => (
                <TradesCard key={tp.id} tradesperson={tp} profile={tp.profiles} />
              ))
            ) : (
              <div className="col-span-full text-center py-20">
                <p className="text-[#4a5568] text-lg">No tradespeople found</p>
                <p className="text-[#4a5568] text-sm mt-2">Try adjusting your filters</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  )
}

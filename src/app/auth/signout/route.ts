import { createClient } from '@/lib/supabase/server'
import { signOut } from '@/lib/data/auth'
import { redirect } from 'next/navigation'

export async function POST() {
  const supabase = await createClient()
  await signOut(supabase)
  redirect('/')
}

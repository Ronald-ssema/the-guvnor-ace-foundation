'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function signOut() {
  try {
    const supabase = await createClient()
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error('Admin sign-out request failed', {
        status: error.status,
      })
    }
  } catch {
    console.error('Admin sign-out request failed')
  }

  redirect('/admin/login')
}

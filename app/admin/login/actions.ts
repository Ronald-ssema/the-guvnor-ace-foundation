'use server'

import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { clientAddress, consumeRateLimit } from '@/lib/security/rateLimit'

export type LoginState = {
  error: string | null
}

export async function login(
  _previousState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '')

  if (!email || !password) {
    return {
      error: 'Enter your email address and password.',
    }
  }

  const requestHeaders = await headers()
  const allowed = await consumeRateLimit({
    scope: 'admin-login',
    subject: `${clientAddress(requestHeaders)}:${email.toLowerCase()}`,
    limit: 5,
    windowSeconds: 15 * 60,
  })

  if (!allowed) {
    return {
      error: 'Too many sign-in attempts. Wait 15 minutes and try again.',
    }
  }

  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  ) {
    return {
      error: 'Administrator sign-in is not configured for this environment.',
    }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return {
      error: 'The email address or password is incorrect.',
    }
  }

  redirect('/admin/mfa')
}

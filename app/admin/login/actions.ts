'use server'

import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { z } from 'zod'

import { consumeRateLimit, getClientAddress } from '@/lib/security/rate-limit'
import { createClient } from '@/lib/supabase/server'

const loginSchema = z.object({
  email: z.email().trim().toLowerCase().max(254),
  password: z.string().min(1).max(1024),
})

export type LoginState = {
  error: string | null
}

export async function login(
  _previousState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const parsedCredentials = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!parsedCredentials.success) {
    return {
      error: 'Enter your email address and password.',
    }
  }

  const { email, password } = parsedCredentials.data
  const requestHeaders = await headers()
  const clientAddress = getClientAddress(requestHeaders)
  const [addressLimit, accountLimit] = await Promise.all([
    consumeRateLimit({
      scope: 'admin-login-address',
      identifier: clientAddress,
      limit: 20,
      windowSeconds: 600,
    }),
    consumeRateLimit({
      scope: 'admin-login-account',
      identifier: `${clientAddress}:${email}`,
      limit: 5,
      windowSeconds: 600,
    }),
  ])

  if (
    addressLimit.status !== 'allowed' ||
    accountLimit.status !== 'allowed'
  ) {
    return {
      error: 'Unable to sign in right now. Please try again later.',
    }
  }

  let authenticationFailed = false

  try {
    const supabase = await createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    authenticationFailed = Boolean(error)
  } catch {
    console.error('Admin sign-in request failed')
    return {
      error: 'Unable to sign in right now. Please try again later.',
    }
  }

  if (authenticationFailed) {
    return {
      error: 'The email address or password is incorrect.',
    }
  }

  redirect('/admin')
}

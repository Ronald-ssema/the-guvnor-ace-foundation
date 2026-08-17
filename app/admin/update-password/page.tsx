'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import type { SupabaseClient } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'

export default function UpdatePasswordPage() {
  const router = useRouter()
  const supabaseRef = useRef<SupabaseClient | null>(null)
  const [ready, setReady] = useState(false)
  const [checking, setChecking] = useState(true)
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  useEffect(() => {
    let active = true

    let client: SupabaseClient

    try {
      client = createClient()
      supabaseRef.current = client
    } catch {
      queueMicrotask(() => {
        if (!active) return
        setError('Password recovery is temporarily unavailable.')
        setChecking(false)
      })

      return () => {
        active = false
      }
    }

    const { data } = client.auth.onAuthStateChange(
      (_event, session) => {
        if (!active) return

        if (session) {
          setReady(true)
          setError('')
          setChecking(false)
        }
      },
    )

    const checkSession = async () => {
      const {
        data: { session },
      } = await client.auth.getSession()

      if (!active) return

      setReady(Boolean(session))
      setChecking(false)

      if (!session) {
        setError('This recovery link is invalid or has expired.')
      }
    }

    void checkSession()

    return () => {
      active = false
      data.subscription.unsubscribe()
    }
  }, [])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    const supabase = supabaseRef.current

    if (!supabase) {
      setError('Password recovery is temporarily unavailable.')
      return
    }

    if (password.length < 8) {
      setError('Your password must be at least 8 characters.')
      return
    }

    if (password !== confirmation) {
      setError('The passwords do not match.')
      return
    }

    setPending(true)

    const { error: updateError } = await supabase.auth.updateUser({
      password,
    })

    if (updateError) {
      setError('Unable to update your password. Please request a new link.')
      setPending(false)
      return
    }

    await supabase.auth.signOut()
    router.replace('/admin/login?reset=success')
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-16 text-white">
      <section className="w-full max-w-md rounded-2xl bg-white p-8 text-slate-900 shadow-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
          The Guvnor Ace Foundation
        </p>

        <h1 className="mt-4 text-3xl font-bold">Set a new password</h1>

        {checking && (
          <p className="mt-6 text-sm text-slate-600">
            Checking your recovery link…
          </p>
        )}

        {!checking && !ready && (
          <p className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

        {!checking && ready && (
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label htmlFor="password" className="block text-sm font-medium">
                New password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                minLength={8}
                className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            <div>
              <label
                htmlFor="confirmation"
                className="block text-sm font-medium"
              >
                Confirm password
              </label>

              <input
                id="confirmation"
                type="password"
                value={confirmation}
                onChange={(event) => setConfirmation(event.target.value)}
                required
                minLength={8}
                className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            {error && (
              <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="w-full rounded-lg bg-emerald-600 px-4 py-3 font-semibold text-white disabled:opacity-60"
            >
              {pending ? 'Updating…' : 'Set password'}
            </button>
          </form>
        )}
      </section>
    </main>
  )
}

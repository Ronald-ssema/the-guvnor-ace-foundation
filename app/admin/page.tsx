import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { signOut } from './actions'

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  const { data: adminUser } = await supabase
    .from('admin_users')
    .select('email, role')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!adminUser || adminUser.role !== 'owner') {
    redirect('/admin/login?error=not-authorised')
  }

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-10 text-slate-900">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-col justify-between gap-6 rounded-2xl bg-slate-950 p-8 text-white sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
              The Guvnor Ace Foundation
            </p>

            <h1 className="mt-3 text-3xl font-bold">Admin portal</h1>

            <p className="mt-2 text-slate-300">
              Manage the Foundation website securely.
            </p>
          </div>

          <form action={signOut}>
            <button
              type="submit"
              className="rounded-lg border border-slate-600 px-5 py-3 font-semibold text-white transition hover:bg-slate-800"
            >
              Sign out
            </button>
          </form>
        </header>

        <section className="mt-8 rounded-2xl bg-white p-8 shadow-sm">
          <p className="text-sm text-slate-500">Signed in as</p>
          <p className="mt-1 font-semibold">{adminUser.email}</p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              'Website content',
              'Stories and news',
              'Projects and programmes',
              'Photos and videos',
              'Reports and statistics',
              'Volunteers and partnerships',
            ].map((item) => (
              <div key={item} className="rounded-xl border border-slate-200 p-5">
                <h2 className="font-semibold">{item}</h2>
                <p className="mt-2 text-sm text-slate-600">
                  Management tools will be added here.
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}

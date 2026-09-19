"use client";

export default function AdminError({ reset }: { reset: () => void }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-16 text-white">
      <section className="w-full max-w-md rounded-2xl bg-white p-8 text-slate-900 shadow-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
          The Guvnor Ace Foundation
        </p>
        <h1 className="mt-4 text-3xl font-bold">Admin portal unavailable</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          We could not verify administrator access. Please try again without
          sharing any sign-in details.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-8 w-full rounded-lg bg-emerald-600 px-4 py-3 font-semibold text-white transition hover:bg-emerald-700"
        >
          Try again
        </button>
      </section>
    </main>
  );
}

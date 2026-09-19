"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

type TotpSetup = {
  factorId: string;
  qrCode: string | null;
  secret: string | null;
};

export default function AdminMfaPage() {
  const router = useRouter();
  const clientRef = useRef<SupabaseClient | null>(null);
  const [setup, setSetup] = useState<TotpSetup | null>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    let active = true;

    async function prepare() {
      const supabase = createClient();
      clientRef.current = supabase;

      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        router.replace("/admin/login");
        return;
      }

      const { data: assurance } =
        await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      if (assurance?.currentLevel === "aal2") {
        const { data: membership } = await supabase
          .from("admin_users")
          .select("user_id")
          .eq("user_id", userData.user.id)
          .maybeSingle();

        if (!membership) {
          await supabase.auth.signOut();
          router.replace("/admin/login?error=not-authorised");
          return;
        }

        router.replace("/admin");
        return;
      }

      const { data: factors, error: factorsError } =
        await supabase.auth.mfa.listFactors();
      if (factorsError) throw factorsError;

      const verified = factors.totp.find((factor) => factor.status === "verified");
      if (verified) {
        if (active) setSetup({ factorId: verified.id, qrCode: null, secret: null });
        return;
      }

      const { data: enrollment, error: enrollmentError } =
        await supabase.auth.mfa.enroll({
          factorType: "totp",
          friendlyName: "Foundation admin",
        });
      if (enrollmentError) throw enrollmentError;

      if (active) {
        setSetup({
          factorId: enrollment.id,
          qrCode: enrollment.totp.qr_code,
          secret: enrollment.totp.secret,
        });
      }
    }

    void prepare()
      .catch(() => active && setError("Unable to prepare two-step verification."))
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
  }, [router]);

  async function verify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const supabase = clientRef.current;
    if (!supabase || !setup || !/^\d{6}$/.test(code)) {
      setError("Enter the six-digit code from your authenticator app.");
      return;
    }

    setPending(true);
    setError("");

    const { data: challenge, error: challengeError } =
      await supabase.auth.mfa.challenge({ factorId: setup.factorId });
    if (challengeError) {
      setError("Unable to start verification. Try again.");
      setPending(false);
      return;
    }

    const { error: verifyError } = await supabase.auth.mfa.verify({
      factorId: setup.factorId,
      challengeId: challenge.id,
      code,
    });

    if (verifyError) {
      setError("That verification code was not accepted.");
      setPending(false);
      return;
    }

    const { data: userData } = await supabase.auth.getUser();
    const { data: membership } = userData.user
      ? await supabase
          .from("admin_users")
          .select("user_id")
          .eq("user_id", userData.user.id)
          .maybeSingle()
      : { data: null };

    if (!membership) {
      await supabase.auth.signOut();
      router.replace("/admin/login?error=not-authorised");
      return;
    }

    router.replace("/admin");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-16 text-white">
      <section className="w-full max-w-md rounded-2xl bg-white p-8 text-slate-900 shadow-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
          Protected administration
        </p>
        <h1 className="mt-4 text-3xl font-bold">Two-step verification</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Use an authenticator app to protect website content and safeguarding records.
        </p>

        {loading && <p className="mt-6 text-sm text-slate-600">Preparing secure sign-in…</p>}

        {!loading && setup?.qrCode && (
          <div className="mt-6 space-y-4">
            {/* Supabase returns a self-contained SVG data URL. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={setup.qrCode} alt="QR code for authenticator app setup" className="mx-auto h-48 w-48" />
            <p className="text-sm text-slate-600">
              Scan this QR code in your authenticator app, then enter the six-digit code below.
            </p>
            {setup.secret && (
              <details className="rounded-lg bg-slate-50 p-3 text-sm">
                <summary className="cursor-pointer font-semibold">Enter a setup key instead</summary>
                <code className="mt-2 block break-all">{setup.secret}</code>
              </details>
            )}
          </div>
        )}

        {!loading && setup && (
          <form onSubmit={verify} className="mt-6 space-y-5">
            <label htmlFor="code" className="block text-sm font-medium">
              Verification code
            </label>
            <input
              id="code"
              value={code}
              onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]{6}"
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-center text-2xl tracking-[0.35em] outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
            {error && <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
            <button type="submit" disabled={pending} className="w-full rounded-lg bg-emerald-700 px-4 py-3 font-semibold text-white disabled:opacity-60">
              {pending ? "Verifying…" : "Verify and continue"}
            </button>
          </form>
        )}

        {!loading && !setup && error && (
          <p role="alert" className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
        )}
      </section>
    </main>
  );
}

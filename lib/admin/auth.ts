import { createClient } from "@/lib/supabase/server";

export type AdminContext = {
  supabase: Awaited<ReturnType<typeof createClient>>;
  userId: string;
  email: string;
  role: "owner" | "editor";
};

export async function getAdminContext(): Promise<AdminContext | null> {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  ) {
    return null;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: adminUser } = await supabase
    .from("admin_users")
    .select("email, role")
    .eq("user_id", user.id)
    .maybeSingle();

  if (
    !adminUser ||
    (adminUser.role !== "owner" && adminUser.role !== "editor")
  ) {
    return null;
  }

  const [{ data: factors }, { data: assurance }] = await Promise.all([
    supabase.auth.mfa.listFactors(),
    supabase.auth.mfa.getAuthenticatorAssuranceLevel(),
  ]);

  const hasVerifiedTotp =
    factors?.totp.some((factor) => factor.status === "verified") ?? false;

  if (!hasVerifiedTotp || assurance?.currentLevel !== "aal2") {
    return null;
  }

  return {
    supabase,
    userId: user.id,
    email: adminUser.email,
    role: adminUser.role,
  };
}

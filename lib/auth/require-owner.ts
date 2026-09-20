import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export const requireOwner = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/admin/login");
  }

  const { data: adminUser, error: adminError } = await supabase
    .from("admin_users")
    .select("email, role")
    .eq("user_id", user.id)
    .maybeSingle();

  if (adminError) {
    console.error("Admin authorization lookup failed", {
      code: adminError.code,
    });
    throw new Error("Unable to verify administrator access.");
  }

  if (!adminUser || adminUser.role !== "owner") {
    try {
      await supabase.auth.signOut();
    } catch {
      // Continue to the generic access-denied redirect.
    }
    redirect("/admin/login?error=not-authorised");
  }

  return {
    supabase,
    user,
    adminUser,
  };
});

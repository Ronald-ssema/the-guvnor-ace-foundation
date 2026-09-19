import type { ReactNode } from "react";

import { requireOwner } from "@/lib/auth/require-owner";

export default async function ProtectedAdminLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  await requireOwner();

  return children;
}

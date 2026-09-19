import Link from "next/link";
import type { ReactNode } from "react";
import { signOut } from "@/app/admin/actions";

type AdminShellProps = {
  children: ReactNode;
  email: string;
  role: "owner" | "editor";
  title: string;
  description: string;
};

export default function AdminShell({
  children,
  email,
  role,
  title,
  description,
}: AdminShellProps) {
  return (
    <main className="admin-app">
      <aside className="admin-sidebar">
        <Link href="/admin" className="admin-brand">
          <span className="admin-brand-mark">GA</span>
          <span>
            <strong>Foundation CMS</strong>
            <small>Secure website management</small>
          </span>
        </Link>

        <nav className="admin-nav" aria-label="Administration">
          <Link href="/admin">Overview</Link>
          <Link href="/admin/content">Visual website editor</Link>
          <Link href="/admin/media">Photos and media</Link>
          <Link href="/" target="_blank">View public website ↗</Link>
        </nav>

        <div className="admin-account">
          <span className="admin-role">{role}</span>
          <strong>{email}</strong>
          <form action={signOut}>
            <button type="submit" className="admin-text-button">
              Sign out
            </button>
          </form>
        </div>
      </aside>

      <section className="admin-main">
        <header className="admin-page-header">
          <div>
            <p>Website administration</p>
            <h1>{title}</h1>
            <span>{description}</span>
          </div>
        </header>

        {children}
      </section>
    </main>
  );
}

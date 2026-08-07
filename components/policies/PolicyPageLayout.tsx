import Link from "next/link";
import type { ReactNode } from "react";

type PolicyNavItem = {
  label: string;
  href: string;
};

type PolicyPageLayoutProps = {
  eyebrow: string;
  title: string;
  description: string;
  lastReviewed: string;
  navigation?: PolicyNavItem[];
  children: ReactNode;
};

export default function PolicyPageLayout({
  eyebrow,
  title,
  description,
  lastReviewed,
  navigation = [],
  children,
}: PolicyPageLayoutProps) {
  return (
    <main className="policy-shell">
      <section className="policy-hero">
        <div className="policy-hero-inner">
          <p className="policy-eyebrow">{eyebrow}</p>

          <h1 className="policy-title">{title}</h1>

          <p className="policy-description">{description}</p>

          <div className="policy-meta">
            <span>
              <strong>Last reviewed:</strong>{" "}
              {lastReviewed}
            </span>

            <span className="policy-meta-separator" aria-hidden="true">•</span>

            <span>The Guvnor Ace Foundation</span>
          </div>
        </div>
      </section>

      <div className="policy-layout">
        {navigation.length > 0 && (
          <aside className="policy-sidebar">
            <div className="policy-nav-card">
              <h2 className="policy-nav-title">Policy navigation</h2>

              <nav aria-label="Policy navigation">
                <ul className="policy-nav-list">
                  {navigation.map((item) => (
                    <li key={item.href}>
                      <a href={item.href}>{item.label}</a>
                    </li>
                  ))}
                </ul>
              </nav>

              <Link className="policy-all-link" href="/policies">
                View all policies →
              </Link>
            </div>
          </aside>
        )}

        <article className="policy-document">{children}</article>
      </div>
    </main>
  );
}

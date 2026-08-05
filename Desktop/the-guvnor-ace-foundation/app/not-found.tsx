import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found-page">
      <div className="site-container not-found-content">
        <p className="eyebrow">404 — Page not found</p>
        <h1>We could not find that page.</h1>
        <p>
          The page may have moved or the address may be incorrect. Return to
          the homepage or explore our programmes.
        </p>

        <div className="hero-actions">
          <Link href="/" className="primary-button">
            Return Home
          </Link>

          <Link href="/programmes" className="secondary-button">
            Explore Our Work
          </Link>
        </div>
      </div>
    </main>
  );
}

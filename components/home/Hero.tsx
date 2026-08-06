import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-heading">
      <div className="site-container hero-grid">
        <div className="hero-content">
          <p className="hero-eyebrow">
            Supporting children and communities across Uganda
          </p>

          <h1 id="hero-heading">
            Together, we can give every child a safer and brighter future.
          </h1>

          <p className="hero-description">
            The Guvnor Ace Foundation supports vulnerable children and families
            through food, education, child protection and practical,
            community-led support.
          </p>

          <div className="hero-actions">
            <Link href="/donate" className="primary-button">
              Donate Today
              <span aria-hidden="true">→</span>
            </Link>

            <Link href="/programmes" className="secondary-button">
              Discover Our Work
            </Link>
          </div>

          <ul className="hero-trust-list" aria-label="Our commitments">
            <li>
              <span aria-hidden="true">✓</span>
              Community-led
            </li>

            <li>
              <span aria-hidden="true">✓</span>
              Transparent
            </li>

            <li>
              <span aria-hidden="true">✓</span>
              Safeguarding-focused
            </li>
          </ul>
        </div>

        <div className="hero-visual">
          <div className="hero-image-wrapper">
            <Image
              src="/images/hero.jpg"
              alt="Children and community members receiving practical support from The Guvnor Ace Foundation in Uganda"
              fill
              priority
              sizes="(max-width: 900px) 100vw, 50vw"
              className="hero-image"
            />

            <div className="hero-image-shade" aria-hidden="true" />

            <div className="hero-message">
              <strong>Hope begins with practical support.</strong>

              <p>
                One meal, one school day and one safe opportunity at a time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
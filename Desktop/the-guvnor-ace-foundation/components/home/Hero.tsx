import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="hero">
      <div className="site-container hero-grid">
        <div className="hero-content">
          <p className="eyebrow">
            Supporting children and communities across Uganda
          </p>

          <h1>
            Together, we can give every child a safer and brighter future.
          </h1>

          <p className="hero-description">
            The Guvnor Ace Foundation supports vulnerable children, families
            and communities through food assistance, education, healthcare,
            protection and sustainable opportunities.
          </p>

          <div className="hero-actions">
            <Link href="/donate" className="primary-button">
              Donate Today
            </Link>

            <Link href="/programmes" className="secondary-button">
              Discover Our Work
            </Link>
          </div>

          <div className="trust-points">
            <span>Community-led</span>
            <span>Transparent</span>
            <span>Safeguarding-focused</span>
          </div>
        </div>

        <div className="hero-media">
          <div className="hero-image-wrapper">
            <Image
              src="/images/hero.jpg"
              alt="Children receiving food support in Uganda"
              fill
              priority
              className="hero-image"
              sizes="(max-width: 920px) 100vw, 45vw"
            />
          </div>

          <div className="hero-message">
            <strong>Hope begins with practical support.</strong>
            <p>One meal, one school day and one safe opportunity at a time.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
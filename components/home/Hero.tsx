import Image from "next/image";
import Link from "next/link";
import type { HomeHeroContent } from "@/lib/cms/home";

export default function Hero({ content }: { content: HomeHeroContent }) {
  const imageUrl = content.imageUrl ?? "/images/hero.jpg";

  return (
    <section className="gaf-hero" aria-labelledby="hero-heading">
      <div className="site-container gaf-hero-grid">
        <div className="gaf-hero-copy">
          <p className="gaf-hero-kicker">
            {content.kicker}
          </p>

          <h1 id="hero-heading">
            {content.title}
          </h1>

          <p className="gaf-hero-description">
            {content.description}
          </p>

          <div className="gaf-hero-actions">
            <Link href="/donate" className="gaf-primary-cta">
              <span>♥</span>
              Donate Now
            </Link>

            <Link href="/programmes" className="gaf-secondary-cta">
              Discover Our Work
              <span>→</span>
            </Link>
          </div>

          <div className="gaf-hero-trust">
            <div>
              <strong>Uganda based</strong>
              <span>Working with local communities</span>
            </div>

            <div>
              <strong>Safeguarding focused</strong>
              <span>Dignity, privacy and wellbeing first</span>
            </div>

            <div>
              <strong>Transparent reporting</strong>
              <span>Verified information only</span>
            </div>
          </div>
        </div>

        <div className="gaf-hero-media">
          <div className="gaf-hero-image-shell">
            <Image
              src={imageUrl}
              alt={content.imageAlt}
              fill
              priority
              className="gaf-hero-image"
              sizes="(max-width: 980px) 100vw, 50vw"
            />

            <div className="gaf-hero-overlay" />

            <div className="gaf-hero-quote">
              <span>“</span>
              <p>
                Every child deserves the opportunity to feel safe, supported
                and able to build a brighter future.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="site-container">
        <div className="gaf-hero-feature-strip">
          <article>
            <span className="gaf-feature-icon">♡</span>
            <div>
              <strong>Child protection</strong>
              <p>Safeguarding is central to our work.</p>
            </div>
          </article>

          <article>
            <span className="gaf-feature-icon">✦</span>
            <div>
              <strong>Community-led</strong>
              <p>Support shaped around real local needs.</p>
            </div>
          </article>

          <article>
            <span className="gaf-feature-icon">✓</span>
            <div>
              <strong>Accountability</strong>
              <p>Responsible use of funds and reporting.</p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

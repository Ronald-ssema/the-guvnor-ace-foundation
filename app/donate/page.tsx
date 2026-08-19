import Image from "next/image";
import Link from "next/link";

import DonationOptions from "@/components/donations/DonationOptions";
import DonationFaq from "@/components/donations/DonationFaq";
import { getSiteEditorSettings, isExternalHref } from "@/lib/cms/siteEditor";
import { getWebsiteImageSettings } from "@/lib/cms/websiteImages";

import { createPageMetadata } from "@/lib/seo";
export const metadata = createPageMetadata({
  title: "Donate | Support Children in Uganda",
  description:
    "Support The Guvnor Ace Foundation and help vulnerable children and families in Uganda through food assistance, education, safeguarding and community programmes.",
  path: "/donate",
});

export default async function DonatePage() {
  const [settings, websiteImages] = await Promise.all([
    getSiteEditorSettings(),
    getWebsiteImageSettings(),
  ]);
  const hero = settings.pages.donate;
  const heroImage = websiteImages.slots.donate;

  const heroActions = [
    {
      label: hero.primaryLabel,
      href: hero.primaryHref,
      external: isExternalHref(hero.primaryHref),
      className: "primary-button",
    },
    {
      label: hero.secondaryLabel,
      href: hero.secondaryHref,
      external: isExternalHref(hero.secondaryHref),
      className: "secondary-button",
    },
  ];

  return (
    <div className="donate-page">
      <section className="donate-hero" aria-labelledby="donate-hero-heading">
        <div
          className={`site-container donate-hero-grid${heroImage.visible ? "" : " donate-hero-no-image"}`}
        >
          <div className="donate-hero-copy">
            <p className="page-hero-eyebrow">{hero.eyebrow}</p>
            <h1 id="donate-hero-heading">{hero.title}</h1>
            <p className="donate-hero-description">{hero.description}</p>

            <div className="donate-hero-actions">
              {heroActions.map((action) => {
                const content = (
                  <>
                    {action.label}
                    <span aria-hidden="true">{action.external ? "↗" : "→"}</span>
                  </>
                );

                return action.external ? (
                  <a
                    key={`${action.href}-${action.label}`}
                    href={action.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={action.className}
                  >
                    {content}
                  </a>
                ) : (
                  <Link
                    key={`${action.href}-${action.label}`}
                    href={action.href}
                    className={action.className}
                  >
                    {content}
                  </Link>
                );
              })}
            </div>

            <div className="donate-hero-assurance" aria-label="Donation assurance">
              <span aria-hidden="true">✓</span>
              <p>
                <strong>Secure ways to give</strong>
                PayPal and GoFundMe payments are completed on their official websites.
              </p>
            </div>
          </div>

          {heroImage.visible && (
            <figure className="donate-hero-visual">
              <Image
                src={heroImage.src}
                alt={heroImage.alt}
                fill
                sizes="(max-width: 900px) 100vw, 47vw"
                priority
                unoptimized={heroImage.src.startsWith("http")}
              />
              <figcaption>
                <span>Your support in action</span>
                <strong>Food, education and practical care</strong>
              </figcaption>
            </figure>
          )}
        </div>
      </section>

      <section
        className="page-section page-section-soft"
        id="donation-options"
        aria-labelledby="donation-options-heading"
      >
        <div className="site-container">
          <div className="page-section-header">
            <div>
              <p className="section-eyebrow">Three simple ways to help</p>

              <h2 id="donation-options-heading">
                Choose the option that works for you.
              </h2>
            </div>

            <p>
              Pay online through an official payment provider or use Airtel
              Money in Uganda. Online payment pages open securely in a new tab.
            </p>
          </div>

          <DonationOptions donations={settings.donations} />
        </div>
      </section>

      <section className="page-section donation-trust-section">
        <div className="site-container">
          <div className="donation-trust-grid">
            <article>
              <span aria-hidden="true">✓</span>
              <div>
                <h3>Official links</h3>
                <p>
                  PayPal and GoFundMe process online payments on their secure
                  websites. We never ask for your card details by email.
                </p>
              </div>
            </article>

            <article>
              <span aria-hidden="true">✓</span>
              <div>
                <h3>Questions and receipts</h3>
                <p>
                  Keep the confirmation from PayPal, GoFundMe or Airtel Money.
                  Contact us if you need help confirming a contribution.
                </p>
              </div>
            </article>

            <article>
              <span aria-hidden="true">✓</span>
              <div>
                <h3>Transparent reporting</h3>
                <p>
                  Every contribution supports our charitable mission and
                  practical work with children, families and communities.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <DonationFaq paypalHref={settings.donations.paypal} />

      <section className="page-section">
        <div className="site-container">
          <div className="cta-panel">
            <div>
              <h2>Need help making a donation?</h2>
              <p>
                Our team can help with payment questions, receipts and
                fundraising support.
              </p>
            </div>

            <div className="cta-panel-actions">
              <Link href="/contact" className="primary-button">
                Contact Our Team
                <span aria-hidden="true">→</span>
              </Link>

              <a
                href={settings.donations.paypal}
                target="_blank"
                rel="noopener noreferrer"
                className="secondary-button"
              >
                Donate with PayPal
                <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

import Link from "next/link";

import DonationOptions from "@/components/donations/DonationOptions";
import { PageHero } from "@/components/ui/PageHero";
import { supportLinks } from "@/lib/supportLinks";

import { createPageMetadata } from "@/lib/seo";
export const metadata = createPageMetadata({
  title: "Donate | Support Children in Uganda",
  description:
    "Support The Guvnor Ace Foundation and help vulnerable children and families in Uganda through food assistance, education, safeguarding and community programmes.",
  path: "/donate",
});

export default function DonatePage() {
  return (
    <>
      <PageHero
        eyebrow="Support our mission"
        title="Help us give children food, education and hope."
        description="Donate securely in moments. Choose PayPal, GoFundMe or Airtel Money and your support can help fund practical programmes for vulnerable children and families in Uganda."
        actions={[
          {
            label: "Donate securely with PayPal",
            href: supportLinks.paypal,
            external: true,
          },
          {
            label: "Donate on GoFundMe",
            href: supportLinks.goFundMe,
            variant: "secondary",
            external: true,
          },
        ]}
      />

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

          <DonationOptions />
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
                href={supportLinks.paypal}
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
    </>
  );
}

import Link from "next/link";

import DonationOptions from "@/components/donations/DonationOptions";
import { PageHero } from "@/components/ui/PageHero";

export const metadata = {
  title: "Donate",
  description:
    "Support The Guvnor Ace Foundation through GoFundMe, PayPal or other official support options.",
};

export default function DonatePage() {
  return (
    <>
      <PageHero
        eyebrow="Support our mission"
        title="Help us give children food, education and hope."
        description="Choose a secure and convenient way to support practical programmes for vulnerable children, families and communities in Uganda."
        actions={[
          {
            label: "Choose a Donation Method",
            href: "#donation-options",
          },
          {
            label: "See Our Work",
            href: "/programmes",
            variant: "secondary",
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
              <p className="section-eyebrow">Official support options</p>

              <h2 id="donation-options-heading">
                Choose how you would like to give.
              </h2>
            </div>

            <p>
              Our official donation and support links are listed below. Each
              external service opens securely in a new browser tab.
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
                  Use only the donation links published on this website and our
                  verified Foundation channels.
                </p>
              </div>
            </article>

            <article>
              <span aria-hidden="true">✓</span>
              <div>
                <h3>Questions and receipts</h3>
                <p>
                  Contact our team if you need confirmation, further
                  information or assistance with a donation.
                </p>
              </div>
            </article>

            <article>
              <span aria-hidden="true">✓</span>
              <div>
                <h3>Transparent reporting</h3>
                <p>
                  We are committed to responsible programme delivery and clear
                  reporting as verified information becomes available.
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
              <h2>Would you like to discuss your support?</h2>
              <p>
                Contact the Foundation about donations, partnerships,
                fundraising or practical support for our programmes.
              </p>
            </div>

            <div className="cta-panel-actions">
              <Link href="/contact" className="primary-button">
                Contact Our Team
                <span aria-hidden="true">→</span>
              </Link>

              <Link href="/reports" className="secondary-button">
                View Transparency
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

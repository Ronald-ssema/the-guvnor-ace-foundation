import Link from "next/link";

import { PageHero } from "@/components/ui/PageHero";

export const metadata = {
  title: "Donate",
};

const supportOptions = [
  {
    title: "Donate through GoFundMe",
    description:
      "Support the Foundation through our official fundraising campaign.",
    href: "#",
    action: "Donate securely",
  },
  {
    title: "Partner with us",
    description:
      "Businesses and organisations can support programmes through responsible partnerships.",
    href: "/contact",
    action: "Discuss a partnership",
  },
  {
    title: "Volunteer your skills",
    description:
      "Contribute time, expertise or professional services to support programme delivery.",
    href: "/volunteer",
    action: "Volunteer with us",
  },
];

export default function DonatePage() {
  return (
    <>
      <PageHero
        eyebrow="Support our mission"
        title="Help us give children food, education and hope."
        description="Your contribution supports practical programmes for vulnerable children, families and communities in Uganda."
        actions={[
          {
            label: "Donate Through GoFundMe",
            href: "#",
          },
          {
            label: "View Our Work",
            href: "/programmes",
            variant: "secondary",
          },
        ]}
      />

      <section className="page-section page-section-soft">
        <div className="site-container">
          <div className="page-section-header">
            <div>
              <p className="section-eyebrow">Ways to help</p>
              <h2>Choose how you would like to support.</h2>
            </div>

            <p>
              Every form of responsible support can contribute to safer and
              brighter opportunities for vulnerable children.
            </p>
          </div>

          <div className="feature-grid">
            {supportOptions.map((option, index) => (
              <Link className="feature-card" href={option.href} key={option.title}>
                <span className="feature-card-number">0{index + 1}</span>
                <h3>{option.title}</h3>
                <p>{option.description}</p>

                <span className="feature-card-link">
                  {option.action}
                  <span aria-hidden="true">→</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="site-container">
          <div className="cta-panel">
            <div>
              <h2>Questions before donating?</h2>
              <p>
                Contact the Foundation for clarification about campaigns,
                receipts, programme support and available donation methods.
              </p>
            </div>

            <div className="cta-panel-actions">
              <Link href="/contact" className="primary-button">
                Contact Our Team
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

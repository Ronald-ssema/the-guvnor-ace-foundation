import Link from "next/link";

import { PageHero } from "@/components/ui/PageHero";

export const metadata = {
  title: "Reports and Transparency",
};

const reports = [
  {
    category: "Programme report",
    title: "Annual impact report",
    description:
      "A verified annual summary of programmes, activities, lessons and outcomes.",
  },
  {
    category: "Financial transparency",
    title: "Income and expenditure summary",
    description:
      "An approved summary explaining how received funds were used across programmes and operational needs.",
  },
  {
    category: "Campaign update",
    title: "Fundraising and delivery update",
    description:
      "Verified campaign totals and programme outcomes following reconciliation and review.",
  },
];

export default function ReportsPage() {
  return (
    <>
      <PageHero
        eyebrow="Transparency and accountability"
        title="Clear reporting builds lasting trust."
        description="This section will publish verified programme summaries, campaign updates and financial information when each report has been reviewed and approved."
        actions={[
          {
            label: "Contact Us",
            href: "/contact",
          },
          {
            label: "Read Our Impact Approach",
            href: "/impact",
            variant: "secondary",
          },
        ]}
      />

      <section className="page-section page-section-soft">
        <div className="site-container">
          <div className="page-section-header">
            <div>
              <p className="section-eyebrow">Foundation reports</p>
              <h2>Responsible information, published carefully.</h2>
            </div>

            <p>
              We do not publish unverified statistics. Reports will be added
              after internal review and approval.
            </p>
          </div>

          <div className="feature-grid">
            {reports.map((report) => (
              <article className="feature-card" key={report.title}>
                <span className="feature-card-number">{report.category}</span>

                <h3>{report.title}</h3>
                <p>{report.description}</p>

                <span className="feature-card-link">Coming soon</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="site-container">
          <div className="cta-panel">
            <div>
              <h2>Have a transparency enquiry?</h2>
              <p>
                Contact the Foundation for questions about programme records,
                receipts, reports or accountability.
              </p>
            </div>

            <div className="cta-panel-actions">
              <Link href="/contact" className="primary-button">
                Contact the Foundation
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

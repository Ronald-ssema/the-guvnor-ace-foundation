import Link from "next/link";
import {
  FaChild,
  FaComments,
  FaFileContract,
  FaHandHoldingHeart,
  FaShieldAlt,
  FaUserLock,
} from "react-icons/fa";

import { PageHero } from "@/components/ui/PageHero";

export const metadata = {
  title: "Policies",
  description:
    "Read The Guvnor Ace Foundation policies covering safeguarding, child protection, privacy, complaints, donations and website use.",
};

const policies = [
  {
    number: "01",
    title: "Safeguarding Policy",
    description:
      "How we protect children, vulnerable people, volunteers and community members from harm.",
    href: "/safeguarding",
    icon: <FaShieldAlt aria-hidden="true" />,
    className: "policy-safeguarding",
    updated: "August 2026",
  },
  {
    number: "02",
    title: "Child Protection Policy",
    description:
      "Our standards for protecting children, responding to concerns and promoting their wellbeing.",
    href: "/child-protection",
    icon: <FaChild aria-hidden="true" />,
    className: "policy-child-protection",
    updated: "August 2026",
  },
  {
    number: "03",
    title: "Privacy Policy",
    description:
      "How we collect, use, store and protect personal information responsibly.",
    href: "/privacy",
    icon: <FaUserLock aria-hidden="true" />,
    className: "policy-privacy",
    updated: "August 2026",
  },
  {
    number: "04",
    title: "Terms and Conditions",
    description:
      "The terms governing the use of our website, information and online services.",
    href: "/terms",
    icon: <FaFileContract aria-hidden="true" />,
    className: "policy-terms",
    updated: "August 2026",
  },
  {
    number: "05",
    title: "Complaints Policy",
    description:
      "How supporters, beneficiaries and community members can raise concerns or complaints.",
    href: "/complaints",
    icon: <FaComments aria-hidden="true" />,
    className: "policy-complaints",
    updated: "August 2026",
  },
  {
    number: "06",
    title: "Donation and Refund Policy",
    description:
      "Important information about donations, payment methods, mistakes and refund requests.",
    href: "/donation-refund",
    icon: <FaHandHoldingHeart aria-hidden="true" />,
    className: "policy-donations",
    updated: "August 2026",
  },
];

export default function PoliciesPage() {
  return (
    <>
      <PageHero
        eyebrow="Governance and accountability"
        title="Our policies protect people and build trust."
        description="Our policies explain the standards that guide our safeguarding, data protection, donations, complaints and responsible programme delivery."
        actions={[
          {
            label: "Read Safeguarding",
            href: "/safeguarding",
          },
          {
            label: "Contact the Foundation",
            href: "/contact",
            variant: "secondary",
          },
        ]}
      />

      <section
        className="policies-section"
        aria-labelledby="policies-heading"
      >
        <div className="site-container">
          <div className="policies-header">
            <div>
              <p className="section-eyebrow">Foundation policies</p>

              <h2 id="policies-heading">
                Clear standards for responsible action.
              </h2>
            </div>

            <p>
              Select a policy below to read how The Guvnor Ace Foundation
              approaches safeguarding, accountability, privacy and public
              engagement.
            </p>
          </div>

          <div className="policies-grid">
            {policies.map((policy) => (
              <Link
                key={policy.title}
                href={policy.href}
                className={`policy-card ${policy.className}`}
              >
                <div className="policy-card-top">
                  <span className="policy-number">{policy.number}</span>

                  <span className="policy-icon">
                    {policy.icon}
                  </span>
                </div>

                <div className="policy-card-content">
                  <h3>{policy.title}</h3>
                  <p>{policy.description}</p>
                </div>

                <div className="policy-card-footer">
                  <span>Updated {policy.updated}</span>

                  <strong>
                    Read policy
                    <span aria-hidden="true">→</span>
                  </strong>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="policy-support-section">
        <div className="site-container">
          <div className="cta-panel">
            <div>
              <h2>Do you have a policy or safeguarding enquiry?</h2>

              <p>
                Contact the Foundation if you need clarification, wish to raise
                a concern or require further information about our standards.
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

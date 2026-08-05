import Link from "next/link";

const policies = [
  {
    href: "/safeguarding",
    title: "Safeguarding Policy",
    description:
      "Our commitment to protecting children and vulnerable people from harm, abuse, neglect and exploitation.",
  },
  {
    href: "/child-protection",
    title: "Child Protection Policy",
    description:
      "The standards, responsibilities and reporting expectations that guide our work involving children.",
  },
  {
    href: "/privacy",
    title: "Privacy Policy",
    description:
      "How we collect, use, retain and protect personal information.",
  },
  {
    href: "/terms",
    title: "Terms and Conditions",
    description:
      "The conditions governing the use of this website and its information.",
  },
  {
    href: "/donation-refund",
    title: "Donation and Refund Policy",
    description:
      "How donations are processed and how mistaken or disputed payments are handled.",
  },
  {
    href: "/complaints",
    title: "Complaints Policy",
    description:
      "How concerns and complaints can be raised, reviewed and responded to fairly.",
  },
];

export default function PoliciesPage() {
  return (
    <main>
      <section className="page-header">
        <div className="site-container page-header-content">
          <p className="eyebrow">Governance and trust</p>

          <h1>Our policies and commitments.</h1>

          <p>
            These policies explain the standards we aim to follow when working
            with children, communities, donors, volunteers and website
            visitors.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="site-container policy-card-grid">
          {policies.map((policy) => (
            <Link href={policy.href} className="policy-card" key={policy.href}>
              <span>Foundation policy</span>
              <h2>{policy.title}</h2>
              <p>{policy.description}</p>
              <strong>Read policy →</strong>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

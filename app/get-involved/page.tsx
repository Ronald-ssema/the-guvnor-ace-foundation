import { createPageMetadata } from "@/lib/seo";

const opportunities = [
  {
    title: "Donate",
    text:
      "Your contribution can help provide food, education, healthcare, protection and community support.",
    link: "https://gofund.me/07e5b2cbf",
    label: "Donate on GoFundMe",
  },
  {
    title: "Volunteer",
    text:
      "Support community activities, communications, fundraising, administration or professional services.",
    link: "mailto:guvnorace@gmail.com?subject=Volunteer with The Guvnor Ace Foundation",
    label: "Contact us to volunteer",
  },
  {
    title: "Partner with us",
    text:
      "We welcome responsible partnerships with schools, charities, companies, community groups and professionals.",
    link: "mailto:guvnorace@gmail.com?subject=Partnership enquiry",
    label: "Discuss a partnership",
  },
  {
    title: "Follow and share",
    text:
      "Help raise awareness by following our official platforms and sharing verified foundation activities.",
    link: "https://linktr.ee/guvnoracefoundation",
    label: "View our official links",
  },
];

export const metadata = createPageMetadata({
  title: "Get Involved",
  description:
    "Support The Guvnor Ace Foundation by donating, volunteering, partnering with us or helping raise awareness for vulnerable children and communities in Uganda.",
  path: "/get-involved",
});

export default function GetInvolvedPage() {
  return (
    <main>
      <section className="page-header">
        <div className="site-container page-header-content">
          <p className="eyebrow">Get involved</p>
          <h1>Together, we can create lasting change.</h1>
          <p>
            There are many ways to support vulnerable children and communities,
            including donating, volunteering, partnering and raising awareness.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="site-container involvement-grid">
          {opportunities.map((opportunity) => (
            <article className="involvement-card" key={opportunity.title}>
              <h2>{opportunity.title}</h2>
              <p>{opportunity.text}</p>

              <a
                href={opportunity.link}
                target={opportunity.link.startsWith("http") ? "_blank" : undefined}
                rel={
                  opportunity.link.startsWith("http")
                    ? "noopener noreferrer"
                    : undefined
                }
                className="secondary-button"
              >
                {opportunity.label}
              </a>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

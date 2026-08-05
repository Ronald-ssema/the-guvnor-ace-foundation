import Image from "next/image";
import Link from "next/link";

const programmes = [
  {
    title: "Food and Nutrition",
    description:
      "Providing practical food assistance and nutrition support to vulnerable children and families.",
    image: "/images/food-drive.jpg",
  },
  {
    title: "Education Support",
    description:
      "Helping children access learning materials, school support and opportunities to continue their education.",
    image: "/images/education.jpg",
  },
  {
    title: "Child and Family Support",
    description:
      "Working alongside families and communities to respond to urgent needs with dignity and care.",
    image: "/images/child-1.jpg",
  },
];

const impactItems = [
  {
    value: "Reporting soon",
    label: "Children supported",
  },
  {
    value: "Reporting soon",
    label: "Meals provided",
  },
  {
    value: "Reporting soon",
    label: "Families reached",
  },
  {
    value: "Reporting soon",
    label: "Community activities",
  },
];

export default function TrustSections() {
  return (
    <>
      <section className="section soft-section" id="programmes">
        <div className="site-container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Our programmes</p>
              <h2>Practical support shaped around real community needs.</h2>
            </div>

            <p>
              Our work focuses on dignity, child protection, accountability and
              direct community engagement.
            </p>
          </div>

          <div className="programme-grid">
            {programmes.map((programme) => (
              <article className="programme-card image-card" key={programme.title}>
                <div className="card-image">
                  <Image
                    src={programme.image}
                    alt={programme.title}
                    fill
                    className="content-image"
                    sizes="(max-width: 920px) 100vw, 33vw"
                  />
                </div>

                <div className="card-content">
                  <h3>{programme.title}</h3>
                  <p>{programme.description}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="section-action">
            <Link href="/programmes" className="secondary-button">
              Explore All Programmes
            </Link>
          </div>
        </div>
      </section>

      <section className="section" id="impact">
        <div className="site-container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Our impact</p>
              <h2>Honest reporting builds lasting trust.</h2>
            </div>

            <p>
              We will publish verified programme totals and financial updates
              as reporting is completed. We do not publish unconfirmed figures.
            </p>
          </div>

          <div className="stats-grid">
            {impactItems.map((item) => (
              <article key={item.label}>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </article>
            ))}
          </div>

          <div className="transparency-panel">
            <div>
              <p className="eyebrow">Transparency</p>
              <h3>Clear reporting for donors, partners and communities.</h3>
            </div>

            <p>
              Our reports section will include verified project summaries,
              expenditure information, campaign updates and supporting evidence
              where appropriate.
            </p>

            <Link href="/reports">View Reports</Link>
          </div>
        </div>
      </section>

      <section className="section cream-section">
        <div className="site-container involvement-grid">
          <article className="involvement-card">
            <p className="eyebrow">Volunteer</p>
            <h2>Give your time and skills.</h2>
            <p>
              Support community activities, fundraising, administration,
              communications or professional services.
            </p>

            <Link href="/volunteer" className="primary-button">
              Become a Volunteer
            </Link>
          </article>

          <article className="involvement-card involvement-card-dark">
            <p className="eyebrow">Partnerships</p>
            <h2>Help us create sustainable impact.</h2>
            <p>
              We welcome responsible partnerships with businesses, schools,
              charities, community groups and professional organisations.
            </p>

            <Link href="/partnerships" className="light-button">
              Partner With Us
            </Link>
          </article>
        </div>
      </section>

      <section className="section story-feature">
        <div className="site-container story-feature-grid">
          <div className="story-feature-image">
            <Image
              src="/images/child-2.jpg"
              alt="Children supported through community outreach"
              fill
              className="content-image"
              sizes="(max-width: 920px) 100vw, 50vw"
            />
          </div>

          <div className="story-feature-copy">
            <p className="eyebrow">Stories with dignity</p>
            <h2>Every story must be shared responsibly.</h2>

            <p>
              We aim to show the impact of our work without exploiting children
              or families. Personal stories should only be published with
              appropriate permission and safeguarding consideration.
            </p>

            <Link href="/safeguarding" className="secondary-button">
              Read Our Safeguarding Commitment
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

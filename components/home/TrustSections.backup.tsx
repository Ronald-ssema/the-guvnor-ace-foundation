import Image from "next/image";
import Link from "next/link";

const programmes = [
  {
    title: "Food & Nutrition",
    description:
      "Providing practical food support and essential supplies to vulnerable children and families.",
    image: "/images/food-drive.jpg",
    href: "/programmes#food-and-nutrition",
    number: "01",
  },
  {
    title: "Education",
    description:
      "Helping children access learning materials, educational support and opportunities to build brighter futures.",
    image: "/images/education.jpg",
    href: "/programmes#education",
    number: "02",
  },
  {
    title: "Children & Families",
    description:
      "Supporting children and families facing hardship through compassionate, practical and community-led assistance.",
    image: "/images/child-1.jpg",
    href: "/programmes#family-support",
    number: "03",
  },
];

const principles = [
  {
    icon: "♡",
    title: "Safeguarding",
    text: "Protecting the dignity, privacy and wellbeing of children.",
  },
  {
    icon: "✓",
    title: "Accountability",
    text: "Responsible management, evidence and transparent reporting.",
  },
  {
    icon: "✦",
    title: "Community-led",
    text: "Responding to real needs alongside the communities we serve.",
  },
];

export default function TrustSections() {
  return (
    <>
      <section className="gaf-programmes">
        <div className="site-container">
          <div className="gaf-section-intro">
            <div>
              <p className="gaf-section-kicker">What we do</p>

              <h2>
                Practical action.
                <br />
                Meaningful change.
              </h2>
            </div>

            <div className="gaf-section-intro-copy">
              <p>
                Our programmes respond to real community needs while keeping
                dignity, safeguarding and accountability at the centre of
                every decision.
              </p>

              <Link href="/programmes">
                Explore all programmes <span>→</span>
              </Link>
            </div>
          </div>

          <div className="gaf-programme-grid">
            {programmes.map((programme) => (
              <Link
                href={programme.href}
                className="gaf-programme-card"
                key={programme.title}
              >
                <div className="gaf-programme-image">
                  <Image
                    src={programme.image}
                    alt={programme.title}
                    fill
                    sizes="(max-width: 800px) 100vw, 33vw"
                  />

                  <span className="gaf-programme-number">
                    {programme.number}
                  </span>
                </div>

                <div className="gaf-programme-copy">
                  <div>
                    <h3>{programme.title}</h3>
                    <p>{programme.description}</p>
                  </div>

                  <span className="gaf-programme-arrow">↗</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="gaf-principles">
        <div className="site-container">
          <div className="gaf-principles-grid">
            <div className="gaf-principles-heading">
              <p className="gaf-section-kicker">How we work</p>

              <h2>
                Trust must be
                <br />
                earned.
              </h2>

              <p>
                Strong charitable work requires more than good intentions. It
                requires responsible systems, safeguarding and accountability.
              </p>
            </div>

            <div className="gaf-principle-list">
              {principles.map((principle) => (
                <article key={principle.title}>
                  <span>{principle.icon}</span>

                  <div>
                    <h3>{principle.title}</h3>
                    <p>{principle.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="gaf-reporting" id="impact">
        <div className="site-container gaf-reporting-grid">
          <div>
            <p className="gaf-section-kicker gaf-section-kicker-light">
              Our impact
            </p>

            <h2>
              Evidence before
              <br />
              numbers.
            </h2>
          </div>

          <div className="gaf-reporting-copy">
            <p className="gaf-reporting-lead">
              We are building a reporting system that prioritises verified
              information over impressive but unconfirmed figures.
            </p>

            <p>
              Programme totals, expenditure information and project outcomes
              will be published as records are reviewed and verified.
            </p>

            <Link href="/reports">
              View reports <span>→</span>
            </Link>
          </div>
        </div>

        <div className="site-container">
          <div className="gaf-report-status">
            <article>
              <span>Children supported</span>
              <strong>Verification in progress</strong>
            </article>

            <article>
              <span>Families reached</span>
              <strong>Verification in progress</strong>
            </article>

            <article>
              <span>Programme activity</span>
              <strong>Verification in progress</strong>
            </article>

            <article>
              <span>Financial reporting</span>
              <strong>Being prepared</strong>
            </article>
          </div>
        </div>
      </section>

      <section className="gaf-story">
        <div className="site-container gaf-story-grid">
          <div className="gaf-story-image">
            <Image
              src="/images/child-2.jpg"
              alt="Children and families supported through community work"
              fill
              sizes="(max-width: 900px) 100vw, 50vw"
            />
          </div>

          <div className="gaf-story-copy">
            <p className="gaf-section-kicker">Stories with dignity</p>

            <h2>
              People are more
              <br />
              than their hardship.
            </h2>

            <p>
              We believe stories should demonstrate impact without exploiting
              the children and families at the centre of our work. Privacy,
              consent and safeguarding must always come first.
            </p>

            <Link href="/safeguarding">
              Our safeguarding commitment <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="gaf-action">
        <div className="site-container">
          <div className="gaf-action-panel">
            <div>
              <p className="gaf-section-kicker gaf-section-kicker-light">
                Take action
              </p>

              <h2>
                Help build a brighter
                <br />
                future.
              </h2>
            </div>

            <div className="gaf-action-buttons">
              <Link href="/donate" className="gaf-action-donate">
                Donate now
                <span>→</span>
              </Link>

              <Link href="/volunteer">
                Volunteer
                <span>→</span>
              </Link>

              <Link href="/partnerships">
                Partner with us
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

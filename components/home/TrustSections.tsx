import Image from "next/image";
import Link from "next/link";
import type { SiteEditorSettings } from "@/lib/cms/siteEditor";
import type { ResolvedWebsiteImages, WebsiteImageSlotKey } from "@/lib/cms/websiteImages";

const programmes = [
  {
    title: "Food & Nutrition",
    description:
      "Providing practical food support and essential supplies to vulnerable children and families.",
    imageKey: "food" as WebsiteImageSlotKey,
    href: "/programmes#food-and-nutrition",
    number: "01",
  },
  {
    title: "Education",
    description:
      "Helping children access learning materials, educational support and opportunities to build brighter futures.",
    imageKey: "education" as WebsiteImageSlotKey,
    href: "/programmes#education",
    number: "02",
  },
  {
    title: "Children & Families",
    description:
      "Supporting children and families facing hardship through compassionate, practical and community-led assistance.",
    imageKey: "childOne" as WebsiteImageSlotKey,
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

export default function TrustSections({
  settings,
  images,
}: {
  settings: SiteEditorSettings;
  images: ResolvedWebsiteImages["slots"];
}) {
  const sections = settings.homeSections;

  return (
    <div className="gaf-home-sections">
      {sections.programmes.visible && (
      <section className="gaf-programmes" style={{ order: sections.programmes.order }}>
        <div className="site-container">
          <div className="gaf-section-intro">
            <div>
              <p className="gaf-section-kicker">{sections.programmes.kicker}</p>

              <h2>{sections.programmes.title}</h2>
            </div>

            <div className="gaf-section-intro-copy">
              <p>{sections.programmes.body}</p>

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
                {images[programme.imageKey].visible && (
                <div className="gaf-programme-image">
                  <Image
                    src={images[programme.imageKey].src}
                    alt={images[programme.imageKey].alt}
                    fill
                    sizes="(max-width: 800px) 100vw, 33vw"
                    unoptimized={images[programme.imageKey].src.startsWith("http")}
                  />

                  <span className="gaf-programme-number">
                    {programme.number}
                  </span>
                </div>
                )}

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
      )}

      {sections.principles.visible && (
      <section className="gaf-principles" style={{ order: sections.principles.order }}>
        <div className="site-container">
          <div className="gaf-principles-grid">
            <div className="gaf-principles-heading">
              <p className="gaf-section-kicker">{sections.principles.kicker}</p>

              <h2>{sections.principles.title}</h2>

              <p>{sections.principles.body}</p>
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
      )}

      {sections.impact.visible && (
      <section className="gaf-reporting" id="impact" style={{ order: sections.impact.order }}>
        <div className="site-container gaf-reporting-grid">
          <div>
            <p className="gaf-section-kicker gaf-section-kicker-light">
              {sections.impact.kicker}
            </p>

            <h2>{sections.impact.title}</h2>
          </div>

          <div className="gaf-reporting-copy">
            <p className="gaf-reporting-lead">{sections.impact.body}</p>

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
      )}

      {sections.story.visible && (
      <section className="gaf-story" style={{ order: sections.story.order }}>
        <div className="site-container gaf-story-grid">
          <div className="gaf-story-image">
            <Image
              src={sections.story.imageUrl || "/images/child-2.jpg"}
              alt={sections.story.imageAlt}
              fill
              sizes="(max-width: 900px) 100vw, 50vw"
            />
            {sections.story.caption && (
              <span className="gaf-story-caption">{sections.story.caption}</span>
            )}
          </div>

          <div className="gaf-story-copy">
            <p className="gaf-section-kicker">{sections.story.kicker}</p>

            <h2>{sections.story.title}</h2>

            <p>{sections.story.body}</p>

            <Link href="/safeguarding">
              Our safeguarding commitment <span>→</span>
            </Link>
          </div>
        </div>
      </section>
      )}

      {sections.action.visible && (
      <section className="gaf-action" style={{ order: sections.action.order }}>
        <div className="site-container">
          <div className="gaf-action-panel">
            <div>
              <p className="gaf-section-kicker gaf-section-kicker-light">
                {sections.action.kicker}
              </p>

              <h2>{sections.action.title}</h2>
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
      )}
    </div>
  );
}

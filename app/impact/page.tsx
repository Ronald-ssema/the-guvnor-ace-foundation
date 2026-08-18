import Image from "next/image";
import Link from "next/link";

import { PageHero } from "@/components/ui/PageHero";

import { createPageMetadata } from "@/lib/seo";
import { getSiteEditorSettings, isExternalHref } from "@/lib/cms/siteEditor";
export const metadata = createPageMetadata({
  title: "Impact & Accountability",
  description:
    "Learn how The Guvnor Ace Foundation documents programme delivery, community impact, safeguarding and responsible use of resources in Uganda.",
  path: "/impact",
});

const principles = [
  {
    title: "Community-led planning",
    description:
      "We listen to children, families and community representatives before designing support.",
  },
  {
    title: "Responsible delivery",
    description:
      "Assistance should be distributed fairly, respectfully and according to identified needs.",
  },
  {
    title: "Evidence and records",
    description:
      "Programme activities should be supported by records, photographs, receipts and reporting.",
  },
  {
    title: "Continuous improvement",
    description:
      "Feedback helps us improve programmes and respond effectively to community needs.",
  },
];

export default async function ImpactPage() {
  const settings = await getSiteEditorSettings();
  const hero = settings.pages.impact;

  return (
    <>
      <PageHero
        eyebrow={hero.eyebrow}
        title={hero.title}
        description={hero.description}
        actions={[
          {
            label: hero.primaryLabel,
            href: hero.primaryHref,
            external: isExternalHref(hero.primaryHref),
          },
          {
            label: hero.secondaryLabel,
            href: hero.secondaryHref,
            variant: "secondary",
            external: isExternalHref(hero.secondaryHref),
          },
        ]}
      />

      <section className="page-section">
        <div className="site-container content-grid">
          <div className="content-image">
            <Image
              src="/images/child-2.jpg"
              alt="Children participating in a community programme in Uganda"
              fill
              sizes="(max-width: 950px) 100vw, 50vw"
              style={{ objectFit: "cover" }}
            />
          </div>

          <div className="content-copy">
            <p className="section-eyebrow">How we measure progress</p>
            <h2>Accountability is central to our mission.</h2>

            <p>
              Our reporting is based on verified programme records,
              beneficiary safeguarding, responsible financial management and
              honest communication with supporters.
            </p>

            <Link href="/reports" className="secondary-button">
              Read Our Reports
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="page-section page-section-soft">
        <div className="site-container">
          <div className="page-section-header">
            <div>
              <p className="section-eyebrow">Our approach</p>
              <h2>How responsible impact is created.</h2>
            </div>

            <p>
              We prioritise dignity, evidence, clear communication and
              continuous programme improvement.
            </p>
          </div>

          <div className="feature-grid">
            {principles.map((principle, index) => (
              <article className="feature-card" key={principle.title}>
                <span className="feature-card-number">0{index + 1}</span>
                <h3>{principle.title}</h3>
                <p>{principle.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

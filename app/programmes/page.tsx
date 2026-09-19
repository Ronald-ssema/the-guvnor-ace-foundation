import Image from "next/image";
import Link from "next/link";

import { PageHero } from "@/components/ui/PageHero";

import { createPageMetadata } from "@/lib/seo";
import { getSiteEditorSettings, isExternalHref } from "@/lib/cms/siteEditor";
import { getWebsiteImageSettings, type WebsiteImageSlotKey } from "@/lib/cms/websiteImages";
export const metadata = createPageMetadata({
  title: "Our Programmes",
  description:
    "Explore The Guvnor Ace Foundation programmes supporting vulnerable children and families in Uganda through food assistance, education, child protection and community outreach.",
  path: "/programmes",
});

const programmes = [
  {
    id: "food-and-nutrition",
    title: "Food and Nutrition",
    description:
      "Providing meals and essential food assistance to vulnerable children and families.",
    imageKey: "food" as WebsiteImageSlotKey,
    activities: [
      "Community food distribution",
      "Emergency household food support",
      "Nutrition awareness and referrals",
      "Assistance for children facing hunger",
    ],
  },
  {
    id: "education",
    title: "Education Support",
    description:
      "Helping children access learning materials, school support and educational opportunities.",
    imageKey: "education" as WebsiteImageSlotKey,
    activities: [
      "School materials and learning supplies",
      "Education-related family support",
      "Mentoring and encouragement",
      "Community learning initiatives",
    ],
  },
  {
    id: "community-outreach",
    title: "Community Outreach",
    description:
      "Working with communities to identify practical needs and deliver responsible assistance.",
    imageKey: "about" as WebsiteImageSlotKey,
    activities: [
      "Community needs assessment",
      "Family support referrals",
      "Safeguarding-led outreach",
      "Partnership and volunteer engagement",
    ],
  },
];

export default async function ProgrammesPage() {
  const [settings, websiteImages] = await Promise.all([
    getSiteEditorSettings(),
    getWebsiteImageSettings(),
  ]);
  const hero = settings.pages.programmes;

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

      {programmes.map((programme, index) => (
        <section
          className={`page-section ${
            index % 2 === 1 ? "page-section-soft" : ""
          }`}
          id={programme.id}
          key={programme.id}
        >
          <div className={`site-container content-grid ${websiteImages.slots[programme.imageKey].visible ? "" : "content-grid-without-image"}`}>
            {websiteImages.slots[programme.imageKey].visible && (
            <div
              className="content-image"
              style={{ order: index % 2 === 1 ? 2 : 1 }}
            >
              <Image
                src={websiteImages.slots[programme.imageKey].src}
                alt={websiteImages.slots[programme.imageKey].alt}
                fill
                sizes="(max-width: 950px) 100vw, 50vw"
                style={{ objectFit: "cover" }}
                unoptimized={websiteImages.slots[programme.imageKey].src.startsWith("http")}
              />
            </div>
            )}

            <div
              className="content-copy"
              style={{ order: index % 2 === 1 ? 1 : 2 }}
            >
              <p className="section-eyebrow">
                Programme {String(index + 1).padStart(2, "0")}
              </p>

              <h2>{programme.title}</h2>

              <p>{programme.description}</p>

              <ul className="info-list">
                {programme.activities.map((activity) => (
                  <li key={activity}>
                    <span className="info-list-icon" aria-hidden="true">
                      ✓
                    </span>
                    <span>{activity}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      ))}

      <section className="page-section">
        <div className="site-container">
          <div className="cta-panel">
            <div>
              <h2>Help us deliver practical support.</h2>
              <p>
                Donations, partnerships and responsible volunteers help us
                extend support to more children and families.
              </p>
            </div>

            <div className="cta-panel-actions">
              <Link href="/donate" className="primary-button">
                Donate Today
              </Link>

              <Link href="/volunteer" className="secondary-button">
                Volunteer
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

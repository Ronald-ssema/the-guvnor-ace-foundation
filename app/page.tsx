import Hero from "@/components/home/Hero";
import HomeSections from "@/components/home/HomeSections";
import TrustSections from "@/components/home/TrustSections";
import { organizationJsonLd } from "@/lib/structured-data";
import { createPageMetadata } from "@/lib/seo";
import { getHomeHeroContent } from "@/lib/cms/home";


export const metadata = createPageMetadata({
  title: "The Guvnor Ace Foundation | Supporting Vulnerable Children in Uganda",
  description:
    "The Guvnor Ace Foundation supports vulnerable children, families and communities in Uganda through education, food assistance, healthcare, safeguarding and sustainable community programmes.",
  path: "/",
});

export const revalidate = 300;

export default async function HomePage() {
  const hero = await getHomeHeroContent();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationJsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <Hero content={hero} />
      <HomeSections />
      <TrustSections />
    </>
  );
}

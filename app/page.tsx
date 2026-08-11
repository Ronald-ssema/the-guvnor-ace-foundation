import Hero from "@/components/home/Hero";
import HomeSections from "@/components/home/HomeSections";
import TrustSections from "@/components/home/TrustSections";
import { organizationJsonLd } from "@/lib/structured-data";

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationJsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <Hero />
      <HomeSections />
      <TrustSections />
    </>
  );
}

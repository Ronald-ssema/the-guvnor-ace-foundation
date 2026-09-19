import Hero from "@/components/home/Hero";
import HomeSections from "@/components/home/HomeSections";
import TrustSections from "@/components/home/TrustSections";
import { organizationJsonLd } from "@/lib/structured-data";
import { createPageMetadata } from "@/lib/seo";
import { headers } from "next/headers";


export const metadata = createPageMetadata({
  title: "The Guvnor Ace Foundation | Supporting Vulnerable Children in Uganda",
  description:
    "The Guvnor Ace Foundation supports vulnerable children, families and communities in Uganda through education, food assistance, healthcare, safeguarding and sustainable community programmes.",
  path: "/",
});

export default async function HomePage() {
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    <>
      <script
        nonce={nonce}
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

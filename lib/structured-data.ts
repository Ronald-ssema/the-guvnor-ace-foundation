import { siteConfig } from "@/lib/site";
import type { SiteEditorSettings } from "@/lib/cms/siteEditor";

export function buildOrganizationJsonLd(
  contact: SiteEditorSettings["contact"],
) {
  return {
    "@context": "https://schema.org",
    "@type": "NGO",
    "@id": `${siteConfig.url}/#organization`,

    name: siteConfig.name,
    alternateName: siteConfig.shortName,
    url: siteConfig.url,

    logo: {
      "@type": "ImageObject",
      url: `${siteConfig.url}/images/logo.png`,
    },

    description: siteConfig.description,

    address: {
      "@type": "PostalAddress",
      addressLocality: "Wakiso District",
      addressCountry: "UG",
    },

    areaServed: {
      "@type": "Country",
      name: "Uganda",
    },

    contactPoint: {
      "@type": "ContactPoint",
      contactType: "general enquiries",
      email: contact.email,
      telephone: contact.phoneHref,
      availableLanguage: ["English"],
    },

    sameAs: [
      "https://www.youtube.com/@guvnoracefoundation",
      "https://www.instagram.com/guvnoracefoundation",
      "https://www.tiktok.com/@guvnoracefoundation",
    ],
  };
}

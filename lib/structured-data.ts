import { siteConfig } from "@/lib/site";

export const organizationJsonLd = {
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
    email: "guvnorace@gmail.com",
    telephone: "+256752462740",
    availableLanguage: ["English"],
  },

  sameAs: [
    "https://www.youtube.com/@guvnoracefoundation",
    "https://www.instagram.com/guvnoracefoundation",
    "https://www.tiktok.com/@guvnoracefoundation",
  ],
};

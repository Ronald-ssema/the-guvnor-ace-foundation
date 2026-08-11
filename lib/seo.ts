import type { Metadata } from "next";

import { siteConfig } from "@/lib/site";

type PageSeoOptions = {
  title: string;
  description: string;
  path: string;
  image?: string;
};

export function createPageMetadata({
  title,
  description,
  path,
  image = siteConfig.socialImage,
}: PageSeoOptions): Metadata {
  return {
    title,
    description,

    alternates: {
      canonical: path,
    },

    openGraph: {
      type: "website",
      url: path,
      siteName: siteConfig.name,
      title,
      description,
      locale: "en_GB",
      images: [
        {
          url: image,
          alt: `${title} - ${siteConfig.name}`,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

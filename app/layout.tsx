import type { Metadata } from "next";

import "./globals.css";

import FoundationAssistant from "@/components/ai/FoundationAssistant";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),

  title: {
    default:
      "The Guvnor Ace Foundation | Supporting Vulnerable Children in Uganda",
    template: "%s | The Guvnor Ace Foundation",
  },

  description: siteConfig.description,

  applicationName: siteConfig.name,

  authors: [
    {
      name: siteConfig.name,
    },
  ],

  creator: siteConfig.name,
  publisher: siteConfig.name,

  keywords: [
    "The Guvnor Ace Foundation",
    "Guvnor Ace Foundation",
    "Uganda charity",
    "children charity Uganda",
    "support vulnerable children Uganda",
    "education support Uganda",
    "child safeguarding Uganda",
    "community support Uganda",
    "Wakiso charity",
    "charity in Uganda",
    "community development Uganda",
  ],

  robots: {
    index: true,
    follow: true,

    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  openGraph: {
    type: "website",
    url: siteConfig.url,
    siteName: siteConfig.name,

    title:
      "The Guvnor Ace Foundation | Supporting Vulnerable Children in Uganda",

    description: siteConfig.description,

    locale: "en_GB",

    images: [
      {
        url: siteConfig.socialImage,
        width: 1000,
        height: 664,
        alt: "The Guvnor Ace Foundation supporting children and communities in Uganda",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title:
      "The Guvnor Ace Foundation | Supporting Vulnerable Children in Uganda",

    description:
      "Supporting vulnerable children, families and communities across Uganda.",

    images: [siteConfig.socialImage],
  },

  icons: {
    icon: "/images/logo.png",
    apple: "/images/logo.png",
  },

  verification: {
    google: "b19s01xfRpkm9jLUyy5JsY74iAepQmcaUcE07BZXpWc",
  },

  category: "charity",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <Navbar />

        <main id="main-content">{children}</main>

        <Footer />

        <FoundationAssistant />
      </body>
    </html>
  );
}

import type { Metadata } from "next";

import "./globals.css";

import FoundationAssistant from "@/components/ai/FoundationAssistant";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://the-guvnor-ace-foundation.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default:
      "The Guvnor Ace Foundation | Supporting Vulnerable Children in Uganda",
    template: "%s | The Guvnor Ace Foundation",
  },

  description:
    "The Guvnor Ace Foundation supports vulnerable children, families and communities across Uganda through education, food assistance, healthcare, safeguarding and sustainable community programmes.",

  keywords: [
    "The Guvnor Ace Foundation",
    "Guvnor Ace Foundation",
    "Uganda charity",
    "children charity Uganda",
    "support vulnerable children Uganda",
    "education support Uganda",
    "child safeguarding Uganda",
    "community support Uganda",
    "donate to children Uganda",
    "Wakiso charity",
    "charity in Uganda",
    "support children Uganda",
    "community development Uganda",
  ],

  authors: [
    {
      name: "The Guvnor Ace Foundation",
    },
  ],

  creator: "The Guvnor Ace Foundation",
  publisher: "The Guvnor Ace Foundation",

  alternates: {
    canonical: "/",
  },

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
    url: siteUrl,
    siteName: "The Guvnor Ace Foundation",
    title:
      "The Guvnor Ace Foundation | Supporting Vulnerable Children in Uganda",
    description:
      "Supporting vulnerable children, families and communities across Uganda through education, food assistance, healthcare, safeguarding and sustainable community programmes.",
    locale: "en_GB",
  },

  twitter: {
    card: "summary_large_image",
    title:
      "The Guvnor Ace Foundation | Supporting Vulnerable Children in Uganda",
    description:
      "Supporting vulnerable children, families and communities across Uganda.",
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
import type { Metadata } from "next";
import "./globals.css";

import Footer from "@/components/layout/Footer";
import FoundationAssistant from "@/components/ai/FoundationAssistant";

export const metadata: Metadata = {
  title: {
    default: "The Guvnor Ace Foundation",
    template: "%s | The Guvnor Ace Foundation",
  },
  description:
    "Supporting vulnerable children, families and communities across Uganda through food assistance, education, healthcare and child protection.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <main>{children}</main>
        <Footer />
        <FoundationAssistant />
      </body>
    </html>
  );
}

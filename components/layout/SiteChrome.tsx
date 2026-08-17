"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import FoundationAssistant from "@/components/ai/FoundationAssistant";
import GlobalDonateCta from "@/components/donations/GlobalDonateCta";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

export default function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) return <>{children}</>;

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <Navbar />
      <main id="main-content">{children}</main>
      <Footer />
      {pathname !== "/donate" && <GlobalDonateCta />}
      <FoundationAssistant />
    </>
  );
}

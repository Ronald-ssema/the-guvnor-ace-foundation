"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import FoundationAssistant from "@/components/ai/FoundationAssistant";
import GlobalDonateCta from "@/components/donations/GlobalDonateCta";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import PageGalleryOutlet from "@/components/media/PageGalleryOutlet";
import type { SiteEditorSettings } from "@/lib/cms/siteEditor";
import type { ResolvedWebsiteImages } from "@/lib/cms/websiteImages";

export default function SiteChrome({
  children,
  galleries,
  settings,
}: {
  children: ReactNode;
  galleries: ResolvedWebsiteImages["pageGalleries"];
  settings: SiteEditorSettings;
}) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) return <>{children}</>;

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <Navbar />
      <main id="main-content">
        {children}
        <PageGalleryOutlet galleries={galleries} />
      </main>
      <Footer contact={settings.contact} />
      {pathname !== "/donate" && <GlobalDonateCta donations={settings.donations} />}
      <FoundationAssistant contact={settings.contact} />
    </>
  );
}

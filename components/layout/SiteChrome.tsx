"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import FoundationAssistant from "@/components/ai/FoundationAssistant";
import GlobalDonateCta from "@/components/donations/GlobalDonateCta";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import PageGalleryOutlet from "@/components/media/PageGalleryOutlet";
import WebsiteCopyRuntime from "@/components/cms/WebsiteCopyRuntime";
import CookieConsent from "@/components/privacy/CookieConsent";
import type { SiteEditorSettings } from "@/lib/cms/siteEditor";
import type { ResolvedWebsiteImages } from "@/lib/cms/websiteImages";
import type { WebsiteTextSettings } from "@/lib/cms/websiteText";

export default function SiteChrome({
  children,
  galleries,
  settings,
  textSettings,
}: {
  children: ReactNode;
  galleries: ResolvedWebsiteImages["pageGalleries"];
  settings: SiteEditorSettings;
  textSettings: WebsiteTextSettings;
}) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) return <>{children}</>;

  return (
    <>
      <div className="cms-copy-scope" data-cms-scope="global-header">
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        <Navbar />
      </div>
      <main id="main-content" data-cms-scope="page">
        {children}
        <PageGalleryOutlet galleries={galleries} />
      </main>
      <div className="cms-copy-scope" data-cms-scope="global-footer">
        <Footer contact={settings.contact} />
      </div>
      <div className="cms-copy-scope" data-cms-scope="global-tools">
        {pathname !== "/donate" && <GlobalDonateCta donations={settings.donations} />}
        <FoundationAssistant contact={settings.contact} />
        <CookieConsent />
      </div>
      <WebsiteCopyRuntime settings={textSettings} />
    </>
  );
}

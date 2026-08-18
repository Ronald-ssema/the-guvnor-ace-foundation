import Link from "next/link";

import type { SiteEditorSettings } from "@/lib/cms/siteEditor";

export default function GlobalDonateCta({
  donations,
}: {
  donations: SiteEditorSettings["donations"];
}) {
  return (
    <aside className="global-donation-cta" aria-label="Quick donation">
      <div className="global-donation-cta-copy">
        <strong>Help a child today</strong>
        <span>Give securely in one click</span>
      </div>

      <div className="global-donation-cta-actions">
        <Link href="/donate">Ways to give</Link>
        <a
          href={donations.paypal}
          target="_blank"
          rel="noopener noreferrer"
          className="global-donation-cta-button"
        >
          Donate now
          <span aria-hidden="true">↗</span>
        </a>
      </div>
    </aside>
  );
}

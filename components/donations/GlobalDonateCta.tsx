import Link from "next/link";

import { supportLinks } from "@/lib/supportLinks";

export default function GlobalDonateCta() {
  return (
    <aside className="global-donation-cta" aria-label="Quick donation">
      <div className="global-donation-cta-copy">
        <strong>Help a child today</strong>
        <span>Give securely in one click</span>
      </div>

      <div className="global-donation-cta-actions">
        <Link href="/donate">Ways to give</Link>
        <a
          href={supportLinks.paypal}
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

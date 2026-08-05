import Link from "next/link";

export default function ReportsPage() {
  return (
    <main>
      <section className="page-header">
        <div className="site-container page-header-content">
          <p className="eyebrow">Transparency and accountability</p>
          <h1>Reports and programme updates.</h1>
          <p>
            This section will publish verified project summaries, campaign
            updates and financial information when each report is approved.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="site-container reports-grid">
          <article className="report-card">
            <span>Programme report</span>
            <h2>Annual impact report</h2>
            <p>
              The first verified annual impact report is being prepared. No
              unconfirmed statistics will be published.
            </p>
            <strong>Coming soon</strong>
          </article>

          <article className="report-card">
            <span>Financial transparency</span>
            <h2>Income and expenditure summary</h2>
            <p>
              This report will explain how received funds were used across
              approved programmes and operational needs.
            </p>
            <strong>Coming soon</strong>
          </article>

          <article className="report-card">
            <span>Campaign update</span>
            <h2>Current fundraising progress</h2>
            <p>
              Verified campaign totals and programme outcomes will be added
              after reconciliation and review.
            </p>
            <strong>Coming soon</strong>
          </article>
        </div>

        <div className="site-container report-contact">
          <p>
            For transparency enquiries, contact{" "}
            <a href="mailto:guvnorace@gmail.com">guvnorace@gmail.com</a>.
          </p>

          <Link href="/contact" className="secondary-button">
            Contact the Foundation
          </Link>
        </div>
      </section>
    </main>
  );
}

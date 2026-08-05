import Link from "next/link";

export default function PartnershipsPage() {
  return (
    <main>
      <section className="page-header">
        <div className="site-container page-header-content">
          <p className="eyebrow">Partnerships</p>
          <h1>Work with us to create responsible, lasting impact.</h1>
          <p>
            We welcome conversations with businesses, schools, charities,
            professionals and community organisations.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="site-container partnership-grid">
          <article>
            <h2>Corporate support</h2>
            <p>
              Sponsor an approved programme, contribute professional services
              or support a responsible fundraising campaign.
            </p>
          </article>

          <article>
            <h2>Schools and community groups</h2>
            <p>
              Organise awareness activities, fundraising initiatives or
              carefully planned educational partnerships.
            </p>
          </article>

          <article>
            <h2>Charity and NGO collaboration</h2>
            <p>
              Explore joint programmes, safeguarding knowledge, training or
              coordinated community support.
            </p>
          </article>
        </div>

        <div className="site-container partnership-cta">
          <h2>Start a partnership conversation.</h2>
          <p>
            Contact the foundation with your organisation name, proposal,
            location and intended contribution.
          </p>

          <Link href="/contact" className="primary-button">
            Contact Our Team
          </Link>
        </div>
      </section>
    </main>
  );
}

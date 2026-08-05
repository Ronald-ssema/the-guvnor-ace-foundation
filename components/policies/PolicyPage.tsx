import Link from "next/link";

type PolicySection = {
  heading: string;
  paragraphs?: string[];
  points?: string[];
};

type PolicyPageProps = {
  eyebrow: string;
  title: string;
  summary: string;
  lastReviewed: string;
  sections: PolicySection[];
  urgentNotice?: {
    title: string;
    text: string;
  };
};

export default function PolicyPage({
  eyebrow,
  title,
  summary,
  lastReviewed,
  sections,
  urgentNotice,
}: PolicyPageProps) {
  return (
    <main>
      <section className="page-header policy-hero">
        <div className="site-container page-header-content">
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p>{summary}</p>

          <div className="policy-meta">
            <span>Last reviewed: {lastReviewed}</span>
            <span>The Guvnor Ace Foundation</span>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="site-container policy-layout">
          <aside className="policy-sidebar">
            <strong>Policy navigation</strong>

            <nav aria-label="Policy navigation">
              {sections.map((section, index) => (
                <a href={`#section-${index + 1}`} key={section.heading}>
                  {section.heading}
                </a>
              ))}
            </nav>

            <Link href="/policies" className="policy-back-link">
              View all policies
            </Link>
          </aside>

          <article className="policy-document">
            {urgentNotice && (
              <div className="policy-alert">
                <strong>{urgentNotice.title}</strong>
                <p>{urgentNotice.text}</p>
              </div>
            )}

            {sections.map((section, index) => (
              <section id={`section-${index + 1}`} key={section.heading}>
                <h2>{section.heading}</h2>

                {section.paragraphs?.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}

                {section.points && (
                  <ul>
                    {section.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}

            <div className="policy-contact-box">
              <div>
                <p className="eyebrow">Questions about this policy?</p>
                <h2>Contact the foundation.</h2>
              </div>

              <div>
                <a href="mailto:guvnorace@gmail.com">
                  guvnorace@gmail.com
                </a>

                <a href="tel:+256752462740">
                  +256 752 462 740
                </a>
              </div>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}

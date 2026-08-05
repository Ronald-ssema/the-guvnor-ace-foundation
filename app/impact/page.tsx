import Image from "next/image";

export default function ImpactPage() {
  return (
    <main>
      <section className="page-header">
        <div className="site-container page-header-content">
          <p className="eyebrow">Our impact</p>
          <h1>Transparent action. Meaningful community change.</h1>
          <p>
            We believe supporters deserve clear information about what we do,
            how assistance is delivered and how community needs are identified.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="site-container impact-layout">
          <div className="section-image">
            <Image
              src="/images/child-2.jpg"
              alt="Children supported through community outreach"
              fill
              className="content-image"
              sizes="(max-width: 920px) 100vw, 50vw"
            />
          </div>

          <div>
            <p className="eyebrow">How we measure progress</p>
            <h2>Accountability is central to our mission.</h2>

            <p className="about-copy">
              Our impact reporting should be based on verified programme
              records, beneficiary safeguarding, responsible financial
              management and honest communication with supporters.
            </p>

            <div className="impact-principles">
              <article>
                <h3>Community-led planning</h3>
                <p>
                  We listen to children, families and community representatives
                  before designing support activities.
                </p>
              </article>

              <article>
                <h3>Responsible delivery</h3>
                <p>
                  Assistance should be distributed fairly, respectfully and
                  according to clearly identified needs.
                </p>
              </article>

              <article>
                <h3>Evidence and records</h3>
                <p>
                  Programme activities should be supported by appropriate
                  records, photographs, receipts and internal reporting.
                </p>
              </article>

              <article>
                <h3>Continuous improvement</h3>
                <p>
                  Feedback helps us improve our programmes and respond more
                  effectively to community needs.
                </p>
              </article>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

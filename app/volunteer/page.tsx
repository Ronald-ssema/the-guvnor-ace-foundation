import { PageHero } from "@/components/ui/PageHero";

import { createPageMetadata } from "@/lib/seo";
export const metadata = createPageMetadata({
  title: "Volunteer With Us",
  description:
    "Volunteer with The Guvnor Ace Foundation and use your time, skills and experience to support responsible community programmes in Uganda.",
  path: "/volunteer",
});

const opportunities = [
  "Community outreach support",
  "Fundraising and donor engagement",
  "Photography, video and communications",
  "Education and mentoring support",
  "Professional or technical services",
  "Event organisation",
];

export default function VolunteerPage() {
  return (
    <>
      <PageHero
        eyebrow="Volunteer with us"
        title="Use your skills to support meaningful work."
        description="We welcome responsible volunteer enquiries from Uganda and internationally. All volunteering must follow our safeguarding and conduct requirements."
        actions={[
          {
            label: "Read Safeguarding",
            href: "/safeguarding",
          },
          {
            label: "Contact Our Team",
            href: "/contact",
            variant: "secondary",
          },
        ]}
      />

      <section className="page-section">
        <div className="site-container content-grid">
          <div className="content-copy">
            <p className="section-eyebrow">Ways to support</p>
            <h2>Bring your experience, time and compassion.</h2>

            <p>
              Volunteer opportunities depend on current programme needs,
              safeguarding requirements and operational capacity.
            </p>

            <ul className="info-list">
              {opportunities.map((opportunity) => (
                <li key={opportunity}>
                  <span className="info-list-icon" aria-hidden="true">
                    ✓
                  </span>
                  <span>{opportunity}</span>
                </li>
              ))}
            </ul>
          </div>

          <form className="professional-form">
            <div className="form-grid">
              <div className="form-field">
                <label htmlFor="full-name">Full name</label>
                <input id="full-name" name="fullName" type="text" required />
              </div>

              <div className="form-field">
                <label htmlFor="email-address">Email address</label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="country">Country</label>
                <input id="country" name="country" type="text" required />
              </div>

              <div className="form-field">
                <label htmlFor="availability">Availability</label>
                <select id="availability" name="availability">
                  <option value="">Select availability</option>
                  <option value="one-off">One-off support</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="remote">Remote support</option>
                </select>
              </div>

              <div className="form-field form-field-full">
                <label htmlFor="skills">Skills and experience</label>
                <textarea id="skills" name="skills" required />
              </div>

              <div className="form-field form-field-full">
                <label htmlFor="motivation">
                  Why would you like to volunteer?
                </label>
                <textarea id="motivation" name="motivation" required />
              </div>

              <div className="form-field form-field-full">
                <button className="primary-button" type="submit">
                  Submit Enquiry
                  <span aria-hidden="true">→</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}

export default function VolunteerPage() {
  return (
    <main>
      <section className="page-header">
        <div className="site-container page-header-content">
          <p className="eyebrow">Volunteer with us</p>
          <h1>Use your skills to support meaningful work.</h1>
          <p>
            We welcome responsible volunteer enquiries from Uganda and
            internationally.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="site-container contact-grid">
          <div>
            <h2>Ways you may be able to help</h2>

            <ul className="feature-list">
              <li>Community outreach support</li>
              <li>Fundraising and donor engagement</li>
              <li>Photography, video and communications</li>
              <li>Education and mentoring support</li>
              <li>Professional or technical services</li>
              <li>Event organisation</li>
            </ul>
          </div>

          <form
            className="contact-form"
            action="mailto:guvnorace@gmail.com"
            method="post"
            encType="text/plain"
          >
            <label>
              Full name
              <input name="name" required />
            </label>

            <label>
              Email address
              <input type="email" name="email" required />
            </label>

            <label>
              Country
              <input name="country" />
            </label>

            <label>
              Skills and experience
              <textarea name="skills" rows={5} required />
            </label>

            <label>
              Availability
              <textarea name="availability" rows={3} />
            </label>

            <button type="submit">Send Volunteer Enquiry</button>
          </form>
        </div>
      </section>
    </main>
  );
}

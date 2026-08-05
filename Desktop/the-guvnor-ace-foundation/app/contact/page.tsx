export default function ContactPage() {
  return (
    <main>
      <section className="page-header">
        <div className="site-container page-header-content">
          <p className="eyebrow">Contact us</p>
          <h1>Connect with The Guvnor Ace Foundation.</h1>
          <p>
            Contact us about donations, volunteering, partnerships, programme
            enquiries or community support.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="site-container contact-grid">
          <div>
            <p className="eyebrow">Official contact details</p>
            <h2>We would be pleased to hear from you.</h2>

            <div className="contact-details">
              <article>
                <h3>Location</h3>
                <p>Bunamwaya–Lubowa, Entebbe Road, Wakiso District, Uganda</p>
              </article>

              <article>
                <h3>Email</h3>
                <a href="mailto:guvnorace@gmail.com">
                  guvnorace@gmail.com
                </a>
              </article>

              <article>
                <h3>Telephone and WhatsApp</h3>
                <a href="tel:+256752462740">+256 752 462 740</a>
              </article>
            </div>
          </div>

          <div className="contact-social-card">
            <h2>Follow our work</h2>

            <a
              href="https://www.facebook.com/profile.php?id=61592290623772"
              target="_blank"
              rel="noopener noreferrer"
            >
              Facebook
            </a>

            <a
              href="https://instagram.com/guvnoracefoundation"
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram
            </a>

            <a
              href="https://www.tiktok.com/@guvnoracefoundation"
              target="_blank"
              rel="noopener noreferrer"
            >
              TikTok
            </a>

            <a
              href="https://www.youtube.com/@guvnoracefoundation"
              target="_blank"
              rel="noopener noreferrer"
            >
              YouTube
            </a>

            <a
              href="https://linktr.ee/guvnoracefoundation"
              target="_blank"
              rel="noopener noreferrer"
            >
              Linktree
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="site-container">
        <div className="footer-grid footer-grid-expanded">
          <div className="footer-brand">
            <h3>The Guvnor Ace Foundation</h3>

            <p>
              Supporting vulnerable children and communities across Uganda
              through food, education, healthcare and child protection.
            </p>

            <p>Seguku, Entebbe Road, Wakiso District, Uganda</p>

            <p>
              Email:{" "}
              <a href="mailto:guvnorace@gmail.com">
                guvnorace@gmail.com
              </a>
            </p>

            <p>
              Phone:{" "}
              <a href="tel:+256752462740">
                +256 752 462 740
              </a>
            </p>
          </div>

          <div>
            <h3>Explore</h3>
            <Link href="/about">About Us</Link>
            <Link href="/programmes">Our Work</Link>
            <Link href="/impact">Impact</Link>
            <Link href="/stories">Stories</Link>
            <Link href="/reports">Reports</Link>
          </div>

          <div>
            <h3>Get Involved</h3>
            <Link href="/volunteer">Volunteer</Link>
            <Link href="/partnerships">Partnerships</Link>
            <Link href="/contact">Contact</Link>

            <a
              href="https://gofund.me/07e5b2cbf"
              target="_blank"
              rel="noopener noreferrer"
            >
              Donate on GoFundMe
            </a>

            <a
              href="https://linktr.ee/guvnoracefoundation"
              target="_blank"
              rel="noopener noreferrer"
            >
              Linktree
            </a>
          </div>

          <div>
            <h3>Policies</h3>
            <Link href="/safeguarding">Safeguarding</Link>
            <Link href="/child-protection">Child Protection</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms and Conditions</Link>
            <Link href="/donation-refund">Donations and Refunds</Link>
            <Link href="/complaints">Complaints</Link>
          </div>

          <div>
            <h3>Follow Us</h3>

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
          </div>
        </div>

        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} The Guvnor Ace Foundation
          </span>

          <div className="footer-legal-links">
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/complaints">Complaints</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

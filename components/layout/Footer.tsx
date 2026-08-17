import Link from "next/link";
import {
  FaEnvelope,
  FaFacebookF,
  FaInstagram,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaTiktok,
  FaYoutube,
} from "react-icons/fa";
import { SiLinktree } from "react-icons/si";

const socialLinks = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/guvnoracefoundation",
    icon: <FaFacebookF aria-hidden="true" />,
    className: "footer-social-facebook",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/guvnoracefoundation",
    icon: <FaInstagram aria-hidden="true" />,
    className: "footer-social-instagram",
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@guvnoracefoundation",
    icon: <FaTiktok aria-hidden="true" />,
    className: "footer-social-tiktok",
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@guvnoracefoundation",
    icon: <FaYoutube aria-hidden="true" />,
    className: "footer-social-youtube",
  },
  {
    label: "Linktree",
    href: "https://linktr.ee/guvnoracefoundation",
    icon: <SiLinktree aria-hidden="true" />,
    className: "footer-social-linktree",
  },
];

export default function Footer() {
  return (
    <footer className="compact-footer">
      <div className="site-container compact-footer-grid">
        <div className="compact-footer-item compact-footer-mission">
          <span className="compact-footer-large-icon" aria-hidden="true">
            ♡
          </span>

          <p>
            We are committed to transparency, accountability and lasting
            impact.
          </p>
        </div>

        <a
          href="mailto:guvnorace@gmail.com"
          className="compact-footer-item"
        >
          <FaEnvelope aria-hidden="true" />
          <span>guvnorace@gmail.com</span>
        </a>

        <a
          href="tel:+256752462740"
          className="compact-footer-item"
        >
          <FaPhoneAlt aria-hidden="true" />
          <span>+256 752 462 740</span>
        </a>

        <div className="compact-footer-item">
          <FaMapMarkerAlt aria-hidden="true" />
          <span>
            Bunamwaya–Lubowa, Entebbe Road, Wakiso District, Uganda.
          </span>
        </div>

        <div className="compact-footer-social-wrapper">
          <span>Follow us</span>

          <div className="compact-footer-socials">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`compact-footer-social ${social.className}`}
                aria-label={social.label}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="compact-footer-legal">
        <div className="site-container compact-footer-legal-inner">
          <span>
            © {new Date().getFullYear()} The Guvnor Ace Foundation
          </span>

          <nav aria-label="Legal and policy links">
            <Link href="/policies">Policies</Link>
            <Link href="/safeguarding">Safeguarding</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/cookies">Cookies</Link>
            <Link href="/accessibility">Accessibility</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/complaints">Complaints</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}

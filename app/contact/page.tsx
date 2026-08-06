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

import { PageHero } from "@/components/ui/PageHero";

export const metadata = {
  title: "Contact Us",
  description:
    "Contact The Guvnor Ace Foundation and follow our official online channels.",
};

const contactMethods = [
  {
    label: "Email",
    title: "Foundation enquiries",
    description:
      "Contact us about donations, volunteering, partnerships and programmes.",
    value: "guvnorace@gmail.com",
    href: "mailto:guvnorace@gmail.com",
    icon: <FaEnvelope aria-hidden="true" />,
  },
  {
    label: "Telephone and WhatsApp",
    title: "Speak with our team",
    description:
      "Contact The Guvnor Ace Foundation during normal working hours.",
    value: "+256 752 462 740",
    href: "tel:+256752462740",
    icon: <FaPhoneAlt aria-hidden="true" />,
  },
  {
    label: "Location",
    title: "Wakiso District, Uganda",
    description:
      "Bunamwaya–Lubowa area, along Entebbe Road, Wakiso District.",
    value: "Learn more about us",
    href: "/about",
    icon: <FaMapMarkerAlt aria-hidden="true" />,
  },
];

const socialLinks = [
  {
    number: "01",
    name: "Facebook",
    username: "Guvnor Ace Foundation",
    href: "https://www.facebook.com/guvnoracefoundation",
    icon: <FaFacebookF aria-hidden="true" />,
    className: "contact-social-facebook",
  },
  {
    number: "02",
    name: "Instagram",
    username: "@guvnoracefoundation",
    href: "https://www.instagram.com/guvnoracefoundation",
    icon: <FaInstagram aria-hidden="true" />,
    className: "contact-social-instagram",
  },
  {
    number: "03",
    name: "TikTok",
    username: "@guvnoracefoundation",
    href: "https://www.tiktok.com/@guvnoracefoundation",
    icon: <FaTiktok aria-hidden="true" />,
    className: "contact-social-tiktok",
  },
  {
    number: "04",
    name: "YouTube",
    username: "@guvnoracefoundation",
    href: "https://www.youtube.com/@guvnoracefoundation",
    icon: <FaYoutube aria-hidden="true" />,
    className: "contact-social-youtube",
  },
  {
    number: "05",
    name: "Linktree",
    username: "All official Foundation links",
    href: "https://linktr.ee/guvnoracefoundation",
    icon: <SiLinktree aria-hidden="true" />,
    className: "contact-social-linktree",
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact us"
        title="We would be pleased to hear from you."
        description="Contact The Guvnor Ace Foundation about donations, volunteering, partnerships, programme enquiries or responsible community support."
        actions={[
          {
            label: "Support Our Mission",
            href: "/donate",
          },
          {
            label: "Volunteer With Us",
            href: "/volunteer",
            variant: "secondary",
          },
        ]}
      />

      <section
        className="contact-details-section"
        aria-labelledby="contact-details-heading"
      >
        <div className="site-container">
          <div className="contact-details-grid">
            {contactMethods.map((method) => (
              <a
                key={method.label}
                href={method.href}
                className="contact-detail-card"
              >
                <span className="contact-detail-icon">
                  {method.icon}
                </span>

                <div className="contact-detail-content">
                  <span className="contact-detail-label">
                    {method.label}
                  </span>

                  <h2>{method.title}</h2>
                  <p>{method.description}</p>

                  <span className="contact-detail-link">
                    {method.value}
                    <span aria-hidden="true">→</span>
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section
        className="contact-social-section"
        aria-labelledby="contact-social-heading"
      >
        <div className="site-container">
          <div className="contact-social-header">
            <div>
              <p className="section-eyebrow">Follow our work</p>

              <h2 id="contact-social-heading">
                Connect with the Foundation online.
              </h2>
            </div>

            <p>
              Follow our official channels for programme updates, stories,
              fundraising campaigns and Foundation news.
            </p>
          </div>

          <div className="contact-social-grid">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`contact-social-card ${social.className}`}
                aria-label={`Visit The Guvnor Ace Foundation on ${social.name}`}
              >
                <span className="contact-social-number">
                  {social.number}
                </span>

                <span className="contact-social-icon">
                  {social.icon}
                </span>

                <h3>{social.name}</h3>
                <p>{social.username}</p>

                <span className="contact-social-action">
                  Visit channel
                  <span aria-hidden="true">→</span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

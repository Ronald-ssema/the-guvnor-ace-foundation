import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";

export const metadata = {
  title: "Contact Us",
};

const contactMethods = [
  {
    label: "Email",
    title: "Foundation enquiries",
    description: "For donations, volunteering, partnerships and programmes.",
    value: "guvnorace@gmail.com",
    href: "mailto:guvnorace@gmail.com",
  },
  {
    label: "Telephone and WhatsApp",
    title: "Speak with our team",
    description: "Contact the Foundation during normal working hours.",
    value: "+256 752 462 740",
    href: "tel:+256752462740",
  },
  {
    label: "Location",
    title: "Wakiso District, Uganda",
    description:
      "Bunamwaya–Lubowa area, along Entebbe Road, Wakiso District.",
    value: "View foundation information",
    href: "/about",
  },
];

const socialLinks = [
  { label: "Facebook", href: "#" },
  { label: "Instagram", href: "#" },
  { label: "TikTok", href: "#" },
  { label: "YouTube", href: "#" },
  { label: "Linktree", href: "#" },
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
            label: "Donate Today",
            href: "/donate",
          },
          {
            label: "Volunteer",
            href: "/volunteer",
            variant: "secondary",
          },
        ]}
      />

      <section className="page-section page-section-soft">
        <div className="site-container">
          <div className="page-section-header">
            <div>
              <p className="section-eyebrow">Official details</p>
              <h2>Choose the best way to reach us.</h2>
            </div>

            <p>
              We aim to respond to genuine enquiries as soon as operationally
              possible.
            </p>
          </div>

          <div className="feature-grid">
            {contactMethods.map((method) => (
              <article className="contact-card" key={method.label}>
                <span className="contact-card-label">{method.label}</span>
                <h3>{method.title}</h3>
                <p>{method.description}</p>
                <a href={method.href}>{method.value}</a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="site-container">
          <div className="page-section-header">
            <div>
              <p className="section-eyebrow">Follow our work</p>
              <h2>Connect with the Foundation online.</h2>
            </div>

            <p>
              Follow verified Foundation channels for programme updates,
              stories and fundraising campaigns.
            </p>
          </div>

          <div className="feature-grid">
            {socialLinks.map((social, index) => (
              <Link className="feature-card" href={social.href} key={social.label}>
                <span className="feature-card-number">0{index + 1}</span>
                <h3>{social.label}</h3>
                <span className="feature-card-link">
                  Visit channel
                  <span aria-hidden="true">→</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

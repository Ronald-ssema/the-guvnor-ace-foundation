import { createPageMetadata } from "@/lib/seo";
import PolicyPageLayout from "@/components/policies/PolicyPageLayout";

export const metadata = createPageMetadata({
  title: "Privacy Policy",
  description:
    "How The Guvnor Ace Foundation may collect, use, protect and responsibly manage personal information.",
  path: "/privacy",
});

const navigation = [
  { label: "Information we collect", href: "#information" },
  { label: "How we use information", href: "#use" },
  { label: "AI assistant", href: "#ai" },
  { label: "Sharing information", href: "#sharing" },
  { label: "Retention & security", href: "#security" },
  { label: "Your choices", href: "#rights" },
  { label: "Cookies & analytics", href: "#cookies" },
  { label: "Contact", href: "#contact" },
];

export default function PrivacyPage() {
  return (
    <PolicyPageLayout
      eyebrow="Privacy"
      title="Privacy Policy"
      description="How The Guvnor Ace Foundation may collect, use, protect and responsibly manage personal information."
      lastReviewed="5 August 2026"
      navigation={navigation}
    >
      <section id="information">
        <h2>Information we may collect</h2>

        <p>
          We aim to collect only information that is reasonably necessary for
          our charitable activities, communications and administration.
        </p>

        <ul>
          <li>Names and contact information.</li>
          <li>Volunteer and partnership enquiry details.</li>
          <li>Messages submitted through contact forms or email.</li>
          <li>
            Donation-related information provided to us by payment platforms.
          </li>
          <li>Website usage and technical information.</li>
          <li>
            Photographs, videos or stories supplied with appropriate permission.
          </li>
        </ul>
      </section>

      <section id="use">
        <h2>How we may use information</h2>

        <p>
          Personal information may be used where reasonably necessary to
          operate the Foundation and respond to people who engage with our work.
        </p>

        <ul>
          <li>Responding to enquiries and requests for information.</li>
          <li>Managing donations, volunteering and partnerships.</li>
          <li>Communicating programme or organisational updates.</li>
          <li>Maintaining safeguarding and organisational records.</li>
          <li>Improving our website and services.</li>
          <li>
            Meeting applicable legal, regulatory, safeguarding or security
            responsibilities.
          </li>
        </ul>
      </section>

      <section id="ai">
        <h2>AI assistant</h2>

        <p>
          Messages submitted to the Foundation&apos;s website AI assistant may
          be processed by an external artificial-intelligence service in order
          to generate a response.
        </p>

        <div className="policy-alert">
          <h3>Protect your personal information</h3>
          <p>
            Visitors should not submit passwords, PINs, payment-card details,
            medical records or highly sensitive personal information through
            the AI assistant.
          </p>
        </div>
      </section>

      <section id="sharing">
        <h2>Sharing information</h2>

        <p>
          We do not intend to sell personal information.
        </p>

        <p>
          Information may be shared with trusted service providers where
          reasonably necessary to provide website, communication, payment or
          organisational services.
        </p>

        <p>
          Information may also be shared where reasonably necessary to protect
          a child or vulnerable person, investigate serious misconduct, prevent
          fraud or comply with an applicable legal obligation.
        </p>
      </section>

      <section id="security">
        <h2>Retention and security</h2>

        <p>
          We aim to retain personal information only for as long as reasonably
          necessary for the purpose for which it was collected, subject to
          safeguarding, accountability, financial and legal requirements.
        </p>

        <p>
          Reasonable organisational and technical measures should be used to
          protect information against unauthorised access, loss, misuse or
          disclosure.
        </p>
      </section>

      <section id="rights">
        <h2>Your choices and rights</h2>

        <p>
          Depending on the circumstances and applicable law, individuals may
          contact us to request access to, correction of or deletion of
          information we hold about them.
        </p>

        <p>
          We may need to retain certain information where there is a legitimate
          safeguarding, legal, financial or organisational reason to do so.
        </p>
      </section>

      <section id="cookies">
        <h2>Cookies and analytics</h2>

        <p>
          Our website may use essential technologies required for the site to
          operate correctly. If analytics or other non-essential tracking
          technologies are introduced, we aim to provide appropriate
          information and controls to visitors.
        </p>
      </section>

      <section id="contact">
        <h2>Questions about privacy?</h2>

        <p>
          If you have a question about how the Foundation handles personal
          information, please contact us.
        </p>

        <div className="policy-contact">
          <h3>Contact The Guvnor Ace Foundation</h3>
          <p>
            Email: guvnorace@gmail.com
            <br />
            Phone: +256 752 462 740
          </p>
        </div>
      </section>
    </PolicyPageLayout>
  );
}

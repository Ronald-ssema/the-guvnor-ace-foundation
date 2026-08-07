import PolicyPageLayout from "@/components/policies/PolicyPageLayout";

const navigation = [
  { label: "Using this website", href: "#use" },
  { label: "Website information", href: "#information" },
  { label: "Donations", href: "#donations" },
  { label: "External services", href: "#external" },
  { label: "Intellectual property", href: "#property" },
  { label: "Acceptable use", href: "#acceptable" },
  { label: "Liability", href: "#liability" },
  { label: "Changes", href: "#changes" },
];

export default function TermsPage() {
  return (
    <PolicyPageLayout
      eyebrow="Legal"
      title="Website Terms & Conditions"
      description="The terms that apply when accessing and using The Guvnor Ace Foundation website and its online services."
      lastReviewed="5 August 2026"
      navigation={navigation}
    >
      <section id="use">
        <h2>Using this website</h2>

        <p>
          By using this website, you agree to use it lawfully, responsibly and
          in a way that does not interfere with its operation or the rights and
          safety of other people.
        </p>

        <p>
          If you do not agree with these terms, you should discontinue use of
          the website.
        </p>
      </section>

      <section id="information">
        <h2>Website information</h2>

        <p>
          We aim to provide accurate and useful information about the
          Foundation, its programmes and ways to support our work.
        </p>

        <p>
          However, website content may be updated, corrected or withdrawn as
          programmes, circumstances and organisational information change.
        </p>

        <p>
          General website information should not be treated as professional
          legal, medical, financial or other specialist advice.
        </p>
      </section>

      <section id="donations">
        <h2>Donations</h2>

        <p>
          Donations may be processed through external payment platforms or
          recognised payment methods listed on our website.
        </p>

        <p>
          Donors are responsible for ensuring that payment details and donation
          amounts are correct before completing a transaction.
        </p>

        <p>
          Specific information about donation corrections and refund requests
          is provided in our Donation & Refund Policy.
        </p>
      </section>

      <section id="external">
        <h2>External websites and services</h2>

        <p>
          Our website may link to services operated by third parties, including
          donation platforms and social-media services.
        </p>

        <p>
          Those services operate under their own terms, privacy practices and
          security arrangements. The Foundation does not control every aspect
          of third-party platforms.
        </p>
      </section>

      <section id="property">
        <h2>Intellectual property</h2>

        <p>
          Unless otherwise stated, Foundation names, branding, written
          materials and original website content should not be copied,
          reproduced or presented as official Foundation material without
          appropriate permission.
        </p>

        <p>
          Third-party trademarks, photographs or materials remain subject to
          the rights of their respective owners.
        </p>
      </section>

      <section id="acceptable">
        <h2>Acceptable use</h2>

        <p>You must not knowingly use this website to:</p>

        <ul>
          <li>Attempt unauthorised access to systems or information.</li>
          <li>Upload malicious code or interfere with website availability.</li>
          <li>Impersonate the Foundation or another person.</li>
          <li>Commit fraud or misrepresent a donation.</li>
          <li>Harass, threaten or exploit another person.</li>
          <li>Submit unlawful or abusive material.</li>
        </ul>
      </section>

      <section id="liability">
        <h2>Availability and liability</h2>

        <p>
          We aim to keep the website available and secure, but continuous or
          error-free access cannot be guaranteed.
        </p>

        <p>
          To the extent permitted by applicable law, the Foundation is not
          responsible for losses arising solely from temporary website
          interruption, third-party service failure or reliance on general
          informational content where reasonable care has been taken.
        </p>
      </section>

      <section id="changes">
        <h2>Changes to these terms</h2>

        <p>
          These terms may be updated when our website, services or
          organisational practices change.
        </p>

        <p>
          The review date displayed on this page indicates when this version
          was last formally reviewed.
        </p>
      </section>

      <div className="policy-contact">
        <h2>Questions about these terms?</h2>
        <p>
          Email: guvnorace@gmail.com
          <br />
          Phone: +256 752 462 740
        </p>
      </div>
    </PolicyPageLayout>
  );
}

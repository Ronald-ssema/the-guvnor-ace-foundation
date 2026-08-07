import PolicyPageLayout from "@/components/policies/PolicyPageLayout";

const navigation = [
  { label: "Purpose", href: "#purpose" },
  { label: "Our safeguarding principles", href: "#principles" },
  { label: "Expected conduct", href: "#conduct" },
  { label: "Reporting a concern", href: "#reporting" },
  { label: "Responding to concerns", href: "#responding" },
  { label: "Review and accountability", href: "#review" },
];

export default function SafeguardingPage() {
  return (
    <PolicyPageLayout
      eyebrow="Safeguarding"
      title="Safeguarding Policy"
      description="Our commitment to protecting children and vulnerable people from abuse, neglect, exploitation and avoidable harm."
      lastReviewed="5 August 2026"
      navigation={navigation}
    >
      <div className="policy-alert">
        <h2>Immediate danger</h2>
        <p>
          If a child or vulnerable person is in immediate danger, contact the
          appropriate local emergency or child-protection authority first.
          You may then contact The Guvnor Ace Foundation on +256 752 462 740.
        </p>
      </div>

      <section id="purpose">
        <h2>Purpose</h2>
        <p>
          The Guvnor Ace Foundation aims to provide a safe, respectful and
          protective environment for every child and vulnerable person involved
          in our work.
        </p>
        <p>
          This policy applies to trustees, staff, volunteers, contractors,
          partners, visitors and anyone representing the Foundation.
        </p>
      </section>

      <section id="principles">
        <h2>Our safeguarding principles</h2>
        <ul>
          <li>The welfare and dignity of children and vulnerable people come first.</li>
          <li>All safeguarding concerns must be taken seriously.</li>
          <li>Concerns should be reported promptly and handled confidentially.</li>
          <li>No person should be treated unfairly because of disability, gender, nationality, religion, background or economic circumstances.</li>
          <li>Photography, filming and storytelling must be respectful and appropriately authorised.</li>
        </ul>
      </section>

      <section id="conduct">
        <h2>Expected conduct</h2>
        <ul>
          <li>Maintain safe and appropriate professional boundaries.</li>
          <li>Avoid being alone with a child where reasonable safeguards are unavailable.</li>
          <li>Never use humiliating, threatening, discriminatory or sexual language.</li>
          <li>Never exchange money, gifts or private communications with a child inappropriately.</li>
          <li>Never publish identifying or sensitive information without appropriate permission.</li>
        </ul>
      </section>

      <section id="reporting">
        <h2>Reporting a concern</h2>
        <p>
          A concern may involve suspected abuse, neglect, exploitation,
          inappropriate conduct, unsafe programme activity or online behaviour.
        </p>
        <p>
          Concerns should be reported to the Foundation using the official email
          address or phone number. Information should be limited to people who
          reasonably need it for safeguarding action.
        </p>
      </section>

      <section id="responding">
        <h2>Responding to concerns</h2>
        <ul>
          <li>Listen calmly and avoid making promises of secrecy.</li>
          <li>Record the concern accurately using the person&apos;s own words where possible.</li>
          <li>Escalate concerns promptly to the appropriate safeguarding lead or authority.</li>
          <li>Protect confidentiality and share information only where necessary.</li>
        </ul>
      </section>

      <section id="review">
        <h2>Review and accountability</h2>
        <p>
          Safeguarding arrangements should be reviewed regularly and improved
          where experience, feedback or changes in risk indicate that stronger
          controls are needed.
        </p>
      </section>

      <div className="policy-contact">
        <h2>Questions or safeguarding concerns?</h2>
        <p>Contact The Guvnor Ace Foundation.</p>
        <p>
          Email: guvnorace@gmail.com
          <br />
          Phone: +256 752 462 740
        </p>
      </div>
    </PolicyPageLayout>
  );
}

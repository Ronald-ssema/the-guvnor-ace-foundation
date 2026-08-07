import PolicyPageLayout from "@/components/policies/PolicyPageLayout";

const navigation = [
  { label: "Our commitment", href: "#commitment" },
  { label: "What you can complain about", href: "#scope" },
  { label: "How to complain", href: "#how" },
  { label: "How we respond", href: "#response" },
  { label: "Confidentiality", href: "#confidentiality" },
  { label: "Further review", href: "#review" },
  { label: "Learning from complaints", href: "#learning" },
];

export default function ComplaintsPage() {
  return (
    <PolicyPageLayout
      eyebrow="Accountability"
      title="Complaints Policy"
      description="How concerns and complaints about The Guvnor Ace Foundation can be raised, reviewed and responded to fairly."
      lastReviewed="5 August 2026"
      navigation={navigation}
    >
      <section id="commitment">
        <h2>Our commitment</h2>

        <p>
          The Guvnor Ace Foundation welcomes constructive feedback and takes
          reasonable complaints seriously.
        </p>

        <p>
          Complaints can help us identify problems, improve our work and
          strengthen the trust of the communities, supporters and partners who
          engage with the Foundation.
        </p>

        <p>
          No person should be disadvantaged simply because they raise a genuine
          concern in good faith.
        </p>
      </section>

      <section id="scope">
        <h2>What you can complain about</h2>

        <p>A complaint may relate to matters such as:</p>

        <ul>
          <li>The conduct of a Foundation representative.</li>
          <li>The delivery of a programme or activity.</li>
          <li>The handling of a donation or supporter enquiry.</li>
          <li>Communication or customer-service concerns.</li>
          <li>Privacy, confidentiality or safeguarding concerns.</li>
          <li>
            A decision or action that you believe was handled unfairly or
            irresponsibly.
          </li>
        </ul>
      </section>

      <section id="how">
        <h2>How to make a complaint</h2>

        <p>
          Complaints may be sent to the Foundation by email or through our
          official telephone contact.
        </p>

        <p>Where possible, please include:</p>

        <ul>
          <li>Your name and preferred contact details.</li>
          <li>A clear description of what happened.</li>
          <li>When and where the matter occurred.</li>
          <li>The people or programme involved, where known.</li>
          <li>Any relevant supporting information.</li>
          <li>The outcome you are seeking.</li>
        </ul>

        <p>
          Anonymous complaints may be considered, although limited information
          may make it more difficult to review the matter properly.
        </p>
      </section>

      <section id="response">
        <h2>How we aim to respond</h2>

        <p>Where reasonably possible, the Foundation aims to:</p>

        <ul>
          <li>Acknowledge a complaint where contact details are available.</li>
          <li>
            Assess whether urgent safety, safeguarding or financial action is
            required.
          </li>
          <li>
            Assign the matter to an appropriate person who is not directly
            involved where reasonably possible.
          </li>
          <li>Review available information fairly.</li>
          <li>
            Provide an outcome or progress update within a reasonable period.
          </li>
        </ul>

        <p>
          Complex matters may require additional time, particularly where
          safeguarding, financial records, third parties or external
          authorities are involved.
        </p>
      </section>

      <section id="confidentiality">
        <h2>Confidentiality</h2>

        <p>
          Complaint information should be shared only with people who
          reasonably need it to assess the concern, protect individuals, meet
          safeguarding responsibilities or comply with applicable law.
        </p>
      </section>

      <section id="review">
        <h2>Further review</h2>

        <p>
          If you believe a complaint was not handled fairly, you may request a
          further internal review and explain the reasons for your request.
        </p>

        <p>
          Serious matters may also be raised with an appropriate regulator,
          law-enforcement body, child-protection authority or payment provider
          where applicable.
        </p>
      </section>

      <section id="learning">
        <h2>Learning from complaints</h2>

        <p>
          The Foundation aims to record significant complaints, identify
          recurring issues and make reasonable improvements where experience
          shows that policies, procedures or controls need strengthening.
        </p>
      </section>

      <div className="policy-contact">
        <h2>Make a complaint</h2>
        <p>
          Email: guvnorace@gmail.com
          <br />
          Phone: +256 752 462 740
        </p>
      </div>
    </PolicyPageLayout>
  );
}

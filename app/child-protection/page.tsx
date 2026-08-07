import PolicyPageLayout from "@/components/policies/PolicyPageLayout";

const navigation = [
  { label: "Our commitment", href: "#commitment" },
  { label: "Best interests of the child", href: "#interests" },
  { label: "Safe conduct", href: "#conduct" },
  { label: "Images & stories", href: "#media" },
  { label: "Digital communication", href: "#digital" },
  { label: "Reporting concerns", href: "#reporting" },
  { label: "Responding to concerns", href: "#response" },
];

export default function ChildProtectionPage() {
  return (
    <PolicyPageLayout
      eyebrow="Child Protection"
      title="Child Protection Policy"
      description="Our standards for protecting the dignity, safety, privacy and wellbeing of children connected with Foundation activities."
      lastReviewed="5 August 2026"
      navigation={navigation}
    >
      <div className="policy-alert">
        <h2>Immediate safety comes first</h2>
        <p>
          If a child appears to be in immediate danger, appropriate emergency
          or child-protection authorities should be contacted without
          unnecessary delay.
        </p>
      </div>

      <section id="commitment">
        <h2>Our commitment</h2>

        <p>
          The Guvnor Ace Foundation believes every child has the right to be
          treated with dignity, respect and care and to participate in
          Foundation activities without abuse, exploitation, neglect,
          discrimination or avoidable harm.
        </p>

        <p>
          Child protection is a responsibility shared by everyone acting on
          behalf of or in connection with the Foundation.
        </p>
      </section>

      <section id="interests">
        <h2>The best interests of the child</h2>

        <p>
          Decisions involving children should place their safety, dignity and
          wellbeing at the centre of reasonable decision-making.
        </p>

        <p>
          Children should be listened to respectfully and should never be
          pressured to share personal experiences for publicity, fundraising or
          organisational purposes.
        </p>
      </section>

      <section id="conduct">
        <h2>Safe conduct around children</h2>

        <p>
          Foundation representatives are expected to maintain appropriate
          professional boundaries.
        </p>

        <ul>
          <li>Never physically, emotionally or sexually abuse a child.</li>
          <li>Never use humiliating, degrading or threatening language.</li>
          <li>
            Avoid unnecessary situations where an adult is isolated with a
            child without reasonable safeguards.
          </li>
          <li>
            Never exchange inappropriate private messages, money or gifts with
            a child.
          </li>
          <li>
            Do not favour, exploit or discriminate against children because of
            background, disability, gender, religion or economic circumstances.
          </li>
        </ul>
      </section>

      <section id="media">
        <h2>Photography, video and children&apos;s stories</h2>

        <p>
          Images and stories involving children should be created and used
          respectfully and only where appropriate permission has been obtained.
        </p>

        <p>
          Content should not unnecessarily reveal sensitive information,
          expose a child to stigma or danger, or portray children in a
          humiliating or exploitative manner.
        </p>
      </section>

      <section id="digital">
        <h2>Digital communication</h2>

        <p>
          Private or informal digital communication between Foundation
          representatives and children should be avoided unless clearly
          necessary, properly authorised and subject to appropriate safeguards.
        </p>

        <p>
          Foundation communication channels should be used wherever reasonably
          possible.
        </p>
      </section>

      <section id="reporting">
        <h2>Reporting a child-protection concern</h2>

        <p>
          Anyone who sees, hears about or reasonably suspects abuse,
          exploitation, unsafe conduct or inappropriate behaviour should report
          the concern promptly.
        </p>

        <p>
          A person reporting a concern should record factual information and
          avoid conducting their own investigation where doing so could
          interfere with appropriate safeguarding action.
        </p>
      </section>

      <section id="response">
        <h2>Responding to concerns</h2>

        <p>
          Child-protection concerns should be handled seriously,
          confidentially and proportionately.
        </p>

        <p>
          Appropriate safeguarding or legal authorities should be involved
          where necessary, particularly where there is immediate danger,
          suspected criminal conduct or serious risk of harm.
        </p>
      </section>

      <div className="policy-contact">
        <h2>Report a child-protection concern</h2>
        <p>
          Email: guvnorace@gmail.com
          <br />
          Phone: +256 752 462 740
        </p>
      </div>
    </PolicyPageLayout>
  );
}

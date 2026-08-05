import PolicyPage from "@/components/policies/PolicyPage";

export default function SafeguardingPage() {
  return (
    <PolicyPage
      eyebrow="Safeguarding"
      title="Safeguarding Policy"
      summary="Our commitment to protecting children and vulnerable people from abuse, neglect, exploitation and avoidable harm."
      lastReviewed="5 August 2026"
      urgentNotice={{
        title: "Immediate danger",
        text: "If a child or vulnerable person is in immediate danger, contact the appropriate local emergency or child-protection authority first. You may then contact the foundation on +256 752 462 740.",
      }}
      sections={[
        {
          heading: "Purpose",
          paragraphs: [
            "The Guvnor Ace Foundation aims to provide a safe, respectful and protective environment for every child and vulnerable person involved in our work.",
            "This policy applies to trustees, staff, volunteers, contractors, partners, visitors and anyone representing the foundation.",
          ],
        },
        {
          heading: "Our safeguarding principles",
          points: [
            "The welfare and dignity of children and vulnerable people come first.",
            "All safeguarding concerns must be taken seriously.",
            "Concerns should be reported promptly and handled confidentially.",
            "No person should be treated unfairly because of disability, gender, nationality, religion, background or economic circumstances.",
            "Photography, filming and storytelling must be respectful and appropriately authorised.",
          ],
        },
        {
          heading: "Expected conduct",
          points: [
            "Maintain safe and appropriate professional boundaries.",
            "Avoid being alone with a child where reasonable safeguards are unavailable.",
            "Never use humiliating, threatening, discriminatory or sexual language.",
            "Never exchange money, gifts or private communications with a child inappropriately.",
            "Never publish identifying or sensitive information without appropriate permission.",
          ],
        },
        {
          heading: "Reporting a concern",
          paragraphs: [
            "A concern may involve suspected abuse, neglect, exploitation, inappropriate conduct, unsafe programme activity or online behaviour.",
            "Concerns should be reported to the foundation using the official email address or phone number. Information should be limited to people who need it for safeguarding action.",
          ],
        },
        {
          heading: "Responding to concerns",
          points: [
            "Listen calmly and avoid making promises of secrecy.",
            "Record the concern accurately using the person’s own words where possible.",
            "Do not conduct an informal investigation or confront an alleged offender.",
            "Refer urgent matters to appropriate authorities or professional services.",
            "Take reasonable steps to prevent further risk.",
          ],
        },
        {
          heading: "Review and accountability",
          paragraphs: [
            "The foundation aims to review this policy regularly and after any serious safeguarding incident or major organisational change.",
          ],
        },
      ]}
    />
  );
}

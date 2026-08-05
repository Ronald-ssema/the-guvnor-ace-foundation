import PolicyPage from "@/components/policies/PolicyPage";

export default function TermsPage() {
  return (
    <PolicyPage
      eyebrow="Website terms"
      title="Terms and Conditions"
      summary="The conditions that apply when using The Guvnor Ace Foundation website."
      lastReviewed="5 August 2026"
      sections={[
        {
          heading: "Acceptance of these terms",
          paragraphs: [
            "By using this website, you agree to use it lawfully and responsibly. If you do not accept these terms, please stop using the website.",
          ],
        },
        {
          heading: "Website information",
          paragraphs: [
            "We aim to keep information accurate and current, but we cannot guarantee that every page will always be complete or free from errors.",
            "Information on this website is general and should not be treated as medical, legal, financial or safeguarding advice.",
          ],
        },
        {
          heading: "Permitted use",
          points: [
            "Use the website only for lawful purposes.",
            "Do not attempt to damage, overload or gain unauthorised access to the website.",
            "Do not submit malicious software, fraudulent requests or misleading information.",
            "Do not copy or exploit foundation content for deceptive or commercial purposes.",
          ],
        },
        {
          heading: "Intellectual property",
          paragraphs: [
            "Unless otherwise stated, website text, branding, graphics and original media belong to or are licensed for use by The Guvnor Ace Foundation.",
            "Permission should be obtained before substantial reproduction or commercial use.",
          ],
        },
        {
          heading: "External links",
          paragraphs: [
            "The website may link to GoFundMe, Linktree and social-media platforms. Those services have their own terms and privacy practices.",
            "We are not responsible for the availability or content of third-party websites.",
          ],
        },
        {
          heading: "AI assistant",
          paragraphs: [
            "The AI assistant may produce incomplete or inaccurate responses. Important information should be confirmed directly with the foundation.",
          ],
        },
        {
          heading: "Limitation of responsibility",
          paragraphs: [
            "To the extent permitted by applicable law, the foundation is not responsible for losses arising solely from reliance on unverified website information or third-party services.",
          ],
        },
        {
          heading: "Changes to these terms",
          paragraphs: [
            "We may update these terms when the website, organisation or applicable requirements change.",
          ],
        },
      ]}
    />
  );
}

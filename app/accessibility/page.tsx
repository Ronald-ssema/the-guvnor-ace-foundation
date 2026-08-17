import { createPageMetadata } from "@/lib/seo";
import PolicyPageLayout from "@/components/policies/PolicyPageLayout";

export const metadata = createPageMetadata({
  title: "Accessibility Statement",
  description: "Our approach to making The Guvnor Ace Foundation website accessible and inclusive.",
  path: "/accessibility",
});

const navigation = [
  { label: "Our commitment", href: "#commitment" },
  { label: "What we support", href: "#support" },
  { label: "Known limitations", href: "#limitations" },
  { label: "Report a problem", href: "#contact" },
];

export default function AccessibilityPage() {
  return (
    <PolicyPageLayout
      eyebrow="Accessibility"
      title="Accessibility Statement"
      description="We want everyone to be able to understand our work, contact us and support the Foundation."
      lastReviewed="17 August 2026"
      navigation={navigation}
    >
      <section id="commitment">
        <h2>Our commitment</h2>
        <p>
          We are working towards the Web Content Accessibility Guidelines
          (WCAG) 2.2 Level AA. Accessibility is reviewed as the website and its
          content change; this statement is not a claim that every page has
          passed a complete independent audit.
        </p>
      </section>

      <section id="support">
        <h2>What the website is designed to support</h2>
        <ul>
          <li>Keyboard navigation and visible keyboard focus.</li>
          <li>Text resizing and responsive layouts on smaller screens.</li>
          <li>Semantic headings, landmarks and descriptive page titles.</li>
          <li>Alternative text for meaningful images.</li>
          <li>Reduced motion preferences where animation is used.</li>
          <li>Clear labels and status messages in administrative forms.</li>
        </ul>
      </section>

      <section id="limitations">
        <h2>Known limitations</h2>
        <p>
          Some older documents, third-party fundraising pages or externally
          hosted media may not provide the same level of accessibility as this
          website. Please contact us if you need information in another format.
        </p>
      </section>

      <section id="contact">
        <h2>Report an accessibility problem</h2>
        <p>
          Tell us which page you were using, what went wrong and what device or
          assistive technology you were using where relevant. We will aim to
          provide the information in an accessible form and investigate the issue.
        </p>
        <div className="policy-contact">
          <h3>Contact The Guvnor Ace Foundation</h3>
          <p>Email: guvnorace@gmail.com<br />Phone: +256 752 462 740</p>
        </div>
      </section>
    </PolicyPageLayout>
  );
}
